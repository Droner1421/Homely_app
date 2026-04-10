import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useWindowDimensions } from 'react-native';
import { HomeFormulario } from "../screens/HomeFormulario";
import { ScreenReporte } from "../screens/ScreenReporte";
import { ScreenMiReporte } from "../screens/ScreenMiReporte";
import { PantallaNotificaciones } from "../screens/ScreenNotificaciones";
import { ScreenPerfil } from "../screens/ScreenPerfil";
import { ScreenAdminDashboard } from "../screens/ScreenAdminDashboard";
import { ScreenDetalleReporte } from "../screens/ScreenDetalleReporte";
import { ScreenLogin } from "../screens/ScreenLogin";
import { ScreenRegistro } from "../screens/ScreenRegistro";
import { DrawerMenu } from "../components/DrawerMenu";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export type RootDrawerNavigator = {
    HomeReportes: undefined;
    CrearReporte: undefined;
    MisReportes: undefined;
    ScreenMiReporte: { reporteId?: number };
    Notificaciones: undefined;
    Perfil: undefined;
    ScreenReporte: { reporteId?: number; isNew?: boolean };
    ScreenDetalleReporte: { reporteId?: number };
};

const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#667eea',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="HomeReportesStack"
                component={HomeFormulario}
                options={{
                    title: 'HomeLY Reportes',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ScreenReporte"
                component={ScreenReporte}
                options={{
                    title: 'Reporte',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="ScreenMiReporte"
                component={ScreenMiReporte}
                options={{
                    title: 'Mi Reporte',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

const AdminNavDrawerWrapper = ({ isAdmin }: { isAdmin: boolean }) => (
    <NavDrawer isAdmin={isAdmin} />
);

const NavDrawer = ({ isAdmin }: { isAdmin: boolean }) => {
    const Drawer = createDrawerNavigator<RootDrawerNavigator>();
    const { width } = useWindowDimensions();

    return (
        <Drawer.Navigator
            initialRouteName="HomeReportes"
            screenOptions={{
                headerShown: false,
                drawerType: width >= 768 ? "permanent" : "front",
                drawerPosition: "right",
                drawerStyle: {
                    backgroundColor: "#FFFFFF",
                    width: width * 0.7,
                },
            }}
            drawerContent={(props) => <DrawerMenu {...props} />}
        >
            {isAdmin ? (
                <>
                    <Drawer.Screen
                        name="HomeReportes"
                        component={ScreenAdminDashboard}
                        options={{ title: "Panel Admin" }}
                    />
                    <Drawer.Screen
                        name="ScreenDetalleReporte"
                        component={ScreenDetalleReporte}
                        options={{ title: "Detalle del Reporte" }}
                    />
                </>
            ) : (
                <>
                    <Drawer.Screen
                        name="HomeReportes"
                        component={HomeStack}
                        options={{ title: "Inicio" }}
                    />
                    <Drawer.Screen
                        name="CrearReporte"
                        component={ScreenReporte}
                        options={{ title: "Crear Reporte" }}
                    />
                </>
            )}
            
            <Drawer.Screen
                name="Notificaciones"
                component={PantallaNotificaciones}
                options={{ title: "Notificaciones" }}
            />
            <Drawer.Screen
                name="Perfil"
                component={ScreenPerfil}
                options={{ title: "Mi Perfil" }}
            />
        </Drawer.Navigator>
    );
};

const AuthStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="ScreenLogin"
                component={ScreenLogin}
            />
            <Stack.Screen
                name="ScreenRegistro"
                component={ScreenRegistro}
            />
        </Stack.Navigator>
    );
};

export const DrawerNavigator = () => {
    const Stack = createNativeStackNavigator();
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            setIsAdmin(user.rol === 'admin');
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    console.log('👁️ [NAVIGATOR] Current user:', user);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen
                    name="DrawerApp"
                    options={{ headerShown: false }}
                >
                    {() => <AdminNavDrawerWrapper isAdmin={isAdmin} />}
                </Stack.Screen>
            ) : (
                <Stack.Screen
                    name="AuthStack"
                    component={AuthStack}
                />
            )}
        </Stack.Navigator>
    );
};

