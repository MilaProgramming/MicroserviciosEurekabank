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
  const [balance, setBalance] = useState(null); // State to hold the balance
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false); 
  const [activaPestana, setActivaPestana] = useState('movimientos');
  const {
    movimientos,
    leerMovimientos,
    realizarDeposito,
    realizarTransferencia,
    realizarRetiro
  } = useEurekaController();

  const {
    loading,
    login
  } = useUserController();

  // Function to handle the change in the account input
  const handleCuentaChange = (e) => {
    setCuenta(e.target.value);
  };

  // Function to handle the click for "Ver Movimientos"
  const handleVerMovimientos = () => {
    if (cuenta) {
      leerMovimientos(cuenta);
      setMostrarMovimientos(true);
    } else {
      alert('Por favor, ingresa un número de cuenta válido.');
    }
  };

  // Function to change tabs
  const cambiarPestana = (pestana) => {
    setActivaPestana(pestana);
    setMostrarMovimientos(false); // Reset movimientos list when changing tabs
  };

  // Function to fetch balance from the API
  const handleVerBalance = async () => {
    if (cuenta) {
      try {
        const response = await fetch(`http://localhost:8082/accounts/nocuenta/${cuenta}`);
        if (!response.ok) {
          throw new Error('Error al obtener el balance');
        }
        const data = await response.json();
        setBalance(data.balance); // Set balance in state
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    } else {
      alert('Por favor, ingresa un número de cuenta válido.');
    }
  };

  return (
    <div className="App">
      <h1>EurekaBank</h1>
      <img src={monstruo} style={{width: "200px"}} alt="Monstruo" />

      {!loading ? (
        <LoginForm login={login} />
      ) : (
        <>
          {/* Tab buttons */}
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
            <button onClick={handleVerBalance}>
              Ver Balance
            </button>
          </div>

          {/* Content of active tab */}
          {activaPestana === 'movimientos' && (
            <div>
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

          {/* Display balance */}
          {balance !== null && (
            <div>
              <h2>Balance de la Cuenta: ${balance}</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
