import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import axios from 'axios';
import { useAuth } from '../../context/auth/AuthContext';
import { successToast, errorToast } from '../../utils/toastNotifications';

const ReviewForm = ({ productId, onReviewSubmitted, hasCompletedReservation }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const { user, token } = useAuth();
  const REV_URL = 'http://localhost:8080/clavecompas/reviews';

  useEffect(() => {
    // Solo verificar si existe una reseña previa, no verificar elegibilidad
    const checkExistingReview = async () => {
      
      try {
        console.log(`Checking for existing review: User ${user.id}, Product ${productId}`);
        
        // Check if user already has a review for this product
        const reviewResponse = await axios.get(
          `${REV_URL}/user/${user.id}/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        
        if (reviewResponse.data.response) {
          console.log('Existing review found:', reviewResponse.data.response);
          setExistingReview(reviewResponse.data.response);
          setRating(reviewResponse.data.response.rating);
          setComment(reviewResponse.data.response.comment || '');
        } else {
          console.log('No existing review found');
          setExistingReview(null);
        }
      } catch (err) {
        // If 404, it means no review exists yet, which is fine
        if (err.response && err.response.status === 404) {
          console.log('No review exists (404 response)');
          setExistingReview(null);
        } else {
          console.error('Error checking existing review:', err);
          errorToast('Error al verificar si ya tienes una reseña');
        }
      }
    };
    
    checkExistingReview();
  }, [productId, onReviewSubmitted]);

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
      
      // Log para depuración
      console.log('Submitting review:', { 
        isUpdate: !!existingReview, 
        reviewData 
      });
      
      // If we have an existing review, update it
      if (existingReview) {
        reviewData.idReview = existingReview.idReview;
        await axios.put(
          `${REV_URL}`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        successToast('Reseña actualizada con éxito');
      } else {
        // Otherwise create a new review
        await axios.post(
          `${REV_URL}`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        successToast('Reseña enviada con éxito');
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
      const errorMessage = err.response?.data?.message || 'Error al enviar la reseña';
      setError(errorMessage);
      errorToast(errorMessage);
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

  if (!hasCompletedReservation) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">Para dejar una reseña, primero debes haber completado una reserva de este instrumento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg mb-6">
      <p className="text-2xl mb-4">
        {existingReview ? 'Actualizar tu reseña' : 'Deja tu reseña'}
      </p>
      
      <p className="text-gray-600 mb-4">
        {existingReview 
          ? 'Puedes modificar tu reseña anterior sobre este instrumento.' 
          : 'Ya que has utilizado este instrumento, nos encantaría conocer tu experiencia.'}
      </p>
      
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
          className="px-4 py-2 bg-[#7a0715]/90 text-[#ffffff] rounded-xl hover:bg-[#604152] shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
        >
          {loading ? 'Enviando...' : existingReview ? 'Actualizar reseña' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;