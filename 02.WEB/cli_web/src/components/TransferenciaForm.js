// src/components/DepositoForm.js
import React, { useState } from 'react';

function TransferenciaForm({ realizarTransferencia }) {
  const [cuentaSalida, setCuentaSalida] = useState('');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    realizarTransferencia(cuentaSalida, cuentaDestino, parseFloat(monto));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Número de cuenta salida:</label>
      <input
        type="text"
        value={cuentaSalida}
        onChange={(e) => setCuentaSalida(e.target.value)}
        required
      />
      <label>Número de cuenta destino:</label>
      <input
        type="text"
        value={cuentaDestino}
        onChange={(e) => setCuentaDestino(e.target.value)}
        required
      />
      <label>Monto a Transferir:</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
      />
      <button type="submit">Realizar Transferencia</button>
    </form>
  );
}

export default TransferenciaForm;
