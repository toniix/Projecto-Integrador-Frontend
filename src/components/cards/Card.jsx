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

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/clavecompas/reviews/stats/${product.idProduct}`);
        setReviewStats(response.data.response);
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewStats();
    }, [product.idProduct]);

  return (
    <div
      className="relative cursor-pointer bg-white shadow-2xl rounded-3xl flex flex-col h-full"
      onClick={() => onViewDetail(product.idProduct)}
    >
      {/* Botón de favorito */}
      <FavoriteButton productId={product.idProduct} />
      
      <img
        src={`/provisorio/${product.idProduct}.jpg`} 
        alt={product.name}
        className="w-full h-60 object-cover rounded-t-2xl"
        onError={(e) => {
          e.target.src = "/img/placeholder.jpg";
        }}
      />
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
  }).isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default Card;