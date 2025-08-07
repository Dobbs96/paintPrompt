package com.paintprompt.controllers;

import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


    @RestController
    @RequestMapping("/api/materials")
    @CrossOrigin(origins = {
    "http://localhost:5173",
    "https://paint-prompt.vercel.app",
    "https://paint-prompt-q0p2k3a0l-friendy-starter.vercel.app"
})
    public class MaterialController {

        @Autowired
        private UserDataRepository userDataRepository;

        // GET materials for a user
        @GetMapping("/get/materials")
        public ResponseEntity<String> getMaterials(@RequestParam String username) {
            UserData user = userDataRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            //modified to make empty accounts work
            String materials = user.getMaterials();
            return ResponseEntity.ok(materials != null ? materials : "");
        }

        // POST add new material
        @PostMapping("/add/material")
        public ResponseEntity<Void> addMaterial(@RequestBody Map<String, String> payload) {
            String username = payload.get("username");
            String material = payload.get("material");

            if (username == null || material == null) {
                return ResponseEntity.badRequest().build();
            }

            UserData user = userDataRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            String current = user.getMaterials();
            List<String> materialList = (current != null && !current.isBlank())
                    ? new ArrayList<>(Arrays.asList(current.split(",")))
                    : new ArrayList<>();

            if (!materialList.contains(material.trim())) {
                materialList.add(material.trim());
                String updated = String.join(", ", materialList);
                user.setMaterials(updated);
                userDataRepository.save(user);
            }

            return ResponseEntity.ok().build();
        }

        @PostMapping("/delete/material")
        public ResponseEntity<String> deleteMaterial(@RequestBody DeleteMaterialRequest request) {
            String username = request.getUsername();
            String materialToRemove = request.getMaterial();

            if (username == null || materialToRemove == null) {
                return ResponseEntity.badRequest().body("Missing username or material");
            }

            UserData user = userDataRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            String materialsStr = user.getMaterials();
            if (materialsStr == null || materialsStr.isBlank()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No materials found");
            }

            List<String> materialsList = Arrays.stream(materialsStr.split(","))
                .map(String::trim)
                .collect(Collectors.toList());

            boolean removed = materialsList.removeIf(m -> m.equalsIgnoreCase(materialToRemove.trim()));

            if (!removed) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Material not found");
            }

            String updatedMaterials = String.join(", ", materialsList);
            user.setMaterials(updatedMaterials);
            userDataRepository.save(user);

            return ResponseEntity.ok("Material deleted successfully");
        }

        // DTO class
        public static class DeleteMaterialRequest {
            private String username;
            private String material;

            public String getUsername() {
                return username;
            }

            public void setUsername(String username) {
                this.username = username;
            }

            public String getMaterial() {
                return material;
            }

            public void setMaterial(String material) {
                this.material = material;
            }
        }


    }