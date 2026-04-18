package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.dto.CreateTransactionRequest;
import sk.norm.tatrashare.dto.TransactionDto;
import sk.norm.tatrashare.dto.TransactionUserDto;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.Transaction;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.repository.TransactionRepository;
import sk.norm.tatrashare.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final Long HARD_CODED_PAID_BY_USER_ID = 1L;

    private final TransactionRepository transactionRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public List<TransactionDto> getGroupTransactions(Long groupId) {
        validateGroupExists(groupId);
        return transactionRepository.findByGroupId(groupId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TransactionDto getGroupTransaction(Long groupId, Long transactionId) {
        validateGroupExists(groupId);
        Transaction transaction = transactionRepository.findByIdAndGroupId(transactionId, groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        return toDto(transaction);
    }

    @Transactional
    public TransactionDto createGroupTransaction(Long groupId, CreateTransactionRequest request) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));

        User paidBy = userRepository.findById(HARD_CODED_PAID_BY_USER_ID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hardcoded paid_by user not found"));

        List<User> beneficiaries = userRepository.findAllById(request.getBeneficiaryIds());
        if (beneficiaries.size() != request.getBeneficiaryIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some beneficiary_ids do not exist");
        }

        Transaction transaction = new Transaction();
        transaction.setGroup(group);
        transaction.setPayedUser(paidBy);
        transaction.setName(request.getName().trim());
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        Transaction savedTransaction = transactionRepository.save(transaction);

        for (Long beneficiaryId : request.getBeneficiaryIds()) {
            transactionRepository.addBeneficiary(savedTransaction.getId(), beneficiaryId);
        }

        return toDto(savedTransaction);
    }

    private void validateGroupExists(Long groupId) {
        if (!groupRepository.existsById(groupId)) {
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

        List<User> beneficiaries = transactionRepository.findBeneficiariesByTransactionId(transaction.getId());
        dto.setBeneficiaries(beneficiaries.stream().map(this::toUserDto).toList());
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

