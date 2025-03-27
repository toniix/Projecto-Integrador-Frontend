import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../review/StarRating";
import axios from "axios";
import Button from "../common/Button";

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
      className="cursor-pointer h-6/6 bg-white shadow-2xl rounded-3xl"
      onClick={() => onViewDetail(product.idProduct)}
    >
      <img
        src={`/provisorio/${product.idProduct}.jpg`}        alt={product.name}
        className="w-full h-60 object-cover rounded-t-2xl"
      />
       <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl text-[#1E1E1E]">{product.name}</h3>
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-2xl text-[#C78418]">{`$${product.price}`}</h2>
          <Button onClick={() => onViewDetail(product.idProduct)}>Ver</Button>
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

export default Card;