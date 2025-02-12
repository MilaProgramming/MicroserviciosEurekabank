package edu.ec.monster.transaccion.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    private Long id;

    private BigDecimal balance = BigDecimal.ZERO;

    private Boolean active = true;

    private String accountNumber;
}
