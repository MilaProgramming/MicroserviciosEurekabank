const BASE_URL = "http://localhost:8081/users";

const performRestRequest = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
    return data;
  } catch (error) {
    console.error("Error realizando la solicitud REST:", error);
    throw error;
  }
};

export const UserService = {
  registrarUsuario: (userData) => performRestRequest("/registrar", "POST", userData),
  obtenerUsuarios: () => performRestRequest(""),
  encontrarUsuario: (id) => performRestRequest("/encontrar", "PUT", { id }),
  actualizarUsuario: (id, userData) => performRestRequest("/"+id, "PUT", userData),
  eliminarUsuario: (id) => performRestRequest("/"+id, "DELETE"),
  login: (username, password) => performRestRequest("/login", "POST", { username, password }),
};
