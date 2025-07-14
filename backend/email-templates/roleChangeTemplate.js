export const getRoleChangeEmailTemplate = (user, role) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Account Role Updated</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Anzia Electronics  Account Update</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Update Details -->
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 20px;">Account Update Details</h2>
      <p style="margin: 8px 0; color: #374151;">
        <strong>Hello ${user.name},</strong>
      </p>
      <p style="margin: 8px 0; color: #374151;">
        Your account role has been updated to <strong style="color: #047857;">${role}</strong>.
      </p>
      <p style="margin: 8px 0; color: #374151;">
        <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #dcfce7; color: #166534;">Active</span>
      </p>
    </div>

    <!-- Role-specific Information -->
    <div style="margin-top: 30px;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">What This Means For You</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${role === 'tenant' ? `
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You now have access to the tenant dashboard
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can view your assigned properties
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can submit maintenance requests
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can manage your rental payments
          </li>
        ` : role === 'agent' ? `
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You now have access to the agent dashboard
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can list and manage properties
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can respond to product inquiries
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can track your product performance
          </li>
        ` : `
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You have standard user privileges
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can browse available properties
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
            You can schedule product viewings
          </li>
        `}
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}/login"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #10b981, #047857); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
        Login to Your Account
      </a>
    </div>

    <!-- Contact Support -->
    <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
      <p style="margin: 0; color: #4b5563;">
        Our support team is available 24/7 to assist you:
        <br>
        📧 <a href="mailto:support@Anzia Electronics .com" style="color: #10b981; text-decoration: none;">support@Anzia Electronics .com</a>
        <br>
        📞 <a href="tel:+254 726171515" style="color: #10b981; text-decoration: none;">+254 726171515</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <p style="color: #6b7280; font-size: 14px;">
      © ${new Date().getFullYear()} Anzia Electronics . All rights reserved.
    </p>
    <div style="margin-top: 10px;">
      <a href="${process.env.WEBSITE_URL}" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
      <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    </div>
  </div>
</div>
`;
