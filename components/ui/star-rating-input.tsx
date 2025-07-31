// File: components/ui/star-rating-input.tsx
import React from "react";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"; // Import both filled and outline

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
  className?: string;
  disabled?: boolean;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  maxStars = 5,
  className,
  disabled = false,
}) => {
  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starValue = index + 1;
    return (
      <button
        key={index}
        type="button"
        onClick={() => !disabled && onChange(starValue)}
        className={`focus:outline-none ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}`}
        disabled={disabled}
      >
        {/* Render filled star if current star value is less than or equal to the selected value */}
        {starValue <= value ? (
          <StarFilledIcon className="h-6 w-6 text-yellow-500 transition-colors duration-200" />
        ) : (
          <StarIcon className="h-6 w-6 text-gray-300 transition-colors duration-200" /> // Use gray outline for unselected
        )}
      </button>
    );
  });

  return <div className="flex items-center space-x-1">{stars}</div>;
};