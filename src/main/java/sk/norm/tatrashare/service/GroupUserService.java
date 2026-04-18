package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.dto.TransactionUserDto;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.GroupUser;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.repository.GroupUserRepository;
import sk.norm.tatrashare.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupUserService {

    private final GroupUserRepository groupUserRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TransactionUserDto> getGroupMembers(Long groupId, Long currentUserId) {
        validateGroupAccess(groupId, currentUserId);
        return groupUserRepository.findUsersByGroupId(groupId)
                .stream()
                .map(this::toUserDto)
                .toList();
    }

    @Transactional
    public TransactionUserDto addGroupMember(Long groupId, Long currentUserId, String fullName, String iban) {
        validateGroupAccess(groupId, currentUserId);

        if (fullName == null || fullName.trim().isBlank() || iban == null || iban.trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "full_name and iban are required");
        }

        String normalizedFullName = fullName.trim();
        String normalizedIban = iban.trim();

        User user = userRepository.findByIban(normalizedIban)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!normalizedFullName.equals(user.getFullName())) {
            // If at least one parameter is incorrect -> "User not found"
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));

        if (groupUserRepository.existsByGroup_IdAndUser_Id(groupId, user.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already a member of this group");
        }

        GroupUser gu = new GroupUser();
        gu.setGroup(group);
        gu.setUser(user);
        groupUserRepository.save(gu);

        return toUserDto(user);
    }

    private void validateGroupAccess(Long groupId, Long currentUserId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }
        if (!groupUserRepository.existsByGroup_IdAndUser_Id(groupId, currentUserId)) {
            // MVP: avoid leaking existence
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found");
        }
    }

    private TransactionUserDto toUserDto(User user) {
        TransactionUserDto dto = new TransactionUserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setIban(user.getIban());
        return dto;
    }
}
