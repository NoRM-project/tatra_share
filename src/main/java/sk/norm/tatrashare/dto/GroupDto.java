package sk.norm.tatrashare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GroupDto {
    private Long id;
    private String name;

    @JsonProperty("members_count")
    private int membersCount;

    @JsonProperty("user_balance")
    private BigDecimal userBalance;
}
