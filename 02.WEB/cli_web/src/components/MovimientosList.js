import React, { useEffect, useState } from 'react';

function MovimientosList({ cuenta, leerMovimientos, movimientos }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCuenta, setLastCuenta] = useState(null); // Guardar la cuenta que ya hemos procesado

  useEffect(() => {
    if (cuenta && cuenta !== lastCuenta && !isLoading) {
      setIsLoading(true); // Indicamos que estamos haciendo la petición
      setLastCuenta(cuenta); // Guardamos la cuenta actual para evitar volver a cargarla

      leerMovimientos(cuenta)
        .finally(() => setIsLoading(false)); // Cambiamos isLoading a false después de que la petición finalice
    }
  }, [cuenta, lastCuenta, isLoading, leerMovimientos]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    // Eliminar el sufijo '[UTC]' si está presente
    const formattedDate = dateString.replace(/\[UTC\]$/, '');
    const date = new Date(formattedDate);
    
    // Verificar si la fecha es válida
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : 'Fecha inválida';
  };

  return (
    <div>
      <h3>Movimientos</h3>
      {isLoading ? (
        <p>Cargando...</p>
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
                <td>{mov.nromov}</td>
                <td>{formatDate(mov.fecha)}&nbsp;&nbsp;&nbsp;&nbsp;</td> {/* Usar la función para formatear la fecha */}
                <td>{mov.tipo}&nbsp;&nbsp;&nbsp;</td>
                <td>{isNaN(mov.importe) ? 'N/A' : parseFloat(mov.importe).toFixed(2)}</td> {/* Verificar si es un número */}
                <td>{mov.accion}</td>
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
