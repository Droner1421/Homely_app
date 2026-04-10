import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAuthApi } from '../hooks/useAuthApi';
import { usePerfilApi } from '../hooks/usePerfilApi';

type PerfilNavigationProp = DrawerNavigationProp<any>;

type Props = { navigation?: PerfilNavigationProp };

export const ScreenPerfil = ({ navigation: navProp }: Props) => {
    const drawerNav = useNavigation<PerfilNavigationProp>();
    const navigation = navProp || drawerNav;
    const { user, logout } = useAuthApi();
    const { perfil, getPerfil, actualizarPerfil, cambiarPassword, isLoading } =
        usePerfilApi();
    const [mode, setMode] = useState<'view' | 'edit' | 'changePassword'>('view');
    const [email, setEmail] = useState('');
    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNueva, setPasswordNueva] = useState('');
    const [passwordConfirmacion, setPasswordConfirmacion] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        getPerfil();
    }, []);

    useEffect(() => {
        if (perfil?.email) {
            setEmail(perfil.email);
        }
    }, [perfil]);

    const handleGuardarEmail = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'El email es requerido');
            return;
        }

        try {
            await actualizarPerfil({ email });
            Alert.alert('Éxito', 'Email actualizado correctamente');
            setMode('view');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar el email');
        }
    };

    const handleCambiarPassword = async () => {
        if (
            !passwordActual.trim() ||
            !passwordNueva.trim() ||
            !passwordConfirmacion.trim()
        ) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        if (passwordNueva !== passwordConfirmacion) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        if (passwordNueva.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await cambiarPassword(passwordActual, passwordNueva, passwordConfirmacion);
            Alert.alert('Éxito', 'Contraseña actualizada correctamente');
            setPasswordActual('');
            setPasswordNueva('');
            setPasswordConfirmacion('');
            setMode('view');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo cambiar la contraseña');
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            await logout();
                            // El DrawerNavigator automáticamente mostrará AuthStack cuando user sea null
                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        } finally {
                            setIsLoggingOut(false);
                        }
                    },
                },
            ]
        );
    };

    const getRoleName = (rol: string) => {
        switch (rol) {
            case 'admin':
                return 'Administrador';
            case 'superadmin':
                return 'Super Administrador';
            default:
                return 'Residente';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    if (isLoading && !perfil) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    return (
        <>
            {/* Header con Drawer */}
            <View style={styles.topHeader}>
                <TouchableOpacity 
                    onPress={() => navigation.openDrawer()}
                    style={styles.menuButton}
                >
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.topHeaderTitle}>Mi Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {mode === 'view' && (
                    <>
                        {/* SECCIÓN IZQUIERDA - INFORMACIÓN PERSONAL */}
                        <View style={styles.profileInfoSection}>
                        {/* Profile Header */}
                        <View style={styles.profileHeader}>
                            <View style={styles.profileAvatar}>
                                <Text style={styles.profileAvatarText}>
                                    {perfil?.nombre?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                                <View style={styles.profileAvatarBadge} />
                            </View>
                            <Text style={styles.profileName}>{perfil?.nombre || 'Usuario'}</Text>
                            <View style={styles.profileRole}>
                                <Text style={styles.profileRoleText}>
                                    {getRoleName(perfil?.rol || 'residente')}
                                </Text>
                            </View>
                        </View>

                        {/* Profile Stats */}
                        <View style={styles.profileStats}>
                            <View style={styles.statItem}>
                                <View style={styles.statIcon}>
                                    <Text style={styles.statIconText}>📋</Text>
                                </View>
                                <Text style={styles.statNumber}>
                                    {perfil?.reportes_count ?? 0}
                                </Text>
                                <Text style={styles.statLabel}>Reportes Creados</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={styles.statIcon}>
                                    <Text style={styles.statIconText}>👍</Text>
                                </View>
                                <Text style={styles.statNumber}>
                                    {perfil?.apoyos_count ?? 0}
                                </Text>
                                <Text style={styles.statLabel}>Apoyos Dados</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={styles.statIcon}>
                                    <Text style={styles.statIconText}>📅</Text>
                                </View>
                                <Text style={styles.statNumber}>
                                    {formatDate(perfil?.created_at)}
                                </Text>
                                <Text style={styles.statLabel}>Miembro Desde</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={styles.statIcon}>
                                    <Text style={styles.statIconText}>✉️</Text>
                                </View>
                                <Text style={styles.statNumberEmail}>
                                    {perfil?.email?.split('@')[0]}
                                </Text>
                                <Text style={styles.statLabel}>Correo Electrónico</Text>
                            </View>
                        </View>
                    </View>

                    {/* SECCIÓN DERECHA - ACCIONES */}
                    <View style={styles.profileEditSection}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>⚙️ Configuración de Cuenta</Text>
                        </View>

                       

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.editBtn]}
                            onPress={() => setMode('edit')}
                        >
                            <Text style={styles.actionBtnIcon}>✏️</Text>
                            <Text style={styles.actionBtnText}>Actualizar Email</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.passwordBtn]}
                            onPress={() => setMode('changePassword')}
                        >
                            <Text style={styles.actionBtnIcon}>🔑</Text>
                            <Text style={styles.actionBtnText}>Cambiar Contraseña</Text>
                        </TouchableOpacity>

                        
                    </View>
                </>
            )}

            {mode === 'edit' && (
                <View style={styles.profileEditSection}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>✏️ Actualizar Email</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => setMode('view')}
                    >
                        <Text style={styles.btnBackIcon}>←</Text>
                        <Text style={styles.btnBackText}>Volver atrás</Text>
                    </TouchableOpacity>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Correo electrónico *</Text>
                        <TextInput
                            style={styles.formControl}
                            placeholder="tu@email.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btnAction, styles.btnSave]}
                        onPress={handleGuardarEmail}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.btnActionIcon}>✓</Text>
                                <Text style={styles.btnActionText}>Guardar Cambios</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {mode === 'changePassword' && (
                <View style={styles.profileEditSection}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>🔑 Cambiar Contraseña</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => setMode('view')}
                    >
                        <Text style={styles.btnBackIcon}>←</Text>
                        <Text style={styles.btnBackText}>Volver atrás</Text>
                    </TouchableOpacity>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Contraseña actual *</Text>
                        <TextInput
                            style={styles.formControl}
                            placeholder="Tu contraseña actual"
                            placeholderTextColor="#9CA3AF"
                            value={passwordActual}
                            onChangeText={setPasswordActual}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Nueva contraseña *</Text>
                        <TextInput
                            style={styles.formControl}
                            placeholder="Nueva contraseña"
                            placeholderTextColor="#9CA3AF"
                            value={passwordNueva}
                            onChangeText={setPasswordNueva}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Confirmar nueva contraseña *</Text>
                        <TextInput
                            style={styles.formControl}
                            placeholder="Confirmar nueva contraseña"
                            placeholderTextColor="#9CA3AF"
                            value={passwordConfirmacion}
                            onChangeText={setPasswordConfirmacion}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btnAction, styles.btnSave]}
                        onPress={handleCambiarPassword}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.btnActionIcon}>✓</Text>
                                <Text style={styles.btnActionText}>Cambiar Contraseña</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    topHeader: {
        backgroundColor: '#667eea',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        padding: 8,
    },
    menuIcon: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
    },
    topHeaderTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },

    // SECCIÓN IZQUIERDA - INFORMACIÓN PERSONAL
    profileInfoSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        margin: 16,
        marginTop: 20,
        borderRadius: 30,
        padding: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.15,
        shadowRadius: 50,
        elevation: 8,
    },

    profileHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },

    profileAvatar: {
        width: 120,
        height: 120,
        marginBottom: 24,
        borderRadius: 60,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 8,
        position: 'relative',
    },

    profileAvatarText: {
        color: '#ffffff',
        fontSize: 56,
        fontWeight: '700',
        textAlign: 'center',
    },

    profileAvatarBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 25,
        height: 25,
        borderRadius: 13,
        backgroundColor: '#4facfe',
        borderWidth: 3,
        borderColor: 'white',
    },

    profileName: {
        fontSize: 32,
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#667eea',
        marginBottom: 8,
        textAlign: 'center',
    },

    profileRole: {
        backgroundColor: '#4facfe',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 16,
        shadowColor: '#4facfe',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 4,
    },

    profileRoleText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },

    // Stats
    profileStats: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginTop: 32,
    },

    statItem: {
        backgroundGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        backgroundColor: 'rgba(102, 126, 234, 0.05)',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.1)',
    },

    statIcon: {
        width: 50,
        height: 50,
        marginHorizontal: 'auto',
        marginBottom: 16,
        borderRadius: 25,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    statIconText: {
        fontSize: 24,
        color: 'white',
    },

    statNumber: {
        fontSize: 40,
        fontWeight: '700',
        color: '#667eea',
        marginBottom: 8,
        textAlign: 'center',
        lineHeight: 44,
    },

    statNumberEmail: {
        fontSize: 16,
        fontWeight: '700',
        color: '#667eea',
        marginBottom: 8,
        textAlign: 'center',
    },

    statLabel: {
        color: '#6c757d',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },

    // SECCIÓN DERECHA - FORMULARIO
    profileEditSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        margin: 16,
        marginBottom: 40,
        borderRadius: 30,
        padding: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.15,
        shadowRadius: 50,
        elevation: 8,
    },

    sectionTitleContainer: {
        marginBottom: 32,
    },

    sectionTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#667eea',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },

    btnBack: {
        background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        backgroundColor: '#30cfd0',
        color: 'white',
        borderWidth: 0,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 15,
        fontWeight: '600',
        fontSize: 16,
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
        flexDirection: 'row',
    },

    btnBackIcon: {
        color: 'white',
        fontSize: 16,
    },

    btnBackText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },

    formGroup: {
        marginBottom: 20,
    },

    formLabel: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 8,
    },

    formControl: {
        borderWidth: 2,
        borderColor: 'rgba(102, 126, 234, 0.1)',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#1f2937',
    },

    // Botones de acción
    actionBtn: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    editBtn: {
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },

    passwordBtn: {
        borderLeftWidth: 4,
        borderLeftColor: '#8b5cf6',
    },

    logoutBtn: {
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },

    actionBtnIcon: {
        fontSize: 20,
        width: 30,
    },

    actionBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
    },

    btnAction: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: '#667eea',
        color: 'white',
        borderWidth: 0,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 15,
        fontWeight: '600',
        fontSize: 16,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 32,
        gap: 8,
    },

    btnSave: {},

    btnActionIcon: {
        color: 'white',
        fontSize: 16,
    },

    btnActionText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});
