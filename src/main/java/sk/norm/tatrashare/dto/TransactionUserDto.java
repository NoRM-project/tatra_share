package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionUserDto {
    private Long id;

    @JsonProperty("full_name")
    private String fullName;

    private String iban;
}

