// src/pages/Home.jsx
import React, { useEffect, useState } from "react";

const allProducts = [
  {
    id: 1,
    nombre: "producto 1",
    descripcion: "es el producto 1",
    imagen: "/img/guitarra-electrica-1.jpg",
  },
  {
    id: 2,
    nombre: "producto 2",
    descripcion: "es el producto 2",
    imagen: "/img/guitarra-electrica-2.jpg",
  },
  {
    id: 3,
    nombre: "producto 3",
    descripcion: "es el producto 3",
    imagen: "/img/violin-cervini-1.jpg",
  },
  {
    id: 4,
    nombre: "producto 4",
    descripcion: "es el producto 4",
    imagen: "/img/violin-cervini-2.jpg",
  },
  {
    id: 5,
    nombre: "producto 5",
    descripcion: "es el producto 5",
    imagen: "/img/set-bateria1.jpg",
  },
  {
    id: 6,
    nombre: "producto 6",
    descripcion: "es el producto 6",
    imagen: "/img/set-bateria2.jpg",
  },
  {
    id: 7,
    nombre: "producto 7",
    descripcion: "es el producto 7",
    imagen: "/img/saxo1.jpg",
  },
  {
    id: 8,
    nombre: "producto 8",
    descripcion: "es el producto 8",
    imagen: "/img/saxo2.jpg",
  },
  {
    id: 9,
    nombre: "producto 9",
    descripcion: "es el producto 9",
    imagen: "/img/acordeon1.jpg",
  },
  {
    id: 10,
    nombre: "producto 10",
    descripcion: "es el producto 10",
    imagen: "/img/acordeon2.jpg",
  },
  {
    id: 11,
    nombre: "producto 11",
    descripcion: "es el producto 11",
    imagen: "/img/guitarra-clasica1.jpg",
  },
  {
    id: 12,
    nombre: "producto 12",
    descripcion: "es el producto 12",
    imagen: "/img/guitarra-clasica2.jpg",
  },
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Home() {
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    // Mezclamos el array y tomamos 10 productos
    const shuffled = shuffleArray([...allProducts]);
    setRandomProducts(shuffled.slice(0, 10));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    console.log("Buscar:", query);
    // Aquí podrías implementar la lógica de búsqueda real
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
            <button type="submit" className="search-btn">
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="categories-section">
        <h2>Categorías</h2>
        <div className="categories-container">
          <button className="category-btn">Cuerdas</button>
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
        <h2>Productos Recomendados</h2>
        <div className="random-products-grid">
          {randomProducts.map((prod) => (
            <div className="product-card" key={prod.id}>
              <img src={prod.imagen} alt={prod.nombre} />
              <h3>{prod.nombre}</h3>
              <p>{prod.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Botón para volver arriba */}
      <button
        className="btn-subir"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Volver arriba
      </button>
    </main>
  );
}

export default Home;
