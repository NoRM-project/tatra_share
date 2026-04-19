package sk.norm.tatrashare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.auth.CurrentUserProvider;
import sk.norm.tatrashare.dto.CreateGroupRequest;
import sk.norm.tatrashare.dto.GroupDto;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.UserRepository;
import sk.norm.tatrashare.service.GroupService;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {

    private final GroupService groupService;
    private final CurrentUserProvider currentUserProvider;
    private final UserRepository userRepository;

    @GetMapping
    public List<GroupDto> getGroupsByCurrentUser() {
        Long currentUserId = 1L; //currentUserProvider.getCurrentUserId();
        return groupService.getGroupsByUserId(currentUserId);
    }

    @PostMapping
    public GroupDto createGroup(@RequestBody @Valid CreateGroupRequest request) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current user not found"));
        return groupService.createGroup(request.getName(), request.getMemberIds(), user);
    }


}
