import { addDays } from "date-fns";
import { toast } from "react-toastify";
import { getApperClient } from "@/services/apperClient";

const generateOrderId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `AM${year}-${randomNum}`;
};

export const orderService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "is_guest_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "estimated_delivery_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(order => ({
        Id: order.Id,
        orderId: order.order_id_c,
        items: JSON.parse(order.items_c || '[]'),
        subtotal: order.subtotal_c,
        shipping: order.shipping_c,
        tax: order.tax_c,
        total: order.total_c,
        shippingAddress: JSON.parse(order.shipping_address_c || '{}'),
        billingAddress: JSON.parse(order.billing_address_c || '{}'),
        paymentMethod: order.payment_method_c,
        status: order.status_c,
        customerEmail: order.customer_email_c,
        isGuest: order.is_guest_c,
        createdAt: order.created_at_c,
        estimatedDelivery: order.estimated_delivery_c
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      return [];
    }
  },

  getById: async (orderId) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "is_guest_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "estimated_delivery_c"}}
        ],
        where: [{
          "FieldName": "order_id_c",
          "Operator": "EqualTo",
          "Values": [orderId]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const order = response.data[0];
      return {
        Id: order.Id,
        orderId: order.order_id_c,
        items: JSON.parse(order.items_c || '[]'),
        subtotal: order.subtotal_c,
        shipping: order.shipping_c,
        tax: order.tax_c,
        total: order.total_c,
        shippingAddress: JSON.parse(order.shipping_address_c || '{}'),
        billingAddress: JSON.parse(order.billing_address_c || '{}'),
        paymentMethod: order.payment_method_c,
        status: order.status_c,
        customerEmail: order.customer_email_c,
        isGuest: order.is_guest_c,
        createdAt: order.created_at_c,
        estimatedDelivery: order.estimated_delivery_c
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  create: async (orderData) => {
    try {
      const apperClient = getApperClient();
      const newOrderId = generateOrderId();
      
      const response = await apperClient.createRecord('order_c', {
        records: [{
          order_id_c: newOrderId,
          items_c: JSON.stringify(orderData.items),
          subtotal_c: orderData.subtotal,
          shipping_c: orderData.shipping,
          tax_c: orderData.tax,
          total_c: orderData.total,
          shipping_address_c: JSON.stringify(orderData.shippingAddress),
          billing_address_c: JSON.stringify(orderData.billingAddress),
          payment_method_c: orderData.paymentMethod,
          status_c: orderData.status || "confirmed",
          customer_email_c: orderData.customerEmail,
          is_guest_c: orderData.isGuest || false,
          created_at_c: new Date().toISOString(),
          estimated_delivery_c: addDays(new Date(), 7).toISOString()
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
          console.error(`Failed to create order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const created = response.results[0].data;
        return {
          Id: created.Id,
          orderId: created.order_id_c,
          items: JSON.parse(created.items_c || '[]'),
          subtotal: created.subtotal_c,
          shipping: created.shipping_c,
          tax: created.tax_c,
          total: created.total_c,
          shippingAddress: JSON.parse(created.shipping_address_c || '{}'),
          billingAddress: JSON.parse(created.billing_address_c || '{}'),
          paymentMethod: created.payment_method_c,
          status: created.status_c,
          customerEmail: created.customer_email_c,
          isGuest: created.is_guest_c,
          createdAt: created.created_at_c,
          estimatedDelivery: created.estimated_delivery_c
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      return null;
    }
  },

  update: async (id, orderData) => {
    try {
      const apperClient = getApperClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (orderData.items) updateFields.items_c = JSON.stringify(orderData.items);
      if (orderData.subtotal !== undefined) updateFields.subtotal_c = orderData.subtotal;
      if (orderData.shipping !== undefined) updateFields.shipping_c = orderData.shipping;
      if (orderData.tax !== undefined) updateFields.tax_c = orderData.tax;
      if (orderData.total !== undefined) updateFields.total_c = orderData.total;
      if (orderData.shippingAddress) updateFields.shipping_address_c = JSON.stringify(orderData.shippingAddress);
      if (orderData.billingAddress) updateFields.billing_address_c = JSON.stringify(orderData.billingAddress);
      if (orderData.paymentMethod) updateFields.payment_method_c = orderData.paymentMethod;
      if (orderData.status) updateFields.status_c = orderData.status;
      if (orderData.customerEmail) updateFields.customer_email_c = orderData.customerEmail;
      if (orderData.isGuest !== undefined) updateFields.is_guest_c = orderData.isGuest;

      const response = await apperClient.updateRecord('order_c', {
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
          console.error(`Failed to update order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          orderId: updated.order_id_c,
          items: JSON.parse(updated.items_c || '[]'),
          subtotal: updated.subtotal_c,
          shipping: updated.shipping_c,
          tax: updated.tax_c,
          total: updated.total_c,
          shippingAddress: JSON.parse(updated.shipping_address_c || '{}'),
          billingAddress: JSON.parse(updated.billing_address_c || '{}'),
          paymentMethod: updated.payment_method_c,
          status: updated.status_c,
          customerEmail: updated.customer_email_c,
          isGuest: updated.is_guest_c,
          createdAt: updated.created_at_c,
          estimatedDelivery: updated.estimated_delivery_c
        };
      }

      return null;
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      return null;
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      const order = await orderService.getById(orderId);
      if (!order) return null;

      const updated = await orderService.update(order.Id, { status });
      if (!updated) return null;

      try {
        const apperClient = getApperClient();
        const emailResponse = await apperClient.functions.invoke(
          import.meta.env.VITE_SEND_ORDER_STATUS_EMAIL,
          {
            body: JSON.stringify({
              orderId: updated.orderId,
              customerEmail: updated.customerEmail,
              status: updated.status,
              orderDetails: {
                createdAt: updated.createdAt,
                estimatedDelivery: updated.estimatedDelivery,
                items: updated.items,
                subtotal: updated.subtotal,
                shipping: updated.shipping,
                tax: updated.tax,
                total: updated.total,
                shippingAddress: updated.shippingAddress
              }
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!emailResponse.success) {
          console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_ORDER_STATUS_EMAIL}. The response body is: ${JSON.stringify(emailResponse)}.`);
          toast.info('Order updated, but email notification failed to send');
        }
      } catch (error) {
        console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_SEND_ORDER_STATUS_EMAIL}. The error is: ${error.message}`);
        toast.info('Order updated, but email notification encountered an error');
      }
      
      return updated;
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('order_c', {
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
          console.error(`Failed to delete order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
      return false;
    }
  }
};