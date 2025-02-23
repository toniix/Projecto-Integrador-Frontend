// src/pages/Home.jsx
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Home() {
  const [randomProducts, setRandomProducts] = useState([]);
  const [allProducts,setAllProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Mezclamos el array y tomamos 10 productos
    fetch(`https://clavecompas-production.up.railway.app/clavecompas/products?page=0&pageSize=10`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data.response.content))
      .catch((error) =>
        console.error("Error al obtener productos:", error)
      );
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const shuffled = shuffleArray([...allProducts]);
      setRandomProducts(shuffled.slice(0, 10));
    }
  }, [allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    console.log("Buscar:", query);
    // Aquí podrías implementar la lógica de búsqueda real
  };

  const handleViewDetail = (productId) => {
    // Por ejemplo, navega a la ruta completa de galería
    navigate(`/product/${productId}`);
  };

  return (
    <main>
      {/* Sección Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a Clave &amp; Compas</h1>
          <p>Tu ritmo, nuestro sonido.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              className="search-input"
              placeholder="Buscar productos..."
            />
            <button type="submit" className="search-btn custom-button">
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="categories-section">
        {/* <h2>Categorías</h2> */}
        <div className="categories-container">
          <button className="category-btn">Cuerda</button>
          <button className="category-btn">Percusión</button>
          <button className="category-btn">Viento</button>
          <button className="category-btn">Audio Profesional</button>
          <button className="category-btn">Instrumentos Electrónicos</button>
          <button className="category-btn">Marca</button>
          <button className="category-btn">Ofertas</button>
        </div>
      </section>

      {/* Sección de Productos Recomendados */}
      <section className="random-products">
        <h2 className="popular-title">Productos Recomendados</h2>
        <div className="random-products-grid">
          {randomProducts.map((prod) => (
            <div className="product-card" key={prod.idProduct} onClick={()=>handleViewDetail(prod.idProduct)}>
              <img src={prod.imageUrls[0]} alt={prod.name}  />
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Botón para volver arriba */}
      <button
        className="btn-subir custom-button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Volver arriba
      </button>
    </main>
  );
}

export default Home;
