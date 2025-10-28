import { useState, useEffect } from "react";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ReviewCard from "@/components/molecules/ReviewCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ReviewList = ({ productId, reviews, loading }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterVerified, setFilterVerified] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedReviews, setSortedReviews] = useState([]);
  
  const reviewsPerPage = 5;

  useEffect(() => {
    let filtered = [...reviews];

    // Apply verified filter
    if (filterVerified) {
      filtered = filtered.filter(r => r.verifiedPurchase);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      default:
        break;
    }

    setSortedReviews(filtered);
    setCurrentPage(1);
  }, [reviews, sortBy, filterVerified]);

  if (loading) {
    return <Loading />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Empty
        icon="MessageSquare"
        title="No reviews yet"
        description="Be the first to review this product!"
      />
    );
  }

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = sortedReviews.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={(e) => setFilterVerified(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Verified purchases only</span>
          </label>
        </div>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest rating</option>
          <option value="lowest">Lowest rating</option>
          <option value="helpful">Most helpful</option>
        </Select>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {currentReviews.map((review) => (
          <ReviewCard 
            key={review.Id} 
            review={review}
            onHelpfulUpdate={(updated) => {
              // Update review in list after helpful mark
              const index = reviews.findIndex(r => r.Id === updated.Id);
              if (index !== -1) {
                reviews[index] = updated;
              }
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;