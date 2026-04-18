package sk.norm.tatrashare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sk.norm.tatrashare.auth.CurrentUserProvider;
import sk.norm.tatrashare.dto.AddGroupMemberRequest;
import sk.norm.tatrashare.dto.TransactionUserDto;
import sk.norm.tatrashare.service.GroupUserService;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/members")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupUserService groupUserService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public List<TransactionUserDto> getMembers(@PathVariable Long groupId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        return groupUserService.getGroupMembers(groupId, currentUserId);
    }

    @PostMapping
    public TransactionUserDto addMember(@PathVariable Long groupId,
                                        @RequestBody @Valid AddGroupMemberRequest request) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        return groupUserService.addGroupMember(groupId, currentUserId, request.getFullName(), request.getIban());
    }
}

