package com.paintprompt.database.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.paintprompt.database.models.UserCredential;

public interface UserCredentialRepository extends JpaRepository<UserCredential, String> {
    boolean existsByUsername(String username);
}
