import { useState, useCallback, useEffect } from 'react';
import apiClient from '../api/apiFormulario';
import { Reporte, FromReporteData } from '../interfaces/interfaces';

export const useReporteApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadReportes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<any>('/reportes');
      console.log('📥 [REPORTES API] Respuesta completa:', response.data);
      
      // La respuesta viene como {success, message, data: [...], pagination: {...}}
      const reportesArray = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data;
        
      console.log('📊 [REPORTES API] Array de reportes:', reportesArray);
      setReportes(reportesArray);
      return reportesArray;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cargar reportes';
      setError(errorMsg);
      console.error('Error al cargar reportes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getReporteById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 [GET REPORTE] Fetching reporte ID:', id);
      const response = await apiClient.get<any>(`/reportes/${id}`);
      console.log('✅ [GET REPORTE] Full response:', response.data);
      
      // La respuesta viene como: {success, message, data: {...}}
      const reporte = response.data.data || response.data;
      console.log('📊 [GET REPORTE] Extracted reporte:', reporte);
      console.log('🖼️ [GET REPORTE] Imágenes:', {
        imagen_problema: reporte.imagen_problema,
        imagen_solucion: reporte.imagen_solucion,
        imagen_problema_url: reporte.imagen_problema_url,
        imagen_solucion_url: reporte.imagen_solucion_url,
      });
      
      // Verificar que tenemos los datos correctos
      if (reporte.id) {
        console.log(`✅ [GET REPORTE] Valid reporte: ID ${reporte.id}, lat: ${reporte.latitud}, long: ${reporte.longitud}`);
        return reporte;
      } else {
        console.error('❌ [GET REPORTE] Invalid reporte structure:', reporte);
        throw new Error('Invalid reporte structure');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al obtener reporte';
      console.error('❌ [GET REPORTE] Error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReporte = useCallback(async (data: FromReporteData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Si hay imagen_problema, usar FormData
      if (data.imagen_problema) {
        const formData = new FormData();
        formData.append('categoria', data.categoria);
        formData.append('descripcion', data.descripcion);
        formData.append('latitud', data.latitud.toString());
        formData.append('longitud', data.longitud.toString());

        // Agregar imagen si existe
        if (data.imagen_problema) {
          const imageName = `imagen_problema_${Date.now()}.jpg`;
          formData.append('imagen_problema', {
            uri: data.imagen_problema,
            type: 'image/jpeg',
            name: imageName,
          } as any);
        }

        console.log('📸 [CREATE REPORTE] Enviando con FormData');
        const response = await apiClient.post<any>('/reportes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('✅ [CREATE REPORTE] Respuesta:', response.data);
        const reporte = response.data.data || response.data;
        setReportes([...reportes, reporte]);
        return reporte;
      } else {
        // Sin imagen, usar JSON normal
        console.log('📝 [CREATE REPORTE] Enviando JSON sin imagen');
        const response = await apiClient.post<Reporte>('/reportes', data);
        setReportes([...reportes, response.data]);
        return response.data;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear reporte';
      setError(errorMsg);
      console.error('❌ [CREATE REPORTE] Error:', errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reportes]);

  const updateReporte = useCallback(async (id: number, data: Partial<FromReporteData>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Si hay imagen_problema o imagen_solucion, usar FormData
      if (data.imagen_problema || data.imagen_solucion) {
        const formData = new FormData();
        
        // Agregar todos los campos de datos
        if (data.categoria) formData.append('categoria', data.categoria);
        if (data.descripcion) formData.append('descripcion', data.descripcion);
        if (data.latitud) formData.append('latitud', data.latitud.toString());
        if (data.longitud) formData.append('longitud', data.longitud.toString());
        if (data.estado) formData.append('estado', data.estado);

        // Agregar imagen_problema si existe
        if (data.imagen_problema) {
          const imageName = `imagen_problema_${Date.now()}.jpg`;
          formData.append('imagen_problema', {
            uri: data.imagen_problema,
            type: 'image/jpeg',
            name: imageName,
          } as any);
        }

        // Agregar imagen_solucion si existe
        if (data.imagen_solucion) {
          const imageName = `imagen_solucion_${Date.now()}.jpg`;
          formData.append('imagen_solucion', {
            uri: data.imagen_solucion,
            type: 'image/jpeg',
            name: imageName,
          } as any);
        }

        console.log('📸 [UPDATE REPORTE] Enviando con FormData');
        const response = await apiClient.put<any>(`/reportes/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('✅ [UPDATE REPORTE] Respuesta:', response.data);
        const reporte = response.data.data || response.data;
        setReportes(reportes.map(r => r.id === id ? reporte : r));
        return reporte;
      } else {
        // Sin imagen, usar JSON normal
        console.log('📝 [UPDATE REPORTE] Enviando JSON sin imagen');
        const response = await apiClient.put<Reporte>(`/reportes/${id}`, data);
        setReportes(reportes.map(r => r.id === id ? response.data : r));
        return response.data;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar reporte';
      setError(errorMsg);
      console.error('❌ [UPDATE REPORTE] Error:', errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reportes]);

  const deleteReporte = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/reportes/${id}`);
      setReportes(reportes.filter(r => r.id !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar reporte';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reportes]);

  const apoyarReporte = useCallback(async (reporteId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/reportes/${reporteId}/apoyo`);
      // Actualizar el contador de apoyos
      setReportes(reportes.map(r => 
        r.id === reporteId 
          ? { ...r, apoyos_count: (r.apoyos_count || 0) + 1 }
          : r
      ));
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al apoyar reporte';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reportes]);

  useEffect(() => {
    loadReportes();
  }, [loadReportes]);

  return {
    isLoading,
    reportes,
    error,
    loadReportes,
    getReporteById,
    createReporte,
    updateReporte,
    deleteReporte,
    apoyarReporte,
  };
};
