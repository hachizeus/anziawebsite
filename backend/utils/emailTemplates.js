// Email templates for order notifications

const orderConfirmationTemplate = (order, user) => {
  const orderItems = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.productId?.images?.[0]?.url || 'https://via.placeholder.com/60x60'}" 
             alt="${item.productId?.name}" 
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.productId?.name || 'Product'}</strong><br>
        <small style="color: #666;">Qty: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        KSh ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Anzia Electronics</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <h1 style="margin: 0; font-size: 28px;">Anzia Electronics</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Your Electronics Partner</p>
      </div>

      <!-- Order Confirmation -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: #28a745; margin-top: 0;">✅ Order Confirmed!</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <strong>Order #${order._id.slice(-8)}</strong><br>
          <small style="color: #666;">Placed on ${new Date(order.createdAt).toLocaleDateString()}</small>
        </div>
      </div>

      <!-- Order Items -->
      <div style="margin-bottom: 20px;">
        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${orderItems}
          <tr style="background: #f8f9fa; font-weight: bold;">
            <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
            <td style="padding: 15px; text-align: right; color: #28a745; font-size: 18px;">
              KSh ${order.totalAmount.toLocaleString()}
            </td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">📍 Shipping Address</h3>
        <p style="margin: 0;">
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
          ${order.shippingAddress.zipCode} ${order.shippingAddress.country}
        </p>
      </div>

      <!-- Order Status Timeline -->
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">📦 Order Status</h3>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <div style="width: 20px; height: 20px; background: #28a745; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 12px;">✓</span>
          </div>
          <div>
            <strong>Order Confirmed</strong><br>
            <small style="color: #666;">We've received your order</small>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 10px; opacity: 0.5;">
          <div style="width: 20px; height: 20px; background: #ddd; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #666; font-size: 12px;">2</span>
          </div>
          <div>
            <strong>Processing</strong><br>
            <small style="color: #666;">Preparing your items</small>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 10px; opacity: 0.5;">
          <div style="width: 20px; height: 20px; background: #ddd; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #666; font-size: 12px;">3</span>
          </div>
          <div>
            <strong>Shipped</strong><br>
            <small style="color: #666;">On the way to you</small>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; opacity: 0.5;">
          <div style="width: 20px; height: 20px; background: #ddd; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #666; font-size: 12px;">4</span>
          </div>
          <div>
            <strong>Delivered</strong><br>
            <small style="color: #666;">Enjoy your purchase!</small>
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="margin-top: 0;">Need Help?</h3>
        <p>Contact our customer support team:</p>
        <p>
          📞 <strong>+254 769 162665</strong><br>
          📧 <strong>support@anziaelectronics.co.ke</strong><br>
          💬 <strong>WhatsApp: +254 769 162665</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p>Thank you for choosing Anzia Electronics!</p>
        <p>© ${new Date().getFullYear()} Anzia Electronics. All rights reserved.</p>
      </div>

    </body>
    </html>
  `;
};

const orderStatusUpdateTemplate = (order, user, newStatus) => {
  const statusMessages = {
    confirmed: { title: '✅ Order Confirmed', message: 'Your order has been confirmed and is being prepared.' },
    processing: { title: '⚙️ Order Processing', message: 'We are preparing your items for shipment.' },
    shipped: { title: '🚚 Order Shipped', message: 'Your order is on its way to you!' },
    delivered: { title: '📦 Order Delivered', message: 'Your order has been delivered. Enjoy your purchase!' },
    cancelled: { title: '❌ Order Cancelled', message: 'Your order has been cancelled. If you have any questions, please contact us.' }
  };

  const statusInfo = statusMessages[newStatus] || { title: 'Order Update', message: 'Your order status has been updated.' };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update - Anzia Electronics</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <h1 style="margin: 0; font-size: 28px;">Anzia Electronics</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Order Status Update</p>
      </div>

      <!-- Status Update -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #28a745; margin-top: 0; font-size: 24px;">${statusInfo.title}</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p style="font-size: 16px;">${statusInfo.message}</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <strong>Order #${order._id.slice(-8)}</strong><br>
          <small style="color: #666;">Status: ${newStatus.toUpperCase()}</small>
        </div>
      </div>

      <!-- Order Summary -->
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">Order Summary</h3>
        <p><strong>Items:</strong> ${order.items?.length || 0} item(s)</p>
        <p><strong>Total:</strong> KSh ${order.totalAmount.toLocaleString()}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      </div>

      ${newStatus === 'shipped' ? `
      <!-- Tracking Info -->
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
        <h3 style="margin-top: 0; color: #1976d2;">🚚 Tracking Information</h3>
        <p>Your order is now on its way! You can expect delivery within 2-3 business days.</p>
        <p><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
      </div>
      ` : ''}

      <!-- Contact Info -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="margin-top: 0;">Questions?</h3>
        <p>Contact us anytime:</p>
        <p>
          📞 <strong>+254 769 162665</strong><br>
          📧 <strong>support@anziaelectronics.co.ke</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p>Thank you for choosing Anzia Electronics!</p>
        <p>© ${new Date().getFullYear()} Anzia Electronics. All rights reserved.</p>
      </div>

    </body>
    </html>
  `;
};

export {
  orderConfirmationTemplate,
  orderStatusUpdateTemplate
};