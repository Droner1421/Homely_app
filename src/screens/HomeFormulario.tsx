import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useReporteApi } from '../hooks/useReporteApi';
import { useNotificacionesApi } from '../hooks/useNotificacionesApi';
import { Reporte } from '../interfaces/interfaces';
import { ReporteCard } from '../components/FormularioCard';

type HomeNavigationProp = DrawerNavigationProp<any>;

export const HomeFormulario = () => {
    const { isLoading, reportes, loadReportes } = useReporteApi();
    const { noLeidas } = useNotificacionesApi();
    const focused = useIsFocused();
    const navigation = useNavigation<HomeNavigationProp>();
    const [filtro, setFiltro] = useState('');
    const [filteredReportes, setFilteredReportes] = useState<Reporte[]>([]);

    useEffect(() => {
        if (focused) {
            loadReportes();
        }
    }, [focused]);

    useEffect(() => {
        if (filtro.trim() === '') {
            setFilteredReportes(reportes);
        } else {
            const filtered = reportes.filter(r =>
                r.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
                r.descripcion.toLowerCase().includes(filtro.toLowerCase())
            );
            setFilteredReportes(filtered);
        }
    }, [reportes, filtro]);

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredReportes}
                keyExtractor={(item) => `${item.id}`}
                ListHeaderComponent={(
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity 
                                onPress={() => navigation.openDrawer()}
                                style={styles.menuButton}
                            >
                                <Text style={styles.menuIcon}>☰</Text>
                            </TouchableOpacity>
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>HomeLY Reportes</Text>
                                {noLeidas > 0 && (
                                    <View style={styles.notificationBadge}>
                                        <Text style={styles.badgeText}>{noLeidas}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <Text style={styles.subtitle}>
                            {filteredReportes.length} reportes disponibles
                        </Text>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar reportes..."
                            placeholderTextColor="#999"
                            value={filtro}
                            onChangeText={setFiltro}
                        />

                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => navigation.navigate('ScreenReporte', { isNew: true })}
                        >
                            <Text style={styles.createButtonText}>➕ Crear Reporte</Text>
                        </TouchableOpacity>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadReportes}
                        colors={['#667eea']}
                        progressBackgroundColor="#f3f4f6"
                    />
                }
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.column}
                renderItem={({ item }) => (
                    <ReporteCard reporte={item} />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>
                            No hay reportes disponibles. ¡Sé el primero en crear uno!
                        </Text>
                    </View>
                )}
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
        paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
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
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    notificationBadge: {
        backgroundColor: '#F44336',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    searchInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    createButton: {
        backgroundColor: '#667eea',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    column: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
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
        marginHorizontal: 24,
    },
});

