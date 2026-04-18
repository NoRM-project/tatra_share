package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TransactionDto {
    private Long id;
    private String name;
    private String description;

    @JsonProperty("paid_by")
    private TransactionUserDto paidBy;

    private BigDecimal amount;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    private List<TransactionUserDto> beneficiaries;
}

