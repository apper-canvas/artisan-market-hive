import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Checkout from "@/components/pages/Checkout";
import Empty from "@/components/ui/Empty";
import ProductCard from "@/components/molecules/ProductCard";
import CartItem from "@/components/molecules/CartItem";
import { formatCurrency } from "@/utils/currency";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
const [isUpdating, setIsUpdating] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = async (productId, selectedVariation, newQuantity) => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    updateQuantity(productId, selectedVariation, newQuantity);
    setIsUpdating(false);
  };

  const handleRemoveItem = async (productId, selectedVariation) => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    removeFromCart(productId, selectedVariation);
    setIsUpdating(false);
  };

  const handleCheckout = () => {
    navigate("/checkout");
};

useEffect(() => {
    async function loadRecommendations() {
      if (cartItems.length === 0) {
        setRecommendedProducts([]);
        return;
      }
setRecommendedLoading(true);
      try {
        const productIds = cartItems.map(item => item.productId);
        const recommended = await productService.getRecommended(productIds, 4);
        setRecommendedProducts(recommended);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        setRecommendedProducts([]);
      } finally {
        setRecommendedLoading(false);
      }
    }
loadRecommendations();
  }, [cartItems]);
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Empty
          title="Your cart is empty"
          message="Start shopping to add handmade treasures to your cart!"
          actionText="Shop Now"
          onAction={() => navigate("/shop")}
          icon="ShoppingCart"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1
                className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-2">Shopping Cart
                          </h1>
            <p className="text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}in your cart
                          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <AnimatePresence mode="popLayout">
                        {cartItems.map(item => <motion.div
                            key={`${item.productId}-${JSON.stringify(item.selectedVariation)}`}
                            layout
                            className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 mb-6 last:mb-0">
                            <CartItem
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem} />
                        </motion.div>)}
                    </AnimatePresence>
                    <div
                        className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
                        <Button variant="ghost" onClick={() => navigate("/shop")} className="flex-1">
                            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />Continue Shopping
                                            </Button>
                    </div>
                </div>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                    <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Order Summary
                                      </h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>
                                {shipping === 0 ? <span className="text-success font-medium">Free</span> : formatCurrency(shipping)}
                            </span>
                        </div>
                        {shipping > 0 && <div className="text-sm text-info bg-info/5 p-3 rounded-lg">
                            <ApperIcon name="Info" className="w-4 h-4 inline mr-1" />Free shipping on orders over $75
                                              </div>}
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-display font-semibold text-gray-800">Total
                                                        </span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={isUpdating}>
                        <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />Proceed to Checkout
                                      </Button>
                    <div
                        className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <ApperIcon name="Shield" className="w-4 h-4 mr-1" />Secure Checkout
                                            </div>
                        <div className="flex items-center">
                            <ApperIcon name="Truck" className="w-4 h-4 mr-1" />Fast Delivery
                                            </div>
                    </div>
                </motion.div>
            </div>
        </div>
</div>
    {/* Recommended Products */}
    {cartItems.length > 0 && <motion.section
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            delay: 0.3
        }}
        className="mt-12">
        <h2
            className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-8">Recommended for You
                          </h2>
        {recommendedLoading ? <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div> : recommendedProducts.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(product => <ProductCard key={product.Id} product={product} />)}
        </div> : null}
    </motion.section>}
</div>
  );
};

export default Cart;