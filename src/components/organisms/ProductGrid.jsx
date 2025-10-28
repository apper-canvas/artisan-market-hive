import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";

const ProductGrid = ({ filters = {}, searchQuery = "", sortBy = "newest" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredProducts = await productService.getAll();
      
      // Apply search filter
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (filters.category && filters.category !== "all") {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      // Apply price range filter
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.price >= filters.minPrice
        );
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= filters.maxPrice
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
        default:
          filteredProducts.sort((a, b) => b.Id - a.Id);
          break;
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters, searchQuery, sortBy]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProducts} />;
  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        message={searchQuery ? `No products match "${searchQuery}"` : "No products available in this category"}
        actionText="View All Products"
        onAction={() => window.location.href = "/shop"}
        icon="Search"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.Id} product={product} />
      ))}
    </motion.div>
  );
};

export default ProductGrid;