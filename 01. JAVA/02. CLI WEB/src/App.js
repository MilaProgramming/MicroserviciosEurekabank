import React, { useState, useEffect } from 'react';
import { useEurekaController } from './controllers/EurekaController';
import useUserController from './controllers/UserController';
import MovimientosList from './components/MovimientosList';
import DepositoForm from './components/DepositoForm';
import LoginForm from './components/LoginForm';
import RetiroForm from './components/RetiroForm';
import TransferenciaForm from './components/TransferenciaForm';
import './App.css';
import monstruo from './assets/monster.jpg';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [activaPestana, setActivaPestana] = useState('movimientos');
  const [userDetails, setUserDetails] = useState(null);
  const [clockTime, setClockTime] = useState(new Date());
  const [calculatorInput, setCalculatorInput] = useState('');
  const [bitcoinPrice, setBitcoinPrice] = useState(null);

  const { movimientos, leerMovimientos, realizarDeposito, realizarTransferencia, realizarRetiro } = useEurekaController();
  const { login } = useUserController();

  useEffect(() => {
    const interval = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Bitcoin Price
  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      setBitcoinPrice(data.bitcoin.usd);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 30000); // Refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  const onKeyPress = button => {
    if (button === "{bksp}") {
      setCalculatorInput(calculatorInput.slice(0, -1));
    } else if (button === "{enter}") {
      evaluateExpression();
    } else {
      setCalculatorInput(calculatorInput + button);
    }
  };

  const evaluateExpression = () => {
    try {
      setCalculatorInput(eval(calculatorInput).toString());
    } catch {
      alert('Invalid expression');
    }
  };

  return (
    <div className="App">
      <div className="header">
        <img src={monstruo} className="logo" alt="Monstruo" />
        <Clock value={clockTime} className="clock" />
      </div>

      {userDetails ? (
        <>
          <div>
            <button onClick={() => setActivaPestana('movimientos')}>Movimientos</button>
            <button onClick={() => setActivaPestana('deposito')}>Depósito</button>
            <button onClick={() => setActivaPestana('retiro')}>Retiro</button>
            <button onClick={() => setActivaPestana('transferencia')}>Transferencia</button>
            <button onClick={() => setActivaPestana('bitcoin')}>Bitcoin Price</button>
            <button onClick={() => setActivaPestana('calculator')}>Calculator</button>
          </div>

          {activaPestana === 'movimientos' && <MovimientosList cuenta={cuenta} leerMovimientos={leerMovimientos} movimientos={movimientos} />} 
          {activaPestana === 'deposito' && <DepositoForm realizarDeposito={realizarDeposito} />}
          {activaPestana === 'retiro' && <RetiroForm realizarRetiro={realizarRetiro} />}
          {activaPestana === 'transferencia' && <TransferenciaForm realizarTransferencia={realizarTransferencia} />}
          
          {activaPestana === 'bitcoin' && (
            <div className="bitcoin-widget">
              <h3>Bitcoin Price</h3>
              <p>Current Price: ${bitcoinPrice ? bitcoinPrice.toFixed(2) : 'Loading...'}</p>
            </div>
          )}

          {activaPestana === 'calculator' && (
            <div>
              <h3>Calculator</h3>
              <input type="text" value={calculatorInput} readOnly />
              <Keyboard layout={{default: ["1 2 3", "4 5 6", "7 8 9", "+ 0 -", "* / =", "{bksp} {enter}"]}} onKeyPress={onKeyPress} />
            </div>
          )}
        </>
      ) : (
        <LoginForm login={login} onLoginSuccess={setUserDetails} />
      )}
    </div>
  );
}

export default App;