package sk.norm.tatrashare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.norm.tatrashare.dto.CreateGroupRequest;
import sk.norm.tatrashare.dto.GroupDto;
import sk.norm.tatrashare.service.GroupService;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public List<GroupDto> getAllGroups() {
        return groupService.getAllGroups();
    }

    @PostMapping
    public GroupDto createGroup(@RequestBody @Valid CreateGroupRequest request) {
        return groupService.createGroup(request);
    }


}
