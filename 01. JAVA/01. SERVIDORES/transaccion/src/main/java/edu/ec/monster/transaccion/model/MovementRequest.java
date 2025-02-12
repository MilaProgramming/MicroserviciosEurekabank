package edu.ec.monster.transaccion.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MovementRequest {
    private String accountNumber;
    private BigDecimal amount;
    private String transactionType;
}
