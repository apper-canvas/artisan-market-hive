import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/currency";
import { orderService } from "@/services/api/orderService";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const orderData = await orderService.getById(orderId);
      if (!orderData) {
        setError("Order not found");
        return;
      }
      
      setOrder(orderData);
    } catch (err) {
      setError("Failed to load order details");
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrder} />;
  if (!order) return <Error message="Order not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 inline-block">
            <div className="text-sm text-gray-600 mb-1">Order Number</div>
            <div className="text-2xl font-bold text-primary">#{order.orderId}</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">
                Order Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="success">{order.status}</Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">
                    {format(new Date(order.estimatedDelivery), "MMM dd, yyyy")}
                  </span>
                </div>
                
                {order.customerEmail && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">
                Shipping Address
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">
                Payment Method
              </h3>
              <div className="flex items-center space-x-2">
                <ApperIcon name="CreditCard" className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{order.paymentMethod}</span>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${JSON.stringify(item.selectedVariation)}`}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </h3>
                      {item.selectedVariation && (
                        <p className="text-xs text-gray-600">
                          {Object.entries(item.selectedVariation).map(([key, value]) => 
                            `${key}: ${value}`
                          ).join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {order.shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      formatCurrency(order.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link to="/shop">
                <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            <Button variant="secondary" size="lg">
              <ApperIcon name="Download" className="w-5 h-5 mr-2" />
              Download Receipt
            </Button>
          </div>

          {order.isGuest && (
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">
                Create an Account
              </h3>
              <p className="text-gray-600 mb-4">
                Track your orders, save your addresses, and enjoy faster checkout by creating an account.
              </p>
              <Button variant="primary" size="md">
                Create Account
              </Button>
            </div>
          )}
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-info/5 rounded-lg border border-info/20"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Mail" className="w-5 h-5 text-info mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Confirmation Email Sent</h4>
              <p className="text-sm text-gray-600 mt-1">
                We've sent a confirmation email to{" "}
                <span className="font-medium">{order.customerEmail}</span> with your order details 
                and tracking information. If you don't see it, please check your spam folder.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;