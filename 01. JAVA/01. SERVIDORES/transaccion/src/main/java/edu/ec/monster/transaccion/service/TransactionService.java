package edu.ec.monster.transaccion.service;

import edu.ec.monster.transaccion.model.AddBalanceDTO;
import edu.ec.monster.transaccion.model.Transaction;
import edu.ec.monster.transaccion.model.TransactionRepository;
import edu.ec.monster.transaccion.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;
    private final UserClient userClient;

    // Create a withdrawal or deposit (movement)
    // Update the createMovement method to wrap the BigDecimal in an AddBalanceDTO
    public Transaction createMovement(Long accountId, BigDecimal amount, String transactionType) {
        log.info("Attempting to create movement: accountId={}, amount={}, transactionType={}", accountId, amount, transactionType);

        // Create AddBalanceDTO to wrap the amount
        AddBalanceDTO addBalanceDTO = new AddBalanceDTO();
        addBalanceDTO.setAmountToAdd(amount);

        // Call AccountService to update the account balance
        try {
            String result = accountClient.addBalance(accountId, addBalanceDTO);
            log.info("Account update result: {}", result);

            // If the account update was successful, create the transaction record
            if (result.contains("actualizado")) {
                Transaction transaction = new Transaction();
                transaction.setTransactionType(transactionType);
                transaction.setAmount(amount);
                transaction.setUserId(accountId);
                transaction.setStatus("completado");

                // Save the transaction
                Transaction savedTransaction = transactionRepository.save(transaction);
                log.info("Transaction created and saved: {}", savedTransaction);
                return savedTransaction;
            } else {
                log.error("Account update failed for accountId={}", accountId);
                throw new RuntimeException("Account update failed");
            }
        } catch (Exception e) {
            log.error("Error creating movement for accountId={} and amount={}: {}", accountId, amount, e.getMessage());
            throw new RuntimeException("Error processing movement", e);
        }
    }
    // Create a transfer (from one account to another)
    public Transaction createTransfer(Long sourceAccountId, Long destinationAccountId, BigDecimal amount) {
        log.info("Attempting to create transfer: sourceAccountId={}, destinationAccountId={}, amount={}", sourceAccountId, destinationAccountId, amount);

        // First, check if the user exists (by calling UserService)
        User user = new User();
        user.setId(sourceAccountId);  // Set the sourceAccountId as the user's id

        ResponseEntity<?> userResponse = userClient.findUserById(user);

        // Check if the user response is OK and the user is not null
        if (userResponse == null || userResponse.getStatusCode() != HttpStatus.OK || userResponse.getBody() == null) {
            log.error("User not found for sourceAccountId={}", sourceAccountId);
            throw new RuntimeException("User not found");
        }

        try {
            // Create AddBalanceDTO to wrap the amount for withdrawal
            AddBalanceDTO withdrawDTO = new AddBalanceDTO();
            withdrawDTO.setAmountToAdd(amount.negate()); // Negative amount for withdrawal

            // Handle withdrawal from source account (negative amount for withdrawal)
            log.info("Attempting to withdraw amount={} from source accountId={}", amount, sourceAccountId);
            String withdrawResult = accountClient.addBalance(sourceAccountId, withdrawDTO);
            log.info("Withdraw result: {}", withdrawResult);

            if (withdrawResult.contains("actualizado")) {
                // Create AddBalanceDTO to wrap the amount for deposit
                AddBalanceDTO depositDTO = new AddBalanceDTO();
                depositDTO.setAmountToAdd(amount); // Positive amount for deposit

                // Deposit into the destination account
                log.info("Attempting to deposit amount={} into destination accountId={}", amount, destinationAccountId);
                String depositResult = accountClient.addBalance(destinationAccountId, depositDTO);
                log.info("Deposit result: {}", depositResult);

                if (depositResult.contains("actualizado")) {
                    // Create transfer transaction record
                    Transaction transaction = new Transaction();
                    transaction.setTransactionType("transferencia");
                    transaction.setAmount(amount);
                    transaction.setSourceAccountId(sourceAccountId);
                    transaction.setDestinationAccountId(destinationAccountId);
                    transaction.setUserId(sourceAccountId);
                    transaction.setStatus("completado");

                    // Save the transaction
                    Transaction savedTransaction = transactionRepository.save(transaction);
                    log.info("Transfer transaction created and saved: {}", savedTransaction);
                    return savedTransaction;
                } else {
                    log.error("Transfer failed - deposit failed for destinationAccountId={}", destinationAccountId);
                    throw new RuntimeException("Transfer failed - deposit failed");
                }
            } else {
                log.error("Transfer failed - withdrawal failed for sourceAccountId={}", sourceAccountId);
                throw new RuntimeException("Transfer failed - withdrawal failed");
            }
        } catch (Exception e) {
            log.error("Error creating transfer between accounts: {} and {} with amount {}: {}", sourceAccountId, destinationAccountId, amount, e.getMessage());
            throw new RuntimeException("Error processing transfer", e);
        }
    }

    // In TransactionService class
    public List<Transaction> getAllTransactions() {
        log.info("Fetching all transactions");
        return transactionRepository.findAll();
    }

}
