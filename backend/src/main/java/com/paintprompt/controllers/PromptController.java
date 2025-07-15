package com.paintprompt.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/prompt")
public class PromptController {
    @Value("${openai.api.key}")
    private String openaiApiKey;

    @GetMapping("/generate")
    public ResponseEntity<String> generatePrompt(
            @RequestParam String mood,
            @RequestParam String medium,
            @RequestParam String complexity,
            @RequestParam String format,
            @RequestParam String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", String.format(
                "Generate a creative painting prompt for me. Mood: %s, Medium: %s, Complexity: %s, Format: %s. My idea: %s. Respond with only the prompt.",
                mood, medium, complexity, format, prompt));

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");
            body.put("messages", new Object[] { message });
            body.put("max_tokens", 100);
            body.put("temperature", 0.8);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            Map response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("choices")) {
                Object choices = response.get("choices");
                if (choices instanceof java.util.List && !((java.util.List) choices).isEmpty()) {
                    Map firstChoice = (Map) ((java.util.List) choices).get(0);
                    Map messageObj = (Map) firstChoice.get("message");
                    String result = (String) messageObj.get("content");
                    return ResponseEntity.ok(result.trim());
                }
            }
            return ResponseEntity.status(500).body("Failed to generate prompt");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
