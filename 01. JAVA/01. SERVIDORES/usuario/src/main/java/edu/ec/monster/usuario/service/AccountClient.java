package edu.ec.monster.usuario.service;
import edu.ec.monster.usuario.model.Account;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "cuenta", url = "http://localhost:8082/accounts")
public interface AccountClient {
    @PostMapping("/crear")
    Account createAccount(@RequestParam("userId") Long userId, @RequestParam("accountNumber") String accountNumber);

    @DeleteMapping("/{accountId}")
    void deleteAccount(@PathVariable("accountId") Long accountId);
}
