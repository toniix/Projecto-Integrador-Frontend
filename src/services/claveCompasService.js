// src/services/claveCompasService.js
import axios from "axios";

// Configuración de la instancia axios con la URL base del backend
const api = axios.create({
  baseURL: "https://clavecompas-production.up.railway.app/clavecompas",
});

// Ejemplo: Listar productos paginados
export const getPaginatedProducts = (page = 1, pageSize = 10) => {
  return api.get(`/productos?page=${page}&pageSize=${pageSize}`);
};

// Ejemplo: Registrar un nuevo producto
export const registerProduct = (productData) => {
  return api.post("/productos", productData);
};

// Ejemplo: Eliminar un producto por ID
export const deleteProduct = (id) => {
  return api.delete(`/productos/${id}`);
};

// Ejemplo: Obtener detalle de un producto
export const getProductDetail = (id) => {
  return api.get(`/productos/${id}`);
};

// Ejemplo: Listar categorías
export const getCategories = () => {
  return api.get("/categorias");
};
