package com.paintprompt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct; 
import java.io.File;                    

@SpringBootApplication
public class PaintPromptApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaintPromptApplication.class, args);
	}

	
	@PostConstruct
	public void init() {
		new File("uploads").mkdirs();

	}


}

