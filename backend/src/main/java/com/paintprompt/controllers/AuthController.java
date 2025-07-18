package com.paintprompt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paintprompt.database.models.UserCredential;
import com.paintprompt.database.repositories.UserCredentialRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserCredentialRepository userRepo;

    @PostMapping("/signup")
    public String signup(@RequestBody UserCredential user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            return "Username already exists!";
        }

        userRepo.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestBody UserCredential user) {
        UserCredential existingUser = userRepo.findById(user.getUsername()).orElse(null);
        if (existingUser == null) {
            return "User not found!";
        }
        if (!existingUser.getPassword().equals(user.getPassword())) {
            return "Incorrect password!";
        }
        return "Sign in successful!";
    }
}