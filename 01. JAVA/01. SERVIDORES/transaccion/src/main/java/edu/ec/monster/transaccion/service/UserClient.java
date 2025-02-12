package edu.ec.monster.transaccion.service;

import edu.ec.monster.transaccion.model.User;
import edu.ec.monster.transaccion.model.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@FeignClient(name = "usuario", url = "http://localhost:8081/users")
public interface UserClient {

    @PutMapping("/encontrar")
    public ResponseEntity<?> findUserById(@RequestBody User user);

}
