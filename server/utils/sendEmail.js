import nodemailer from "nodemailer";

export const sendOrderEmail = async (user, order, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Calculate GST (Assuming 5% GST for apparel as an example. Adjust as needed)
  const gstRate = 0.05; 
  const totalAmount = order.totalAmount || 0;
  const totalBeforeTax = (totalAmount / (1 + gstRate)).toFixed(2);
  const gstAmount = (totalAmount - totalBeforeTax).toFixed(2);
  const cgst = (gstAmount / 2).toFixed(2);
  const sgst = (gstAmount / 2).toFixed(2);

  // Generate HTML for the items list dynamically
  const itemsHtml = order.cartItems && order.cartItems.length > 0 
    ? order.cartItems.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eeeeee; color: #333333;">${item.title || 'Item'}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: center; color: #333333;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right; color: #333333;">₹${item.salePrice > 0 ? item.salePrice : item.price}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="3" style="padding: 12px; text-align: center; color: #888;">Items details included in attached PDF</td></tr>`;

  const orderDate = new Date(order.orderDate || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  await transporter.sendMail({
    from: `"Fashion City" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Confirmation & GST Invoice - ${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Invoice</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9fb; margin: 0; padding: 20px;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899, #a855f7); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Fashion City</h1>
              <p style="color: #fbcfe8; margin: 5px 0 0 0; font-size: 14px;">Thank you for your purchase!</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Tax Invoice</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="50%" style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                    <strong>Billed To:</strong><br>
                    ${user.name || 'Valued Customer'}<br>
                    ${user.email}
                  </td>
                  <td width="50%" style="color: #4b5563; font-size: 14px; line-height: 1.6; text-align: right;">
                    <strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}<br>
                    <strong>Date:</strong> ${orderDate}<br>
                    <strong>GSTIN:</strong> 07AAECM1234P1Z5 </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px; width: 100%;">
                <thead>
                  <tr>
                    <th style="padding: 12px; background-color: #f3f4f6; color: #374151; text-align: left; font-size: 14px; border-radius: 6px 0 0 6px;">Item Description</th>
                    <th style="padding: 12px; background-color: #f3f4f6; color: #374151; text-align: center; font-size: 14px;">Qty</th>
                    <th style="padding: 12px; background-color: #f3f4f6; color: #374151; text-align: right; font-size: 14px; border-radius: 0 6px 6px 0;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%"></td>
                  <td width="50%">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #4b5563;">
                      <tr>
                        <td style="padding: 6px 0;">Taxable Amount:</td>
                        <td style="padding: 6px 0; text-align: right;">₹${totalBeforeTax}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">CGST (2.5%):</td>
                        <td style="padding: 6px 0; text-align: right;">₹${cgst}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; border-bottom: 1px solid #eeeeee;">SGST (2.5%):</td>
                        <td style="padding: 6px 0; border-bottom: 1px solid #eeeeee; text-align: right;">₹${sgst}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #1f2937; font-size: 18px; font-weight: bold;">Grand Total:</td>
                        <td style="padding: 12px 0; color: #d946ef; font-size: 18px; font-weight: bold; text-align: right;">₹${totalAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                A detailed PDF invoice is attached to this email. <br>
                If you have any questions, reply to this email or contact <a href="mailto:support@fashioncity.com" style="color: #d946ef; text-decoration: none;">support@fashioncity.com</a>.
              </p>
            </td>
          </tr>
        </table>
        
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} Fashion City. All rights reserved.
        </p>

      </body>
      </html>
    `,
    attachments: [
      {
        filename: `Invoice_${order._id}.pdf`,
        path: pdfPath,
      },
    ],
  });
};