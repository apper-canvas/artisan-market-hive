import { toast } from "react-toastify";
import { getApperClient } from "@/services/apperClient";
import { orderService } from "./orderService";

const transformReview = (dbReview) => ({
  Id: dbReview.Id,
  productId: dbReview.product_id_c?.Id || dbReview.product_id_c,
  orderId: dbReview.order_id_c,
  rating: dbReview.rating_c,
  title: dbReview.title_c,
  comment: dbReview.comment_c,
  customerName: dbReview.customer_name_c,
  customerEmail: dbReview.customer_email_c,
  verifiedPurchase: dbReview.verified_purchase_c,
  helpfulCount: dbReview.helpful_count_c,
  createdAt: dbReview.CreatedOn,
  updatedAt: dbReview.ModifiedOn
});

export const reviewService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "verified_purchase_c"}},
          {"field": {"Name": "helpful_count_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformReview);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  async getByProductId(productId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "verified_purchase_c"}},
          {"field": {"Name": "helpful_count_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "product_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(productId)]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(transformReview);
    } catch (error) {
      console.error("Error fetching reviews for product:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('review_c', parseInt(id), {
        fields: [
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "verified_purchase_c"}},
          {"field": {"Name": "helpful_count_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      return transformReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      return null;
    }
  },

  async canUserReview(productId, customerEmail) {
    try {
      if (!customerEmail) {
        return { canReview: false, reason: "Please provide your email address" };
      }

      const existingReviews = await reviewService.getByProductId(productId);
      const existingReview = existingReviews.find(r => r.customerEmail === customerEmail);

      if (existingReview) {
        return { 
          canReview: false, 
          reason: "You have already reviewed this product",
          existingReviewId: existingReview.Id 
        };
      }

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

      const purchaseOrder = userOrders.find(order =>
        order.items.some(item => item.productId === parseInt(productId))
      );

      return { 
        canReview: true, 
        verifiedPurchase: true,
        orderId: purchaseOrder?.Id,
        reason: "You can leave a verified review for this product"
      };
    } catch (error) {
      console.error("Error checking review eligibility:", error);
      return { canReview: false, reason: "Unable to verify review eligibility" };
    }
  },

  async create(reviewData) {
    try {
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

      const apperClient = getApperClient();
      const response = await apperClient.createRecord('review_c', {
        records: [{
          product_id_c: parseInt(reviewData.productId),
          order_id_c: reviewData.orderId || 0,
          rating_c: parseInt(reviewData.rating),
          title_c: reviewData.title.trim(),
          comment_c: reviewData.comment.trim(),
          customer_name_c: reviewData.customerName || "Anonymous",
          customer_email_c: reviewData.customerEmail,
          verified_purchase_c: reviewData.verifiedPurchase || false,
          helpful_count_c: 0
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create review");
        }

        return transformReview(response.results[0].data);
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error("Rating must be between 1 and 5");
      }

      if (data.title && data.title.trim().length < 3) {
        throw new Error("Review title must be at least 3 characters");
      }

      if (data.comment && data.comment.trim().length < 10) {
        throw new Error("Review comment must be at least 10 characters");
      }

      const apperClient = getApperClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (data.rating) updateFields.rating_c = parseInt(data.rating);
      if (data.title) updateFields.title_c = data.title.trim();
      if (data.comment) updateFields.comment_c = data.comment.trim();
      if (data.helpfulCount !== undefined) updateFields.helpful_count_c = data.helpfulCount;

      const response = await apperClient.updateRecord('review_c', {
        records: [updateFields]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update review");
        }

        return transformReview(response.results[0].data);
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('review_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete review");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  async markHelpful(id) {
    try {
      const review = await reviewService.getById(id);
      if (!review) {
        throw new Error("Review not found");
      }

      return await reviewService.update(id, {
        helpfulCount: review.helpfulCount + 1
      });
    } catch (error) {
      console.error("Error marking review helpful:", error);
      throw error;
    }
  }
};