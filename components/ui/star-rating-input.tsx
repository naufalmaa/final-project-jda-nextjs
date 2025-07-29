// File: components/ui/star-rating-input.tsx

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's cn utility

interface StarRatingInputProps {
  value: number; // Current rating (1-5)
  onChange: (rating: number) => void;
  maxStars?: number; // Total number of stars, default 5
  className?: string;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  maxStars = 5,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn("flex space-x-0.5", className)}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={cn(
              "cursor-pointer text-3xl transition-colors duration-100",
              displayValue >= starValue ? "text-yellow-500" : "text-gray-300"
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};