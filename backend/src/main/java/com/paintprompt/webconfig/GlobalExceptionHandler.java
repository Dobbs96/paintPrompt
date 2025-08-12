package com.paintprompt.webconfig;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSize(MaxUploadSizeExceededException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "File too large");
        body.put("message", "The uploaded file exceeds the maximum allowed size.");
        body.put("maxFileSize", "25MB");
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(body);
    }
}
