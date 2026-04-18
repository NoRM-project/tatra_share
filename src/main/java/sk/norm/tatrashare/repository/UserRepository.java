package sk.norm.tatrashare.repository;

import sk.norm.tatrashare.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByIban(String iban);
}
