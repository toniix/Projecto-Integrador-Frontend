import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../context/auth/AuthContext";
import ReviewCard from './ReviewCard';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL;
  const REV_URL = API_URL + '/reviews';

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${REV_URL}/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setReviews(response.data.response.content || []);
      } catch (err) {
        setError('Error al cargar tus reseñas');
        console.error('Error fetching user reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserReviews();
  }, [user, token]);
  
  if (loading) {
    return <div className="text-center py-4">Cargando tus reseñas...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Aún no has realizado ninguna reseña.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Tus reseñas</h3>
      {reviews.map(review => (
        <div key={review.idReview} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{review.product.name}</h4>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteReview(review.idReview)}
            >
              Eliminar
            </button>
          </div>
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
};

export default UserReviews;