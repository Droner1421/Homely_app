
// ====== USUARIO ======
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'residente' | 'admin' | 'superadmin';
  estado: 'pendiente' | 'activo' | 'inactivo' | 'bloqueado';
  api_token?: string;
  categoria_admin?: string | null;
  reportes_count?: number;
  apoyos_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ====== REPORTE ======
export interface Reporte {
  id: number;
  usuario_id: number;
  categoria: string;
  descripcion: string;
  imagenes: string[];
  latitud: number;
  longitud: number;
  estado: 'pendiente' | 'en_progreso' | 'resuelto' | 'rechazado';
  admin_id?: number;
  imagen_problema?: string;
  imagen_problema_url?: string; // URL completa generada por API
  imagen_solucion?: string;
  imagen_solucion_url?: string; // URL completa generada por API
  apoyos_count?: number;
  apoyos?: any[];
  usuario?: Usuario;
  admin?: Usuario;
  created_at?: string;
  updated_at?: string;
}

// ====== NOTIFICACIÓN ======
export interface Notificacion {
  id: number;
  usuario_id: number;
  reporte_id: number;
  mensaje: string;
  leido: boolean;
  tipo: 'nuevo_reporte' | 'reporte_actualizado' | 'comentario' | 'apoyo';
  created_at?: string;
  updated_at?: string;
}

// ====== APOYO ======
export interface Apoyo {
  id: number;
  reporte_id: number;
  usuario_id: number;
  created_at?: string;
}

// ====== AUTH RESPONSE ======
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: Usuario;
    token: string;
    rol: string;
  };
}

// ====== FORM STATE ======
export interface FromReporteData {
  id?: number;
  categoria: string;
  descripcion: string;
  imagenes: string[];
  latitud: number;
  longitud: number;
  estado?: 'pendiente' | 'en_progreso' | 'resuelto' | 'rechazado';
  imagen_problema?: string; // File URI for image upload
  imagen_solucion?: string;
}