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

export const ScreenRegistro = ({ navigation }: Props) => {
    const { register, isLoading } = useAuth();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleRegister = async () => {
        console.log('📝 [REGISTRO] Iniciando validación de campos');
        
        if (!nombre.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim()) {
            console.warn('⚠️ [REGISTRO] Campos vacíos');
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!email.includes('@')) {
            console.warn('⚠️ [REGISTRO] Email inválido:', email);
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        if (password.length < 6) {
            console.warn('⚠️ [REGISTRO] Contraseña muy corta:', password.length, 'caracteres');
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== passwordConfirm) {
            console.warn('⚠️ [REGISTRO] Las contraseñas no coinciden');
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            console.log('📤 [REGISTRO] Enviando datos al API:', {
                nombre: nombre,
                email: email,
                passwordLength: password.length
            });
            const result = await register(nombre, email, password);
            console.log('✅ [REGISTRO] Registro exitoso:', result);
            Alert.alert('Éxito', 'Cuenta creada correctamente. Accediendo...');
            console.log('⏳ [REGISTRO] La navegación es automática por el AuthContext');
            // No navegar manualmente - DrawerNavigator lo hará automáticamente
        } catch (error: any) {
            console.error('❌ [REGISTRO] Error en registro:', error.message);
            const errorMsg = error.response?.data?.message || 'Error al registrarse';
            console.error('📝 [REGISTRO] Mensaje de error:', errorMsg);
            Alert.alert('Error', errorMsg);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backBtn}>← Volver</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <Text style={styles.logo}>🏘️</Text>
                <Text style={styles.appName}>HomeLY</Text>
                <Text style={styles.appSubtitle}>Crear Cuenta</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Registro</Text>
                <Text style={styles.subtitle}>
                    Únete a nuestra comunidad para reportar problemas
                </Text>

                <Text style={styles.label}>Nombre Completo</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Tu nombre completo"
                    placeholderTextColor="#999"
                    value={nombre}
                    onChangeText={setNombre}
                    editable={!isLoading}
                />

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
                        placeholder="Crea una contraseña segura"
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

                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirma tu contraseña"
                        placeholderTextColor="#999"
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry={!showPasswordConfirm}
                        editable={!isLoading}
                    />
                    <TouchableOpacity onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                        <Text style={styles.eyeIcon}>
                            {showPasswordConfirm ? '👁️' : '👁️‍🗨️'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ScreenLogin')}>
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <Text style={styles.loginLink}>Inicia sesión</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    Al registrarte, aceptas nuestros términos de servicio y política de privacidad
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingHorizontal: 0,
    },
    backBtn: {
        fontSize: 16,
        color: '#667eea',
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
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
    registerButton: {
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
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        fontSize: 13,
        color: '#666',
    },
    loginLink: {
        fontSize: 13,
        color: '#667eea',
        fontWeight: '600',
    },
    termsContainer: {
        marginHorizontal: 16,
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    termsText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        lineHeight: 16,
    },
});
