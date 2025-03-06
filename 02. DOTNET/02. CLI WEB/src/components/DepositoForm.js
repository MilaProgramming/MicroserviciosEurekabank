// src/components/DepositoForm.js
import React, { useState } from 'react';

function DepositoForm() {
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [status, setStatus] = useState(''); // To store the status of the transaction
  const [isLoading, setIsLoading] = useState(false); // To handle loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the request payload
    const payload = {
      accountNumber: cuenta,
      amount: parseFloat(monto),
      transactionType: 'deposito',
    };

    setIsLoading(true);
    setStatus(''); // Reset status on new request

    try {
      // Make the POST request to the backend
      const response = await fetch('http://localhost:8083/transaccion/movimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to create deposito');
      }

      const data = await response.json();
      setStatus(`Deposito exitoso! Transaction ID: ${data.id}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Realizando Depósito...' : 'Realizar Depósito'}
        </button>
      </form>

      {status && <p>{status}</p>} {/* Display status message */}
    </div>
  );
}

export default DepositoForm;
