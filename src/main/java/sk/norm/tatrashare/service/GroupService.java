package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.repository.GroupRepository;
import sk.norm.tatrashare.dto.CreateGroupRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(int id) {
        return groupRepository.findById((long) id).orElse(null);
    }

    public Group getGroupByName(String name) {
        return groupRepository.findByName(name).orElse(null);
    }

    public Group createGroup(CreateGroupRequest groupRequest) {
        if (groupRequest.getName() == null || groupRequest.getName().trim().isBlank() || groupRequest.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be null or empty.");
        }

        String groupName = groupRequest.getName().trim();

        if (groupRepository.existsByName(groupName)) {
            throw new IllegalArgumentException("Group with name '" + groupName + "' already exists.");
        }

        Group group = new Group();
        group.setName(groupName);
        return groupRepository.save(group);
    }

}
