import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, totalStars = 5, size = 'md', interactive = false, onRatingChange }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  const sizeClass = sizes[size] || sizes.md;
  
  const handleClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <FaStar 
          key={`star-${i}`} 
          className={`text-[#C78418] ${sizeClass} ${interactive ? 'cursor-pointer' : ''}`} 
          onClick={() => handleClick(i)}
        />
      );
    }

    // Half star
    if (hasHalfStar && !interactive) {
      stars.push(
        <FaStarHalfAlt 
          key="half-star" 
          className={`text-[#C78418] ${sizeClass}`} 
        />
      );
    }

    // Empty stars
    const emptyStars = interactive 
      ? totalStars - fullStars 
      : totalStars - fullStars - (hasHalfStar ? 1 : 0);
    
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(
        <FaRegStar 
          key={`empty-star-${i}`} 
          className={`text-[#C78418] ${sizeClass} ${interactive ? 'cursor-pointer' : ''}`} 
          onClick={() => handleClick(fullStars + i)}
        />
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center">
      {renderStars()}
      {!interactive && (
        <span className="ml-2 text-gray-600">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;