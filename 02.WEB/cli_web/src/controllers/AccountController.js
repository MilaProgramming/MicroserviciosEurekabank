import { useState } from "react";
import { AccountService } from "../services/AccountService";

export const useAccountController = () => {
  const [cuentas, setCuentas] = useState([]);
  const [balance, setBalance] = useState(null);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [error, setError] = useState(null);

  const cargarCuentas = async () => {
    try {
      const data = await AccountService.obtenerCuentas();
      setCuentas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const alternarEstadoCuenta = async (id) => {
    try {
      await AccountService.activarCuenta(id);
      cargarCuentas();
    } catch (err) {
      setError(err.message);
    }
  };

  const obtenerBalanceCuenta = async (id) => {
    try {
      const data = await AccountService.obtenerBalance(id);
      setBalance(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const buscarCuenta = async (id) => {
    try {
      const data = await AccountService.buscarCuentaPorId(id);
      setCuentaSeleccionada(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    cuentas,
    balance,
    cuentaSeleccionada,
    error,
    cargarCuentas,
    alternarEstadoCuenta,
    obtenerBalanceCuenta,
    buscarCuenta,
  };
};
