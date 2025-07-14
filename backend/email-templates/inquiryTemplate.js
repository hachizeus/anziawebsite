export const getInquiryEmailTemplate = (inquiryData) => {
  const {
    name,
    email,
    phone,
    message,
    formType,
    productId,
    productTitle,
    moveInDate,
    leaseTerm,
    occupants,
    inquiryType
  } = inquiryData;

  // Determine if it's a rental inquiry
  const isRental = formType === 'rental';
  
  // Use the same HTML structure as the welcome email template
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
    <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 20px; color: white; text-align: center; border-radius: 5px 5px 0 0;">
      <h1 style="margin: 0;">New ${isRental ? 'Rental' : 'product'} Inquiry</h1>
      <p style="margin: 5px 0 0;">Anzia Electronics  Customer Inquiry</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e5e7eb;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">product Information</h2>
        <p><strong>product:</strong> ${productTitle}</p>
        <p><strong>product ID:</strong> ${productId}</p>
        ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ''}
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Customer Information</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        ${isRental ? `
        <p><strong>Preferred Move-in Date:</strong> ${moveInDate}</p>
        <p><strong>Lease Term:</strong> ${leaseTerm === 'flexible' ? 'Flexible' : `${leaseTerm} months`}</p>
        <p><strong>Number of Occupants:</strong> ${occupants}</p>
        ` : ''}
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Message</h2>
        <p style="background: #f9fafb; padding: 15px; border-radius: 5px;">${message}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>© ${new Date().getFullYear()} Makini Realtors. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
};
