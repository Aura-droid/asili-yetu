"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  reviewsCount?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
}

export default function StarRating({ rating = 0, reviewsCount = 0, onRate, interactive = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const safeRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(safeRating);
  const fraction = safeRating - fullStars;

  const displayRating = interactive && hoverRating > 0 ? hoverRating : safeRating;

  return (
    <div className={`flex items-center gap-3 ${interactive ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center gap-1 drop-shadow-lg">
        {[1, 2, 3, 4, 5].map((idx) => {
          const isFilled = idx <= Math.floor(displayRating);
          const isPartial = idx === Math.floor(displayRating) + 1 && (displayRating % 1 !== 0);
          const partialWidth = isPartial ? `${(displayRating % 1) * 100}%` : '0%';

          return (
            <div 
              key={idx} 
              className="relative w-5 h-5 transition-transform active:scale-90"
              onMouseEnter={() => interactive && setHoverRating(idx)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRate && onRate(idx)}
            >
              {/* Background empty star */}
              <Star className={`absolute inset-0 w-full h-full ${interactive ? 'text-white/20 hover:text-white/40' : 'text-white/30'} transition-colors`} />
              
              {/* Foreground filled star */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ 
                  width: isFilled ? '100%' : partialWidth 
                }}
              >
                 <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        })}
      </div>
      
      {reviewsCount > 0 && !interactive && (
        <span className="text-white font-semibold text-sm drop-shadow-md">
          {safeRating.toFixed(1)} <span className="text-white/60 font-medium">({reviewsCount} reviews)</span>
        </span>
      )}
      {interactive && (
        <span className="text-white/60 font-black text-xs uppercase tracking-widest ml-2 animate-pulse">
          Rate this Safari
        </span>
      )}
    </div>
  );
}
