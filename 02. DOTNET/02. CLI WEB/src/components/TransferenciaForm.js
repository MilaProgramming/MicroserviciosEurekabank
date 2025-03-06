// src/components/TransferenciaForm.js
import React, { useState } from 'react';

function TransferenciaForm() {
  const [cuentaSalida, setCuentaSalida] = useState('');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [status, setStatus] = useState(''); // To store the status of the transaction
  const [isLoading, setIsLoading] = useState(false); // To handle loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the request payload
    const payload = {
      sourceAccountNumber: cuentaSalida,
      destinationAccountNumber: cuentaDestino,
      amount: parseFloat(monto), // Amount to transfer
    };

    setIsLoading(true);
    setStatus(''); // Reset status on new request

    try {
      // Make the POST request to the backend
      const response = await fetch('http://localhost:8083/transaccion/transferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to create transferencia');
      }

      const data = await response.json();
      setStatus(`Transferencia exitosa! Transaction ID: ${data.id}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Realizando Transferencia...' : 'Realizar Transferencia'}
        </button>
      </form>

      {status && <p>{status}</p>} {/* Display status message */}
    </div>
  );
}

export default TransferenciaForm;
