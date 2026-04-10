import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useReporteApi } from '../hooks/useReporteApi';
import { Reporte } from '../interfaces/interfaces';

type AdminDashboardNavigationProp = DrawerNavigationProp<any>;

export const ScreenAdminDashboard = ({ navigation }: { navigation: AdminDashboardNavigationProp }) => {
  const { reportes, isLoading, error, loadReportes, updateReporte } = useReporteApi();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('pendiente');

  useEffect(() => {
    loadReportes();
    const interval = setInterval(loadReportes, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadReportes();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredReportes = selectedFilter === 'todos' 
    ? reportes 
    : reportes.filter(r => r.estado === selectedFilter);

  const handleChangeStatus = async (reporteId: number, newStatus: string) => {
    Alert.alert(
      'Cambiar Estado',
      `¿Cambiar estado a "${newStatus}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateReporte(reporteId, { estado: newStatus as any });
              Alert.alert('Éxito', 'Estado actualizado');
              await loadReportes();
            } catch (err) {
              Alert.alert('Error', 'No se pudo actualizar el estado');
            }
          },
        },
      ]
    );
  };

  const StatsBadge = ({ label, count, color }: any) => (
    <View style={[styles.statBadge, { borderLeftColor: color }]}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const stats = {
    pendiente: reportes.filter(r => r.estado === 'pendiente').length,
    en_proceso: reportes.filter(r => r.estado === 'en_proceso').length,
    finalizado: reportes.filter(r => r.estado === 'finalizado').length,
  };

  const FilterButton = ({ label, value }: any) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ReporteCard = ({ reporte }: { reporte: Reporte }) => (
    <TouchableOpacity 
      style={styles.reporteCard}
      onPress={() => navigation.navigate('ScreenDetalleReporte', { reporteId: reporte.id })}
      activeOpacity={0.7}
    >
      <View style={styles.reporteHeader}>
        <View>
          <Text style={styles.reporteCategory}>{reporte.categoria}</Text>
          <Text style={styles.reporteUser}>
            {reporte.usuario?.nombre || 'Usuario desconocido'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reporte.estado) }]}>
          <Text style={styles.statusText}>{reporte.estado}</Text>
        </View>
      </View>

      <Text style={styles.reporteDescription}>{reporte.descripcion}</Text>

      <View style={styles.reporteStats}>
        <Text style={styles.statText}>
          📍 {parseFloat(reporte.latitud).toFixed(4)}, {parseFloat(reporte.longitud).toFixed(4)}
        </Text>
        <Text style={styles.statText}>👍 {reporte.apoyos_count || 0} apoyos</Text>
      </View>

      {reporte.estado === 'pendiente' && (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
          onPress={() => handleChangeStatus(reporte.id, 'en_proceso')}
        >
          <Text style={styles.actionBtnText}>Marcar en Proceso</Text>
        </TouchableOpacity>
      )}

      {reporte.estado === 'en_proceso' && (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
          onPress={() => handleChangeStatus(reporte.id, 'finalizado')}
        >
          <Text style={styles.actionBtnText}>Marcar Finalizado</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (isLoading && reportes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header con botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Panel de Administración</Text>
          <Text style={styles.headerSubtitle}>Gestión de Reportes</Text>
        </View>
      </View>

      {/* Stats */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <StatsBadge label="Pendientes" count={stats.pendiente} color="#F59E0B" />
        <StatsBadge label="En Proceso" count={stats.en_proceso} color="#3B82F6" />
        <StatsBadge label="Finalizados" count={stats.finalizado} color="#10B981" />
      </ScrollView>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <FilterButton label="Pendientes" value="pendiente" />
        <FilterButton label="En Proceso" value="en_proceso" />
        <FilterButton label="Finalizados" value="finalizado" />
        <FilterButton label="Todos" value="todos" />
      </ScrollView>

      {/* Reportes List */}
      <View style={styles.listContainer}>
        {filteredReportes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hay reportes en esta categoría</Text>
          </View>
        ) : (
          filteredReportes.map(reporte => (
            <ReporteCard key={reporte.id} reporte={reporte} />
          ))
        )}
      </View>
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
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginBottom: 5,
  },
  statBadge: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    borderLeftWidth: 4,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  reporteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  reporteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reporteCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  reporteUser: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  reporteDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
    lineHeight: 20,
  },
  reporteStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
