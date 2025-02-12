const BASE_URL = "http://localhost:8083/transaccion";

const performRestRequest = async (endpoint, method, body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error realizando la solicitud REST:", error);
    throw error;
  }
};

export const TransactionService = {
  async realizarMovimiento(accountId, amount, transactionType) {
    return await performRestRequest("movimiento", "POST", { accountId, amount, transactionType });
  },

  async realizarTransferencia(sourceAccountId, destinationAccountId, amount) {
    return await performRestRequest("transferencia", "POST", { sourceAccountId, destinationAccountId, amount });
  },

  async obtenerTransacciones() {
    return await performRestRequest("", "GET");
  }
};
