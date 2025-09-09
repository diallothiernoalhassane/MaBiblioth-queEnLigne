import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  totalRatings?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showCount = false,
  totalRatings = 0,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      // Si on clique sur la même étoile que la note actuelle, on la supprime
      const newRating = rating === starRating ? 0 : starRating;
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = readonly ? rating : (hoverRating || rating);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className="flex items-center space-x-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStarClick(star);
            }}
            onMouseEnter={() => handleStarHover(star)}
            whileHover={readonly ? {} : { scale: 1.1 }}
            whileTap={readonly ? {} : { scale: 0.95 }}
            disabled={readonly}
          >
            <Star
              className={`${sizeClasses[size]} transition-all duration-200 ${
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-500'
                  : star <= (hoverRating || 0)
                  ? 'fill-yellow-300 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              } ${!readonly && star <= (hoverRating || 0) ? 'drop-shadow-md' : ''}`}
            />
          </motion.button>
        ))}
      </div>
      
      {showCount && totalRatings > 0 && (
        <span className="text-sm text-gray-500 ml-2">
          ({totalRatings} avis)
        </span>
      )}
      
      {!readonly && (
        <span className="text-xs text-gray-400 ml-2">
          {hoverRating ? `${hoverRating}/5` : rating ? `${rating}/5` : 'Noter'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
