package sk.norm.tatrashare.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class GroupReportDto {

    /** Total amount the current user owes to others. */
    private BigDecimal liability;

    /** Total amount others owe to the current user. */
    private BigDecimal receivable;

    /** receivable - liability */
    private BigDecimal difference;

    private List<GroupReportBalanceDto> balances;
}

