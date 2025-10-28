import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ApperIcon name="Search" className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-6xl font-display font-bold text-gray-800 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-display font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            Perhaps you'd like to explore our handmade treasures instead?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link to="/">
                <ApperIcon name="Home" className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="secondary" size="lg" asChild>
              <Link to="/shop">
                <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                Shop Products
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Contact our support team
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/contact">
                <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;