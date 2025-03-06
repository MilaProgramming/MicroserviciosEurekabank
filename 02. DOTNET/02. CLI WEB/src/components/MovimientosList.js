import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/TransactionService'; // Import the service

function MovimientosList({ cuenta }) {
  const [movimientos, setMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      if (cuenta) {
        setIsLoading(true);
        setError('');
        try {
          const data = await fetchTransactions(cuenta);
          setMovimientos(data);
        } catch (err) {
          setError('Failed to load transactions');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();
  }, [cuenta]);

  // Format date helper function
  const formatDate = (dateString) => {
    const formattedDate = dateString.replace(/\[UTC\]$/, '');
    const date = new Date(formattedDate);
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : 'Fecha inválida';
  };

  return (
    <div>
      <h3>Movimientos</h3>
      {isLoading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : movimientos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>No &nbsp;&nbsp;&nbsp;</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Importe&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov, index) => (
              <tr key={index}>
                <td>{mov.id}</td>
                <td>{formatDate(mov.transactionDate)}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>{mov.transactionType}&nbsp;&nbsp;&nbsp;</td>
                <td>{isNaN(mov.amount) ? 'N/A' : parseFloat(mov.amount).toFixed(2)}</td>
                <td>{mov.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay movimientos disponibles.</p>
      )}
    </div>
  );
}

export default MovimientosList;
