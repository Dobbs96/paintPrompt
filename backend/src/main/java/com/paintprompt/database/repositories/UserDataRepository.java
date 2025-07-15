package com.paintprompt.database.repositories;

import com.paintprompt.database.models.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, String> {
    UserData findByUsername(String username);
}
