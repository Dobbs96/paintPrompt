package com.paintprompt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paintprompt.database.models.UserCredential;
import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserCredentialRepository;
import com.paintprompt.database.repositories.UserDataRepository;
import com.paintprompt.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserCredentialRepository userRepo;
    
    @Autowired
    private UserDataRepository userDataRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public String signup(@RequestBody UserCredential user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            return "Username already exists!";
        }

        userRepo.save(user);

        //creating a userdata row
        UserData userData = new UserData();
        userData.setUsername(user.getUsername());
        userData.setMaterials(""); // should set it as an empty string that can add items now
        userDataRepo.save(userData);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserCredential user) {
        UserCredential existingUser = userRepo.findById(user.getUsername()).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(401).body("User not found!");
        }
        if (!existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body("Incorrect password!");
        }
        String token = jwtUtil.generateToken(existingUser.getUsername());
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Sign in successful!",
            "token", token
        ));
    }
}