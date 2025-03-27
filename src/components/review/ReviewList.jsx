import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import axios from 'axios';

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/clavecompas/reviews/product/${productId}?page=${page}&size=${pageSize}&sortBy=reviewDate&sortDir=desc`
      );
      
      const { content, last } = response.data.response;
      
      if (page === 0) {
        setReviews(content);
      } else {
        setReviews(prevReviews => [...prevReviews, ...content]);
      }
      
      setHasMore(!last);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las reseñas');
      setLoading(false);
      console.error('Error fetching reviews:', err);
      console.log(err);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center my-4">{error}</div>;
  }

  return (
    <div className="mt-6">
      <p className="text-2xl mb-4">Reseñas de Clientes</p>
      
      {reviews.length === 0 && !loading ? (
        <p className="text-gray-500 italic">Este producto aún no tiene reseñas.</p>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.idReview} review={review} />
            ))}
          </div>
          
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Cargando...' : 'Cargar más reseñas'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsList;