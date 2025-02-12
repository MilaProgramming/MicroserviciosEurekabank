// src/components/DepositoForm.js
import React, { useState } from 'react';

function RetiroForm({ realizarRetiro }) {
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    realizarRetiro(cuenta, parseFloat(monto));
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
      <label>Monto a Retirar:</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
      />
      <button type="submit">Realizar Retiro</button>
    </form>
  );
}

export default RetiroForm;
