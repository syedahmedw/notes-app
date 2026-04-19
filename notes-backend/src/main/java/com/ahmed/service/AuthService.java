package com.ahmed.service;

import com.ahmed.config.JwtUtil;
import com.ahmed.entity.User;
import com.ahmed.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Signup
    public String register(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser.isPresent()) {
            return "Username already exists!";
        }

        // 🔥 HASH PASSWORD
        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
        return "User registered successfully";
    }

    // Login
    public String login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return "USER_NOT_FOUND";
        }

        User user = userOpt.get();

        if (!encoder.matches(password, user.getPassword())) {
            return "WRONG_PASSWORD";
        }

        return jwtUtil.generateToken(username);
    }
}