import axios from 'axios';

const API_URL = 'http://localhost:8080/api/instruments'; // Reemplazar segun backend

const instrumentService = {
  createInstrument: async (instrumentData) => {
    try {
      const response = await axios.post(API_URL, instrumentData);
      return response.data;
    } catch (error) {
      alert('Error al registrar el instrumento');
      throw new Error('Error al registar el instrumento', error);
    }
  },
  
};

export default instrumentService;