package edu.ec.monster.cuenta.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findById(Long accountId);
    Optional<Account> findByAccountNumber(String accountNumber);
}
