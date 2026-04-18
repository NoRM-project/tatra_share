package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sk.norm.tatrashare.dto.GroupDto;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.dto.CreateGroupRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public List<GroupDto> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public GroupDto createGroup(CreateGroupRequest groupRequest) {
        if (groupRequest.getName() == null || groupRequest.getName().trim().isBlank() || groupRequest.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be null or empty.");
        }

        String groupName = groupRequest.getName().trim();

        if (groupRepository.existsByName(groupName)) {
            throw new IllegalArgumentException("Group with name '" + groupName + "' already exists.");
        }

        Group group = new Group();
        group.setName(groupName);
        Group savedGroup = groupRepository.save(group);

        // TODO: Handle member_ids and associate members with the group

        return convertToDto(savedGroup);
    }

    private GroupDto convertToDto(Group group) {
        GroupDto dto = new GroupDto();
        dto.setId(Math.toIntExact(group.getId()));
        dto.setName(group.getName());
        // TODO: Implement logic to calculate members count and user balance
        dto.setMembersCount(0);
        dto.setUserBalance(0.0f);
        return dto;
    }

}
