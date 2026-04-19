package sk.norm.tatrashare.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.norm.tatrashare.dto.CreateUserDto;
import sk.norm.tatrashare.entity.User;
import sk.norm.tatrashare.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody CreateUserDto userAddDto) {
        return userService.createUser(userAddDto.getFullName(), userAddDto.getIban());
    }
}
