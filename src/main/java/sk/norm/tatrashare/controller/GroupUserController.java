package sk.norm.tatrashare.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.repository.UserRepository;
import sk.norm.tatrashare.service.GroupUserService;

import java.util.List;

@RestController
@RequestMapping("/api/groupusers")
@RequiredArgsConstructor
public class GroupUserController {

    private final GroupUserService groupUserService;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    @GetMapping("/groups/{userId}")
    public List<Group> getGroupsByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return groupUserService.getGroupsByUser(user);
    }

    @GetMapping("/users/{groupId}")
    public List<User> getUsersByGroup(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        return groupUserService.getUsersByGroup(group);
    }
}
