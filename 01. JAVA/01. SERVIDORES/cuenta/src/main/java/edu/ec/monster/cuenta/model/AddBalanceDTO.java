package edu.ec.monster.cuenta.model;

import java.math.BigDecimal;

public class AddBalanceDTO {
    private BigDecimal amountToAdd;

    // Getter and Setter
    public BigDecimal getAmountToAdd() {
        return amountToAdd;
    }

    public void setAmountToAdd(BigDecimal amountToAdd) {
        this.amountToAdd = amountToAdd;
    }
}

