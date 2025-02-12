package edu.ec.monster.usuario.model;

import lombok.Getter;

@Getter
public class UserResponse {
    private String firstName;
    private String lastName;
    private String accountNumber;

    public UserResponse(User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.accountNumber = user.getAccount() != null ? user.getAccount().getAccountNumber() : null;
    }
}