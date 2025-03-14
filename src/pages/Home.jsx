// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../components/common/PaginationComponent";
import Button from "../components/common/Button";
import CardsContainer from "../components/containers/CardsContainer";
import { SearchBar, ActiveFilters } from "../components/search";
import useSearch from "../hooks/useSearch";
import { Music } from "lucide-react";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Home() {
  const [randomProducts, setRandomProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const categories = [
    { id: 1, name: "Cuerdas", img: "/img/cuerdas.jpg" },
    { id: 2, name: "Percusión", img: "/img/percusion.jpg" },
    { id: 3, name: "Viento", img: "/img/viento.jpg" },
    { id: 4, name: "Teclas", img: "/img/teclas.jpg" },
    { id: 5, name: "Electrónicas", img: "/img/electronica.jpg" },
  ];

  // Usar hook personalizado para la búsqueda
  const { 
    filters, 
    filteredItems,
    hasActiveFilters,
    updateFilters, 
    removeFilter, 
    resetFilters 
  } = useSearch(allProducts);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      // Convertir de UI (base 1) a API (base 0)
      const apiPage = page - 1;
      
      // Construimos la URL base
      let url = `${API_URL}/products?page=${apiPage}&pageSize=10`;
      
      // Añadimos parámetros de búsqueda si existen
      if (filters.keyword) {
        // En un entorno real, ajustar estos parámetros según la API
        url += `&keyword=${encodeURIComponent(filters.keyword)}`;
      }
      
      if (filters.category) {
        url += `&category=${filters.category}`;
      }
      
      if (filters.dateRange && filters.dateRange.startDate && filters.dateRange.endDate) {
        const startDateStr = filters.dateRange.startDate.toISOString().split('T')[0];
        const endDateStr = filters.dateRange.endDate.toISOString().split('T')[0];
        url += `&startDate=${startDateStr}&endDate=${endDateStr}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Respuesta de la API:", data);
      
      // Actualizar estados con los datos recibidos
      setAllProducts(data.response.content || []);
      setTotalPages(data.response.totalPages || 1);
      
      // Opcional: verificar si la página actual coincide con la que devuelve la API
      const apiReturnedPage = (data.response.number || 0) + 1; // Convertir de base 0 a base 1
      if (apiReturnedPage !== page && apiReturnedPage > 0) {
        setCurrentPage(apiReturnedPage);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos cuando cambia la página
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Recargar productos cuando cambian los filtros
  useEffect(() => {
    if (hasActiveFilters) {
      setCurrentPage(1); // Volver a la primera página al filtrar
      fetchProducts(1);
    }
  }, [filters, hasActiveFilters]);

  // Actualizar productos aleatorios cuando cambian los productos filtrados
  useEffect(() => {
    if (filteredItems.length > 0) {
      const shuffled = shuffleArray([...filteredItems]);
      setRandomProducts(shuffled.slice(0, 10));
    } else if (allProducts.length > 0) {
      const shuffled = shuffleArray([...allProducts]);
      setRandomProducts(shuffled.slice(0, 10));
    }
  }, [filteredItems, allProducts]);

  // Manejar la búsqueda desde el componente SearchBar
  const handleSearch = (searchData) => {
    updateFilters({
      keyword: searchData.keyword || '',
      category: searchData.category,
      dateRange: searchData.dateRange
    });
  };

  // Manejar clic en categorías
  const handleCategoryClick = (categoryId) => {
    updateFilters({ category: categoryId });
  };

  // Manejar reset de filtros
  const handleResetFilters = () => {
    resetFilters();
  };

  // Ver detalles de un producto
  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <main className="bg-[#ffffff] min-h-screen text-[#1e1e1e]">
      {/* Sección Hero */}
      <section className="hidden md:flex bg-[url('../img/homeview.png')] bg-cover bg-center p-10 text-white h-[600px] flex flex-col justify-end items-end">
        <p className="text-8xl text-[#ffffff] text-right mb-2">Tu ritmo,</p>
        <p className="text-8xl text-[#ffffff] text-right">nuestro sonido</p>        
      </section>

      {/* Sección de búsqueda - Insertada entre el hero y las categorías */}
      <section className="py-6 px-6 bg-[#F9F7F4] border-b border-[#b08562]">
        <SearchBar 
          onSearch={handleSearch} 
          categories={categories} 
          initialFilters={filters}
        />
        
        {/* Mostrar filtros activos */}
        <div className="max-w-5xl mx-auto mt-4">
          <ActiveFilters 
            filters={filters}
            categories={categories}
            onRemoveFilter={removeFilter}
            onResetFilters={resetFilters}
          />
        </div>
      </section>

      {/* Sección de Categorías - Mantener exactamente igual */}
      <section className="flex flex-wrap justify-center gap-4 p-6 bg-[#F9F7F4] outline outline-1 outline-[#b08562]">
        <button
          onClick={handleResetFilters}
          className={`px-6 py-3 rounded-lg w-48 h-16 text-lg ${
            filters.category === null ? "bg-[#b08562] text-white" : "text-[#b08562] hover:bg-[#c6bcb049]"
          }`}
          style={{ 
            backgroundImage: `url("/img/todos.png")`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: filters.category === null ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: 'filter 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.filter = 'grayscale(0%)'}
          onMouseOut={(e) => e.target.style.filter = filters.category === null ? 'grayscale(0%)' : 'grayscale(100%)'}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`text-[#ffffff] px-6 py-3 rounded-xl w-48 h-16 text-lg hover:bg-[#c6bcb049] ${
              filters.category === category.id ? "bg-[#b08562] text-white" : ""
            }`}
            style={{ 
              backgroundImage: `url(${category.img})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              filter: filters.category === category.id ? 'grayscale(0%)' : 'grayscale(100%)',
              transition: 'filter 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.filter = 'grayscale(0%)'}
            onMouseOut={(e) => e.target.style.filter = filters.category === category.id ? 'grayscale(0%)' : 'grayscale(100%)'}
          >
            {category.name}
          </button>
        ))}
      </section>
      
      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#730f06]"></div>
        </div>
      )}

      {/* Mostrar productos o mensaje si no hay resultados */}
      {filteredItems.length === 0 && hasActiveFilters && !loading ? (
        <div className="text-center py-10">
          <Music size={48} className="mx-auto text-[#b08562] mb-4" />
          <h3 className="text-xl font-semibold mb-2">No encontramos instrumentos que coincidan con tu búsqueda</h3>
          <p className="text-[#757575] mb-4">Intenta con otros términos o navega por nuestras categorías</p>
          <Button
            onClick={resetFilters}
            variant="primary"
          >
            Ver todos los instrumentos
          </Button>
        </div>
      ) : (
        <CardsContainer products={randomProducts} handleViewDetail={handleViewDetail} />
      )}
          
      {/* Paginación solo en la parte inferior */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Botón para volver arriba */}
      <div className="flex justify-center py-4">
        <button
          className="bg-[#730f06] text-[#d9c6b0] px-4 py-2 rounded-lg hover:bg-[#3e0b05]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Volver arriba
        </button>
      </div>
    </main>
  );
}

export default Home;