import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CheckoutStepper from "@/components/molecules/CheckoutStepper";
import { formatCurrency } from "@/utils/currency";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
const [isGuest, setIsGuest] = useState(true);
  
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingAddressSame: true,
    billingAddress: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    }
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { id: "shipping", title: "Shipping" },
    { id: "payment", title: "Payment" },
    { id: "review", title: "Review" }
  ];

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Validate shipping form
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required shipping information");
      return;
    }
    
    if (isGuest && !guestEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    setCurrentStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment form
    const requiredPaymentFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const missingPaymentFields = requiredPaymentFields.filter(field => !paymentData[field]);
    
    if (missingPaymentFields.length > 0) {
      toast.error("Please fill in all payment information");
      return;
    }
    
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      const orderData = {
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: shippingData,
        billingAddress: paymentData.billingAddressSame ? shippingData : paymentData.billingAddress,
        paymentMethod: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
        status: "confirmed",
        customerEmail: isGuest ? guestEmail : shippingData.email,
        isGuest
      };
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = await orderService.create(orderData);
      
      clearCart();
      navigate(`/order-confirmation/${order.orderId}`);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === "shipping") {
      setShippingData(prev => ({ ...prev, [field]: value }));
    } else if (section === "payment") {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingAddressChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value }
    }));
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Checkout
          </h1>
          <CheckoutStepper currentStep={currentStep} steps={steps} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {currentStep === 0 && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">
                    Shipping Information
                  </h2>
                  
                  {/* Guest/Account Toggle */}
                  <div className="mb-6 p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="checkoutType"
                          checked={isGuest}
                          onChange={() => setIsGuest(true)}
                          className="mr-2"
                        />
                        Guest Checkout
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="checkoutType"
                          checked={!isGuest}
                          onChange={() => setIsGuest(false)}
                          className="mr-2"
                        />
                        Create Account
                      </label>
                    </div>
                    
                    {isGuest && (
                      <div className="mt-4">
                        <Input
                          type="email"
                          label="Email Address"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="First Name"
                      value={shippingData.firstName}
                      onChange={(e) => handleInputChange("shipping", "firstName", e.target.value)}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={shippingData.lastName}
                      onChange={(e) => handleInputChange("shipping", "lastName", e.target.value)}
                      required
                    />
                  </div>

                  {!isGuest && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Input
                        type="email"
                        label="Email Address"
                        value={shippingData.email}
                        onChange={(e) => handleInputChange("shipping", "email", e.target.value)}
                        required
                      />
                      <Input
                        type="tel"
                        label="Phone Number"
                        value={shippingData.phone}
                        onChange={(e) => handleInputChange("shipping", "phone", e.target.value)}
                      />
                    </div>
                  )}

                  <Input
                    label="Street Address"
                    value={shippingData.address}
                    onChange={(e) => handleInputChange("shipping", "address", e.target.value)}
                    className="mb-4"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Input
                      label="City"
                      value={shippingData.city}
                      onChange={(e) => handleInputChange("shipping", "city", e.target.value)}
                      required
                    />
                    <Select
                      label="State"
                      value={shippingData.state}
                      onChange={(e) => handleInputChange("shipping", "state", e.target.value)}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </Select>
                    <Input
                      label="ZIP Code"
                      value={shippingData.zipCode}
                      onChange={(e) => handleInputChange("shipping", "zipCode", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Continue to Payment
                    <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              )}

              {currentStep === 1 && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">
                    Payment Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Card Number"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange("payment", "cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <Input
                      label="Cardholder Name"
                      value={paymentData.cardName}
                      onChange={(e) => handleInputChange("payment", "cardName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Input
                      label="Expiry Date"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange("payment", "expiryDate", e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                    <Input
                      label="CVV"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange("payment", "cvv", e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={paymentData.billingAddressSame}
                        onChange={(e) => handleInputChange("payment", "billingAddressSame", e.target.checked)}
                        className="mr-2"
                      />
                      Billing address same as shipping address
                    </label>
                  </div>

                  {!paymentData.billingAddressSame && (
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Billing Address</h3>
                      
                      <Input
                        label="Street Address"
                        value={paymentData.billingAddress.address}
                        onChange={(e) => handleBillingAddressChange("address", e.target.value)}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="City"
                          value={paymentData.billingAddress.city}
                          onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                          required
                        />
                        <Select
                          label="State"
                          value={paymentData.billingAddress.state}
                          onChange={(e) => handleBillingAddressChange("state", e.target.value)}
                          required
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                        </Select>
                        <Input
                          label="ZIP Code"
                          value={paymentData.billingAddress.zipCode}
                          onChange={(e) => handleBillingAddressChange("zipCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(0)}
                      className="flex-1"
                    >
                      <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" variant="primary" size="lg" className="flex-1">
                      Review Order
                      <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">
                    Review Your Order
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.productId}-${JSON.stringify(item.selectedVariation)}`}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-primary">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {shippingData.firstName} {shippingData.lastName}<br />
                      {shippingData.address}<br />
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      **** **** **** {paymentData.cardNumber.slice(-4)}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input type="checkbox" required className="mr-2" />
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                      )}
                      {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-4">
                <div className="flex items-center">
                  <ApperIcon name="Shield" className="w-3 h-3 mr-1" />
                  Secure
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Lock" className="w-3 h-3 mr-1" />
                  Encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;