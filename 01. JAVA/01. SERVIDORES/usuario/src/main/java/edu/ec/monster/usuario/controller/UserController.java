package edu.ec.monster.usuario.controller;
import edu.ec.monster.usuario.model.LoginRequest;
import edu.ec.monster.usuario.model.User;
import edu.ec.monster.usuario.model.UserDTO;
import edu.ec.monster.usuario.model.UserResponse;
import edu.ec.monster.usuario.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String EXCHANGE_RATE_API = "https://v6.exchangerate-api.com/v6/ad5945e3a57058d54cf1735e/pair";
    private final String QUOTABLE_API = "http://api.quotable.io/random";
    private final String NEWS_API = "https://newsapi.org/v2/top-headlines?country=us&apiKey=fa55f8285c8f42d68071ea25251e874c";

    @PostMapping("/registrar")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/encontrar")
    public ResponseEntity<?> findUserById(@RequestBody User user) {
        Optional<User> userOptional = userService.findUserById(user.getId());
        return userOptional.map(foundUser -> ResponseEntity.ok(new UserResponse(foundUser)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(401).body("Usuario o contraseña inválidos");
        }
    }

    @GetMapping("/phrase")
    public ResponseEntity<?> getPhraseOfTheDay() {
        Map<String, Object> response = restTemplate.getForObject(QUOTABLE_API, Map.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/news")
    public ResponseEntity<?> getNews() {
        Map<String, Object> response = restTemplate.getForObject(NEWS_API, Map.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/currency/{from}/{to}")
    public ResponseEntity<?> getCurrencyConversion(@PathVariable String from, @PathVariable String to) {
        String url = EXCHANGE_RATE_API + "/" + from + "/" + to;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return ResponseEntity.ok(response);
    }

}
