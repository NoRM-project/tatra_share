package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddGroupMemberRequest {

    @NotBlank
    @JsonProperty("full_name")
    private String fullName;

    @NotBlank
    private String iban;
}

