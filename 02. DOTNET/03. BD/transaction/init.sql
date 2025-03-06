-- Drop the database if it already exists (optional for testing)
DROP DATABASE IF EXISTS eurekabank;

-- Create the database
CREATE DATABASE eurekabank;

-- Switch to the newly created database
USE eurekabank;

-- Create the transactions table
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_type VARCHAR(50) NOT NULL,  -- 'retiro', 'deposito', 'transferencia'
    amount DECIMAL(15, 2) NOT NULL,
    source_account_id BIGINT,               -- For 'transferencia', this will be the source account ID
    destination_account_id BIGINT,          -- For 'transferencia', this will be the destination account ID
    user_id BIGINT NOT NULL,                -- The ID of the user who made the transaction
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20)                     -- Can be 'completado', or 'faillido'
);
