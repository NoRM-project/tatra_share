package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.dto.GroupReportBalanceDto;
import sk.norm.tatrashare.dto.GroupReportDto;
import sk.norm.tatrashare.dto.TransactionUserDto;
import sk.norm.tatrashare.entity.Transaction;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.repository.GroupUserRepository;
import sk.norm.tatrashare.repository.TransactionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(2, RoundingMode.UNNECESSARY);

    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Convenience method used by group listing (user_balance).
     */
    @Transactional(readOnly = true)
    public BigDecimal getGroupDifference(Long groupId, Long currentUserId) {
        return getGroupReport(groupId, currentUserId).getDifference();
    }

    @Transactional(readOnly = true)
    public GroupReportDto getGroupReport(Long groupId, Long currentUserId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }

        if (!groupUserRepository.existsByGroup_IdAndUser_Id(groupId, currentUserId)) {
            // For MVP treat it as not found (avoid leaking group existence)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }

        Map<Long, BigDecimal> netByOtherUserId = calculateNetByOtherUser(groupId, currentUserId);

        List<User> members = groupUserRepository.findUsersByGroupId(groupId);
        List<GroupReportBalanceDto> balances = new ArrayList<>();

        BigDecimal receivable = ZERO;
        BigDecimal liability = ZERO;

        for (User member : members) {
            if (member.getId().equals(currentUserId)) {
                continue;
            }

            BigDecimal amount = netByOtherUserId.getOrDefault(member.getId(), ZERO);

            GroupReportBalanceDto balanceDto = new GroupReportBalanceDto();
            balanceDto.setAmount(amount);
            balanceDto.setMember(toUserDto(member));
            balances.add(balanceDto);

            if (amount.signum() > 0) {
                receivable = receivable.add(amount);
            } else if (amount.signum() < 0) {
                liability = liability.add(amount.abs());
            }
        }

        GroupReportDto report = new GroupReportDto();
        report.setReceivable(receivable);
        report.setLiability(liability);
        report.setDifference(receivable.subtract(liability));
        report.setBalances(balances);
        return report;
    }

    /**
     * Returns per-user net balance relative to current user.
     * Positive => other user owes current user.
     * Negative => current user owes other user.
     */
    private Map<Long, BigDecimal> calculateNetByOtherUser(Long groupId, Long currentUserId) {
        Map<Long, BigDecimal> netByOtherUserId = new HashMap<>();

        List<Transaction> transactions = transactionRepository.findByGroupId(groupId);
        for (Transaction transaction : transactions) {
            Long payerId = transaction.getPayedUser().getId();
            List<Long> beneficiaryIds = transactionRepository.findBeneficiaryIdsByTransactionId(transaction.getId());
            if (beneficiaryIds.isEmpty()) {
                continue;
            }

            BigDecimal amount = transaction.getAmount();
            BigDecimal share = amount.divide(BigDecimal.valueOf(beneficiaryIds.size()), 2, RoundingMode.HALF_UP);

            for (Long beneficiaryId : beneficiaryIds) {
                if (payerId.equals(currentUserId) && !beneficiaryId.equals(currentUserId)) {
                    // beneficiary owes me
                    netByOtherUserId.merge(beneficiaryId, share, BigDecimal::add);
                } else if (beneficiaryId.equals(currentUserId) && !payerId.equals(currentUserId)) {
                    // I owe payer
                    netByOtherUserId.merge(payerId, share.negate(), BigDecimal::add);
                }
            }
        }

        return netByOtherUserId;
    }

    private TransactionUserDto toUserDto(User user) {
        TransactionUserDto dto = new TransactionUserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setIban(user.getIban());
        return dto;
    }
}


