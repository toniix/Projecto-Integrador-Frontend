import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../review/StarRating";
import axios from "axios";
import PropTypes from "prop-types";
import Button from "../common/Button";
import FavoriteButton from "../common/FavoriteButton";

const Card = ({ product, onViewDetail }) => {
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  
  const API_URL = import.meta.env.VITE_API_URL;

  // Función para obtener la URL de la imagen, considerando todas las posibles propiedades
  const getProductImageUrl = () => {
    // Para depuración - muestra todas las propiedades del objeto producto
    // console.log("Producto completo:", product);

    // Verificar todas las posibles propiedades donde podría estar la URL de la imagen
    if (product.mainImageUrl) return product.mainImageUrl;
    if (product.image) return product.image;
    if (product.productImage) return product.productImage;
    if (product.imageUrl) return product.imageUrl;
    if (product.imageUrls && product.imageUrls.length > 0) return product.imageUrls[0];
    if (product.images && product.images.length > 0) {
      if (typeof product.images[0] === 'string') return product.images[0];
      if (product.images[0].url) return product.images[0].url;
      if (product.images[0].imageUrl) return product.images[0].imageUrl;
    }
    
    // Fallback a imagen basada en ID
    return `/img/products/${product.idProduct}.jpg`;
  };


  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews/stats/${product.idProduct}`);
        setReviewStats(response.data.response);
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewStats();
  }, [product.idProduct, API_URL]);

  return (
    <div
      className="relative cursor-pointer bg-white shadow-2xl rounded-3xl flex flex-col h-full"
      onClick={() => onViewDetail(product.idProduct)}
    >
      {/* Botón de favorito */}
      <FavoriteButton productId={product.idProduct} />
      
      {/* DIV contenedor de la imagen */}
      <div className="w-full h-60 rounded-t-2xl overflow-hidden bg-gray-100">
        <img
          src={getProductImageUrl()}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // console.error("Error cargando imagen:", e.target.src);
            e.target.src = "/img/placeholder.jpg";
          }}
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl text-[#1E1E1E] mb-2">{product.name}</h3>
        {/* Este div empuja el contenido que sigue hacia abajo */}
        <div className="flex-1"></div>
        <div className="flex justify-between items-center mt-auto">
          <h2 className="text-2xl text-[#C78418]">{`$${product.price}`}</h2>
          <Button onClick={(e) => {
            e.stopPropagation(); // Evita que se propague al div padre
            onViewDetail(product.idProduct);
          }}>
            Ver
          </Button>
        </div>
        <div className="flex items-center mb-2">
          {!loading && (
            <>
              <StarRating rating={reviewStats.averageRating} size="sm" />
              <span className="text-sm text-gray-500 ml-1">
                ({reviewStats.totalReviews})
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  product: PropTypes.shape({
    idProduct: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    // Propiedades opcionales para las imágenes
    mainImageUrl: PropTypes.string,
    image: PropTypes.string,
    productImage: PropTypes.string,
    imageUrl: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        imageUrl: PropTypes.string
      }))
    ])
  }).isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default Card;