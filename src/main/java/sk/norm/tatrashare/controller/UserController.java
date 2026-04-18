package sk.norm.tatrashare.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @GetMapping("/iban/{iban}")
    public User getUserByIban(@PathVariable String iban) {
        return userService.getUserByIban(iban);
    }

    @GetMapping("/full_name/{full_name}")
    public User getUserByUsername(@PathVariable String full_name) {
        return userService.getUserByFullName(full_name);
    }
}
