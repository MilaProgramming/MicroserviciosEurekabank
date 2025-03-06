// src/controllers/EurekaController.js
import { useState } from 'react';
import { EurekaService } from '../services/EurekaService';

// src/controllers/EurekaController.js

export function useEurekaController() {
  const [movimientos, setMovimientos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (usuario, contrasena) => {
    const success = await EurekaService.login(usuario, contrasena);
    setIsLoggedIn(success);
    console.log("Login exitoso:", success);
    if (success) {
      setMensaje("Login exitoso!");
    } else {
      setMensaje("Login fallido. Intenta nuevamente.");
    }
  };

  const leerMovimientos = async (cuenta) => {
    const movimientos = await EurekaService.leerMovimientos(cuenta);
    setMovimientos(movimientos);
  };

  const realizarDeposito = async (cuenta, monto) => {
    const result = await EurekaService.registrarDeposito(cuenta, monto);
    setMensaje(result);
  };

  const realizarTransferencia = async (cuentaOrigen, cuentaDestino, importe) => {
    const result = await EurekaService.registrarTransferencia(cuentaOrigen, cuentaDestino, importe);
    setMensaje(result);
  };

  const realizarRetiro = async (cuenta, importe) => {
    const result = await EurekaService.registrarRetiro(cuenta, importe);
    setMensaje(result);
  };

  return {
    movimientos,
    mensaje,
    isLoggedIn,
    login,
    leerMovimientos,
    realizarDeposito,
    realizarTransferencia,
    realizarRetiro,
  };
}
