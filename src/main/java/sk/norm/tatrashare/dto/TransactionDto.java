package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TransactionDto {
    private Long id;
    private String name;
    private String description;

    @JsonProperty("paid_by")
    private TransactionUserDto paidBy;

    private Long amount;
    private List<TransactionUserDto> beneficiaries;
}

