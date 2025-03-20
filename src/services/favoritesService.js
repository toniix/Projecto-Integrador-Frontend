import { apiClient } from "./api"; // Usa la instancia centralizada de Axios

const favoritesService = {
    /**
     * Verifica si un producto está en favoritos
     * @param {number|string} productId - ID del producto a verificar
     * @returns {Promise<boolean>} - true si el producto está en favoritos, false en caso contrario
     */
    checkFavoriteStatus: async (productId) => {
        try {
            // Obtenemos el token del localStorage
            const token = localStorage.getItem('token');
            // Configuramos un objeto de config con el token
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await apiClient.get(`/api/favorites/check/${productId}`, config);
            return response.data.isFavorite;
        } catch (error) {
            console.error("Error al verificar estado de favorito:", error);
            return false;
        }
    },

    /**
     * Agrega un producto a favoritos
     * @param {number|string} productId - ID del producto a agregar
     * @returns {Promise<object>} - Respuesta del servidor
     */
    addToFavorites: async (productId) => {
        try {
            // Obtenemos el token del localStorage
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No hay sesión activa");

            const response = await apiClient.post(
                "/api/favorites",
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al agregar a favoritos:", error);
            throw error;
        }
    },

    /**
     * Elimina un producto de favoritos
     * @param {number|string} productId - ID del producto a eliminar
     * @returns {Promise<object>} - Respuesta del servidor
     */
    removeFromFavorites: async (productId) => {
        try {
            // Obtenemos el token del localStorage
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No hay sesión activa");

            const response = await apiClient.delete(
                `/api/favorites/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al eliminar de favoritos:", error);
            throw error;
        }
    },

    /**
     * Obtiene todos los productos favoritos del usuario
     * @returns {Promise<Array>} - Lista de productos favoritos
     */
    getUserFavorites: async () => {
        try {
            // Obtenemos el token del localStorage
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No hay sesión activa");

            const response = await apiClient.get(
                "/api/favorites",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
            throw error;
        }
    },
};

export default favoritesService;