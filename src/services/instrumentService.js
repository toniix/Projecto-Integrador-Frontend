import axios from 'axios';

<<<<<<< HEAD
//const API_LOCAL = import.meta.env.VITE_API_URL_LOCAL;

const API_URL = import.meta.env.VITE_API_URL;


const instrumentService = {
  async getCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error.response?.data || error.message);
=======
const API_URL = 'http://localhost:8080/api/v1';

const instrumentService = {
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/instrument_type`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
>>>>>>> 57da30bd5aa574ac5ed374f19f5bd975096a3544
      throw error;
    }
  },

<<<<<<< HEAD
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
=======
  createInstrument: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/instrumentos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      alert('Error al registrar el instrumento');
      throw new Error('Error al registrar el instrumento', error);
    }
  },
>>>>>>> 57da30bd5aa574ac5ed374f19f5bd975096a3544
};

export default instrumentService;
