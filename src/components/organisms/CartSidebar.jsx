import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/currency";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const total = getCartTotal();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/shop");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-display font-semibold text-gray-800">
                Shopping Cart ({cartItems.length})
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Empty
                    title="Your cart is empty"
                    message="Add some handmade treasures to get started!"
                    actionText="Start Shopping"
                    onAction={handleContinueShopping}
                    icon="ShoppingBag"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItem
                        key={`${item.productId}-${JSON.stringify(item.selectedVariation)}`}
                        item={item}
                        onQuantityChange={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-display font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                    Checkout
                  </Button>
                  
                  <Button
                    onClick={handleContinueShopping}
                    variant="ghost"
                    size="md"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;