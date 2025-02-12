const BASE_URL = "http://localhost:8082/accounts";

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

export const AccountService = {
  async obtenerCuentas() {
    return await performRestRequest("", "GET");
  },

  async activarCuenta(id) {
    return await performRestRequest(`${id}/desactivar`, "PUT");
  },

  async obtenerBalance(id) {
    return await performRestRequest(`${id}/balance`, "GET");
  },

  async buscarCuentaPorId(id) {
    return await performRestRequest(`${id}`, "GET");
  }
};
