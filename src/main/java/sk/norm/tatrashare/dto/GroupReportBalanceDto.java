package sk.norm.tatrashare.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GroupReportBalanceDto {

    /**
     * If amount > 0 -> member owes current user.
     * If amount < 0 -> current user owes member.
     */
    private BigDecimal amount;

    private TransactionUserDto member;
}

