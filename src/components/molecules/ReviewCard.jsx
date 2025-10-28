import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StarRating from "./StarRating";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";

const ReviewCard = ({ review, onHelpfulUpdate }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkHelpful = async () => {
    try {
      setIsMarking(true);
      const updated = await reviewService.markHelpful(review.Id);
      setHelpfulCount(updated.helpfulCount);
      if (onHelpfulUpdate) {
        onHelpfulUpdate(updated);
      }
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to mark review as helpful");
      console.error("Error marking review helpful:", error);
    } finally {
      setIsMarking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-800">{review.customerName}</p>
              {review.verifiedPurchase && (
                <Badge variant="success" className="text-xs">
                  <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                  Verified Purchase
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
      <p className="text-gray-600 mb-4 leading-relaxed">{review.comment}</p>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkHelpful}
          disabled={isMarking}
          className="text-gray-600 hover:text-primary"
        >
          <ApperIcon name="ThumbsUp" className="w-4 h-4 mr-1" />
          Helpful ({helpfulCount})
        </Button>
      </div>
    </div>
  );
};

export default ReviewCard;