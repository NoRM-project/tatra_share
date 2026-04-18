package sk.norm.tatrashare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.norm.tatrashare.entity.Group;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByName(String name);
    boolean existsByName(String name);
}
