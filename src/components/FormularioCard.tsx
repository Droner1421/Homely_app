import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Reporte } from '../interfaces/interfaces';

interface Props {
    reporte: Reporte;
}

export const ReporteCard = ({ reporte }: Props) => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    
    const getStatusColor = (estado: string) => {
        switch(estado) {
            case 'pendiente': return '#FF9800';
            case 'en_progreso': return '#2196F3';
            case 'resuelto': return '#4CAF50';
            case 'rechazado': return '#F44336';
            default: return '#9C27B0';
        }
    };

    const handlePress = () => {
        // Residentes ven ScreenMiReporte, Admins ven ScreenReporte
        if (user?.rol === 'admin') {
            navigation.navigate('ScreenReporte', { reporteId: reporte.id });
        } else {
            navigation.navigate('ScreenMiReporte', { reporteId: reporte.id });
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.categoria}>{reporte.categoria}</Text>
                    <View 
                        style={[
                            styles.badge,
                            { backgroundColor: getStatusColor(reporte.estado) }
                        ]}
                    >
                        <Text style={styles.badgeText}>{reporte.estado}</Text>
                    </View>
                </View>

                <Text style={styles.descripcion} numberOfLines={2}>
                    {reporte.descripcion}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.apoyo}>👍 {reporte.apoyos_count || 0}</Text>
                    <Text style={styles.fecha}>
                        {new Date(reporte.created_at || '').toLocaleDateString()}
                    </Text>
                </View>

                {(reporte.imagen_problema_url || reporte.imagen_problema || (reporte.imagenes && reporte.imagenes.length > 0)) && (
                    <Image
                        style={styles.image}
                        source={{ uri: (reporte.imagen_problema_url?.startsWith('http')
                            ? reporte.imagen_problema_url
                            : `http://74.208.117.45:80${reporte.imagen_problema_url || reporte.imagen_problema}`)
                            || reporte.imagenes?.[0] }}
                        resizeMode="cover"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

// Mantener compatibilidad con nombre anterior
export const FormularioCard = ReporteCard;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        width: 170,
        height: 200,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#667eea',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoria: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#333',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    descripcion: {
        color: '#666',
        fontSize: 12,
        marginBottom: 10,
        lineHeight: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    apoyo: {
        fontSize: 12,
        color: '#764ba2',
        fontWeight: '600',
    },
    fecha: {
        fontSize: 10,
        color: '#999',
    },
    image: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        marginTop: 8,
    },
});
