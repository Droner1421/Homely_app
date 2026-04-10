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
    Modal,
    FlatList,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useFormReporte } from '../hooks/useFormFormulario';
import { useReporteApi } from '../hooks/useReporteApi';

type ReporteNavigationProp = DrawerNavigationProp<any>;

type Props = { navigation?: ReporteNavigationProp; route: { params?: any } };

const CATEGORIAS = [
    { label: 'Áreas Verdes', value: 'areas_verdes' },
    { label: 'Calles', value: 'calles' },
    { label: 'Fugas', value: 'fugas' },
    { label: 'Alumbrado', value: 'alumbrado' },
];

export const ScreenReporte = ({ navigation: navProp, route }: Props) => {
    const drawerNav = useNavigation<ReporteNavigationProp>();
    const navigation = navProp || drawerNav;
    const { state, handleInputChange, handleSubmit, handleDelete } = useFormReporte();
    const { getReporteById, isLoading: apiLoading } = useReporteApi();
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [direccion, setDireccion] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const obtenerUbicacion = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita permiso de ubicación');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            handleInputChange('latitud', loc.coords.latitude);
            handleInputChange('longitud', loc.coords.longitude);
        } catch (error) {
            Alert.alert('Error', 'No se pudo obtener la ubicación');
        }
    };

    const seleccionarImagen = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita acceso a la galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
                handleInputChange('imagen_problema', result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const limpiarImagen = () => {
        setSelectedImage(null);
        handleInputChange('imagen_problema', '');
    };

    useEffect(() => {
        const cargarReporte = async () => {
            const params = route.params;
            if (!params) return;

            if (params.isNew) {
                // Obtener ubicación automáticamente para nuevo reporte
                await obtenerUbicacion();
            } else if (params.reporteId) {
                try {
                    const reporte = await getReporteById(params.reporteId);
                    if (reporte) {
                        handleInputChange('categoria', reporte.categoria);
                        handleInputChange('descripcion', reporte.descripcion);
                        handleInputChange('latitud', reporte.latitud);
                        handleInputChange('longitud', reporte.longitud);
                        setDireccion(reporte.direccion || '');
                    }
                } catch (error) {
                    console.error('Error al cargar reporte:', error);
                }
            }
        };

        cargarReporte();
    }, [route.params]);

    const handleEnviar = async () => {
        if (!state.categoria.trim()) {
            Alert.alert('Error', 'Por favor selecciona una categoría');
            return;
        }
        if (!state.descripcion.trim()) {
            Alert.alert('Error', 'Por favor ingresa una descripción');
            return;
        }

        setIsLoading(true);
        try {
            await handleSubmit();
            Alert.alert('Éxito', 'Reporte enviado correctamente');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo enviar el reporte');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEliminar = () => {
        Alert.alert('Eliminar', '¿Estás seguro de que quieres eliminar este reporte?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    setIsLoading(true);
                    try {
                        await handleDelete();
                        Alert.alert('Éxito', 'Reporte eliminado correctamente');
                        navigation.goBack();
                    } catch (error: any) {
                        Alert.alert('Error', error.message || 'No se pudo eliminar el reporte');
                    } finally {
                        setIsLoading(false);
                    }
                },
            },
        ]);
    };

    const selectedCategory = CATEGORIAS.find(c => c.value === state.categoria);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
               
                <Text style={styles.headerTitle}>
                    {state.id ? 'Editar Reporte' : 'Nuevo Reporte'}
                </Text>
                <View style={{ width: 60 }} />
            </View>

            {/* Contenedor del Formulario */}
            <View style={styles.formContainer}>
                {/* Sección: Información del Reporte */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ℹ️ Información del Reporte</Text>

                    {/* Categoría */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Categoría *</Text>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => setShowCategoryModal(true)}
                        >
                            <Text style={[styles.selectButtonText, !state.categoria && styles.placeholder]}>
                                {selectedCategory?.label || 'Selecciona una categoría'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Descripción */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Descripción detallada *</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Describe el problema en detalle..."
                            placeholderTextColor="#9CA3AF"
                            value={state.descripcion}
                            onChangeText={(value) => handleInputChange('descripcion', value)}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Sección: Ubicación */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Ubicación</Text>

                    {/* Búsqueda de dirección */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Dirección (opcional)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Calle, número, barrio..."
                            placeholderTextColor="#9CA3AF"
                            value={direccion}
                            onChangeText={setDireccion}
                        />
                    </View>

                    {/* Botón de ubicación */}
                    <TouchableOpacity style={styles.locationButton} onPress={obtenerUbicacion}>
                        <Text style={styles.locationButtonText}>📌 Obtener mi ubicación</Text>
                    </TouchableOpacity>

                    {/* Coordenadas */}
                    <View style={styles.coordsBox}>
                        <Text style={styles.coordsLabel}>Coordenadas:</Text>
                        <Text style={styles.coordsValue}>
                            {location.latitude
                                ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                                : 'No obtenida'}
                        </Text>
                    </View>
                </View>

                {/* Sección: Foto del Problema */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📸 Foto del Problema (Opcional)</Text>

                    <View style={styles.formGroup}>
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={seleccionarImagen}
                        >
                            <Text style={styles.imagePickerButtonText}>
                                📤 Seleccionar imagen
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {selectedImage && (
                        <View>
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.imagePreview}
                            />
                            <TouchableOpacity
                                style={styles.clearImageButton}
                                onPress={limpiarImagen}
                            >
                                <Text style={styles.clearImageButtonText}>✕ Quitar imagen</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Botones de Acción */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                        onPress={handleEnviar}
                        disabled={isLoading || apiLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {state.id ? '✓ Actualizar' : '✓ Enviar Reporte'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
                    </TouchableOpacity>

                    {state.id && (
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleEliminar}
                        >
                            <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Modal de Categorías */}
            <Modal
                visible={showCategoryModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecciona una categoría</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={CATEGORIAS}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.categoryOption,
                                        state.categoria === item.value && styles.categoryOptionSelected,
                                    ]}
                                    onPress={() => {
                                        handleInputChange('categoria', item.value);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.categoryOptionText,
                                            state.categoria === item.value && styles.categoryOptionTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: '#667eea',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
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
        fontWeight: '700',
    },
    formContainer: {
        padding: 16,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    imageCount: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    selectButton: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 14,
        backgroundColor: '#F9FAFB',
    },
    selectButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    placeholder: {
        color: '#9CA3AF',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#F9FAFB',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    locationButton: {
        backgroundColor: '#4facfe',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    coordsBox: {
        backgroundColor: '#F0F9FF',
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    coordsLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    coordsValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    imagePickerButton: {
        backgroundColor: '#667eea',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    imagePickerButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    imagePreview: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 12,
    },
    clearImageButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    clearImageButtonText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 12,
    },
    actionButtons: {
        gap: 10,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#10B981',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    cancelButton: {
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(107, 114, 128, 0.2)',
    },
    cancelButtonText: {
        color: '#6B7280',
        fontWeight: '600',
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    modalClose: {
        fontSize: 20,
        color: '#6B7280',
        fontWeight: 'bold',
    },
    categoryOption: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    categoryOptionSelected: {
        backgroundColor: '#F0F9FF',
        borderLeftWidth: 4,
        borderLeftColor: '#667eea',
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#6B7280',
    },
    categoryOptionTextSelected: {
        color: '#667eea',
        fontWeight: '600',
    },
});
