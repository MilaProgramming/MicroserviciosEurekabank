import React, { useState } from 'react';

function LoginForm({ login, onLoginSuccess }) {  // Make sure to destructure onLoginSuccess here
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [accountNumber, setAccountNumber] = useState(null);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario,
          password: contrasena,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        onLoginSuccess(data);  // Now onLoginSuccess is defined correctly
      } else {
        alert('Login fallido');
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
      console.error(error);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      firstName,
      lastName,
      age: parseInt(age),
      gender,
      username: nuevoUsuario,
      password: nuevaContrasena
    };

    try {
      const response = await fetch('http://localhost:8081/users/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistroExitoso(true);
        setAccountNumber(data.account.accountNumber);
        setMostrarRegistro(false);
      } else {
        alert(`Error: ${data.message || 'Registro fallido'}`);
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
      console.error(error);
    }
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
          <label>Primer Nombre:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label>Apellido:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label>Edad:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <label>Género:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="MUJER">Mujer</option>
            <option value="HOMBRE">Hombre</option>
            <option value="OTRO">Otro</option>
          </select>
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

      {registroExitoso && accountNumber && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#28a745' }}>
          <h3>¡Registro Exitoso!</h3>
          <p>La cuenta ha sido creada con éxito. Número de cuenta: {accountNumber}</p>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
