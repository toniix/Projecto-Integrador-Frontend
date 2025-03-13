// src/components/search/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, RefreshCw } from 'lucide-react';
import DateRangePicker from '../common/DateRangePicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchBar = ({ onSearch, categories, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyword, setKeyword] = useState(initialFilters.keyword || '');
  const [startDate, setStartDate] = useState(initialFilters.startDate || null);
  const [endDate, setEndDate] = useState(initialFilters.endDate || null);
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Ejemplo de datos para autocompletado
  const popularSearches = [
    'Guitarra eléctrica',
    'Piano de cola',
    'Batería acústica',
    'Violín profesional',
    'Saxofón alto',
    'Sintetizador',
    'Bajo eléctrico',
    'Amplificador',
  ];

  // Detectar clics fuera de las sugerencias y dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
        searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }

      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar sugerencias
  useEffect(() => {
    if (keyword.length > 1) {
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(keyword.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      keyword,
      dateRange: startDate && endDate ? { startDate, endDate } : null,
      category: selectedCategory
    });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    setShowSuggestions(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleClear = () => {
    setKeyword('');
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory(null);
  };

  // Resetear todo el buscador a su estado original
  const handleReset = () => {
    handleClear();
    setIsExpanded(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className={`transition-all duration-300 ease-in-out bg-white rounded-full shadow-lg border border-[#b08562] 
                    ${isExpanded ? 'py-6 rounded-2xl' : 'py-3'}`}
      >
        <form onSubmit={handleSubmit}>
          <div className={`flex items-start px-6 ${isExpanded ? 'flex-col space-y-4 md:flex-row md:space-y-0 md:items-center' : 'flex-row items-center'}`}>
            {/* Campo de búsqueda */}
            <div className={`relative flex-1 ${isExpanded ? 'w-full md:w-auto' : ''}`} ref={searchRef}>
              <div className="flex items-center h-10">
                <Search size={20} className="text-[#730f06] absolute left-3" />
                <input
                  type="text"
                  placeholder="¿Qué instrumento estás buscando?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  className="w-full h-full pl-10 pr-4 py-2 rounded-full bg-transparent focus:outline-none border border-transparent focus:border-[#b08562]"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => setKeyword('')}
                    className="absolute right-3 text-gray-400 hover:text-[#730f06]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sugerencias */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-[#F9F7F4] cursor-pointer flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Separador */}
            {isExpanded && <div className="hidden md:block h-10 w-px bg-gray-300 mx-4"></div>}

            {/* Selector de categoría */}
            {isExpanded && (
              <div className="relative md:w-40" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center justify-between h-10 w-full md:w-40 px-4 rounded-lg border border-gray-300 focus:outline-none hover:border-[#b08562] transition-colors"
                >
                  <span className="truncate">
                    {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Categoría'}
                  </span>
                  <ChevronDown size={16} className="ml-2" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div
                      className="px-4 py-2 hover:bg-[#F9F7F4] cursor-pointer"
                      onClick={() => handleCategorySelect(null)}
                    >
                      Todas las categorías
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="px-4 py-2 hover:bg-[#F9F7F4] cursor-pointer"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Separador */}
            {isExpanded && <div className="hidden md:block h-10 w-px bg-gray-300 mx-4"></div>}

            {/* Selector de fechas y botones en la misma fila y alineados */}
            {isExpanded ? (
              <div className="flex w-full md:w-auto flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:items-center">
                <div className="w-full md:w-auto">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    placeholder="Selecciona fechas"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center h-10 px-4 py-0 text-[#730f06] bg-white border border-[#730f06] rounded-full hover:bg-[#F9F7F4] transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    <span>Limpiar</span>
                  </button>
                  <button
      type="button"
      onClick={handleReset}
      className="flex items-center justify-center bg-white border border-[#730f06] rounded-full hover:bg-gray-300 transition"
      title="Resetear búsqueda"
      aria-label="Resetear búsqueda"
    >
      <RefreshCw size={16} className="text-[#730f06]" strokeWidth={2} />
    </button>

                  <button
                    type="submit"
                    className="flex items-center justify-center h-10 px-4 py-0 bg-gradient-to-r from-[#730f06] to-[#3e0b05] text-white rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Search size={16} className="mr-2" />
                    <span>Buscar</span>
                  </button>
                </div>
              </div>
            ) : (
              // Botón de búsqueda cuando está colapsado
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#730f06] to-[#3e0b05] text-white rounded-full hover:opacity-90 transition-opacity ml-2"
              >
                <Search size={18} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;