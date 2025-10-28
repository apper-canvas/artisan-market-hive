import ordersData from "@/services/mockData/orders.json";
import { format, addDays } from "date-fns";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateOrderId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `AM${year}-${randomNum}`;
};

export const orderService = {
  getAll: async () => {
    await delay(Math.random() * 300 + 200);
    return [...ordersData];
  },

  getById: async (orderId) => {
    await delay(Math.random() * 300 + 200);
    const order = ordersData.find(o => o.orderId === orderId);
    return order ? { ...order } : null;
  },

  create: async (orderData) => {
    await delay(Math.random() * 500 + 400);
    const maxId = ordersData.length > 0 ? Math.max(...ordersData.map(o => o.Id)) : 0;
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      estimatedDelivery: addDays(new Date(), 7).toISOString(),
      status: "confirmed"
    };
    ordersData.push(newOrder);
    return { ...newOrder };
  },

  update: async (id, orderData) => {
    await delay(Math.random() * 400 + 300);
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) return null;
    
    ordersData[index] = { ...ordersData[index], ...orderData };
    return { ...ordersData[index] };
  },

updateStatus: async (orderId, status) => {
    await delay(Math.random() * 300 + 200);
    const index = ordersData.findIndex(o => o.orderId === orderId);
    if (index === -1) return null;
    
    ordersData[index].status = status;
    const updatedOrder = { ...ordersData[index] };
    
    // Send email notification
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const emailResponse = await apperClient.functions.invoke(
        import.meta.env.VITE_SEND_ORDER_STATUS_EMAIL,
        {
          body: JSON.stringify({
            orderId: updatedOrder.orderId,
            customerEmail: updatedOrder.customerEmail,
            status: updatedOrder.status,
            orderDetails: {
              createdAt: updatedOrder.createdAt,
              estimatedDelivery: updatedOrder.estimatedDelivery,
              items: updatedOrder.items,
              subtotal: updatedOrder.subtotal,
              shipping: updatedOrder.shipping,
              tax: updatedOrder.tax,
              total: updatedOrder.total,
              shippingAddress: updatedOrder.shippingAddress
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
    
    return updatedOrder;
  },

  delete: async (id) => {
    await delay(Math.random() * 400 + 300);
    const index = ordersData.findIndex(o => o.Id === parseInt(id));
    if (index === -1) return false;
    
    ordersData.splice(index, 1);
    return true;
  }
};