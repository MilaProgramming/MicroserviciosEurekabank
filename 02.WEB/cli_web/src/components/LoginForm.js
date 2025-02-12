// src/components/LoginForm.js
import React, { useState } from 'react';

function LoginForm({ login }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(usuario, contrasena);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Usuario:</label>
      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <label>Contraseña:</label>
      <input
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

export default LoginForm;
