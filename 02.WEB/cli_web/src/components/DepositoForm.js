// src/components/DepositoForm.js
import React, { useState } from 'react';

function DepositoForm({ realizarDeposito }) {
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    realizarDeposito(cuenta, parseFloat(monto));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Número de cuenta:</label>
      <input
        type="text"
        value={cuenta}
        onChange={(e) => setCuenta(e.target.value)}
        required
      />
      <label>Monto a Depositar:</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
      />
      <button type="submit">Realizar Depósito</button>
    </form>
  );
}

export default DepositoForm;
