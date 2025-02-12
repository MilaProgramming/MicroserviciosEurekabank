package edu.ec.monster.usuario.service;

import edu.ec.monster.usuario.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AccountClient accountClient;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Transactional
    public User registerUser(User user) {
        Logger logger = LoggerFactory.getLogger(UserService.class);

        // Log the initial user information
        logger.info("Starting user registration for: {}", user.getUsername());

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        logger.info("Password hashed for user: {}", user.getUsername());

        // Save user first to generate ID
        User savedUser = userRepository.save(user);
        logger.info("User saved. User ID: {}", savedUser.getId());

        // Generate Account Number
        Long generatedAccountId = generateAccountNumber();
        logger.info("Generated account number: {}", generatedAccountId);

        // Create account locally in User Service
        Account account = new Account();
        account.setAccountNumber(generatedAccountId.toString());
        account.setUser(savedUser); // Associate user with account

        // Manually set the Account ID to be the same as User ID
        account.setId(savedUser.getId()); // Make Account ID same as User ID

        // Save the account in the local database
        Account savedAccount = accountRepository.save(account);
        logger.info("Account created locally for user {} with account number: {}", savedUser.getUsername(), savedAccount.getAccountNumber());

        // Now, call the external account service with the correct userId and accountNumber
        try {
            Account createdAccount = accountClient.createAccount(savedUser.getId(), generatedAccountId.toString());
            logger.info("Account successfully created in the account service. Account ID: {}", createdAccount.getId());

            // If created account has a valid ID
            if (createdAccount == null || createdAccount.getId() == null) {
                logger.error("Failed to create account in account-service for user {}. Response: {}", savedUser.getUsername(), createdAccount);
                throw new RuntimeException("Failed to create account in account-service");
            }

            // Set the local account reference in user
            savedUser.setAccount(savedAccount);
            logger.info("Setting local account reference for user: {}", savedUser.getUsername());

            // Save user with linked account again
            savedUser = userRepository.save(savedUser);
            logger.info("User with ID {} and account linked successfully.", savedUser.getId());

            return savedUser;
        } catch (Exception e) {
            logger.error("Error occurred while creating account in external service for user {}: {}", savedUser.getUsername(), e.getMessage(), e);
            throw new RuntimeException("Error while creating account in external service.", e);
        }
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        // Log retrieved users to check if they contain accounts
        for (User user : users) {
            logger.info("User ID: {}, Username: {}, Account: {}",
                    user.getId(),
                    user.getUsername(),
                    (user.getAccount() != null ? user.getAccount().getId() : "No account"));
        }

        List<UserDTO> userDTOs = users.stream()
                .map(UserDTO::new) // Convert each User to UserDTO
                .collect(Collectors.toList());

        // Log the DTOs after conversion
        for (UserDTO userDTO : userDTOs) {
            logger.info("UserDTO ID: {}, AccountId: {}", userDTO.getId(), userDTO.getAccountId());
        }

        return userDTOs;
    }


    public Optional<User> findUserById(Long id) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Manually load the account for this user
            Account account = accountRepository.findById(user.getId()).orElse(null);  // Find account by user ID
            user.setAccount(account);  // Set the account on the user
            return Optional.of(user);
        }

        return Optional.empty();
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setAge(updatedUser.getAge());
            user.setGender(updatedUser.getGender());

            // Only update password if it's provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            // Manually set the account if needed
            Account account = accountRepository.findById(user.getId()).orElse(null);  // Find account by user ID
            user.setAccount(account); // Set the account again after update

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public void deleteUser(Long id) {
        logger.info("Attempting to delete user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        logger.info("User found: {}", user);

        // Fetch the associated account first
        Optional<Account> accountOpt = accountRepository.findByUserId(id);

        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            logger.info("Associated account found: {}", account);

            // Try to delete the account via Feign client
            try {
                logger.info("Attempting to delete account with ID: {} via Feign", account.getId());
                accountClient.deleteAccount(account.getId());
                logger.info("Account deleted successfully via Feign");
            } catch (Exception e) {
                logger.error("Failed to delete account via Feign client: {}", e.getMessage(), e);
                throw new RuntimeException("Account deletion failed via Feign", e);
            }

            // Delete the account from the database
            logger.info("Deleting account from repository");
            accountRepository.delete(account);
        } else {
            logger.warn("No account found for user ID: {}", id);
        }

        // Delete the user
        logger.info("Deleting user from repository");
        userRepository.deleteById(id);

        logger.info("User with ID {} deleted successfully", id);
    }



    public Optional<User> loginUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Verify password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }

        return Optional.empty(); // Return empty if login fails
    }

    private Long generateAccountNumber() {
        return new Random().nextLong(1000000000L, 9999999999L); // Generates a 10-digit account ID
    }

}
