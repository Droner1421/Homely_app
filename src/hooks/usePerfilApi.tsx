import { useState, useCallback } from 'react';
import apiClient from '../api/apiFormulario';
import { Usuario } from '../interfaces/interfaces';

export const usePerfilApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('📥 [PERFIL] Obteniendo perfil del usuario');
      const response = await apiClient.get<any>('/perfil');
      console.log('✅ [PERFIL] Datos recibidos:', response.data);
      // El API retorna {data: {...}, message: ..., success: true}
      const userData = response.data.data || response.data;
      console.log('📌 [PERFIL] Usuario extraído:', userData);
      setPerfil(userData);
      return userData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al obtener perfil';
      setError(errorMsg);
      console.error('❌ [PERFIL] Error al obtener perfil:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actualizarPerfil = useCallback(async (data: Partial<Usuario>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<any>('/perfil', data);
      const userData = response.data.data || response.data;
      setPerfil(userData);
      return userData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar perfil';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cambiarPassword = useCallback(async (
    passwordActual: string,
    passwordNueva: string,
    passwordConfirmacion: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/perfil/cambiar-password', {
        password_actual: passwordActual,
        password_nueva: passwordNueva,
        password_confirmacion: passwordConfirmacion,
      });
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar contraseña';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    perfil,
    error,
    getPerfil,
    actualizarPerfil,
    cambiarPassword,
  };
};
