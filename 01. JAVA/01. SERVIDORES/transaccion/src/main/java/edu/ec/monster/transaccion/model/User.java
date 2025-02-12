package edu.ec.monster.transaccion.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {

    private Long id;

    private String firstName;

    private String lastName;

    private int age;

    private Gender gender;

    private String username;

    private String password; // Assume it's hashed

    private LocalDateTime createdAt = LocalDateTime.now();

    private Account account; // You can still reference Account here if needed for operational purposes
}
