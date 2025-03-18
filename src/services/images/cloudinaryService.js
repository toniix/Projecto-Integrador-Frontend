import axios from 'axios';

// Obtener variables de entorno tal como están definidas en tu .env
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_API_UPLOAD_PRESET;

// Verificar si las variables están definidas
if (!CLOUDINARY_URL) {
  console.error('ERROR: La variable VITE_CLOUDINARY_URL no está definida en el archivo .env');
}

if (!CLOUDINARY_UPLOAD_PRESET) {
  console.error('ERROR: La variable VITE_API_UPLOAD_PRESET no está definida en el archivo .env');
}

/**
 * Servicio para interactuar con Cloudinary
 */
const cloudinaryService = {
  /**
   * Sube una imagen a Cloudinary y retorna la URL
   * @param {File} file - Archivo de imagen a subir
   * @returns {Promise<string>} - URL de la imagen subida
   */
  async uploadImage(file) {
    // Verificar que las variables de entorno estén definidas
    if (!CLOUDINARY_URL || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Las variables de entorno de Cloudinary no están configuradas correctamente');
    }

    // Verificar que el archivo sea válido
    if (!file || !(file instanceof File)) {
      throw new Error('Archivo inválido para subir a Cloudinary');
    }

    console.log('Preparando para subir imagen a Cloudinary');
    console.log('URL de Cloudinary:', CLOUDINARY_URL);
    console.log('Upload Preset:', CLOUDINARY_UPLOAD_PRESET);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      // Usar fetch para la solicitud a Cloudinary
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error de Cloudinary:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Error de Cloudinary: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.secure_url) {
        throw new Error('Respuesta inválida de Cloudinary');
      }

      console.log('Imagen subida exitosamente a Cloudinary');
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      throw new Error(error.message || 'Error al subir imagen a Cloudinary');
    }
  }
};

export default cloudinaryService;