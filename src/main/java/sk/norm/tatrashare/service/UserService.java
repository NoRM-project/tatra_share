package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(String fullName, String iban) {
        if (fullName == null || fullName.trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "full_name cannot be empty");
        }
        if (iban == null || iban.trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "iban cannot be empty");
        }
        User user = new User();
        user.setFullName(fullName.trim());
        user.setIban(iban.trim());
        return userRepository.save(user);
    }
}
