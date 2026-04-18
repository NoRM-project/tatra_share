package sk.norm.tatrashare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.GroupUser;
import sk.norm.tatrashare.entity.User;

import java.util.List;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {
    List<GroupUser> findByUser(User user);
    List<GroupUser> findByGroup(Group group);
}
