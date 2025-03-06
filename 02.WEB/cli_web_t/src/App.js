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
import AboutUs from './components/AboutUs';


function App() {
  const [cuenta, setCuenta] = useState('');
  const [balance, setBalance] = useState(null); // State to hold the balance
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [activaPestana, setActivaPestana] = useState('movimientos');
  const [userDetails, setUserDetails] = useState(null); // Store user details (name, account number)
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [quote, setQuote] = useState(null);
  const [news, setNews] = useState([]);
  const [conversionRate, setConversionRate] = useState(null);
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  
  const {
    movimientos,
    leerMovimientos,
    realizarDeposito,
    realizarTransferencia,
    realizarRetiro
  } = useEurekaController();

  const { login } = useUserController();

  // Function to handle the change in the account input
  const handleCuentaChange = (e) => {
    setCuenta(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };


  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
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
    if (pestana === 'frase') fetchQuote();
    if (pestana === 'noticias') fetchNews();
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

  const handleLoginSuccess = (user) => {
    setUserDetails({
      firstName: user.firstName,
      lastName: user.lastName,
      accountNumber: user.account.accountNumber,
    });
    setLoading(false); // Set loading to false after successful login
    setActivaPestana('movimientos');  // You can default to "movimientos" tab after login
  };
  
  const fetchQuote = async () => {
    try {
      const response = await fetch('http://localhost:8081/users/phrase');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      alert('Error obteniendo la frase.');
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:8081/users/news');
      const data = await response.json();
      setNews(data.articles.slice(0, 5));
    } catch (error) {
      alert('Error obteniendo noticias.');
    }
  };

  const convertCurrency = async () => {
    if (!amount) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/users/currency/${fromCurrency}/${toCurrency}/${amount}`);
      const data = await response.json();
      setConversionRate(data.converted_amount);
    } catch (error) {
      alert('Error obteniendo tasa de conversión.');
    }
  };

  return (
    <div className="App">
      <div className='Header'>
        <div className='Logos'>
          <h1>EurekaBank</h1>
          <img src={monstruo} style={{ width: '200px' }} alt="Monstruo" />
        </div>
        {/* Show user details if logged in */}
        {userDetails ? (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3>¡Bienvenido, {userDetails.firstName} {userDetails.lastName}!</h3>
            <p>Número de Cuenta: {userDetails.accountNumber}</p>
          </div>
        ) : null}
      </div>

      {!userDetails ? (
          <div className="login-container">
          <LoginForm login={login} onLoginSuccess={handleLoginSuccess} />
          </div>
      ) : (
        <div className='tabInfo'>
          {/* Tab buttons */}
          <div className='botones'>
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
            <button onClick={() => cambiarPestana('frase')} className={activaPestana === 'transferencia' ? 'active' : ''}>
              Ver Frase del Día
            </button>
            <button onClick={() => cambiarPestana('noticias')} className={activaPestana === 'transferencia' ? 'active' : ''}>
              Ver Noticias
            </button>
            <button onClick={() => cambiarPestana('conversion')} className={activaPestana === 'transferencia' ? 'active' : ''}>
              Convertir Unidades
            </button>
            <button onClick={() => cambiarPestana('aboutus')} className={activaPestana === 'aboutus' ? 'active' : ''}>
              ¿Quienes somos?
            </button>
          </div>

          <div className='tabContent'>
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
          {activaPestana === 'aboutus' && (
            <div>
              <AboutUs />
            </div>
          )}

          {activaPestana === 'frase' && quote && (
            <div className="quote-container">
              <h3>Frase del Día</h3>
              <p>{quote.content} - {quote.author}</p>
            </div>
          )}
          {activaPestana === 'noticias' && news.length > 0 && (
            <div className="news-container">
              <h3>Últimas Noticias</h3>
              <ul>
                {news.map((article, index) => (
                  <li key={index}><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></li>
                ))}
              </ul>
            </div>
          )}
      {activaPestana === 'conversion' && (
            <div className="conversion-container">
              <h3>Conversión de Moneda</h3>
              <input type="number" value={amount} onChange={handleAmountChange} placeholder="Ingresa la cantidad" />
              <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
                <option value="GBP">GBP</option>
              </select>
              {/* SPACE */}
              <br></br>
              <span>a </span>
              <tr></tr>
              <select value={toCurrency} onChange={handleToCurrencyChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
                <option value="GBP">GBP</option>
              </select>
              <button onClick={convertCurrency}>Convertir</button>
              {conversionRate !== null && <p>{amount} {fromCurrency} = {conversionRate} {toCurrency}</p>}
            </div>
          )}
          </div>


        </div>
      )}
    </div>
  );
}

export default App;
