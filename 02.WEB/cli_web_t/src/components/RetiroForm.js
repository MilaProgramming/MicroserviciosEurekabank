// src/components/RetiroForm.js
import React, { useState } from 'react';

function RetiroForm() {
  const [cuenta, setCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [status, setStatus] = useState(''); // To store the status of the transaction
  const [isLoading, setIsLoading] = useState(false); // To handle loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure that the amount is negative for retiro
    const amount = parseFloat(monto);
    const transactionAmount = amount < 0 ? amount : -amount; // Convert to negative if not already

    // Prepare the request payload
    const payload = {
      accountNumber: cuenta,
      amount: transactionAmount, // Send negative amount for retiro
      transactionType: 'retiro',
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
        throw new Error('Failed to create retiro');
      }

      const data = await response.json();
      setStatus(`Retiro exitoso! Transaction ID: ${data.id}`);
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
        <label>Monto a Retirar:</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Realizando Retiro...' : 'Realizar Retiro'}
        </button>
      </form>

      {status && <p>{status}</p>} {/* Display status message */}
    </div>
  );
}

export default RetiroForm;
