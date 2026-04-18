package sk.norm.tatrashare.dto;

import lombok.Data;

@Data
public class GroupDto {
    private int id;
    private String name;
    private int membersCount;
    private float userBalance;
}
