/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FullGallery.css";

const FullGallery = () => {
  const { id } = useParams(); // id del producto
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    // Se obtiene el detalle del producto para acceder a su galería completa
    fetch(`https://clavecompas-production.up.railway.app/clavecompas/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProducto(data.response))
      .catch((error) => console.error("Error al obtener el producto:", error));
  }, [id]);

  if (!producto) return <div>Loading...</div>;

  return (
    <div className="full-gallery-container">
      <header className="gallery-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &#8592; Volver
        </button>
        <h1 className="gallery-title">{producto.name} - Galería</h1>
      </header>
      <div className="gallery-grid">
        {producto.imageUrls.map((imagen, index) => (
          <div key={index} className="gallery-item">
            <img src={imagen} alt={`Imagen ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullGallery;
