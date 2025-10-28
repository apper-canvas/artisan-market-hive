import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { productService } from "@/services/api/productService";
import { reviewService } from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Shop from "@/components/pages/Shop";
import Home from "@/components/pages/Home";
import ReviewList from "@/components/organisms/ReviewList";
import ReviewForm from "@/components/organisms/ReviewForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProductCard from "@/components/molecules/ProductCard";
import QuantitySelector from "@/components/molecules/QuantitySelector";
import { formatCurrency } from "@/utils/currency";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState({});
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [canReview, setCanReview] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  useEffect(() => {
    async function loadRelatedProducts() {
      if (!product || loading) return;
      
      setRecommendedLoading(true);
      try {
        const related = await productService.getRelatedProducts(product.Id, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to load related products:', error);
        setRelatedProducts([]);
      } finally {
        setRecommendedLoading(false);
      }
    }

loadRelatedProducts();
  }, [product, loading]);
const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const productData = await productService.getById(parseInt(id));
      if (!productData) {
        setError("Product not found");
        return;
      }
      
      setProduct(productData);
      
      // Load related products
      const allProducts = await productService.getAll();
      const related = allProducts
        .filter(p => p.Id !== productData.Id && p.category === productData.category)
        .slice(0, 4);
      setRelatedProducts(related);
      
      // Load reviews
      await loadReviews(productData.Id);
      
      // Check if user can review (using sample email for demo)
      const reviewCheck = await reviewService.canUserReview(
        productData.Id, 
        "john.smith@email.com"
      );
      setCanReview(reviewCheck);
      
    } catch (err) {
      setError("Failed to load product details");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const productReviews = await reviewService.getByProductId(productId);
      setReviews(productReviews);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    await loadReviews(product.Id);
    
    // Refresh review permission check
    const reviewCheck = await reviewService.canUserReview(
      product.Id,
      "john.smith@email.com"
    );
    setCanReview(reviewCheck);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleVariationChange = (variationType, value) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationType]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addToCart(product, quantity, selectedVariations);
    setIsAddingToCart(false);
  };

  const canAddToCart = product?.stock > 0;
  const hasVariations = product?.variations && product.variations.length > 0;
  const allVariationsSelected = hasVariations ? 
    product.variations.every(variation => selectedVariations[variation.type]) : true;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProduct} />;
  if (!product) return <Error message="Product not found" onRetry={() => navigate("/shop")} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate("/")}>Home</button>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <button onClick={() => navigate("/shop")}>Shop</button>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-square bg-gray-100 rounded-xl overflow-hidden"
              layoutId={`product-image-${product.Id}`}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {product.featured && <Badge variant="accent">Featured</Badge>}
                {product.stock < 5 && product.stock > 0 && (
                  <Badge variant="warning">Only {product.stock} left</Badge>
                )}
                {product.stock === 0 && <Badge variant="error">Sold Out</Badge>}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              
              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon
                        key={i}
                        name="Star"
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
              
              <p className="text-4xl font-bold text-primary mb-6">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Variations */}
            {hasVariations && (
              <div className="space-y-4">
                {product.variations.map((variation) => (
                  <div key={variation.type}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variation.type}
                    </label>
                    <Select
                      value={selectedVariations[variation.type] || ""}
                      onChange={(e) => handleVariationChange(variation.type, e.target.value)}
                    >
                      <option value="">Select {variation.type}</option>
                      {variation.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={product.stock}
              />
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart || !allVariationsSelected || isAddingToCart}
                variant="primary"
                size="xl"
                className="w-full"
              >
                {isAddingToCart ? (
                  <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                )}
                {!canAddToCart ? "Out of Stock" : "Add to Cart"}
              </Button>
              
              {!allVariationsSelected && hasVariations && (
                <p className="text-sm text-error text-center">
                  Please select all product options
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span className="font-medium">{product.stock} available</span>
                </div>
              </div>
</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
                Customer Reviews
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Star" className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-semibold text-gray-800">
                      {product.rating}
                    </span>
                    <span className="text-gray-600">out of 5</span>
                  </div>
                  <span className="text-gray-500">
                    Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
            </div>
            
            {canReview?.canReview && !showReviewForm && (
              <Button
                variant="primary"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </Button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                productId={product.Id}
                customerEmail="john.smith@email.com"
                orderId={canReview?.orderId}
                verifiedPurchase={canReview?.verifiedPurchase}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

<ReviewList
            productId={product.Id}
            reviews={reviews}
            loading={reviewsLoading}
          />
        </div>

{/* Related Products */}
        <section>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-8">
            Related Products
          </h2>
          {recommendedLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.Id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No related products found</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;