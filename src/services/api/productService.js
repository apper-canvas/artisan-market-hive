import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async () => {
    await delay(Math.random() * 300 + 200);
    return [...productsData];
  },

  getById: async (id) => {
    await delay(Math.random() * 300 + 200);
    const product = productsData.find(p => p.Id === parseInt(id));
    return product ? { ...product } : null;
  },

  getByCategory: async (category) => {
    await delay(Math.random() * 300 + 200);
    return productsData.filter(p => p.category.toLowerCase() === category.toLowerCase())
      .map(p => ({ ...p }));
  },

  getFeatured: async () => {
    await delay(Math.random() * 300 + 200);
    return productsData.filter(p => p.featured).map(p => ({ ...p }));
  },

  search: async (query) => {
    await delay(Math.random() * 300 + 200);
    const lowercaseQuery = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    ).map(p => ({ ...p }));
  },

  create: async (productData) => {
    await delay(Math.random() * 400 + 300);
    const maxId = Math.max(...productsData.map(p => p.Id));
    const newProduct = {
      ...productData,
      Id: maxId + 1
    };
    productsData.push(newProduct);
    return { ...newProduct };
  },

  update: async (id, productData) => {
    await delay(Math.random() * 400 + 300);
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) return null;
    
    productsData[index] = { ...productsData[index], ...productData };
    return { ...productsData[index] };
  },

  delete: async (id) => {
    await delay(Math.random() * 400 + 300);
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) return false;
productsData.splice(index, 1);
    return true;
  },

  getRecommended: async (productIds, limit = 4) => {
    await delay(Math.random() * 300 + 200);
    if (!productIds || productIds.length === 0) return [];
    
    const cartProducts = productsData.filter(p => productIds.includes(p.Id));
    const cartCategories = [...new Set(cartProducts.map(p => p.category))];
    
    const recommended = productsData
      .filter(p => !productIds.includes(p.Id) && cartCategories.includes(p.category))
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(p => ({ ...p }));
    
    return recommended;
  },

  getRelatedProducts: async (productId, limit = 4) => {
    await delay(Math.random() * 300 + 200);
    const product = productsData.find(p => p.Id === parseInt(productId));
    if (!product) return [];
    
    const related = productsData
      .filter(p => p.Id !== product.Id && p.category === product.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(p => ({ ...p }));
    
    return related;
  }
};