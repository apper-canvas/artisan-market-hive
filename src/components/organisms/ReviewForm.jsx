import { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import StarRating from "@/components/molecules/StarRating";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";

const ReviewForm = ({ productId, customerEmail, orderId, verifiedPurchase, onReviewSubmitted, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    customerName: "",
    customerEmail: customerEmail || ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.comment || formData.comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters";
    }

    if (formData.comment.trim().length > 500) {
      newErrors.comment = "Review must be less than 500 characters";
    }

    if (!formData.customerName || formData.customerName.trim().length < 2) {
      newErrors.customerName = "Please enter your name";
    }

    if (!formData.customerEmail || !formData.customerEmail.includes("@")) {
      newErrors.customerEmail = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        productId: parseInt(productId),
        orderId: orderId || null,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        verifiedPurchase: verifiedPurchase || false
      };

      await reviewService.create(reviewData);
      
      toast.success("Review submitted successfully!");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Reset form
      setFormData({
        rating: 0,
        title: "",
        comment: "",
        customerName: "",
        customerEmail: customerEmail || ""
      });
      setErrors({});

    } catch (error) {
      toast.error(error.message || "Failed to submit review");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-lg">
      <h3 className="text-xl font-display font-bold text-gray-800">Write a Review</h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <StarRating
          rating={formData.rating}
          interactive={true}
          size="lg"
          onChange={(rating) => setFormData({ ...formData, rating })}
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-error">{errors.rating}</p>
        )}
      </div>

      {/* Name */}
      <Input
        label="Your Name *"
        type="text"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        error={errors.customerName}
        placeholder="Enter your name"
      />

      {/* Email */}
      <Input
        label="Your Email *"
        type="email"
        value={formData.customerEmail}
        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
        error={errors.customerEmail}
        placeholder="your.email@example.com"
      />

      {/* Title */}
      <Input
        label="Review Title *"
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder="Sum up your review in a few words"
        maxLength={100}
      />

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review * ({formData.comment.length}/500)
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={5}
          maxLength={500}
          placeholder="Share your thoughts about this product..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-error">{errors.comment}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;