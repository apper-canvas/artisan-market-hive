import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter signup logic would go here
  };

  return (
    <footer className="bg-gradient-to-br from-surface to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Palette" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-semibold text-gray-800">
                Artisan Market
              </span>
            </Link>
            <p className="text-gray-600">
              Discover unique handmade products crafted with love by talented artisans from around the world.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Facebook" className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Instagram" className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Twitter" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-800 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-600 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/categories/jewelry" className="text-gray-600 hover:text-primary transition-colors">Jewelry</Link></li>
              <li><Link to="/categories/home-decor" className="text-gray-600 hover:text-primary transition-colors">Home Decor</Link></li>
              <li><Link to="/categories/pottery" className="text-gray-600 hover:text-primary transition-colors">Pottery</Link></li>
              <li><Link to="/categories/textiles" className="text-gray-600 hover:text-primary transition-colors">Textiles</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 hover:text-primary transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-800 mb-4">Stay Connected</h3>
            <p className="text-gray-600 mb-4">
              Get updates on new arrivals and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Artisan Market. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;