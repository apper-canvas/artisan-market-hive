import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99,
  className 
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    if (value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="p-1 h-8 w-8"
      >
        <ApperIcon name="Minus" className="w-4 h-4" />
      </Button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="p-1 h-8 w-8"
      >
        <ApperIcon name="Plus" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;