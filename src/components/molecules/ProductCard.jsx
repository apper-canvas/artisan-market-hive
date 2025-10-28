import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "@/hooks/useCart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      addToCart(product);
      setIsLoading(false);
    }, 300);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden hover-lift group">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover product-image-zoom"
            />
          </div>
          
          {product.featured && (
            <Badge variant="accent" className="absolute top-3 left-3">
              Featured
            </Badge>
          )}
          
          {product.stock < 5 && product.stock > 0 && (
            <Badge variant="warning" className="absolute top-3 right-3">
              Low Stock
            </Badge>
          )}
          
          {product.stock === 0 && (
            <Badge variant="error" className="absolute top-3 right-3">
              Sold Out
            </Badge>
          )}

          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              onClick={handleQuickAdd}
              disabled={product.stock === 0 || isLoading}
              className="shadow-lg"
            >
              {isLoading ? (
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
              ) : (
                <ApperIcon name="Plus" className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-display text-lg text-gray-800 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-primary">
              {formatCurrency(product.price)}
            </span>
            
            {product.rating && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;