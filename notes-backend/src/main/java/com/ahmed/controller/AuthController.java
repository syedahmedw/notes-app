package com.ahmed.controller;

import com.ahmed.entity.User;
import com.ahmed.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Signup
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return authService.register(user);
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return authService.login(user.getUsername(), user.getPassword());
    }
}
