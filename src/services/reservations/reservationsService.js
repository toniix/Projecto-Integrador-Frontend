// src/services/reservations/reservationsService.js
import { apiClient } from "../api";

const reservationService = {
  /**
   * Obtiene las reservas del usuario autenticado
   * @returns {Promise<Object>} Respuesta con las reservas del usuario
   */
  async getUserReservations() {
    try {
      // Obtener token directamente del localStorage
      const token = localStorage.getItem('token');
      
      // Configurar explícitamente el encabezado Authorization para esta petición
      const response = await apiClient.get("/reservations/user", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener las reservas del usuario:", error);
      
      // Añadir información de depuración
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Estado HTTP:", error.response.status);
      }
      
      throw error;
    }
  },

  /**
   * Obtiene el detalle de una reserva específica
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} Respuesta con el detalle de la reserva
   */
  async getReservationDetails(reservationId) {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get(`/reservations/${reservationId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener los detalles de la reserva #${reservationId}:`, error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Estado HTTP:", error.response.status);
      }
      throw error;
    }
  },


};

export default reservationService;