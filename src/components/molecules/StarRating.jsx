import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = "md",
  interactive = false,
  onChange = null,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  const handleClick = (value) => {
    if (!interactive) return;
    setSelectedRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = interactive ? (hoverRating || selectedRating) : rating;

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={cn(
              sizeClasses[size],
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default"
            )}
          >
            <ApperIcon
              name="Star"
              className={cn(
                "w-full h-full transition-colors",
                isFilled ? "text-yellow-400 fill-current" : "text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;