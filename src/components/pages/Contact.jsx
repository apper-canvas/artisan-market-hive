import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      title: "Customer Support",
      description: "Get help with orders, shipping, and products",
      icon: "HeadphonesIcon",
      contact: "support@artisanmarket.com",
      hours: "Mon-Fri, 9am-6pm EST"
    },
    {
      title: "Artisan Partnerships",
      description: "Join our marketplace as a seller",
      icon: "Users",
      contact: "partnerships@artisanmarket.com",
      hours: "Mon-Fri, 10am-5pm EST"
    },
    {
      title: "General Inquiries",
      description: "Press, partnerships, and other questions",
      icon: "Mail",
      contact: "hello@artisanmarket.com",
      hours: "Mon-Fri, 9am-6pm EST"
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Most orders ship within 1-3 business days and arrive within 5-7 business days for domestic orders. International shipping may take 10-21 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items in their original condition. Handmade items may have specific return restrictions."
    },
    {
      question: "How do you ensure product quality?",
      answer: "We work directly with vetted artisans and have a quality assurance process. Each product is inspected before shipping."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! You'll receive a tracking number via email once your order ships. You can track your package using this number."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <Select
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Support</option>
                  <option value="product">Product Question</option>
                  <option value="partnership">Artisan Partnership</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </Select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <ApperIcon name="Send" className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={info.icon} className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                      <p className="text-sm font-medium text-primary">{info.contact}</p>
                      <p className="text-xs text-gray-500">{info.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-6">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">
                Follow Us
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Stay connected for the latest updates, new arrivals, and artisan stories.
              </p>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Facebook" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Instagram" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Twitter" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Youtube" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;