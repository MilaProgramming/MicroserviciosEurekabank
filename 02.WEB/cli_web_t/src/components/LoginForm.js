// src/components/LoginForm.js
import React, { useState } from 'react';

function LoginForm({ login, register }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(usuario, contrasena);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register(nuevoUsuario, nuevaContrasena);
    setMostrarRegistro(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: mostrarRegistro ? 'none' : 'block' }}>
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

      <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
        {mostrarRegistro ? 'Volver al Login' : 'Registrarse'}
      </button>

      {mostrarRegistro && (
        <form onSubmit={handleRegisterSubmit}>
          <label>Nuevo Usuario:</label>
          <input
            type="text"
            value={nuevoUsuario}
            onChange={(e) => setNuevoUsuario(e.target.value)}
            required
          />
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
