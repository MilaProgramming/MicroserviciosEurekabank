import { useState, useEffect } from "react";
import { UserService } from "../services/UserService";

const useUserController = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await UserService.obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registrarUsuario = async (userData) => {
    setLoading(true);
    try {
      await UserService.registrarUsuario(userData);
      cargarUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const encontrarUsuario = async (id) => {
    setLoading(true);
    try {
      const data = await UserService.encontrarUsuario(id);
      setUsuario(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarUsuario = async (id, userData) => {
    setLoading(true);
    try {
      await UserService.actualizarUsuario(id, userData);
      cargarUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    setLoading(true);
    try {
      await UserService.eliminarUsuario(id);
      cargarUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      await UserService.login(username, password);
      setLoading(true);
      return;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    } finally {
    }
  };

  return {
    usuarios,
    usuario,
    error,
    loading,
    cargarUsuarios,
    registrarUsuario,
    encontrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login,
  };
};

export default useUserController;