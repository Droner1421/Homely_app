import React, { useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useFormFormulario } from '../hooks/useFormFormulario';
import { useImagePicker } from '../hooks/useImagePicker';


type Props = { navigation: any; route: { params?: any } };

export const ScreenFormulario = ({ navigation, route }: Props) => {
    const { state, handleInputChange, handleSubmit, handleDelete } = useFormFormulario();
    const { pickImage } = useImagePicker();

    useEffect(() => {
        const formulario = route.params;
        if (!formulario) return;
        if ('reset' in formulario && formulario.reset) {
           
            return;
        }

        handleInputChange('id', formulario.id ?? 0);
        handleInputChange('razon_social', formulario.razon_social ?? '');
        handleInputChange('rfc', formulario.rfc ?? '');
        handleInputChange('giro_comercial', formulario.giro_comercial ?? '');
        handleInputChange('direccion_fiscal', formulario.direccion_fiscal ?? '');
        handleInputChange('representante_legar', formulario.representante_legar ?? '');
        handleInputChange('correo', formulario.correo ?? '');
        handleInputChange('telefono', formulario.telefono ?? '');
        handleInputChange('numero_de_empleados', formulario.numero_de_empleados ?? '');
        handleInputChange('años_de_experiencia', formulario.años_de_experiencia ?? '');
        handleInputChange('capacidad_tecnica', formulario.capacidad_tecnica ?? '');
        handleInputChange('certificaciones', formulario.certificaciones ?? '');
        handleInputChange('clientes_principales', formulario.clientes_principales ?? '');
        handleInputChange('banco_y_cuenta', formulario.banco_y_cuenta ?? '');
        handleInputChange('conflicto_de_intereses', formulario.conflicto_de_intereses ?? '');
        handleInputChange('Firma_del_representante', formulario.Firma_del_representante ?? '');
        handleInputChange('imagen_rfc', formulario.imagen_rfc ?? '');
        handleInputChange('imagen_acta_constitutiva', formulario.imagen_acta_constitutiva ?? '');
        handleInputChange('imagen_comprobante_fiscal', formulario.imagen_comprobante_fiscal ?? '');
        handleInputChange('imagen_identificacion_legal', formulario.imagen_identificacion_legal ?? '');
        handleInputChange('imagen_certificaciones_iso', formulario.imagen_certificaciones_iso ?? '');
        handleInputChange('imagen_comprobante_bancario', formulario.imagen_comprobante_bancario ?? '');
    }, [route.params]);



    return (
        <ScrollView style={styles.marginGlobal}>
            <Text style={styles.title}>Formulario</Text>

            {state.id !== 0 && (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert('Borrar', '¿Deseas eliminar este formulario?', [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                                text: 'Eliminar', style: 'destructive', onPress: async () => {
                                    try {
                                        await handleDelete();
                                       
                                        navigation.navigate('HomeFormulario');
                                        Alert.alert('Éxito', 'Formulario eliminado correctamente');
                                    } catch (error: any) {
                                        console.error('delete error', error);
                                        Alert.alert('Error', 'No se pudo eliminar el formulario');
                                    }
                                }
                            }
                        ]);
                    }}
                    style={styles.botonBorrar}
                >
                    <Text style={styles.textoBotonBlanco}>Borrar</Text>
                </TouchableOpacity>
            )}

            <View style={styles.container}>
                <Text style={styles.label}>Razón Social</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Razón Social"
                    placeholderTextColor="#666"
                    value={state.razon_social}
                    onChangeText={(value) => handleInputChange('razon_social', value)}
                />

                <Text style={styles.label}>RFC</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="RFC"
                    placeholderTextColor="#666"
                    value={state.rfc}
                    onChangeText={(value) => handleInputChange('rfc', value)}
                />

                <Text style={styles.label}>Giro Comercial</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Giro Comercial"
                    placeholderTextColor="#666"
                    value={state.giro_comercial}
                    onChangeText={(value) => handleInputChange('giro_comercial', value)}
                />

                <Text style={styles.label}>Dirección Fiscal</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Dirección Fiscal"
                    placeholderTextColor="#666"
                    value={state.direccion_fiscal}
                    onChangeText={(value) => handleInputChange('direccion_fiscal', value)}
                />

                <Text style={styles.label}>Representante Legal</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Representante Legal"
                    placeholderTextColor="#666"
                    value={state.representante_legar}
                    onChangeText={(value) => handleInputChange('representante_legar', value)}
                />

                <Text style={styles.label}>Correo</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Correo"
                    placeholderTextColor="#666"
                    value={state.correo}
                    onChangeText={(value) => handleInputChange('correo', value)}
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Teléfono"
                    placeholderTextColor="#666"
                    value={state.telefono}
                    onChangeText={(value) => handleInputChange('telefono', value)}
                />

                <Text style={styles.label}>Número de Empleados</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Número de Empleados"
                    placeholderTextColor="#666"
                    value={state.numero_de_empleados}
                    onChangeText={(value) => handleInputChange('numero_de_empleados', value)}
                />

                <Text style={styles.label}>Años de Experiencia</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Años de Experiencia"
                    placeholderTextColor="#666"
                    value={state.años_de_experiencia}
                    onChangeText={(value) => handleInputChange('años_de_experiencia', value)}
                />

                <Text style={styles.label}>Capacidad Técnica</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Capacidad Técnica"
                    placeholderTextColor="#666"
                    value={state.capacidad_tecnica}
                    onChangeText={(value) => handleInputChange('capacidad_tecnica', value)}
                />

                <Text style={styles.label}>Certificaciones</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Certificaciones"
                    placeholderTextColor="#666"
                    value={state.certificaciones}
                    onChangeText={(value) => handleInputChange('certificaciones', value)}
                />

                <Text style={styles.label}>Clientes Principales</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Clientes Principales"
                    placeholderTextColor="#666"
                    value={state.clientes_principales}
                    onChangeText={(value) => handleInputChange('clientes_principales', value)}
                />

                <Text style={styles.label}>Banco y Cuenta</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Banco y Cuenta"
                    placeholderTextColor="#666"
                    value={state.banco_y_cuenta}
                    onChangeText={(value) => handleInputChange('banco_y_cuenta', value)}
                />

                <Text style={styles.label}>Conflicto de Intereses</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Conflicto de Intereses"
                    placeholderTextColor="#666"
                    value={state.conflicto_de_intereses}
                    onChangeText={(value) => handleInputChange('conflicto_de_intereses', value)}
                />

                <Text style={styles.label}>Firma del Representante</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Firma del Representante"
                    placeholderTextColor="#666"
                    value={state.Firma_del_representante}
                    onChangeText={(value) => handleInputChange('Firma_del_representante', value)}
                />

                
                <Text style={styles.label}>RFC</Text>
                <TouchableOpacity onPress={async () => {
                    const base64 = await pickImage();
                    if (base64) handleInputChange('imagen_rfc', base64);
                }} style={styles.botonSeleccionarImagen}>
                    <Text style={styles.textoBotonBlanco}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {state.imagen_rfc && <Image style={styles.avatar} source={{ uri: `data:image/jpeg;base64,${state.imagen_rfc}` }} />}

                <Text style={styles.label}>Acta Constitutiva</Text>
                <TouchableOpacity onPress={async () => {
                    const base64 = await pickImage();
                    if (base64) handleInputChange('imagen_acta_constitutiva', base64);
                }} style={styles.botonSeleccionarImagen}>
                    <Text style={styles.textoBotonBlanco}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {state.imagen_acta_constitutiva && <Image style={styles.avatar} source={{ uri: `data:image/jpeg;base64,${state.imagen_acta_constitutiva}` }} />}

                <Text style={styles.label}>Comprobante Fiscal</Text>
                <TouchableOpacity onPress={async () => {
                    const base64 = await pickImage();
                    if (base64) handleInputChange('imagen_comprobante_fiscal', base64);
                }} style={styles.botonSeleccionarImagen}>
                    <Text style={styles.textoBotonBlanco}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {state.imagen_comprobante_fiscal && <Image style={styles.avatar} source={{ uri: `data:image/jpeg;base64,${state.imagen_comprobante_fiscal}` }} />}

                <Text style={styles.label}>Identificación Legal</Text>
                <TouchableOpacity onPress={async () => {
                    const base64 = await pickImage();
                    if (base64) handleInputChange('imagen_identificacion_legal', base64);
                }} style={styles.botonSeleccionarImagen}>
                    <Text style={styles.textoBotonBlanco}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {state.imagen_identificacion_legal && <Image style={styles.avatar} source={{ uri: `data:image/jpeg;base64,${state.imagen_identificacion_legal}` }} />}

                <Text style={styles.label}>Certificaciones ISO</Text>
                <TouchableOpacity onPress={async () => {
                    const base64 = await pickImage();
                    if (base64) handleInputChange('imagen_certificaciones_iso', base64);
                }} style={styles.botonSeleccionarImagen}>
                    <Text style={styles.textoBotonBlanco}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {state.imagen_certificaciones_iso && <Image style={styles.avatar} source={{ uri: `data:image/jpeg;base64,${state.imagen_certificaciones_iso}` }} />}

                <Text style={styles.label}>Comprobante Bancario</Text>
                <TouchableOpacity onPress={async () => {
                    const base64 = await pickImage();
                    if (base64) handleInputChange('imagen_comprobante_bancario', base64);
                }} style={styles.botonSeleccionarImagen}>
                    <Text style={styles.textoBotonBlanco}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {state.imagen_comprobante_bancario && <Image style={styles.avatar} source={{ uri: `data:image/jpeg;base64,${state.imagen_comprobante_bancario}` }} />}

                
                <TouchableOpacity
                    onPress={async () => {
                        try {
                            await handleSubmit();
                          
                            navigation.navigate('HomeFormulario');
                            Alert.alert('Éxito', `Formulario ${state.id !== 0 ? 'actualizado' : 'creado'} correctamente`);
                        } catch (error: any) {
                            console.error('submit error', error);
                            const serverMessage = error?.response?.data?.message ?? error?.response?.data ?? error?.message;
                            Alert.alert('Error', `No se pudo guardar el formulario: ${serverMessage}`);
                        }
                    }}
                    style={styles.botonCrearActualizar}
                >
                    <Text style={styles.textoBotonBlanco}>{state.id !== 0 ? 'Actualizar' : 'Crear'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                       
                            navigation.navigate('HomeFormulario');
                        
                    }}
                    style={styles.botonRegresar}
                >
                    <Text style={styles.textoBotonBlanco}>Regresar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
 marginGlobal: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },

  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '800',
  },

  container: {
    backgroundColor: '#0b0b0b',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 24,
  },

  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },

  textInput: {
    backgroundColor: '#111',
    color: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 12, 
  },

  avatar: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 10,
  },

  botonBorrar: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },

  botonSeleccionarImagen: {
    backgroundColor: '#2b6ef6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  botonCrearActualizar: {
    backgroundColor: 'violet',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  botonRegresar: {
    backgroundColor: 'grey',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBotonBlanco: {
    color: '#fff',
    fontWeight: '700',
  },
});
