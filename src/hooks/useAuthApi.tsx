import { useState, useCallback } from 'react';
import apiClient from '../api/apiFormulario';
import { Usuario, AuthResponse } from '../interfaces/interfaces';

export const useAuthApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Validar contra el API
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      const { user, token, rol } = response.data.data;
      setUser(user);
      
      return response.data.data;
    } catch (err: any) {
      console.error('❌ [LOGIN] Error:', err.message);
      const errorMsg = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        nombre,
        email,
        password,
      });
      
      const { user, token, rol } = response.data.data;
      setUser(user);
      
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al registrarse';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const getCurrentUser = useCallback(async () => {
    return user;
  }, [user]);

  return {
    isLoading,
    user,
    error,
    login,
    register,
    logout,
    getCurrentUser,
  };
};
