/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./ImageGalleryPreview.css";

/* eslint-disable react/prop-types */
const ImageGalleryPreview = ({ productId, imagenPrincipal, galeria }) => {
  const navigate = useNavigate();

  // Tomamos las primeras 4 imágenes para la grilla de vista previa
  const previewImages = galeria.slice(0, 4);

  const handleVerMas = () => {
    // Por ejemplo, navega a la ruta completa de galería
    navigate(`/product/${productId}/galeria`);
  };

  return (
    <div className="gallery-preview-container">
      {/* Mitad izquierda: Imagen principal */}
      <div className="main-image">
        <img src={imagenPrincipal} alt="Imagen principal" />
      </div>

      {/* Mitad derecha: Grilla de 2x2 para las 4 imágenes */}
      <div className="grid-images">
        {previewImages.map((img, index) => (
          <div key={index} className="grid-image">
            <img src={img} alt={`Imagen ${index + 1}`} />
            {index === previewImages.length - 1 && (
              <div className="ver-mas" onClick={handleVerMas}>
                Ver Más
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryPreview;
