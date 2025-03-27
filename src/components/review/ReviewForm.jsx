import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import axios from 'axios';
// import { useAuth } from "../context/auth/AuthContext";
import { useAuth } from '../../context/auth/AuthContext';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    // Check if user can review this product (has completed a reservation)
    const checkReviewEligibility = async () => {
      if (!user || !token) return;
      
      try {
        // First check if user already has a review for this product
        const reviewResponse = await axios.get(
          `http://localhost:8080/clavecompas/reviews/user/${user.id}/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (reviewResponse.data.response) {
          setExistingReview(reviewResponse.data.response);
          setRating(reviewResponse.data.response.rating);
          setComment(reviewResponse.data.response.comment || '');
          setCanReview(true);
          return;
        }
        
        // If no existing review, check if user has completed reservations for this product
        // This endpoint would need to be implemented in your backend
        const response = await axios.get(
          `http://localhost:8080/clavecompas/reservations/user/completed?productId=${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setCanReview(response.data.response && response.data.response.length > 0);
      } catch (err) {
        // If 404, it means no review exists yet, which is fine
        if (err.response && err.response.status !== 404) {
          console.error('Error checking review eligibility:', err);
        }
      }
    };
    
    checkReviewEligibility();
  }, [productId, user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const reviewData = {
        idProduct: productId,
        rating,
        comment,
        reviewDate: new Date().toISOString()
      };
      
      // If we have an existing review, update it
      if (existingReview) {
        reviewData.idReview = existingReview.idReview;
        await axios.put(
          `${API_BASE_URL}/reviews`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Otherwise create a new review
        await axios.post(
          `${API_BASE_URL}/reviews`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Notify parent component that a review was submitted
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // If it's a new review, reset the form
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la reseña');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-blue-800">Inicia sesión para dejar una reseña</p>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">Solo los usuarios que han completado una reserva pueden dejar una reseña</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {existingReview ? 'Actualizar tu reseña' : 'Deja tu reseña'}
      </h3>
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Reseña {existingReview ? 'actualizada' : 'enviada'} con éxito
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tu calificación</label>
          <StarRating 
            rating={rating} 
            interactive={true} 
            onRatingChange={setRating} 
            size="lg" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Tu comentario (opcional)
          </label>
          <textarea
            id="comment"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300"
        >
          {loading ? 'Enviando...' : existingReview ? 'Actualizar reseña' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;