import React, { createContext, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiFormulario';
import { Usuario, AuthResponse } from '../interfaces/interfaces';

interface AuthContextType {
  user: Usuario | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (nombre: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<Usuario | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Todos los usuarios usan el API para obtener token real
      console.log('📤 [AUTH] Enviando credenciales al API:', email);
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      console.log('✅ [AUTH] Respuesta del API:', response.data);
      const { user, token, rol } = response.data.data;
      
      // Guardar token en AsyncStorage para peticiones posteriores
      await AsyncStorage.setItem('auth_token', token);
      console.log('💾 [AUTH] Token guardado en AsyncStorage');
      
      setUser(user);
      
      return response.data.data;
    } catch (err: any) {
      console.error('❌ [AUTH] Login Error:', err.message);
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
      
      // Guardar token en AsyncStorage para peticiones posteriores
      await AsyncStorage.setItem('auth_token', token);
      console.log('💾 [AUTH] Token guardado en AsyncStorage');
      
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
    await AsyncStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  const getCurrentUser = useCallback(async () => {
    return user;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
