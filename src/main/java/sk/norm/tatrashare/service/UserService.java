package sk.norm.tatrashare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.repository.UserRepository;
import sk.norm.tatrashare.service.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByIban(String iban) {
        return userRepository.findByIban(iban).orElse(null);
    }

    public User getUserByFullName(String full_name) {
        return userRepository.findByIban(full_name).orElse(null);
    }

    public User getUserById(int id) {
        return userRepository.findById((long) id).orElse(null);
    }
}
