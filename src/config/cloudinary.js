// Configuración de Cloudinary
export const cloudinaryConfig = {
  cloudName: "dvojtf3n9", // Reemplaza con tu Cloud Name
  uploadPreset: "noticias_preset", // Crearemos este preset
};

// Función para subir imagen a Cloudinary
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url; // Retorna la URL de la imagen
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};
