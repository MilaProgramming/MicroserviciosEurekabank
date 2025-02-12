package edu.ec.monster.transaccion.controller;

import edu.ec.monster.transaccion.model.MovementRequest;
import edu.ec.monster.transaccion.model.Transaction;
import edu.ec.monster.transaccion.model.TransferRequest;
import edu.ec.monster.transaccion.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transaccion")
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/movimiento")
    public ResponseEntity<Transaction> createMovement(@RequestBody MovementRequest request) {
        Transaction transaction = transactionService.createMovement(request.getAccountId(), request.getAmount(), request.getTransactionType());
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/transferencia")
    public ResponseEntity<Transaction> createTransfer(@RequestBody TransferRequest request) {
        if (request == null) {
            log.error("Received null request body");
            throw new IllegalArgumentException("TransferRequest cannot be null");
        }
        Transaction transaction = transactionService.createTransfer(request.getSourceAccountId(), request.getDestinationAccountId(), request.getAmount());
        return ResponseEntity.ok(transaction);
    }
    
    @GetMapping("/")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        if (transactions.isEmpty()) {
            log.info("No transactions found.");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transactions);
    }

}
