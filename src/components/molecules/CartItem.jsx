import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import QuantitySelector from "@/components/molecules/QuantitySelector";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/currency";

const CartItem = ({ 
  item, 
  onQuantityChange, 
  onRemove 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
    >
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {item.name}
        </h3>
        
        {item.selectedVariation && (
          <p className="text-xs text-gray-600 mt-1">
            {Object.entries(item.selectedVariation).map(([key, value]) => 
              `${key}: ${value}`
            ).join(", ")}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-primary">
            {formatCurrency(item.price)}
          </span>
          
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(newQuantity) => 
              onQuantityChange(item.productId, item.selectedVariation, newQuantity)
            }
            className="scale-90"
          />
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId, item.selectedVariation)}
          className="text-error hover:text-error hover:bg-error/5 p-1"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </Button>
        
        <span className="text-sm font-semibold text-gray-800">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>
    </motion.div>
  );
};

export default CartItem;