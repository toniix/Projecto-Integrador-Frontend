import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import CardsContainer from "../components/containers/CardsContainer";
import instrumentService from "../services/instrumentService";
import "../styles/CategoriesFilterPage.css";

const CategoriesFilterPage = () => {
  // Estado para las categorías y productos
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Estado para controlar las categorías seleccionadas (filtros)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Estado para el recuento de productos filtrados
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();

  // Cargar categorías y productos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtenemos categorías desde el servicio de instrumentos
        const categoriesData = await instrumentService.getCategories();
        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.response || []
        );

        // Para la simulación, obtendremos todos los productos
        const productsData = await instrumentService.getInstrumenAll(0, 1000);
        setProducts(productsData.products || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  // Función para aplicar los filtros por categorías
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        selectedCategories.includes(product.idCategory)
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategories, products]);

  // Función para manejar el cambio en la selección de categorías
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <main className="min-h-screen bg-[#F9F7F4] p-6">
      {/* Encabezado */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-[#730f06] text-center">
          Explora por Categorías
        </h1>
        <p className="text-center text-sm text-[#757575] mt-2">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Volver a Home
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Panel lateral de filtros */}
        <aside className="md:w-1/4 p-4 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#3e0b05] mb-4">
            Filtrar Categorías
          </h2>
          {categories.map((category) => (
            <div key={category.idCategory} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`cat-${category.idCategory}`}
                checked={selectedCategories.includes(category.idCategory)}
                onChange={() => toggleCategory(category.idCategory)}
                className="mr-2"
              />
              <label
                htmlFor={`cat-${category.idCategory}`}
                className="text-[#3e0b05]"
              >
                {category.name}
              </label>
            </div>
          ))}
          <Button variant="secondary" onClick={clearFilters} className="mt-4">
            Limpiar Filtros
          </Button>
        </aside>

        {/* Área principal: Listado de productos */}
        <section className="md:w-3/4">
          <CardsContainer
            products={filteredProducts}
            handleViewDetail={(productId) => navigate(`/product/${productId}`)}
          />
        </section>
      </div>
    </main>
  );
};

export default CategoriesFilterPage;
