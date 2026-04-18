package sk.norm.tatrashare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.norm.tatrashare.entity.Group;
import sk.norm.tatrashare.entity.GroupUser;
import sk.norm.tatrashare.entity.User;

import java.util.List;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {
    @Query("SELECT gu.group FROM GroupUser gu WHERE gu.user.id = :userId")
    List<Group> findGroupsByUserId(@Param("userId") Long userId);

    boolean existsByGroup_IdAndUser_Id(Long groupId, Long userId);

    @Query("SELECT gu.user FROM GroupUser gu WHERE gu.group.id = :groupId ORDER BY gu.user.id")
    List<User> findUsersByGroupId(@Param("groupId") Long groupId);

    long countByGroup_Id(Long groupId);
}
