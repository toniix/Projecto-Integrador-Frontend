// src/hooks/useSearch.js
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para la lógica de búsqueda
 * @param {Array} allItems - Lista completa de elementos
 * @param {Object} initialFilters - Filtros iniciales
 */
const useSearch = (allItems = [], initialFilters = {}) => {
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || '',
    category: initialFilters.category || null,
    dateRange: initialFilters.dateRange || null,
  });
  
  const [filteredItems, setFilteredItems] = useState([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  // Verificar si hay filtros activos
  useEffect(() => {
    const { keyword, category, dateRange } = filters;
    setHasActiveFilters(
      Boolean(keyword) || 
      Boolean(category) || 
      Boolean(dateRange && dateRange.startDate && dateRange.endDate)
    );
  }, [filters]);
  
  // Aplicar filtros localmente
  useEffect(() => {
    let results = [...allItems];
    
    // Filtrar por palabra clave
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(item => 
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.description && item.description.toLowerCase().includes(keyword))
      );
    }
    
    // Filtrar por categoría
    if (filters.category) {
      results = results.filter(item => item.idCategory === filters.category);
    }
    
    // Filtrar por rango de fechas (esto dependería de la estructura de tus datos)
    if (filters.dateRange && filters.dateRange.startDate && filters.dateRange.endDate) {
      // Implementa la lógica específica de filtrado por fechas según tu modelo de datos
      console.log("Aplicando filtro de fechas:", filters.dateRange);
    }
    
    setFilteredItems(results);
  }, [filters, allItems]);
  
  // Función para actualizar todos los filtros
  const updateFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  // Función para quitar un filtro específico
  const removeFilter = (filterName) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      switch (filterName) {
        case 'keyword':
          newFilters.keyword = '';
          break;
        case 'category':
          newFilters.category = null;
          break;
        case 'dateRange':
          newFilters.dateRange = null;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
  };
  
  // Función para resetear todos los filtros
  const resetFilters = () => {
    setFilters({
      keyword: '',
      category: null,
      dateRange: null
    });
  };
  
  return {
    filters,
    filteredItems,
    hasActiveFilters,
    updateFilters,
    removeFilter,
    resetFilters
  };
};

export default useSearch;