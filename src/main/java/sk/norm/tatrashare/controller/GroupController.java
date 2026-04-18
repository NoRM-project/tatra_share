package sk.norm.tatrashare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.norm.tatrashare.dto.CreateGroupRequest;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.service.GroupService;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public Group getGroupById(@PathVariable int id) {
        return groupService.getGroupById(id);
    }

    @GetMapping("/name/{name}")
    public Group getGroupByName(@PathVariable String name) {
        return groupService.getGroupByName(name);
    }

    @PostMapping
    public Group createGroup(@RequestBody @Valid CreateGroupRequest request) {
        return groupService.createGroup(request);
    }

}
