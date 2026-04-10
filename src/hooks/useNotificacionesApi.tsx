import { useState, useCallback, useEffect } from 'react';
import apiClient from '../api/apiFormulario';
import { Notificacion } from '../interfaces/interfaces';

export const useNotificacionesApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noLeidas, setNoLeidas] = useState(0);

  const loadNotificaciones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<any>('/notificaciones');
      console.log('📨 [NOTIFICACIONES API] Respuesta completa:', response.data);
      
      // La respuesta viene como {success, message, data: [...], pagination: {...}}
      const notificacionesArray = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data;
        
      console.log('🔔 [NOTIFICACIONES API] Array de notificaciones:', notificacionesArray);
      setNotificaciones(notificacionesArray);
      
      // Contar no leídas
      const count = notificacionesArray.filter((n: any) => !n.leido).length;
      setNoLeidas(count);
      
      return notificacionesArray;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cargar notificaciones';
      setError(errorMsg);
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const marcarLeida = useCallback(async (notificacionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/notificaciones/${notificacionId}/marcar-leida`);
      
      setNotificaciones(
        notificaciones.map(n =>
          n.id === notificacionId ? { ...n, leido: true } : n
        )
      );
      
      setNoLeidas(Math.max(0, noLeidas - 1));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al marcar como leída';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notificaciones, noLeidas]);

  const marcarTodasLeidas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/notificaciones/marcar-todas-leidas');
      
      setNotificaciones(
        notificaciones.map(n => ({ ...n, leido: true }))
      );
      
      setNoLeidas(0);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al marcar todas como leídas';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notificaciones]);

  const eliminarNotificacion = useCallback(async (notificacionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/notificaciones/${notificacionId}`);
      
      const notif = notificaciones.find(n => n.id === notificacionId);
      if (notif && !notif.leido) {
        setNoLeidas(Math.max(0, noLeidas - 1));
      }
      
      setNotificaciones(
        notificaciones.filter(n => n.id !== notificacionId)
      );
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar notificación';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notificaciones, noLeidas]);

  useEffect(() => {
    loadNotificaciones();
    
    // Configurar polling cada 30 segundos
    const interval = setInterval(loadNotificaciones, 30000);
    
    return () => clearInterval(interval);
  }, [loadNotificaciones]);

  return {
    isLoading,
    notificaciones,
    noLeidas,
    error,
    loadNotificaciones,
    marcarLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
  };
};
