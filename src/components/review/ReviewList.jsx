import React, { useState, useEffect, useRef } from 'react';
import ReviewCard from './ReviewCard';
import axios from 'axios';
import { errorToast } from '../../utils/toastNotifications';

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageSize = 5;
  const cardsToShow = 5;

  const API_URL = import.meta.env.VITE_API_URL;
  const REV_URL = API_URL + '/reviews';
  
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${REV_URL}/product/${productId}`
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
      errorToast('No se pudieron cargar las reseñas');
      setLoading(false);
      console.error('Error fetching reviews:', err);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < reviews.length - cardsToShow) {
      setCurrentIndex(currentIndex + 1);
    } else if (hasMore && !loading) {
      loadMore();
    }
  };

  if (error) {
    return <div className="text-red-500 text-center my-4">{error}</div>;
  }

  const visibleReviews = reviews.slice(currentIndex, currentIndex + cardsToShow);
  const canGoNext = currentIndex < reviews.length - cardsToShow || hasMore;

  return (
    <div className="mt-6">
      <p className="text-2xl mb-4">Reseñas de Clientes</p>
      
      {reviews.length === 0 && !loading ? (
        <p className="text-gray-500 italic">Este producto aún no tiene reseñas.</p>
      ) : (
        <div className="relative">
          {currentIndex > 0 && (
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#3B0012] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#5a0a1f]"
              aria-label="Ver reseñas anteriores"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-hidden py-4 px-10"
          >
            {visibleReviews.map(review => (
              <ReviewCard key={review.idReview} review={review} />
            ))}
            
            {loading && visibleReviews.length < cardsToShow && (
              <div className="flex items-center justify-center w-64 mx-2">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B0012]"></div>
              </div>
            )}
          </div>
          
          {canGoNext && (
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#3B0012] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#5a0a1f]"
              aria-label="Ver más reseñas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
