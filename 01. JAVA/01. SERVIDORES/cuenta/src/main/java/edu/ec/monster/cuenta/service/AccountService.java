package edu.ec.monster.cuenta.service;

import edu.ec.monster.cuenta.model.Account;
import edu.ec.monster.cuenta.model.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    @Transactional
    public Account createAccount(Long userId, String accountNumber) {
        Account account = new Account();

        account.setId(userId); // Use user ID for account ID
        account.setAccountNumber(accountNumber); // Use the generated number
        account.setBalance(BigDecimal.ZERO);
        account.setActive(true);

        return accountRepository.save(account);
    }

    public Optional<Account> findByAccountId(Long accountId) {
        return accountRepository.findById(accountId);
    }

    @Transactional
    public void deactivateAccount(Long accountId) {
        accountRepository.findById(accountId).ifPresent(account -> {
            boolean newState = !account.getActive(); // Toggle state
            account.setActive(newState); // Update state
            accountRepository.save(account);
        });
    }

    @Transactional
    public void deleteAccount(Long accountId) {
        accountRepository.findById(accountId).ifPresent(accountRepository::delete);
    }

    @Transactional
    public Account updateAccount(Long accountId, Account updatedAccount) {
        Optional<Account> existingAccountOpt = accountRepository.findById(accountId);
        if (existingAccountOpt.isPresent()) {
            Account existingAccount = existingAccountOpt.get();
            existingAccount.setBalance(updatedAccount.getBalance());
            existingAccount.setActive(updatedAccount.getActive());

            return accountRepository.save(existingAccount);
        }
        return null;
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Transactional
    public String addBalance(Long accountId, BigDecimal amountToAdd) {
        Optional<Account> accountOpt = accountRepository.findById(accountId);
        log.info("Adding {} to account {}", amountToAdd, accountId);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            BigDecimal currentBalance = account.getBalance();

            // Check if the amount to add is positive
            if (amountToAdd.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal newBalance = currentBalance.add(amountToAdd);
                account.setBalance(newBalance);
                accountRepository.save(account);
                return "Saldo actualizado.";
            } else {
                // Check if the amount to reduce is less than the current balance
                if (currentBalance.compareTo(amountToAdd.abs()) >= 0) {
                    BigDecimal newBalance = currentBalance.subtract(amountToAdd.abs());
                    account.setBalance(newBalance);
                    accountRepository.save(account);
                    return "Saldo actualizado.";
                }else {
                    return "Fondos insuficientes.";
                }
            }

        } else {
            return "Acción no encontrada.";
        }
    }


}

