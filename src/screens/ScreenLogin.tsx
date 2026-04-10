import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

type Props = { navigation: any };

export const ScreenLogin = ({ navigation }: Props) => {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        try {
            console.log('🔑 [LOGIN] Intentando login con:', email);
            const result = await login(email, password);
            console.log('✅ [LOGIN] Login exitoso:', result);
        } catch (error: any) {
            console.error('❌ [LOGIN] Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.spacer} />

            <View style={styles.logoContainer}>
                <Text style={styles.logo}>🏘️</Text>
                <Text style={styles.appName}>HomeLY</Text>
                <Text style={styles.appSubtitle}>Reportes Comunitarios</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <Text style={styles.subtitle}>
                    Accede a tu cuenta para gestionar reportes
                </Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="tu@email.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                />

                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Tu contraseña"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={!isLoading}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.eyeIcon}>
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ScreenRegistro')}>
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                        <Text style={styles.registerLink}>Regístrate aquí</Text>
                    </View>
                </TouchableOpacity>
            </View>

            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    spacer: {
        height: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        fontSize: 56,
        marginBottom: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    appSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    card: {
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12,
    },
    textInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
    },
    eyeIcon: {
        fontSize: 18,
    },
    loginButton: {
        backgroundColor: '#667eea',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    registerText: {
        fontSize: 13,
        color: '#666',
    },
    registerLink: {
        fontSize: 13,
        color: '#667eea',
        fontWeight: '600',
    },
    infoContainer: {
        marginHorizontal: 16,
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoItem: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
        lineHeight: 18,
    },
    adminHintContainer: {
        marginHorizontal: 16,
        marginBottom: 30,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F0F4FF',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#667eea',
    },
    adminHintTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 8,
    },
    adminHintText: {
        fontSize: 12,
        color: '#667eea',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
});
