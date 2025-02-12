import React, { useState } from 'react';
import { useEurekaController } from './controllers/EurekaController';
import useUserController from './controllers/UserController';
import MovimientosList from './components/MovimientosList';
import DepositoForm from './components/DepositoForm';
import LoginForm from './components/LoginForm';
import './App.css';
import monstruo from './assets/monster.jpg';
import RetiroForm from './components/RetiroForm';
import TransferenciaForm from './components/TransferenciaForm';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false); // Estado para controlar si se deben mostrar los movimientos
  const [activaPestana, setActivaPestana] = useState('movimientos'); // Estado para controlar la pestaña activa
  const {
    movimientos,
    leerMovimientos,
    realizarDeposito,
    realizarTransferencia,
    realizarRetiro
  } = useEurekaController();

  const {
    usuarios,
    usuario,
    error,
    loading,
    cargarUsuarios,
    registrarUsuario,
    encontrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login
  } = useUserController();

  // Función para manejar el cambio en el input de cuenta
  const handleCuentaChange = (e) => {
    setCuenta(e.target.value);
  };

  // Función para manejar el clic en el botón "Ver Movimientos"
  const handleVerMovimientos = () => {
    if (cuenta) {
      leerMovimientos(cuenta);
      setMostrarMovimientos(true); // Muestra los movimientos cuando se hace clic en el botón
    } else {
      alert('Por favor, ingresa un número de cuenta válido.');
    }
  };

  // Cambia la pestaña activa
  const cambiarPestana = (pestana) => {
    setActivaPestana(pestana);
    setMostrarMovimientos(false); // Resetear la lista de movimientos al cambiar de pestaña
  };

  return (
    <div className="App">
      <h1>EurekaBank</h1>
      <img src={monstruo} style={{width: "200px"}} alt="Monstruo" />

      {!loading ? (
        <LoginForm login={login} />
      ) : (
        <>
          

          {/* Contenedor para las pestañas */}
          <div>
            <button onClick={() => cambiarPestana('movimientos')} className={activaPestana === 'movimientos' ? 'active' : ''}>
              Ver Movimientos
            </button>
            <button onClick={() => cambiarPestana('deposito')} className={activaPestana === 'deposito' ? 'active' : ''}>
              Realizar Depósito
            </button>
            <button onClick={() => cambiarPestana('retiro')} className={activaPestana === 'retiro' ? 'active' : ''}>
              Realizar Retiro
            </button>
            <button onClick={() => cambiarPestana('transferencia')} className={activaPestana === 'transferencia' ? 'active' : ''}>
              Realizar Transferencia
            </button>
          </div>

          {/* Contenido de las pestañas */}
          {activaPestana === 'movimientos' && (
            <div>
              {/* Input para que el usuario ingrese la cuenta */}
          <div>
            <label htmlFor="cuenta">Número de cuenta: </label>
            <input
              type="text"
              id="cuenta"
              value={cuenta}
              onChange={handleCuentaChange}
              placeholder="Ingresa tu cuenta"
            />
          </div>
              <button onClick={handleVerMovimientos}>Ver Movimientos</button>
              {mostrarMovimientos && (
                <MovimientosList cuenta={cuenta} leerMovimientos={leerMovimientos} movimientos={movimientos} />
              )}
            </div>
          )}

          {activaPestana === 'deposito' && (
            <div>
              <DepositoForm realizarDeposito={realizarDeposito} />
            </div>
          )}
          {activaPestana === 'retiro' && (
            <div>
              <RetiroForm realizarRetiro={realizarRetiro} />
            </div>
          )}
          {activaPestana === 'transferencia' && (
            <div>
              <TransferenciaForm realizarTransferencia={realizarTransferencia} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
