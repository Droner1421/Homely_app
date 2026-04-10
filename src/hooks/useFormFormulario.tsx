
import { useReducer } from "react";
import { useReporteApi } from "./useReporteApi";
import { FromReporteData } from "../interfaces/interfaces";

interface UseFormReporte {
    state: FromReporteData;
    handleInputChange: (fieldName: keyof FromReporteData, value: string | number | string[]) => void;
    handleSubmit: () => Promise<void>;
    handleDelete: () => Promise<void>;
    resetForm: () => void;
}

export const useFormReporte = (): UseFormReporte => {
    const { createReporte, updateReporte, deleteReporte } = useReporteApi();

    const initialForm: FromReporteData = {
        categoria: "",
        descripcion: "",
        imagenes: [],
        latitud: 0,
        longitud: 0,
    };

    type Action = { 
        type: "handleInputChange", 
        payload: { fieldName: keyof FromReporteData, value: string | number | string[] } 
    } | {
        type: "resetForm"
    };

    const formReducer = (state: FromReporteData, action: Action) => {
        switch(action.type) {
            case "handleInputChange":
                return {
                    ...state,
                    [action.payload.fieldName]: action.payload.value
                };
            case "resetForm":
                return initialForm;
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(formReducer, initialForm);

    const handleInputChange = (fieldName: keyof FromReporteData, value: string | number | string[]) => {
        dispatch({ type: "handleInputChange", payload: { fieldName, value } });
    };

    const handleSubmit = async () => {
        try {
            if (state.id) {
                await updateReporte(state.id, state);
            } else {
                await createReporte(state);
            }
            dispatch({ type: "resetForm" });
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            throw error;
        }
    };

    const handleDelete = async () => {
        if (state.id) {
            try {
                await deleteReporte(state.id);
                dispatch({ type: "resetForm" });
            } catch (error) {
                console.error('Error al eliminar reporte:', error);
                throw error;
            }
        }
    };

    const resetForm = () => {
        dispatch({ type: "resetForm" });
    };

    return { state, handleInputChange, handleSubmit, handleDelete, resetForm };
};

// Mantener la antigua interfaz para compatibilidad si es necesaria
export interface FromFormularioData {
    id?: number;
    razon_social: string;  
    rfc: string;  
    giro_comercial: string;  
    direccion_fiscal: string;  
    representante_legar: string;  
    correo: string;  
    telefono: string;  
    numero_de_empleados: string;  
    años_de_experiencia: string;  
    capacidad_tecnica: string;  
    certificaciones: string;  
    clientes_principales: string;  
    banco_y_cuenta: string;  
    conflicto_de_intereses: string;  
    Firma_del_representante: string;   
    imagen_rfc: string;   
    imagen_acta_constitutiva: string;   
    imagen_comprobante_fiscal: string;   
    imagen_identificacion_legal: string;   
    imagen_certificaciones_iso: string;
    imagen_comprobante_bancario: string;
}