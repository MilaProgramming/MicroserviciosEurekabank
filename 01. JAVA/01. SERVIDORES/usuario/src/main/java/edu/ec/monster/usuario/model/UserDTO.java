package edu.ec.monster.usuario.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private int age;
    private Gender gender;
    private String username;
    private String password;
    private LocalDateTime createdAt;
    private String accountId;  // Only include account ID

    // Constructor, Getters, and Setters
    public UserDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.age = user.getAge();
        this.gender = user.getGender();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.createdAt = user.getCreatedAt();
        this.accountId = (user.getAccount() != null) ? user.getAccount().getAccountNumber() : null;  // Only set account ID if it's available
    }

    // Getters and Setters for all fields
}

