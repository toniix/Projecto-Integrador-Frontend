import React from 'react';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ReviewCard = ({ review }) => {
  const { rating, comment, reviewDate, user } = review;
  
  // Format the date to show how long ago the review was posted
  const formattedDate = formatDistanceToNow(new Date(reviewDate), { 
    addSuffix: true,
    locale: es
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-semibold">{user?.name || 'Usuario'}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <StarRating rating={rating} size="sm" />
      </div>
      
      {comment && (
        <div className="mt-3">
          <p className="text-gray-700">{comment}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;