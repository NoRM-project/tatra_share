package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateTransactionRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private BigDecimal amount;

    @NotEmpty
    @JsonProperty("beneficiary_ids")
    private List<Long> beneficiaryIds;
}

