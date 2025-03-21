import axios from "axios";
//const API_LOCAL = import.meta.env.VITE_API_URL_LOCAL;
const API_URL = import.meta.env.VITE_API_URL;

const categoryService = {
  
  

  async getCategoryById(idUser,token) {
    
    try {
      const response = await axios.get(`${API_URL}/users/${idUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregamos el token Bearer
          },
        }
      );
      console.log("vemos si trae algo ",response);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener roles:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Create new Category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created instrument
   */
  async createCategory(categoryData,token) {
    try {
      const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: { 
            "Content-Type": "application/json" ,
             "Authorization":`Bearer ${token}`  
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error al crear el categoria:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Get all instruments with pagination
   * @param {number} page - Page number (0-based)
   * @param {number} pageSize - Items per page
   * @returns {Promise<Object>} Paginated instruments data
   */
  async getCategoryAll(page = 0, pageSize = 10, token) {
    try {
      // La API usa paginación base 0 (como es común en Spring Boot)
      const response = await axios.get(`${API_URL}/categories/admin`, {
        params: {
          page, // Enviamos directamente el valor (que ya debe estar en base 0)
          pageSize,
        },
        headers:{
            Authorization:`Bearer ${token}`,
        }
      });

      // console.log("Respuesta completa del backend:", response.data);

      // Asegurándonos de acceder correctamente a la estructura de la respuesta
      const data = response.data?.response || {};

      return {
        products: data.content || [],
        totalPages: data.totalPages || 1,
        currentPageIndex: data.number || 0, // Página actual en base 0
      };
    } catch (error) {
      console.error(
        "Error al listar las categorias:",
        error.response?.data || error.message
      );
      return { products: [], totalPages: 1, currentPageIndex: 0 };
    }
  },
   /**
   * Delete instrument
   * @param {number} id - Instrument ID
   * @returns {Promise<void>}
   */
   async deleteCategory(id, token) {
    try {
      await axios.delete(`${API_URL}/categories/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      });
      // Note: This function doesn't return a success message as commented out below
      // return { success: true, message: 'Instrumento eliminado correctamente' };
    } catch (error) {
      console.error(
        "Error al eliminar el instrumento:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default usersService;
