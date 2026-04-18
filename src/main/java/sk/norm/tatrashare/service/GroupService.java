package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.dto.GroupDto;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.GroupUser;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.repository.GroupUserRepository;
import sk.norm.tatrashare.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;
    private final ReportService reportService;

    public List<GroupDto> getGroupsByUserId(Long userId) {
        return groupUserRepository.findGroupsByUserId(userId)
                .stream()
                .map(group -> convertToDto(group, userId))
                .toList();
    }

    @Transactional
    public GroupDto createGroup(String name, List<Long> memberIds, User creator) {
        if (creator == null || creator.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creator cannot be null");
        }

        if (name == null || name.trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group name cannot be empty");
        }

        String groupName = name.trim();

        if (groupRepository.existsByName(groupName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Group with name '" + groupName + "' already exists");
        }

        Group group = new Group();
        group.setName(groupName);
        Group savedGroup = groupRepository.save(group);

        // Creator must always be a member. memberIds are optional.
        Set<Long> allMemberIds = new HashSet<>();
        allMemberIds.add(creator.getId());
        if (memberIds != null) {
            allMemberIds.addAll(memberIds.stream().filter(Objects::nonNull).collect(Collectors.toSet()));
        }

        List<User> users = userRepository.findAllById(allMemberIds);
        if (users.size() != allMemberIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some member_ids do not exist");
        }

        for (User user : users) {
            GroupUser groupUser = new GroupUser();
            groupUser.setGroup(savedGroup);
            groupUser.setUser(user);
            groupUserRepository.save(groupUser);
        }

        return convertToDto(savedGroup, creator.getId());
    }

    private GroupDto convertToDto(Group group, Long currentUserId) {
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setMembersCount((int) groupUserRepository.countByGroup_Id(group.getId()));

        dto.setUserBalance(reportService.getGroupDifference(group.getId(), currentUserId));
        return dto;
    }

}
