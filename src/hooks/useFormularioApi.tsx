import { useEffect, useState } from "react";
import { useReporteApi } from "./useReporteApi";
import { Reporte } from "../interfaces/interfaces";
import { FromFormularioData } from "./useFormFormulario";

interface UseFormularioApi{
    isLoading:  boolean;
    listFormulario: Reporte[];
    loadFormulario: () => Promise<void>;
    createFormulario: (data: any) => Promise<void>;
    updateFormulario: (data: any) => Promise<void>;
    deleteFormulario: (data: any) => Promise<void>;
}

// Hook para compatibilidad - redirige a useReporteApi
export const useFormularioApi = (): UseFormularioApi => {
    const {
        isLoading,
        reportes,
        loadReportes,
        createReporte,
        updateReporte,
        deleteReporte,
    } = useReporteApi();

    return {
        isLoading,
        listFormulario: reportes,
        loadFormulario: loadReportes,
        createFormulario: createReporte,
        updateFormulario: updateReporte,
        deleteFormulario: deleteReporte,
    };
}