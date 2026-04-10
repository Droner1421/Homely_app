import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNotificacionesApi } from '../hooks/useNotificacionesApi';

type NotificacionesNavigationProp = DrawerNavigationProp<any>;

export const PantallaNotificaciones = () => {
    const navigation = useNavigation<NotificacionesNavigationProp>();
    const {
        notificaciones,
        isLoading,
        noLeidas,
        loadNotificaciones,
        marcarLeida,
        marcarTodasLeidas,
        eliminarNotificacion,
    } = useNotificacionesApi();
    const focused = useIsFocused();
    const [filtro, setFiltro] = useState<'todas' | 'noLeidas'>('todas');

    useEffect(() => {
        if (focused) {
            loadNotificaciones();
        }
    }, [focused]);

    const notificacionesFiltradas =
        filtro === 'noLeidas'
            ? notificaciones.filter((n) => !n.leido)
            : notificaciones;

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'nuevo_reporte':
                return '📝';
            case 'reporte_actualizado':
                return '🔄';
            case 'comentario':
                return '💬';
            case 'apoyo':
                return '👍';
            default:
                return '📬';
        }
    };

    const handleEliminar = (id: number) => {
        Alert.alert('Eliminar', '¿Estás seguro de que quieres eliminar esta notificación?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => eliminarNotificacion(id),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notificacionesFiltradas}
                keyExtractor={(item) => `${item.id}`}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <TouchableOpacity 
                                onPress={() => navigation.openDrawer()}
                                style={styles.menuButton}
                            >
                                <Text style={styles.menuIcon}>☰</Text>
                            </TouchableOpacity>
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>Notificaciones</Text>
                                {noLeidas > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{noLeidas} nuevas</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={styles.filterContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.filterBtn,
                                    filtro === 'todas' && styles.filterBtnActive,
                                ]}
                                onPress={() => setFiltro('todas')}
                            >
                                <Text
                                    style={[
                                        styles.filterBtnText,
                                        filtro === 'todas' && styles.filterBtnTextActive,
                                    ]}
                                >
                                    Todas ({notificaciones.length})
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterBtn,
                                    filtro === 'noLeidas' && styles.filterBtnActive,
                                ]}
                                onPress={() => setFiltro('noLeidas')}
                            >
                                <Text
                                    style={[
                                        styles.filterBtnText,
                                        filtro === 'noLeidas' && styles.filterBtnTextActive,
                                    ]}
                                >
                                    No leídas ({noLeidas})
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {noLeidas > 0 && (
                            <TouchableOpacity
                                style={styles.markAllBtn}
                                onPress={marcarTodasLeidas}
                            >
                                <Text style={styles.markAllBtnText}>
                                    ✓ Marcar todas como leídas
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.notificationItem,
                            !item.leido && styles.notificationItemUnread,
                        ]}
                        onPress={() => marcarLeida(item.id)}
                    >
                        <View style={styles.notificationContent}>
                            <Text style={styles.notificationIcon}>
                                {getTipoIcon(item.tipo)}
                            </Text>
                            <View style={styles.notificationText}>
                                <Text style={styles.notificationMessage}>
                                    {item.mensaje}
                                </Text>
                                <Text style={styles.notificationDate}>
                                    {new Date(item.created_at || '').toLocaleDateString(
                                        'es-ES',
                                        {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleEliminar(item.id)}
                        >
                            <Text style={styles.deleteBtnText}>✕</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadNotificaciones}
                        colors={['#667eea']}
                        progressBackgroundColor="#f3f4f6"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>
                            {filtro === 'noLeidas'
                                ? '¡No tienes notificaciones nuevas!'
                                : 'No hay notificaciones aún'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        padding: 8,
        marginRight: 12,
    },
    menuIcon: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        backgroundColor: '#F44336',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    filterBtn: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    filterBtnActive: {
        backgroundColor: '#667eea',
    },
    filterBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    filterBtnTextActive: {
        color: 'white',
    },
    markAllBtn: {
        backgroundColor: '#E8F0FE',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    markAllBtnText: {
        color: '#667eea',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        marginHorizontal: 8,
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#E5E7EB',
    },
    notificationItemUnread: {
        backgroundColor: '#F3F4F6',
        borderLeftColor: '#667eea',
    },
    notificationContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    notificationIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    notificationText: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
    },
    notificationDate: {
        fontSize: 12,
        color: '#999',
    },
    deleteBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    deleteBtnText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: 'bold',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
