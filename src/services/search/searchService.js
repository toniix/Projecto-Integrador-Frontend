import axios from 'axios';

// URL base para las APIs, ajustar según tu configuración
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Servicio para manejar las búsquedas de productos
 */
const searchService = {
  /**
   * Buscar productos según varios criterios
   * @param {Object} searchParams - Parámetros de búsqueda
   * @returns {Promise} Promesa con los resultados de la búsqueda
   */
  searchProducts: async (searchParams) => {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      // Añadir parámetros solo si están definidos
      if (searchParams.keyword) params.append('keyword', searchParams.keyword);
      if (searchParams.categoryId) params.append('categoryId', searchParams.categoryId);
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
      if (searchParams.startDate) params.append('startDate', formatDate(searchParams.startDate));
      if (searchParams.endDate) params.append('endDate', formatDate(searchParams.endDate));
      if (searchParams.quantity) params.append('quantity', searchParams.quantity);
      
      // Parámetros de paginación y ordenamiento
      params.append('sortBy', searchParams.sortBy || 'name');
      params.append('sortDirection', searchParams.sortDirection || 'asc');
      params.append('page', searchParams.page || 0);
      params.append('size', searchParams.size || 8);
      
      const response = await axios.get(`${API_BASE_URL}/search/products`, { params });
      return response.data.response;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },
  
  /**
   * Obtener sugerencias de autocompletado
   * @param {string} query - Texto de búsqueda para autocompletar
   * @returns {Promise} Promesa con las sugerencias
   */
  getAutocompleteSuggestions: async (query) => {
    try {
      if (!query || query.length < 2) return [];
      
      const params = new URLSearchParams();
      params.append('query', query);
      
      const response = await axios.get(`${API_BASE_URL}/search/autocomplete`, { params });
      return response.data.response;
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      return [];
    }
  }
};

/**
 * Formatea una fecha como YYYY-MM-DD para enviar a la API
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
  if (!date) return null;
  
  // Si ya es un string, verificar si ya tiene el formato correcto
  if (typeof date === 'string') {
    // Si ya tiene el formato YYYY-MM-DD, devolverlo
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    
    // Si no, convertirlo a Date
    date = new Date(date);
  }
  
  // Formatear como YYYY-MM-DD
  return date.toISOString().split('T')[0];
}

export default searchService;