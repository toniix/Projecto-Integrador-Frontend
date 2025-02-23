import axios from 'axios';

//const API_LOCAL = import.meta.env.VITE_API_URL_LOCAL;

const API_URL = import.meta.env.VITE_API_URL;


const instrumentService = {
  async getCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error.response?.data || error.message);
      throw error;
    }
  },

  async createInstrument(instrumentData) {
    try {
      const response = await axios.post(`${API_URL}/products`, instrumentData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el instrumento:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default instrumentService;
