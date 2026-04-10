import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useReporteApi } from '../hooks/useReporteApi';
import { Reporte } from '../interfaces/interfaces';

type MiReporteNavigationProp = DrawerNavigationProp<any>;

type Props = {
  navigation: MiReporteNavigationProp;
  route: { params?: { reporteId?: number } };
};

/**
 * 🏠 SCREEN ESPECÍFICA PARA RESIDENTES
 * Muestra SOLO sus propios reportes con evidencia de solución
 */
export const ScreenMiReporte = ({ navigation, route }: Props) => {
  const reporteId = route.params?.reporteId;
  const { getReporteById, deleteReporte } = useReporteApi();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cargarReporte = async () => {
      console.log('========================================');
      console.log('🏠 [MI REPORTE] INICIANDO CARGA');
      console.log('   ID:', reporteId);
      console.log('========================================');
      
      if (!reporteId) {
        console.error('❌ reporteId es undefined');
        setLoading(false);
        return;
      }

      try {
        const data = await getReporteById(reporteId);
        
        console.log('✅ [MI REPORTE] Reporte cargado:', {
          id: data?.id,
          categoria: data?.categoria,
          estado: data?.estado,
          tiene_imagen_problema: !!data?.imagen_problema_url,
          tiene_imagen_solucion: !!data?.imagen_solucion_url,
          admin_nombre: data?.admin?.nombre,
        });

        setReporte(data);
      } catch (err) {
        console.error('❌ [MI REPORTE] Error al cargar:', err);
        Alert.alert('Error', 'No se pudo cargar el reporte');
      } finally {
        setLoading(false);
      }
    };

    cargarReporte();
  }, [reporteId]);

  const abrirMapa = () => {
    if (!reporte) return;
    const url = `https://maps.google.com/?q=${reporte.latitud},${reporte.longitud}`;
    Linking.openURL(url);
  };

  const handleDeleteReporte = () => {
    Alert.alert(
      '⚠️ Eliminar Reporte',
      '¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('❌ Eliminación cancelada'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            if (!reporteId) return;
            setDeleting(true);
            try {
              console.log('🗑️ [MI REPORTE] Eliminando reporte ID:', reporteId);
              await deleteReporte(reporteId);
              console.log('✅ [MI REPORTE] Reporte eliminado exitosamente');
              Alert.alert('Éxito', 'Reporte eliminado correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (err) {
              console.error('❌ [MI REPORTE] Error al eliminar:', err);
              Alert.alert('Error', 'No se pudo eliminar el reporte');
            } finally {
              setDeleting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getColorEstado = (estado: string): string => {
    switch (estado) {
      case 'pendiente':
        return '#f59e0b';
      case 'en_proceso':
        return '#3b82f6';
      case 'finalizado':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando reporte...</Text>
      </View>
    );
  }

  if (!reporte) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Reporte no encontrado</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Reporte</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteReporte}
          disabled={deleting}
        >
          <Text style={styles.deleteButtonText}>
            {deleting ? '...' : '🗑️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ESTADO BADGE */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getColorEstado(reporte.estado) },
          ]}
        >
          <Text style={styles.statusText}>
            {reporte.estado === 'pendiente' && '⏳ Pendiente'}
            {reporte.estado === 'en_proceso' && '⚙️ En Proceso'}
            {reporte.estado === 'finalizado' && '✅ Finalizado'}
          </Text>
        </View>
        <Text style={styles.categoryBadgeText}>{reporte.categoria}</Text>
      </View>

      {/* TARJETA PRINCIPAL */}
      <View style={styles.card}>
        {/* Descripción del Problema */}
        <Text style={styles.sectionTitle}>📝 Descripción del Problema</Text>
        <Text style={styles.description}>{reporte.descripcion}</Text>

        {/* Imagen del Problema */}
        {reporte.imagen_problema_url && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>📸 Foto del Problema</Text>
            <Image
              source={{
                uri: reporte.imagen_problema_url?.startsWith('http')
                  ? reporte.imagen_problema_url
                  : `http://74.208.117.45:80${reporte.imagen_problema_url}`,
              }}
              style={styles.problemImage}
              resizeMode="cover"
              onLoad={() => console.log('✅ Imagen problema cargada')}
              onError={(e) => console.error('❌ Error imagen problema:', e)}
            />
          </View>
        )}

        {/* Ubicación */}
        <Text style={styles.sectionTitle}>📍 Ubicación</Text>
        {reporte.direccion && (
          <Text style={styles.address}>{reporte.direccion}</Text>
        )}
        <View style={styles.coordsContainer}>
          <Text style={styles.coords}>
            {parseFloat(reporte.latitud).toFixed(4)}, {parseFloat(reporte.longitud).toFixed(4)}
          </Text>
          <TouchableOpacity style={styles.mapBtn} onPress={abrirMapa}>
            <Text style={styles.mapBtnText}>Ver Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN DE SOLUCIÓN */}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
          🔧 Evidencia de Solución
        </Text>

        {reporte.imagen_solucion_url ? (
          <View>
            {/* Status verde */}
            <View style={styles.solutionStatus}>
              <Text style={styles.solutionStatusText}>
                ✅ Solución Confirmada
              </Text>
            </View>

            {/* Admin que resolvió */}
            {reporte.admin && (
              <View style={styles.adminInfo}>
                <View style={styles.adminAvatar}>
                  <Text style={styles.adminAvatarText}>
                    {reporte.admin.nombre?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.adminDetails}>
                  <Text style={styles.adminName}>{reporte.admin.nombre}</Text>
                  <Text style={styles.adminRole}>Administrador</Text>
                </View>
              </View>
            )}

            {/* Imagen de solución */}
            <View style={styles.solutionImageContainer}>
              <Text style={styles.solutionImageLabel}>Foto de la Solución:</Text>
              {(() => {
                const baseUrl = 'http://74.208.117.45:80';
                const imagenUrl = reporte.imagen_solucion_url;
                const urlFinal = imagenUrl?.startsWith('http')
                  ? imagenUrl
                  : `${baseUrl}${imagenUrl}`;

                console.log('🖼️ [SOLUCIÓN] Construyendo URL:');
                console.log('   imagen_url:', imagenUrl);
                console.log('   url_final:', urlFinal);

                return (
                  <>
                  

                    {/* Imagen */}
                    <Image
                      key={urlFinal}
                      source={{ uri: urlFinal }}
                      style={styles.solutionImage}
                      resizeMode="contain"
                      onLoadStart={() =>
                        console.log('⏳ Cargando imagen de solución...')
                      }
                      onLoad={() =>
                        console.log('✅ Imagen de solución cargada exitosamente')
                      }
                      onError={(e) => {
                        console.error('❌ Error cargando imagen de solución');
                        console.error('   URL:', urlFinal);
                        console.error('   Error:', e);
                      }}
                    />
                  </>
                );
              })()}
            </View>

            {/* Mensaje del admin */}
            {reporte.mensaje_admin && (
              <View style={styles.adminMessage}>
                <Text style={styles.adminMessageLabel}>
                  💬 Mensaje del Administrador:
                </Text>
                <Text style={styles.adminMessageText}>{reporte.mensaje_admin}</Text>
              </View>
            )}

            {/* Fecha de resolución */}
            {reporte.fecha_finalizacion && (
              <Text style={styles.resolutionDate}>
                ✓ Resuelto el {new Date(reporte.fecha_finalizacion).toLocaleDateString('es-ES')}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingIcon}>⏳</Text>
            <Text style={styles.waitingTitle}>Esperando Solución</Text>
            <Text style={styles.waitingText}>
              El administrador está trabajando en tu reporte. Aquí aparecerá la evidencia
              de solución cuando esté lista.
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      reporte.estado === 'finalizado'
                        ? '100%'
                        : reporte.estado === 'en_proceso'
                        ? '50%'
                        : '15%',
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* APOYOS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👍 Apoyos</Text>
        <Text style={styles.apoyosCount}>
          {reporte.apoyos?.length || 0} usuario{(reporte.apoyos?.length || 0) !== 1 ? 's' : ''} apoyan este reporte
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#dc2626',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  categoryBadgeText: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageSection: {
    marginTop: 16,
  },
  problemImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  address: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 10,
  },
  coordsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  coords: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  mapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#667eea',
    borderRadius: 6,
  },
  mapBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  solutionStatus: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  solutionStatusText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 14,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  adminAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  adminDetails: {
    flex: 1,
  },
  adminName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  adminRole: {
    fontSize: 12,
    color: '#94a3b8',
  },
  solutionImageContainer: {
    marginTop: 12,
  },
  solutionImageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  debugUrl: {
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  debugUrlText: {
    fontSize: 10,
    color: '#0369a1',
    fontFamily: 'monospace',
  },
  solutionImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  adminMessage: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  adminMessageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 6,
  },
  adminMessageText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
  resolutionDate: {
    marginTop: 12,
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  waitingIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  waitingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  waitingText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  apoyosCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
});
