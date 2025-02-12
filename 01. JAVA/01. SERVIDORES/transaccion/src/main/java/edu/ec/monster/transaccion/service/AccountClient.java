package edu.ec.monster.transaccion.service;

import edu.ec.monster.transaccion.model.Account;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import edu.ec.monster.transaccion.model.AddBalanceDTO;

import java.math.BigDecimal;

@FeignClient(name = "cuenta", url = "http://localhost:8082/accounts")
public interface AccountClient {

    @PostMapping("/{accountId}/add-balance")
    String addBalance(@PathVariable("accountId") Long accountId, @RequestBody AddBalanceDTO addBalanceDTO);

    @GetMapping("/{accountId}/balance")
    BigDecimal getBalance(@PathVariable("accountId") Long accountId);

    @PostMapping("/crear")
    Account createAccount(@RequestParam("userId") Long userId, @RequestParam("accountNumber") String accountNumber);

    @DeleteMapping("/{accountId}")
    void deleteAccount(@PathVariable("accountId") Long accountId);

    // New method to fetch account by accountNumber
    @GetMapping("/nocuenta/{accountNumber}")
    Account getAccountByAccountNumber(@PathVariable("accountNumber") String accountNumber);
}
