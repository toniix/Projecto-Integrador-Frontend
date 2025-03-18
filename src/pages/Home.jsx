import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaginationComponent from "../components/common/PaginationComponent";
import Button from "../components/common/Button";
import CardsContainer from "../components/containers/CardsContainer";
import { SearchBar, ActiveFilters } from "../components/search";
import { Music } from "lucide-react";
import searchService from "../services/search/searchService";
import instrumentService from "../services/instrumentService";


// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }


function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Estados para productos y control de UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para categorías - SIEMPRE inicializar como array vacío
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Obtener valores iniciales de la URL
  const initialFilters = {
    keyword: queryParams.get('keyword') || '',
    categoryId: queryParams.get('categoryId') ? parseInt(queryParams.get('categoryId')) : null,
    startDate: queryParams.get('startDate') ? new Date(queryParams.get('startDate')) : null,
    endDate: queryParams.get('endDate') ? new Date(queryParams.get('endDate')) : null,
  };

  // Estado para filtros y paginación
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: parseInt(queryParams.get('page') || '0'),
    size: 8,
    totalPages: 0,
    totalElements: 0
  });
  
  // Verificar si hay filtros activos
  const hasActiveFilters = Boolean(filters.keyword) || 
                          Boolean(filters.categoryId) || 
                          Boolean(filters.startDate && filters.endDate);

  // Categorías predefinidas para fallback
  const defaultCategories = [
    { id: 1, name: "Cuerdas", img: "/img/cuerdas.jpg" },
    { id: 2, name: "Percusión", img: "/img/percusion.jpg" },
    { id: 3, name: "Viento", img: "/img/viento.jpg" },
    { id: 4, name: "Teclas", img: "/img/teclas.jpg" },
    { id: 5, name: "Electrónicas", img: "/img/electronica.jpg" },
  ];

  // Cargar categorías desde la API
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const data = await instrumentService.getCategories();
      
      // Verificar que la respuesta sea un array
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.response)) {
        // Si la respuesta tiene estructura { response: [...] }
        setCategories(data.response);
      } else {
        console.warn("La respuesta de categorías no es un array, usando valores predeterminados");
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      // Categorías predefinidas como fallback
      setCategories(defaultCategories);
    } finally {
      setLoadingCategories(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para buscar productos utilizando el servicio
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si hay una categoría seleccionada, usar el endpoint específico
      if (filters.categoryId && !filters.keyword && !filters.startDate && !filters.endDate) {
        try {
          // Usar el servicio específico para buscar por categoría
          const data = await instrumentService.getProductsByCategory(filters.categoryId);
          
          // Verificar la estructura de la respuesta
          const productList = Array.isArray(data) ? data : 
                            (data && Array.isArray(data.response)) ? data.response : [];
          
          setProducts(productList);
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(productList.length / pagination.size) || 1,
            totalElements: productList.length
          }));
        } catch (err) {
          console.error("Error al buscar por categoría, usando búsqueda general:", err);
          // Si falla, intentar con la búsqueda general
          const searchParams = {
            categoryId: filters.categoryId,
            page: pagination.page,
            size: pagination.size
          };
          
          const data = await searchService.searchProducts(searchParams);
          setProducts(data.content || []);
          setPagination(prev => ({
            ...prev,
            totalPages: data.totalPages || 0,
            totalElements: data.totalElements || 0
          }));
        }
      } else {
        // Usar el servicio de búsqueda general
        const searchParams = {
          keyword: filters.keyword,
          categoryId: filters.categoryId,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: pagination.page,
          size: pagination.size,
          sortBy: 'name',
          sortDirection: 'asc'
        };
        
        const data = await searchService.searchProducts(searchParams);
        
        setProducts(data.content || []);
        setPagination(prev => ({
          ...prev,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0
        }));
      }
    } catch (err) {
      console.error("Error al buscar productos:", err);
      setError("No pudimos cargar los productos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.size]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Actualizar productos cuando cambian los filtros o paginación
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Actualizar URL con los parámetros de búsqueda
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.startDate) params.set('startDate', filters.startDate.toISOString().split('T')[0]);
    if (filters.endDate) params.set('endDate', filters.endDate.toISOString().split('T')[0]);
    if (pagination.page > 0) params.set('page', pagination.page);
    
    // Actualizar URL sin recargar la página
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
    
  }, [filters, pagination.page, navigate, location.pathname]);

  // Manejar la búsqueda desde el componente SearchBar
  const handleSearch = (searchData) => {
    // Resetear paginación al hacer una nueva búsqueda
    setPagination(prev => ({ ...prev, page: 0 }));
    
    // Actualizar filtros
    setFilters({
      keyword: searchData.keyword || '',
      categoryId: searchData.category || null,
      startDate: searchData.dateRange?.startDate || null,
      endDate: searchData.dateRange?.endDate || null
    });
  };

  // Manejar clic en categorías
  const handleCategoryClick = (categoryId) => {
    setPagination(prev => ({ ...prev, page: 0 }));
    setFilters(prev => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? null : categoryId
    }));
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    // Convertir de base 1 (UI) a base 0 (API)
    setPagination(prev => ({ ...prev, page: newPage - 1 })); 
    // Hacer scroll hacia arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Quitar un filtro específico
  const handleRemoveFilter = (filterName) => {
    setPagination(prev => ({ ...prev, page: 0 }));
    
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterName) {
        case 'keyword':
          newFilters.keyword = '';
          break;
        case 'category':
          newFilters.categoryId = null;
          break;
        case 'dateRange':
          newFilters.startDate = null;
          newFilters.endDate = null;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
  };

  // Resetear todos los filtros
  const handleResetFilters = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    
    setFilters({
      keyword: '',
      categoryId: null,
      startDate: null,
      endDate: null
    });
  };

  // Ver detalles de un producto
  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Adaptar filtros para el componente ActiveFilters
  const activeFiltersForComponent = {
    keyword: filters.keyword,
    category: filters.categoryId,
    dateRange: filters.startDate && filters.endDate ? { 
      startDate: filters.startDate, 
      endDate: filters.endDate 
    } : null
  };

  return (
    <main className="bg-[#ffffff] min-h-screen text-[#1e1e1e]">
      {/* Sección Hero - SIEMPRE visible según criterio de aceptación #22 */}
      <section className="hidden md:flex bg-[url('../img/homeview.png')] bg-cover bg-center p-10 text-white h-[600px] flex flex-col justify-end items-end">
        <p className="text-8xl text-[#ffffff] text-right mb-2">Tu ritmo,</p>
        <p className="text-8xl text-[#ffffff] text-right">nuestro sonido</p>        
      </section>

      {/* Sección de búsqueda */}
      <section className="py-6 px-6 bg-[#F9F7F4] border-b border-[#b08562]">
        <SearchBar 
          onSearch={handleSearch} 
          categories={Array.isArray(categories) ? categories : []} 
          initialFilters={activeFiltersForComponent}
        />
        
        {/* Mostrar filtros activos */}
        <div className="max-w-5xl mx-auto mt-4">
          <ActiveFilters 
            filters={activeFiltersForComponent}
            categories={Array.isArray(categories) ? categories : []} 
            onRemoveFilter={handleRemoveFilter}
            onResetFilters={handleResetFilters}
          />
        </div>
      </section>

      {/* Sección de Categorías - SIEMPRE visible según criterio de aceptación #22 */}
      {Array.isArray(categories) && categories.length > 0 && (
        <section className="flex flex-wrap justify-center gap-4 p-6 bg-[#F9F7F4] outline outline-1 outline-[#b08562]">
          <button
            onClick={handleResetFilters}
            className={`px-6 py-3 rounded-lg w-48 h-16 text-lg ${
              filters.categoryId === null ? "bg-[#b08562] text-white" : "text-[#b08562] hover:bg-[#c6bcb049]"
            }`}
            style={{ 
              backgroundImage: `url("/img/todos.png")`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              filter: filters.categoryId === null ? 'grayscale(0%)' : 'grayscale(100%)',
              transition: 'filter 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.filter = 'grayscale(0%)'}
            onMouseOut={(e) => e.target.style.filter = filters.categoryId === null ? 'grayscale(0%)' : 'grayscale(100%)'}
          >
            Todos
          </button>
          
          {/* Verificación adicional antes de mapear categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`text-[#ffffff] px-6 py-3 rounded-xl w-48 h-16 text-lg hover:bg-[#c6bcb049] ${
                filters.categoryId === category.id ? "bg-[#b08562] text-white" : ""
              }`}
              style={{ 
                backgroundImage: `url(${category.img || `/img/category-${category.id}.jpg`})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                filter: filters.categoryId === category.id ? 'grayscale(0%)' : 'grayscale(100%)',
                transition: 'filter 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.filter = 'grayscale(0%)'}
              onMouseOut={(e) => e.target.style.filter = filters.categoryId === category.id ? 'grayscale(0%)' : 'grayscale(100%)'}
            >
              {category.name}
            </button>
          ))}
        </section>
      )}
      
      {/* Título de resultados - Visible cuando hay búsqueda activa */}
      {/* La sección de título de resultados se mueve al bloque de productos */}
      
      {/* Indicador de carga */}
      {(loading || loadingCategories) && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#730f06]"></div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && !loading && (
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={fetchProducts}
            variant="primary"
          >
            Intentar nuevamente
          </Button>
        </div>
      )}

      {/* Mostrar productos o mensaje si no hay resultados */}
      {!loading && !loadingCategories && !error && (
        <>
          {products.length === 0 && hasActiveFilters ? (
            <div className="text-center py-10">
              <Music size={48} className="mx-auto text-[#b08562] mb-4" />
              <h3 className="text-xl font-semibold mb-2">No encontramos instrumentos que coincidan con tu búsqueda</h3>
              <p className="text-[#757575] mb-4">Intenta con otros términos o navega por nuestras categorías</p>
              <Button
                onClick={handleResetFilters}
                variant="primary"
              >
                Ver todos los instrumentos
              </Button>
            </div>
          ) : (
            <div>
              <div className="max-w-7xl mx-auto pt-8 px-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-[#3e0b05]">
                    {loading ? 'Buscando...' : 
                      hasActiveFilters ? 
                        (filters.categoryId && !filters.keyword ? 
                          `Categoría: ${Array.isArray(categories) ? 
                            (categories.find(c => c.id === filters.categoryId)?.name || 'Seleccionada') : 
                            'Seleccionada'}` :
                          `Resultados ${filters.keyword ? `para "${filters.keyword}"` : ''}`) : 
                        'Instrumentos destacados'}
                  </h2>
                  
                  {hasActiveFilters && !loading && pagination && (
                    <div className="text-sm text-[#757575]">
                      <span>{pagination.totalElements} productos encontrados</span>
                    </div>
                  )}
                </div>
              </div>
              <CardsContainer 
                products={products} 
                handleViewDetail={handleViewDetail} 
              />
            </div>
          )}
        </>
      )}
          
      {/* Paginación solo si hay más de una página */}
      {!loading && !loadingCategories && pagination.totalPages > 1 && (
        <div className="flex justify-center my-8">
          <PaginationComponent
            currentPage={pagination.page + 1} // Convertir de base 0 (API) a base 1 (UI)
            totalPages={pagination.totalPages}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}

      {/* Botón para volver arriba */}
      <div className="flex justify-center py-6">
        <button
          className="bg-[#730f06] text-[#d9c6b0] px-4 py-2 rounded-lg hover:bg-[#3e0b05] transition-colors duration-300 shadow-md"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Volver arriba
        </button>
      </div>
    </main>
  );
}

export default Home;