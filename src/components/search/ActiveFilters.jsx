import { X, Filter, Music, CalendarDays } from 'lucide-react';
import PropTypes from 'prop-types';

const ActiveFilters = ({ filters, categories, onRemoveFilter, onResetFilters }) => {
  const { keyword, category, dateRange } = filters;
  
  // Si no hay filtros activos, no mostramos nada
  if (!keyword && !category && (!dateRange || !dateRange.startDate || !dateRange.endDate)) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center text-[#3e0b05]">
        <Filter size={16} className="mr-1" /> Filtros:
      </span>
      
      {keyword && (
        <span className="flex items-center bg-white rounded-full px-3 py-1 text-sm border border-[#b08562]">
          <Music size={14} className="mr-1 text-[#730f06]" />
          {keyword}
          <button 
            onClick={() => onRemoveFilter('keyword')}
            className="ml-2 text-gray-400 hover:text-[#730f06]"
          >
            <X size={14} />
          </button>
        </span>
      )}
      
      {category && (
        <span className="flex items-center bg-white rounded-full px-3 py-1 text-sm border border-[#b08562]">
          {categories.find(c => c.id === category)?.name || 'Categoría'}
          <button 
            onClick={() => onRemoveFilter('category')}
            className="ml-2 text-gray-400 hover:text-[#730f06]"
          >
            <X size={14} />
          </button>
        </span>
      )}
      
      {dateRange && dateRange.startDate && dateRange.endDate && (
        <span className="flex items-center bg-white rounded-full px-3 py-1 text-sm border border-[#b08562]">
          <CalendarDays size={14} className="mr-1 text-[#730f06]" />
          {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
          <button 
            onClick={() => onRemoveFilter('dateRange')}
            className="ml-2 text-gray-400 hover:text-[#730f06]"
          >
            <X size={14} />
          </button>
        </span>
      )}
      
      <button
        onClick={onResetFilters}
        className="ml-auto text-sm text-[#730f06] hover:underline"
      >
        Limpiar filtros
      </button>
    </div>
  );
};

ActiveFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

export default ActiveFilters;