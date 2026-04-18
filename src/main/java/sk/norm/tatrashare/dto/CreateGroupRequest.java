package sk.norm.tatrashare.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Setter
@Getter
public class CreateGroupRequest {
    @NotBlank
    private String name;
}
