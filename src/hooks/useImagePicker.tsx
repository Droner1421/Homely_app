import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface UseImagePicker {
    imagen64: string;
    pickImage: () => Promise<string>;
}

export const useImagePicker = (): UseImagePicker => {

    const [imagen64, setImagen64] = useState<string>("");

    
    const pickImage = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permisos requeridos",
                "Se requieren permisos para acceder a la galería",
                [{ text: "Aceptar" }]
            );
            return "";
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (result.canceled) return "";

        const base64 = result.assets && result.assets[0] && result.assets[0].base64 ? result.assets[0].base64 : "";
        setImagen64(base64);
        return base64;
    };

    return { imagen64, pickImage };

};