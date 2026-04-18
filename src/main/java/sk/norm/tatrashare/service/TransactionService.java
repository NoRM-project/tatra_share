package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.auth.CurrentUserProvider;
import sk.norm.tatrashare.dto.CreateTransactionRequest;
import sk.norm.tatrashare.dto.TransactionDto;
import sk.norm.tatrashare.dto.TransactionUserDto;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.Transaction;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.repository.GroupUserRepository;
import sk.norm.tatrashare.repository.TransactionRepository;
import sk.norm.tatrashare.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    public List<TransactionDto> getGroupTransactions(Long groupId) {
        validateGroupAccess(groupId);
        return transactionRepository.findByGroupId(groupId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TransactionDto getGroupTransaction(Long groupId, Long transactionId) {
        validateGroupAccess(groupId);
        Transaction transaction = transactionRepository.findByIdAndGroupId(transactionId, groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        return toDto(transaction);
    }

    @Transactional
    public TransactionDto createGroupTransaction(Long groupId, CreateTransactionRequest request) {
        validateGroupAccess(groupId);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));

        Long currentUserId = currentUserProvider.getCurrentUserId();
        User paidBy = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current user not found"));

        // beneficiary_ids: reject nulls / duplicates early (otherwise DB unique constraint errors)
        List<Long> beneficiaryIds = request.getBeneficiaryIds();
        if (beneficiaryIds == null || beneficiaryIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "beneficiary_ids cannot be empty");
        }
        if (beneficiaryIds.stream().anyMatch(Objects::isNull)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "beneficiary_ids cannot contain nulls");
        }
        Set<Long> uniqueBeneficiaryIds = Set.copyOf(beneficiaryIds);
        if (uniqueBeneficiaryIds.size() != beneficiaryIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "beneficiary_ids cannot contain duplicates");
        }

        // Enforce that paid_by + beneficiaries are members of this group
        Set<Long> groupMemberIds = groupUserRepository.findUsersByGroupId(groupId)
                .stream()
                .map(User::getId)
                .collect(Collectors.toSet());

        if (!groupMemberIds.contains(currentUserId)) {
            // Should not happen because validateGroupAccess checks membership, but keep it explicit.
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }
        if (!groupMemberIds.containsAll(uniqueBeneficiaryIds)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some beneficiary_ids are not members of this group");
        }

        List<User> beneficiaryUsers = userRepository.findAllById(uniqueBeneficiaryIds);
        if (beneficiaryUsers.size() != uniqueBeneficiaryIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some beneficiary_ids do not exist");
        }

        Transaction transaction = new Transaction();
        transaction.setGroup(group);
        transaction.setPayedUser(paidBy);
        transaction.setName(request.getName().trim());
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        Transaction savedTransaction = transactionRepository.save(transaction);

        for (Long beneficiaryId : beneficiaryIds) {
            transactionRepository.addBeneficiary(savedTransaction.getId(), beneficiaryId);
        }

        return toDto(savedTransaction);
    }

    private void validateGroupAccess(Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }
        Long currentUserId = currentUserProvider.getCurrentUserId();
        if (!groupUserRepository.existsByGroup_IdAndUser_Id(groupId, currentUserId)) {
            // MVP: avoid leaking group existence
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }
    }

    private TransactionDto toDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setName(transaction.getName());
        dto.setDescription(transaction.getDescription());
        dto.setPaidBy(toUserDto(transaction.getPayedUser()));
        dto.setAmount(transaction.getAmount());
        dto.setCreatedAt(transaction.getCreatedAt());

        List<Long> beneficiaryIds = transactionRepository.findBeneficiaryIdsByTransactionId(transaction.getId());
        List<User> beneficiaries = userRepository.findAllById(beneficiaryIds);
        Map<Long, User> usersById = beneficiaries.stream().collect(Collectors.toMap(User::getId, user -> user));
        dto.setBeneficiaries(beneficiaryIds.stream()
                .map(id -> {
                    User u = usersById.get(id);
                    if (u == null) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Beneficiary user not found for id=" + id);
                    }
                    return u;
                })
                .map(this::toUserDto)
                .toList());
        return dto;
    }

    private TransactionUserDto toUserDto(User user) {
        TransactionUserDto dto = new TransactionUserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setIban(user.getIban());
        return dto;
    }
}

