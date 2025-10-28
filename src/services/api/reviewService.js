import reviewsData from "@/services/mockData/reviews.json";
import { orderService } from "./orderService";

let reviews = [...reviewsData];
let nextId = Math.max(...reviews.map(r => r.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getAll() {
    await delay(200);
    return reviews.map(r => ({ ...r }));
  },

  async getByProductId(productId) {
    await delay(200);
    return reviews
      .filter(r => r.productId === parseInt(productId))
      .map(r => ({ ...r }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(150);
    const review = reviews.find(r => r.Id === parseInt(id));
    return review ? { ...review } : null;
  },

  async canUserReview(productId, customerEmail) {
    await delay(200);
    
    if (!customerEmail) {
      return { canReview: false, reason: "Please provide your email address" };
    }

    // Check if user already reviewed this product
    const existingReview = reviews.find(
      r => r.productId === parseInt(productId) && 
           r.customerEmail === customerEmail
    );

    if (existingReview) {
      return { 
        canReview: false, 
        reason: "You have already reviewed this product",
        existingReviewId: existingReview.Id 
      };
    }

    // Check if user purchased this product
    const allOrders = await orderService.getAll();
    const userOrders = allOrders.filter(o => o.customerEmail === customerEmail);
    
    const hasPurchased = userOrders.some(order =>
      order.items.some(item => item.productId === parseInt(productId))
    );

    if (!hasPurchased) {
      return { 
        canReview: true, 
        verifiedPurchase: false,
        reason: "You can review this product, but it won't be marked as verified purchase"
      };
    }

    // Find the order that contains this product
    const purchaseOrder = userOrders.find(order =>
      order.items.some(item => item.productId === parseInt(productId))
    );

    return { 
      canReview: true, 
      verifiedPurchase: true,
      orderId: purchaseOrder?.Id,
      reason: "You can leave a verified review for this product"
    };
  },

  async create(reviewData) {
    await delay(300);

    if (!reviewData.productId) {
      throw new Error("Product ID is required");
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (!reviewData.title || reviewData.title.trim().length < 3) {
      throw new Error("Review title must be at least 3 characters");
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      throw new Error("Review comment must be at least 10 characters");
    }

    if (!reviewData.customerEmail) {
      throw new Error("Customer email is required");
    }

    const newReview = {
      Id: nextId++,
      productId: parseInt(reviewData.productId),
      orderId: reviewData.orderId || null,
      rating: parseInt(reviewData.rating),
      title: reviewData.title.trim(),
      comment: reviewData.comment.trim(),
      customerName: reviewData.customerName || "Anonymous",
      customerEmail: reviewData.customerEmail,
      verifiedPurchase: reviewData.verifiedPurchase || false,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    return { ...newReview };
  },

  async update(id, data) {
    await delay(250);

    const index = reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (data.title && data.title.trim().length < 3) {
      throw new Error("Review title must be at least 3 characters");
    }

    if (data.comment && data.comment.trim().length < 10) {
      throw new Error("Review comment must be at least 10 characters");
    }

    const updatedReview = {
      ...reviews[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    reviews[index] = updatedReview;
    return { ...updatedReview };
  },

  async delete(id) {
    await delay(200);
    
    const index = reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }

    const deletedReview = reviews[index];
    reviews.splice(index, 1);
    return { ...deletedReview };
  },

  async markHelpful(id) {
    await delay(150);

    const index = reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Review not found");
    }

    reviews[index] = {
      ...reviews[index],
      helpfulCount: reviews[index].helpfulCount + 1,
      updatedAt: new Date().toISOString()
    };

    return { ...reviews[index] };
  }
};