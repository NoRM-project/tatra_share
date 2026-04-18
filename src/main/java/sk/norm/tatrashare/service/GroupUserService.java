package sk.norm.tatrashare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.GroupUser;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.GroupUserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupUserService {

    @Autowired
    private GroupUserRepository groupUserRepository;

    public List<Group> getGroupsByUser(User user) {
        List<GroupUser> groupUsers = groupUserRepository.findByUser(user);
        return groupUsers.stream().map(GroupUser::getGroup).collect(Collectors.toList());
    }

    public List<User> getUsersByGroup(Group group) {
        List<GroupUser> groupUsers = groupUserRepository.findByGroup(group);
        return groupUsers.stream().map(GroupUser::getUser).collect(Collectors.toList());
    }
}
