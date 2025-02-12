package edu.ec.monster.transaccion.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddBalanceDTO {
    private BigDecimal amountToAdd;
}
