import React from 'react';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ReviewCard = ({ review }) => {
  const { rating, comment, reviewDate, userName } = review;
  
  // Format the date to show how long ago the review was posted
  const formattedDate = formatDistanceToNow(new Date(reviewDate), { 
    addSuffix: true,
    locale: es
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full w-64 mx-2">
      <div className="flex flex-col items-center mb-3">
        <div className="w-12 h-12 rounded-full bg-[#3B0012] flex items-center justify-center text-white font-bold mb-2">
          {userName?.charAt(0) || 'U'}
        </div>
        <p className="font-semibold text-center">{userName || 'Usuario'}</p>
        <p className="text-sm text-gray-500 text-center">{formattedDate}</p>
      </div>
      
      <div className="flex justify-center my-2">
        <StarRating rating={rating} size="sm" />
      </div>
      
      {comment && (
        <div className="mt-2 flex-grow overflow-y-auto">
          <p className="text-gray-700 text-center">{comment}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
