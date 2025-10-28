import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import ApperIcon from "@/components/ApperIcon";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const searchQuery = searchParams.get("search") || "";

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "jewelry", label: "Jewelry" },
    { value: "home-decor", label: "Home Decor" },
    { value: "pottery", label: "Pottery" },
    { value: "textiles", label: "Textiles" },
    { value: "art", label: "Art" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (key === "category" && value !== "all") {
      newParams.set("category", value);
    } else if (key === "category" && value === "all") {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
    });
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    setSearchParams(newParams);
  };

  const hasActiveFilters = filters.category !== "all" || filters.minPrice || filters.maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
            Handmade Products
          </h1>
          {searchQuery && (
            <p className="text-lg text-gray-600">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-gray-800">Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", parseFloat(e.target.value) || "")}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", parseFloat(e.target.value) || "")}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <Button
                variant="secondary"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="lg:hidden w-full sm:w-auto"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}
              </Button>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48"
                label="Sort by"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Mobile Filters Panel */}
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-semibold text-gray-800">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", parseFloat(e.target.value) || "")}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", parseFloat(e.target.value) || "")}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Product Grid */}
            <ProductGrid 
              filters={filters} 
              searchQuery={searchQuery} 
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;