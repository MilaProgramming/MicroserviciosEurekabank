CREATE DATABASE eurekabank;

\c eurekabank;

CREATE TABLE accounts (
    id BIGINT PRIMARY KEY,
    account_number BIGINT NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
