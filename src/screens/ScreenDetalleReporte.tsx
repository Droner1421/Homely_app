import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useReporteApi } from '../hooks/useReporteApi';
import { Reporte } from '../interfaces/interfaces';

type DetailNavigationProp = DrawerNavigationProp<any>;

type Props = {
  navigation: DetailNavigationProp;
  route: { params?: { reporteId?: number } };
};

export const ScreenDetalleReporte = ({ navigation, route }: Props) => {
  const reporteId = route.params?.reporteId;
  const { reportes, isLoading, loadReportes, updateReporte, getReporteById } = useReporteApi();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarReporte = async () => {
      console.log('🔍 [DETALLE] ========== INICIANDO CARGA ==========');
      console.log('🔍 [DETALLE] Buscando reporte con ID:', reporteId, 'tipo:', typeof reporteId);
      setLoading(true);
      
      try {
        if (!reporteId) {
          console.error('❌ [DETALLE] reporteId es undefined o null');
          setLoading(false);
          return;
        }

        // OPCIÓN 1: Primero buscar en la lista local (más rápido)
        console.log('📌 [DETALLE] Opción 1: Buscando en lista cargada...');
        if (reportes && reportes.length > 0) {
          const found = reportes.find(r => {
            const match = r.id === reporteId || r.id === parseInt(String(reporteId));
            console.log(`   Comparing ${r.id} === ${reporteId}? ${match}`);
            return match;
          });
          
          if (found) {
            console.log('✅ [DETALLE] ¡Encontrado en lista!:', found.id);
            console.log('🖼️ [DETALLE] Imágenes en lista:', {
              problema: found.imagen_problema_url,
              solucion: found.imagen_solucion_url,
            });
            setReporte(found);
            setLoading(false);
            return;
          } else {
            console.warn('⚠️ [DETALLE] No encontrado en lista. Intentando cargar desde API...');
          }
        }

        // OPCIÓN 2: Si no está en lista, cargar del API
        console.log('📌 [DETALLE] Opción 2: Cargando del API directamente...');
        const reporteData = await getReporteById(reporteId);
        console.log('✅ [DETALLE] Reporte cargado del API:', reporteData?.id);
        console.log('🖼️ [DETALLE] Imágenes del API:', {
          problema: reporteData?.imagen_problema_url,
          solucion: reporteData?.imagen_solucion_url,
        });
        if (reporteData) {
          setReporte(reporteData);
        }
      } catch (err) {
        console.error('❌ [DETALLE] Error general:', err);
      } finally {
        setLoading(false);
      }
    };

    buscarReporte();
  }, [reporteId, reportes]);

  const handleChangeStatus = async (newStatus: string) => {
    if (!reporte) return;
    Alert.alert(
      'Cambiar Estado',
      `¿Cambiar estado a "${newStatus}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateReporte(reporte.id, { estado: newStatus as any });
              Alert.alert('Éxito', 'Estado actualizado');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'No se pudo actualizar el estado');
            }
          },
        },
      ]
    );
  };

  const openMaps = () => {
    if (!reporte) return;
    const url = `https://maps.google.com/?q=${reporte.latitud},${reporte.longitud}`;
    Linking.openURL(url);
  };

  if (loading || !reporte) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={{ marginTop: 10, color: '#667eea' }}>Cargando reporte...</Text>
      </View>
    );
  }

  // 🔍 LOG: Mostrar qué datos tiene el reporte cuando se renderiza
  console.log('🎨 [RENDER] Reporte #' + reporte.id + ' se está renderizando');
  console.log('   imagen_problema_url:', reporte.imagen_problema_url);
  console.log('   imagen_solucion_url:', reporte.imagen_solucion_url);
  console.log('   estado:', reporte.estado);
  console.log('   admin:', reporte.admin_id ? `Asignado a ${reporte.admin?.nombre}` : 'Sin asignar');

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Reporte</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Categoría y Status */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{reporte.categoria}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reporte.estado) }]}>
            <Text style={styles.statusText}>{reporte.estado}</Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{reporte.descripcion}</Text>

        {/* Dirección */}
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <Text style={styles.address}>{reporte.direccion || 'Sin dirección registrada'}</Text>
        <View style={styles.coordsRow}>
          <Text style={styles.coords}>
            📍 {parseFloat(reporte.latitud).toFixed(4)}, {parseFloat(reporte.longitud).toFixed(4)}
          </Text>
          <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
            <Text style={styles.mapButtonText}>Ver mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Imágenes */}
        {reporte.imagen_problema_url && (
          <>
            <Text style={styles.sectionTitle}>📸 Imagen del Problema</Text>
            {(() => {
              const baseUrl = 'http://74.208.117.45:80';
              const imagenUrl = reporte.imagen_problema_url;
              const urlFinal = imagenUrl?.startsWith('http') 
                ? imagenUrl 
                : `${baseUrl}${imagenUrl}`;
              
              return (
                <Image
                  source={{ uri: urlFinal }}
                  style={styles.image}
                  onLoad={() => console.log('✅ [IMG PROBLEMA] Cargada')}
                  onError={(e) => console.error('❌ [IMG PROBLEMA] Error:', e)}
                />
              );
            })()}
          </>
        )}

        {/* Sección de Solución */}
        <View style={{ marginTop: 20, backgroundColor: '#f0f9ff', padding: 15, borderRadius: 10 }}>
          <Text style={[styles.sectionTitle, { color: '#0369a1' }]}>
            🔧 Evidencia de Solución
          </Text>
          
          {reporte.imagen_solucion_url ? (
            <>
              <Text style={{ color: '#059669', marginBottom: 10, fontWeight: '600' }}>
                ✅ Solución confirmada
              </Text>
              {/* Construir URL correctamente */}
              {(() => {
                const baseUrl = 'http://74.208.117.45:80';
                const imagenUrl = reporte.imagen_solucion_url;
                
                // Si ya tiene http, usa directo; sino concatena con base
                const urlFinal = imagenUrl?.startsWith('http') 
                  ? imagenUrl 
                  : `${baseUrl}${imagenUrl}`;
                
                console.log('🔗 [URL CONSTRUCTION]');
                console.log('   imagenUrl:', imagenUrl);
                console.log('   urlFinal:', urlFinal);
                
                return (
                  <Image
                    source={{ uri: urlFinal }}
                    style={styles.image}
                    onLoad={() => {
                      console.log('✅ [IMG SOLUCIÓN] Cargada exitosamente');
                      console.log('   URL:', urlFinal);
                    }}
                    onError={(e) => {
                      console.error('❌ [IMG SOLUCIÓN] Error al cargar');
                      console.error('   URL intentada:', urlFinal);
                      console.error('   Error:', e);
                    }}
                  />
                );
              })()}
            </>
          ) : (
            <View style={{ 
              padding: 20, 
              backgroundColor: '#fef3c7',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#f59e0b'
            }}>
              <Text style={{ 
                color: '#b45309',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '500'
              }}>
                ⏳ Esperando evidencia de solución del administrador...
              </Text>
              <Text style={{ 
                color: '#92400e',
                textAlign: 'center',
                fontSize: 12,
                marginTop: 5
              }}>
                Estado actual: {reporte.estado}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Información del Usuario */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Reportante</Text>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>
              {reporte.usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{reporte.usuario?.nombre}</Text>
            <Text style={styles.userEmail}>{reporte.usuario?.email}</Text>
          </View>
        </View>
        
        {/* Apoyos */}
        <View style={styles.apoYosSection}>
          <Text style={styles.apoYosCount}>👍 {reporte.apoyos?.length || 0} apoyos</Text>
        </View>
      </View>

      {/* Información del Admin */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gestión del Reporte</Text>
        
        {reporte.admin && (
          <>
            <Text style={styles.sectionTitle}>Asignado a</Text>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>
                  {reporte.admin?.nombre?.charAt(0).toUpperCase() || 'A'}
                </Text>
              </View>
              <View>
                <Text style={styles.userName}>{reporte.admin?.nombre}</Text>
              </View>
            </View>
          </>
        )}

        {reporte.mensaje_admin && (
          <>
            <Text style={styles.sectionTitle}>Mensaje del Administrador</Text>
            <Text style={styles.adminMessage}>{reporte.mensaje_admin}</Text>
          </>
        )}

        {reporte.fecha_finalizacion && (
          <>
            <Text style={styles.sectionTitle}>Fecha de Finalización</Text>
            <Text style={styles.finalizationDate}>
              {new Date(reporte.fecha_finalizacion).toLocaleDateString('es-ES')}
            </Text>
          </>
        )}
      </View>

      {/* Acciones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acciones</Text>
        
        {reporte.estado === 'pendiente' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
            onPress={() => handleChangeStatus('en_proceso')}
          >
            <Text style={styles.actionButtonText}>Marcar en Proceso</Text>
          </TouchableOpacity>
        )}

        {reporte.estado === 'en_proceso' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => handleChangeStatus('finalizado')}
          >
            <Text style={styles.actionButtonText}>Marcar Finalizado</Text>
          </TouchableOpacity>
        )}

        {reporte.estado === 'finalizado' && (
          <View style={styles.finishedMessage}>
            <Text style={styles.finishedText}>✓ Este reporte ya ha sido finalizado</Text>
          </View>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

function getStatusColor(estado: string): string {
  const colors: { [key: string]: string } = {
    pendiente: '#F59E0B',
    en_proceso: '#3B82F6',
    finalizado: '#10B981',
  };
  return colors[estado] || '#6B7280';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    margin: 12,
    padding: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  address: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  coords: {
    fontSize: 12,
    color: '#666',
  },
  mapButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 11,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  userName: {
    fontWeight: '600',
    color: '#333',
    fontSize: 13,
  },
  userEmail: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  apoYosSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  apoYosCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  adminMessage: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  finalizationDate: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  finishedMessage: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  finishedText: {
    color: '#10B981',
    fontWeight: '500',
    fontSize: 13,
  },
});
