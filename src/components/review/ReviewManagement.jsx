import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../context/auth/AuthContext";
import StarRating from './StarRating';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useAuth();
  const pageSize = 10;

  useEffect(() => {
    fetchReviews();
  }, [page, token]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/clavecompas/admin/reviews?page=${page}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setReviews(response.data.response.content);
      setTotalPages(response.data.response.totalPages);
    } catch (err) {
      setError('Error al cargar las reseñas');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      return;
    }
    
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh the list
      fetchReviews();
    } catch (err) {
      alert('Error al eliminar la reseña');
      console.error('Error deleting review:', err);
    }
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-8">Cargando reseñas...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Reseñas</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Usuario</th>
              <th className="py-3 px-6 text-left">Producto</th>
              <th className="py-3 px-6 text-center">Calificación</th>
              <th className="py-3 px-6 text-left">Comentario</th>
              <th className="py-3 px-6 text-center">Fecha</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {reviews.map(review => (
              <tr key={review.idReview} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">{review.idReview}</td>
                <td className="py-3 px-6">{review.user?.name || 'Usuario ' + review.idUser}</td>
                <td className="py-3 px-6">{review.product?.name || 'Producto ' + review.idProduct}</td>
                <td className="py-3 px-6 text-center">
                  <StarRating rating={review.rating} size="sm" />
                </td>
                <td className="py-3 px-6 truncate max-w-xs">{review.comment || '-'}</td>
                <td className="py-3 px-6 text-center">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <button 
                    onClick={() => handleDeleteReview(review.idReview)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button 
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-md mr-2 bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Anterior
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages).keys()].map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    pageNum === page 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 rounded-md ml-2 bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;