import { toast } from "react-toastify";
import { getApperClient } from "@/services/apperClient";

const transformProduct = (dbProduct) => ({
  Id: dbProduct.Id,
  name: dbProduct.name_c,
  description: dbProduct.description_c,
  price: dbProduct.price_c,
  category: dbProduct.category_c,
  stock: dbProduct.stock_c,
  featured: dbProduct.featured_c,
  rating: dbProduct.rating_c,
  reviewCount: dbProduct.review_count_c,
  images: JSON.parse(dbProduct.images_c || '[]'),
  variations: JSON.parse(dbProduct.variations_c || '[]')
});

export const productService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "variations_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "variations_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      return transformProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  getByCategory: async (category) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "variations_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformProduct);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  getFeatured: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "variations_c"}}
        ],
        where: [{
          "FieldName": "featured_c",
          "Operator": "EqualTo",
          "Values": [true]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformProduct);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  search: async (query) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "variations_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [{
                "fieldName": "name_c",
                "operator": "Contains",
                "values": [query]
              }],
              "operator": "OR"
            },
            {
              "conditions": [{
                "fieldName": "description_c",
                "operator": "Contains",
                "values": [query]
              }],
              "operator": "OR"
            },
            {
              "conditions": [{
                "fieldName": "category_c",
                "operator": "Contains",
                "values": [query]
              }],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformProduct);
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  create: async (productData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('product_c', {
        records: [{
          name_c: productData.name,
          description_c: productData.description,
          price_c: productData.price,
          category_c: productData.category,
          stock_c: productData.stock,
          featured_c: productData.featured || false,
          rating_c: productData.rating || 0,
          review_count_c: productData.reviewCount || 0,
          images_c: JSON.stringify(productData.images || []),
          variations_c: JSON.stringify(productData.variations || [])
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create product:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        return transformProduct(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
      return null;
    }
  },

  update: async (id, productData) => {
    try {
      const apperClient = getApperClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (productData.name) updateFields.name_c = productData.name;
      if (productData.description) updateFields.description_c = productData.description;
      if (productData.price !== undefined) updateFields.price_c = productData.price;
      if (productData.category) updateFields.category_c = productData.category;
      if (productData.stock !== undefined) updateFields.stock_c = productData.stock;
      if (productData.featured !== undefined) updateFields.featured_c = productData.featured;
      if (productData.rating !== undefined) updateFields.rating_c = productData.rating;
      if (productData.reviewCount !== undefined) updateFields.review_count_c = productData.reviewCount;
      if (productData.images) updateFields.images_c = JSON.stringify(productData.images);
      if (productData.variations) updateFields.variations_c = JSON.stringify(productData.variations);

      const response = await apperClient.updateRecord('product_c', {
        records: [updateFields]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update product:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        return transformProduct(response.results[0].data);
      }

      return null;
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('product_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete product:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      return false;
    }
  },

  getRecommended: async (productIds, limit = 4) => {
    try {
      if (!productIds || productIds.length === 0) return [];

      const allProducts = await productService.getAll();
      const cartProducts = allProducts.filter(p => productIds.includes(p.Id));
      const cartCategories = [...new Set(cartProducts.map(p => p.category))];
      
      const recommended = allProducts
        .filter(p => !productIds.includes(p.Id) && cartCategories.includes(p.category))
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
      
      return recommended;
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      return [];
    }
  },

  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const product = await productService.getById(parseInt(productId));
      if (!product) return [];
      
      const allProducts = await productService.getAll();
      const related = allProducts
        .filter(p => p.Id !== product.Id && p.category === product.category)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
      
      return related;
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  }
};