import { useState, useEffect, useCallback } from 'react';
import searchService from '../services/searchService';

/**
 * Hook personalizado para la lógica de búsqueda con API
 * @param {Object} initialFilters - Filtros iniciales
 * @param {Object} initialPagination - Configuración inicial de paginación
 */
const useSearch = (initialFilters = {}, initialPagination = { page: 0, size: 8 }) => {
  // Estado para los filtros
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || '',
    categoryId: initialFilters.categoryId || null,
    startDate: initialFilters.startDate || null,
    endDate: initialFilters.endDate || null,
    minPrice: initialFilters.minPrice || null,
    maxPrice: initialFilters.maxPrice || null,
    quantity: initialFilters.quantity || 1,
  });
  
  // Estado para la paginación y ordenamiento
  const [pagination, setPagination] = useState({
    page: initialPagination.page || 0,
    size: initialPagination.size || 8,
    sortBy: initialPagination.sortBy || 'name',
    sortDirection: initialPagination.sortDirection || 'asc',
    totalPages: 0,
    totalElements: 0
  });
  
  // Estado para los resultados
  const [results, setResults] = useState({
    products: [],
    loading: false,
    error: null
  });
  
  // Estado para indicar si hay filtros activos
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  // Estado para sugerencias de autocompletado
  const [suggestions, setSuggestions] = useState([]);
  
  // Verificar si hay filtros activos
  useEffect(() => {
    const { keyword, categoryId, startDate, endDate, minPrice, maxPrice } = filters;
    setHasActiveFilters(
      Boolean(keyword) || 
      Boolean(categoryId) || 
      Boolean(startDate && endDate) ||
      Boolean(minPrice) ||
      Boolean(maxPrice)
    );
  }, [filters]);
  
  // Función para buscar productos
  const searchProducts = useCallback(async () => {
    try {
      setResults(prev => ({ ...prev, loading: true, error: null }));
      
      // Preparar parámetros de búsqueda combinando filtros y paginación
      const searchParams = {
        ...filters,
        page: pagination.page,
        size: pagination.size,
        sortBy: pagination.sortBy,
        sortDirection: pagination.sortDirection
      };
      
      // Formatear dateRange si existe
      if (filters.startDate && filters.endDate) {
        searchParams.startDate = filters.startDate;
        searchParams.endDate = filters.endDate;
      }
      
      // Llamar a la API
      const data = await searchService.searchProducts(searchParams);
      
      // Actualizar resultados y paginación
      setResults({
        products: data.content || [],
        loading: false,
        error: null
      });
      
      // Actualizar información de paginación
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0
      }));
      
    } catch (error) {
      setResults({
        products: [],
        loading: false,
        error: error.message || 'Error al buscar productos'
      });
    }
  }, [filters, pagination.page, pagination.size, pagination.sortBy, pagination.sortDirection]);
  
  // Buscar productos cuando cambian los filtros o paginación
  useEffect(() => {
    searchProducts();
  }, [searchProducts]);
  
  // Función para obtener sugerencias de autocompletado
  const getAutocompleteSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const data = await searchService.getAutocompleteSuggestions(query);
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      setSuggestions([]);
    }
  }, []);
  
  // Función para actualizar todos los filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reiniciar paginación al cambiar filtros
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);
  
  // Función para actualizar paginación
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);
  
  // Función para quitar un filtro específico
  const removeFilter = useCallback((filterName) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      switch (filterName) {
        case 'keyword':
          newFilters.keyword = '';
          break;
        case 'categoryId':
          newFilters.categoryId = null;
          break;
        case 'dateRange':
          newFilters.startDate = null;
          newFilters.endDate = null;
          break;
        case 'price':
          newFilters.minPrice = null;
          newFilters.maxPrice = null;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
    
    // Reiniciar paginación al quitar filtros
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);
  
  // Función para resetear todos los filtros
  const resetFilters = useCallback(() => {
    setFilters({
      keyword: '',
      categoryId: null,
      startDate: null,
      endDate: null,
      minPrice: null,
      maxPrice: null,
      quantity: 1
    });
    
    // Reiniciar paginación
    setPagination(prev => ({ 
      ...prev, 
      page: 0,
      sortBy: 'name',
      sortDirection: 'asc'
    }));
  }, []);
  
  return {
    // Estados
    filters,
    results,
    hasActiveFilters,
    suggestions,
    pagination,
    
    // Acciones
    searchProducts,
    updateFilters,
    updatePagination,
    removeFilter,
    resetFilters,
    getAutocompleteSuggestions
  };
};

export default useSearch;