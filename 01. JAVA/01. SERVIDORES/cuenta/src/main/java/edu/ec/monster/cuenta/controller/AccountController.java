package edu.ec.monster.cuenta.controller;
import edu.ec.monster.cuenta.model.Account;
import edu.ec.monster.cuenta.model.AddBalanceDTO;
import edu.ec.monster.cuenta.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/crear")
    public ResponseEntity<Account> createAccount(@RequestParam("userId") Long userId, @RequestParam("accountNumber") String accountNumber) {
        return ResponseEntity.ok(accountService.createAccount(userId, accountNumber));
    }


    @GetMapping("/{accountId}")
    public ResponseEntity<?> getAccount(@PathVariable Long accountId) {
        Optional<Account> account = accountService.findByAccountId(accountId);
        return account.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{accountId}/desactivar")
    public ResponseEntity<Void> deactivateAccount(@PathVariable Long accountId) {
        System.out.println("Desactivando cuenta con ID: " + accountId);
        accountService.deactivateAccount(accountId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long accountId) {
        log.info("Deleting account with ID: {}", accountId);
        accountService.deleteAccount(accountId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long accountId, @RequestBody Account updatedAccount) {
        Account account = accountService.updateAccount(accountId, updatedAccount);
        return account != null ? ResponseEntity.ok(account) : ResponseEntity.notFound().build();
    }

    @GetMapping("/")
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long accountId) {
        Optional<Account> account = accountService.findByAccountId(accountId);
        if (account.isPresent()) {
            return ResponseEntity.ok(account.get().getBalance());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{accountId}/add-balance")
    public ResponseEntity<String> addBalance(@PathVariable Long accountId, @RequestBody AddBalanceDTO addBalanceDTO) {
        // Extract the amount to add from the DTO
        BigDecimal amount = addBalanceDTO.getAmountToAdd();

        // Call the service to add the balance
        String result = accountService.addBalance(accountId, amount);

        if (result.contains("actualizado")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(400).body(result);
        }
    }

}
