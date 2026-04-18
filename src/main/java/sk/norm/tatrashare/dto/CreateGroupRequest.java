package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Setter
@Getter
public class CreateGroupRequest {
    @NotBlank
    private String name;
    @JsonProperty("member_ids")
    private List<Long> memberIds;
}
