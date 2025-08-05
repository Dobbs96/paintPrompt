package com.paintprompt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserDataRepository;


@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://paint-prompt.vercel.app",
    "https://paint-prompt-q0p2k3a0l-friendy-starter.vercel.app"
})
public class UserController {
    @Autowired
    private UserDataRepository userDataRepository;

    //changed from /materials to /user-materials for distinct pathing for debugging purposes
    @GetMapping("/get/user-materials")
    public ResponseEntity<String> getMaterials(@RequestParam String username) {
        UserData user = userDataRepository.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user.getMaterials());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
