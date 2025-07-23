package com.paintprompt.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "https://paint-prompt-9bsizc8hc-friendy-starter.vercel.app/") // website might need
@CrossOrigin(origins = "http://localhost:8000/") // localhost
public class PingController {

    @GetMapping("/ping")
    public String ping() {
        return "Backend is alive!";
    }
}
