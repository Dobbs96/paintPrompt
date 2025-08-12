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
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) String medium,
            @RequestParam(required = false) String complexity,
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

         StringBuilder content = new StringBuilder();
            if (prompt != null && !prompt.trim().isEmpty()) {
          content.append("Generate a creative painting prompt for me.");
                if (mood != null && !mood.isEmpty()) content.append(" Mood: ").append(mood).append(".");
                if (medium != null && !medium.isEmpty()) content.append(" Medium: ").append(medium).append(".");
                if (complexity != null && !complexity.isEmpty()) content.append(" Complexity: ").append(complexity).append(".");
                if (format != null && !format.isEmpty()) content.append(" Format: ").append(format).append(".");
          content.append(" My idea: ").append(prompt)
              .append(". Respond with only the prompt text (no quotes), and keep it under 450 characters.");
            } else {
          content.append("Generate a random, simple, and fun drawing prompt for a beginner artist. Respond with only the prompt text (no quotes), and keep it under 450 characters.");
            }

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", content.toString());

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");
            body.put("messages", new Object[] { message });
            // Keep tokens modest; we also apply a hard character cap below
            body.put("max_tokens", 120);
            body.put("temperature", 0.8);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("choices")) {
                Object choicesObj = response.get("choices");
                if (choicesObj instanceof java.util.List<?>) {
                    java.util.List<?> choices = (java.util.List<?>) choicesObj;
                    if (!choices.isEmpty()) {
                        Object firstChoiceObj = choices.get(0);
                        if (firstChoiceObj instanceof Map<?, ?>) {
                            Map<?, ?> firstChoice = (Map<?, ?>) firstChoiceObj;
                            Object messageObjRaw = firstChoice.get("message");
                            if (messageObjRaw instanceof Map<?, ?>) {
                                Map<?, ?> messageObj = (Map<?, ?>) messageObjRaw;
                                Object contentRaw = messageObj.get("content");
                                if (contentRaw instanceof String) {
                                    String result = ((String) contentRaw).trim();
                                    if (result.length() > 450) {
                                        result = result.substring(0, 450);
                                    }
                                    return ResponseEntity.ok(result);
                                }
                            }
                        }
                    }
                }
            }
            return ResponseEntity.status(500).body("Failed to generate prompt");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
