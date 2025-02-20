import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const instrumentService = {
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/instrument_type`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

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
};

export default instrumentService;
