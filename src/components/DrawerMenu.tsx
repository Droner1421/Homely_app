import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';

export const DrawerMenu = ({ navigation }: DrawerContentComponentProps) => {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        console.log('🚪 [DRAWER] Iniciando logout...');
        try {
            await logout();
            console.log('✅ [DRAWER] Sesión cerrada correctamente');
            // El DrawerNavigator automáticamente mostrará la pantalla de login cuando user sea null
        } catch (error) {
            console.error('❌ [DRAWER] Error al cerrar sesión:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const isAdmin = user?.rol === 'admin';

    const menuItems = isAdmin
        ? [
            { label: 'Panel Admin', icon: '📊', screen: 'HomeReportes' },
            { label: 'Notificaciones', icon: '🔔', screen: 'Notificaciones' },
            { label: 'Perfil', icon: '👤', screen: 'Perfil' },
        ]
        : [
            { label: 'Inicio', icon: '🏠', screen: 'HomeReportes' },
            { label: 'Crear Reporte', icon: '➕', screen: 'CrearReporte' },
            { label: 'Notificaciones', icon: '🔔', screen: 'Notificaciones' },
            { label: 'Perfil', icon: '👤', screen: 'Perfil' },
        ];

    return (
        <DrawerContentScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
                        <Text style={styles.userRole}>
                            {user?.rol === 'admin' ? '👨‍💼 Admin' : '👤 Residente'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(item.screen)}
                        style={styles.menuItem}
                    >
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
                onPress={handleLogout}
                disabled={isLoggingOut}
                style={[styles.logoutBtn, isLoggingOut && styles.logoutBtnDisabled]}
            >
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>
                    {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                </Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 12,
        color: '#666666',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    menuContainer: {
        paddingHorizontal: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 'auto',
        marginBottom: 20,
        marginHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
    },
    logoutBtnDisabled: {
        opacity: 0.5,
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },
});