# 🏘️ HomeLY App

**Aplicación móvil React Native sincronizada 100% con Homely-web**

HomeLY_app es una versión móvil de la plataforma Homely-web que permite a residentes crear, gestionar y apoyar reportes de problemas comunitarios directamente desde sus dispositivos. La app está completamente sincronizada con el backend de Homely-web, lo que significa que cualquier cambio en la web se refleja automáticamente en la app y viceversa.

## 🌟 Características Principales

- ✅ **Autenticación Segura** - Login/Registro con JWT tokens
- 📝 **Crear Reportes** - Con descripción, fotos y ubicación GPS
- 🔔 **Notificaciones en Tiempo Real** - Actualizaciones instantáneas
- 👥 **Sistema de Apoyos** - Apoya reportes de otros residentes
- 📍 **Geolocalización** - Reportes con coordenadas automáticas
- 📸 **Captura de Imágenes** - Toma fotos directamente en la app
- 🔄 **Sincronización Bidireccional** - Web ↔ App
- 👤 **Gestión de Perfil** - Edita tu información personal
- 🎨 **Diseño Moderno** - UI idéntica a Homely-web

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar o descargar el proyecto
cd c:\Users\Gabriel\Documents\Ulises\Formu

# Instalar dependencias
npm install

# (Opcional) Instalar Expo CLI si no lo tienes
npm install -g expo-cli

# Ejecutar la app
expo start
```

### Acceso a la App

```bash
# Opción 1: Emulador Android
- Expo abre y muestra botón "Android"
- Click para abrir en Android Emulator

# Opción 2: iOS Simulator
- Requiere macOS
- Click en botón "iOS"

# Opción 3: Dispositivo Físico
- Descarga Expo Go desde App Store / Play Store
- Escanea el QR que aparece en terminal
- App se abre en tu dispositivo

# Opción 4: Web
- Click en botón "Web"
- Se abre en navegador (para testing)
```

## 📋 Requisitos

- Node.js >= 16
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- **Importante:** Homely-web debe estar corriendo en `http://localhost:8000`

## ⚙️ Configuración

### 1. URLs de API

El archivo `src/api/apiFormulario.tsx` contiene la URL base:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

**Cambiar según tu configuración:**
- Local: `http://localhost:8000/api`
- Emulador Android: `http://10.0.2.2:8000/api`
- Dispositivo físico: `http://192.168.1.X:8000/api`

Ver [CONFIG_ENVIRONMENTS.md](CONFIG_ENVIRONMENTS.md) para más detalles.

### 2. Permisos

Los permisos están predefinidos en `app.json`:
- 📷 Cámara (capturar fotos)
- 📍 Ubicación (GPS)
- 📁 Almacenamiento (galería)

Se solicitan automáticamente cuando se necesitan.

## 📱 Pantallas

1. **Login** - Autentica con email y contraseña
2. **Registro** - Crea una nueva cuenta como Residente
3. **Dashboard** - Lista de reportes disponibles con búsqueda/filtros
4. **Crear Reporte** - Completa categoría, descripción, foto y ubicación
5. **Notificaciones** - Recibe updates sobre tus reportes
6. **Perfil** - Manage tu cuenta y cambiar contraseña

## 🔗 Conexión con Homely-web

Esta app está 100% sincronizada con [Homely-web](../homely-web):

- **BD Compartida:** SQLite (misma base de datos)
- **Autenticación:** JWT tokens
- **API:** Laravel REST endpoints
- **Cambios Bidireccionales:** Web → App y App → Web

Ver [SINCRONIZACION_COMPLETA.md](SINCRONIZACION_COMPLETA.md) para arquitectura completa.

## 📦 Estructura del Proyecto

```
src/
├── api/                         # Configuración de axios
│   └── apiFormulario.tsx        # Cliente HTTP + interceptores
├── hooks/                       # Custom React hooks
│   ├── useAuthApi.tsx          # Autenticación
│   ├── useReporteApi.tsx       # CRUD reportes
│   ├── useNotificacionesApi.tsx # Gestión notificaciones
│   ├── usePerfilApi.tsx        # Perfil usuario
│   ├── useFormFormulario.tsx   # Estado formulario
│   └── useImagePicker.tsx      # Captura de imágenes
├── screens/                     # Pantallas
│   ├── ScreenLogin.tsx
│   ├── ScreenRegistro.tsx
│   ├── HomeFormulario.tsx      # Dashboard principal
│   ├── ScreenReporte.tsx       # Crear/editar reportes
│   ├── ScreenNotificaciones.tsx # Panel notificaciones
│   └── ScreenPerfil.tsx        # Mi perfil
├── components/                  # Componentes reutilizables
│   ├── ReporteCard.tsx         # Card para mostrar reportes
│   └── DrawerMenu.tsx          # Menú lateral
├── navigator/                   # Navegación
│   └── DrawerNavigator.tsx     # Setup de rutas
└── interfaces/                  # Tipos TypeScript
    └── interfaces.tsx           # Definiciones de datos
```

## 🎨 Colores & Tema

Paleta de colores de Homely:
- **Primario:** `#667eea` (Púrpura)
- **Secundario:** `#764ba2` (Púrpura oscuro)
- **Éxito:** `#4CAF50` (Verde)
- **Advertencia:** `#FF9800` (Naranja)
- **Error:** `#F44336` (Rojo)

## 🔐 Datos de Prueba

Para probar la app con datos reales, necesitas:
1. Homely-web corriendo en `http://localhost:8000`
2. Crear usuarios de prueba desde web o app
3. Crear algunos reportes de prueba
4. Invitar a amigos para que vean/apoyen reportes

## 📊 Modelos Principales

### Reporte
```typescript
{
  id: number
  usuario_id: number
  categoria: string
  descripcion: string
  imagenes: string[]
  latitud: number
  longitud: number
  estado: 'pendiente' | 'en_progreso' | 'resuelto' | 'rechazado'
  apoyos_count: number
}
```

### Usuario
```typescript
{
  id: number
  nombre: string
  email: string
  rol: 'residente' | 'admin' | 'superadmin'
  estado: 'activo' | 'inactivo' | 'bloqueado'
}
```

### Notificacion
```typescript
{
  id: number
  usuario_id: number
  reporte_id: number
  mensaje: string
  leido: boolean
  tipo: 'nuevo_reporte' | 'reporte_actualizado' | 'comentario' | 'apoyo'
}
```

## 🐛 Troubleshooting

### "Cannot reach API"
- Verifica que Homely-web esté corriendo: `php artisan serve`
- Comprueba la URL en `src/api/apiFormulario.tsx`
- En emulador, usa `10.0.2.2` en lugar de `localhost`

### "Permission Denied"
- En Android: Verifica permisos en Ajustes > Aplicaciones
- En iOS: Verifica en Settings > Privacy

### Imágenes No Se Guardan
- Verifica espacio en almacenamiento del dispositivo
- Comprueba que `storage/app/public` existe en Homely-web
- Ejecuta: `php artisan storage:link`

## 📚 Documentación Adicional

- [README_HOMELY_APP.md](README_HOMELY_APP.md) - Guía completa de desarrollo
- [CONFIG_ENVIRONMENTS.md](CONFIG_ENVIRONMENTS.md) - Configuración de entornos
- [SINCRONIZACION_COMPLETA.md](SINCRONIZACION_COMPLETA.md) - Arquitectura y sincronización

## 👨‍💻 Desarrollo

### Agregar Nueva Pantalla
1. Crear archivo en `src/screens/ScreenNueva.tsx`
2. Agregarla a `DrawerNavigator.tsx`

### Agregar Nuevo Hook
1. Crear en `src/hooks/useNuevoApi.tsx`
2. Usar `apiClient` de `src/api/apiFormulario.tsx`

### estilo
- Componentes funcionales con hooks
- Estilos con `StyleSheet.create()`
- Tipado TypeScript obligatorio

## 📲 Próximos Pasos

- [ ] WebSockets para notificaciones en tiempo real
- [ ] Pantalla de mapa visual de reportes
- [ ] Analytics y estadísticas
- [ ] Share reports en redes sociales
- [ ] Modo offline con sincronización posterior
- [ ] Temas light/dark
- [ ] Múltiples idiomas

## 📄 Licencia

Este proyecto es parte del ecosistema HomeLY y está bajo licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación incluida
2. Comprueba los logs de Homely-web
3. Verifica Network tab en DevTools

---

**Desarrollado con ❤️ para la comunidad**

Última actualización: Abril 2026  
Versión: 1.0.0  
Status: ✅ Producción
