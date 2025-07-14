export const getTenantAssignmentEmailTemplate = (data) => {
  const {
    userName,
    userEmail,
    productTitle,
    productAddress,
    rentAmount,
    leasePeriod,
    startDate,
    paymentDetails
  } = data;

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
    <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 20px; color: white; text-align: center; border-radius: 5px 5px 0 0;">
      <h1 style="margin: 0;">product Rental Confirmation</h1>
      <p style="margin: 5px 0 0;">Welcome to Makini Realtors</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e5e7eb;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Congratulations!</h2>
        <p>Dear ${userName},</p>
        <p>We are pleased to inform you that you have been assigned as a tenant for the following product:</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">product Details</h2>
        <p><strong>product:</strong> ${productTitle}</p>
        <p><strong>Address:</strong> ${productAddress}</p>
        <p><strong>Monthly Rent:</strong> ${rentAmount}</p>
        <p><strong>Lease Period:</strong> ${leasePeriod}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Payment Information</h2>
        <p>${paymentDetails}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Next Steps</h2>
        <p>You can now access your tenant dashboard by logging into your account. Your account has been updated with tenant privileges.</p>
        <p>Please log in to view your rental details, make payments, and submit maintenance requests.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.WEBSITE_URL}/login" style="background: linear-gradient(135deg, #10b981, #047857); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
        </div>
      </div>

      <div style="margin-bottom: 20px; background: #f9fafb; padding: 15px; border-radius: 5px;">
        <p><strong>Need help?</strong> If you have any questions or need assistance, please contact us at:</p>
        <p>Email: support@Anzia Electronics .com</p>
        <p>Phone: (123) 456-7890</p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>© ${new Date().getFullYear()} Makini Realtors. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
};
