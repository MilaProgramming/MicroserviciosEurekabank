const BASE_URL = "http://104.197.108.224/eureka-server-java-restful-1.0-SNAPSHOT/java";

// Helper function para realizar solicitudes HTTP
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

// Servicio Eureka RESTful
export const EurekaService = {
  // Login
  async login(usuario, clave) {
    const body = { usuario, clave };
    try {
      const response = await performRestRequest("login", "POST", body);
      return response === true; // Devuelve true si el login es exitoso
    } catch (error) {
      console.error("Error en el login:", error);
      return false;
    }
  },

// Leer movimientos
async leerMovimientos(cuenta) {
  const body = { cuenta };
  try {
    const response = await performRestRequest("leerMovimientos", "POST", body);

    // Verifica que la respuesta sea un array
    if (Array.isArray(response)) {
      return response.map(item => {
        return {
          fecha: item.fecha,  // Formato de fecha legible
          tipo: item.tipo,
          importe: item.importe.toFixed(2),  // Asegúrate de que el importe tenga 2 decimales
          accion: item.accion,
          nromov: item.nromov
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al leer los movimientos:", error);
    return [];
  }
},

  // Registrar depósito
  async registrarDeposito(cuenta, importe) {
    const body = { cuenta, importe };
    try {
      const response = await performRestRequest("registrarDeposito", "POST", body);
      return response || "Depósito registrado con éxito.";
    } catch (error) {
      console.error("Error al registrar el depósito:", error);
      return "Error al realizar el depósito.";
    }
  },

  // Registrar retiro
  async registrarRetiro(cuenta, importe) {
    const body = { cuenta, importe };
    try {
      const response = await performRestRequest("registrarRetiro", "POST", body);
      return response || "Retiro registrado con éxito.";
    } catch (error) {
      console.error("Error al registrar el retiro:", error);
      return "Error al realizar el retiro.";
    }
  },

  // Registrar transferencia
  async registrarTransferencia(cuentaOrigen, cuentaDestino, importe) {
    const body = { cuentaOrigen, cuentaDestino, importe };
    try {
      const response = await performRestRequest("registrarTransferencia", "POST", body);
      return response || "Transferencia realizada con éxito.";
    } catch (error) {
      console.error("Error al registrar la transferencia:", error);
      return "Error al realizar la transferencia.";
    }
  },
};
