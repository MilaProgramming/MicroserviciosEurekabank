// src/services/transactionService.js

const apiUrl = "http://localhost:8083/transaccion";

export const fetchTransactions = async (cuenta) => {
  try {
    const response = await fetch(`${apiUrl}/${cuenta}`);
    if (!response.ok) {
      throw new Error("Error fetching transactions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
