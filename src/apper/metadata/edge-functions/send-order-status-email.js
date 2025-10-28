import apper from "https://cdn.apper.io/actions/apper-actions.js";

apper.serve(async (req) => {
  try {
    // Parse request body
    const body = await req.json();
    const { orderId, customerEmail, status, orderDetails } = body;

    // Validate required fields
    if (!orderId || !customerEmail || !status || !orderDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: orderId, customerEmail, status, and orderDetails are required"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email format"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate status
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get Resend API key
    const resendApiKey = await apper.getSecret('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service not configured. Please add RESEND_API_KEY secret."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Build status-specific content
    const statusConfig = {
      processing: {
        subject: `Order ${orderId} is Being Processed`,
        heading: "Your Order is Being Processed",
        message: "We've received your order and are preparing your items for shipment.",
        color: "#4A7C88"
      },
      shipped: {
        subject: `Order ${orderId} Has Been Shipped`,
        heading: "Your Order is On Its Way!",
        message: `Your order has been shipped and is on its way to you. ${orderDetails.estimatedDelivery ? `Expected delivery: ${orderDetails.estimatedDelivery}` : ''}`,
        color: "#8B6F47"
      },
      delivered: {
        subject: `Order ${orderId} Has Been Delivered`,
        heading: "Your Order Has Been Delivered",
        message: "Your order has been successfully delivered. We hope you love your purchase!",
        color: "#6B9080"
      },
      cancelled: {
        subject: `Order ${orderId} Has Been Cancelled`,
        heading: "Your Order Has Been Cancelled",
        message: "Your order has been cancelled. If you have any questions, please contact our support team.",
        color: "#C1666B"
      }
    };

    const config = statusConfig[status.toLowerCase()];

    // Build order items HTML
    let itemsHtml = '';
    if (orderDetails.items && orderDetails.items.length > 0) {
      itemsHtml = orderDetails.items.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${item.name}
            ${item.selectedVariation ? `<br><span style="font-size: 12px; color: #6b7280;">${Object.entries(item.selectedVariation).map(([key, value]) => `${key}: ${value}`).join(', ')}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
      `).join('');
    }

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: ${config.color}; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-family: 'DM Serif Display', serif;">${config.heading}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #374151;">
                ${config.message}
              </p>
              
              <!-- Order Details -->
              <div style="margin: 24px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px;">
                <h2 style="margin: 0 0 12px; font-size: 18px; color: #1f2937;">Order Details</h2>
                <p style="margin: 4px 0; font-size: 14px; color: #6b7280;">Order ID: <strong style="color: #1f2937;">${orderId}</strong></p>
                <p style="margin: 4px 0; font-size: 14px; color: #6b7280;">Status: <strong style="color: ${config.color}; text-transform: capitalize;">${status}</strong></p>
                ${orderDetails.createdAt ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;">Order Date: <strong style="color: #1f2937;">${orderDetails.createdAt}</strong></p>` : ''}
              </div>
              
              <!-- Order Items -->
              ${itemsHtml ? `
              <div style="margin: 24px 0;">
                <h3 style="margin: 0 0 16px; font-size: 16px; color: #1f2937;">Items Ordered</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Item</th>
                      <th style="padding: 12px; text-align: center; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Qty</th>
                      <th style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </div>
              ` : ''}
              
              <!-- Order Summary -->
              ${orderDetails.subtotal ? `
              <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 6px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Subtotal:</td>
                    <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #1f2937;">$${orderDetails.subtotal.toFixed(2)}</td>
                  </tr>
                  ${orderDetails.shipping ? `
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Shipping:</td>
                    <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #1f2937;">$${orderDetails.shipping.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  ${orderDetails.tax ? `
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Tax:</td>
                    <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #1f2937;">$${orderDetails.tax.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 12px 0 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Total:</td>
                    <td style="padding: 12px 0 4px; font-size: 16px; font-weight: 600; text-align: right; color: #1f2937;">$${orderDetails.total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              ` : ''}
              
              <!-- Shipping Address -->
              ${orderDetails.shippingAddress ? `
              <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 6px;">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #1f2937;">Shipping Address</h3>
                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                  ${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}<br>
                  ${orderDetails.shippingAddress.address}<br>
                  ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}<br>
                  ${orderDetails.shippingAddress.country}
                </p>
              </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                Questions? Contact us at support@artisanmarket.com
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Artisan Market. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Artisan Market <orders@artisanmarket.com>',
        to: customerEmail,
        subject: config.subject,
        html: emailHtml
      })
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({ message: 'Unknown error' }));
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to send email: ${errorData.message || resendResponse.statusText}`
        }),
        {
          status: resendResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const emailResult = await resendResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order status email sent successfully",
        emailId: emailResult.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Server error: ${error.message}`
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});