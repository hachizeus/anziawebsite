export const getSchedulingEmailTemplate = (appointment, date, time, notes) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Viewing Scheduled</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Anzia Electronics  product Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>product:</strong> ${appointment.productId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${time}
        </p>
        ${notes ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Notes:</strong> ${notes}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">Pending</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
            We will confirm your appointment shortly
          </li>
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:inquiries@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">inquiries@Anzia Electronics .co.ke</a>
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
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;


export const getEmailTemplate = (appointment, status) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Anzia Electronics  product Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>product:</strong> ${appointment.productId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${appointment.time}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: ${
            status === 'confirmed' ? '#dcfce7' : status === 'cancelled' ? '#fee2e2' : '#fef3c7'
          }; color: ${
            status === 'confirmed' ? '#166534' : status === 'cancelled' ? '#991b1b' : '#854d0e'
          };">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${status === 'confirmed' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Arrive 10 minutes before your scheduled time
            </li>
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Bring valid identification
            </li>
          ` : status === 'cancelled' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #991b1b;">i</span>
              You can schedule another viewing at any time
            </li>
          ` : `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
              We will confirm your appointment shortly
            </li>
          `}
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:inquiries@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">inquiries@Anzia Electronics .co.ke</a>
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
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getNewsletterTemplate = (email) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Anzia Electronics !</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Premier Real Estate Newsletter</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #10b981;">${email}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Thank you for joining our community of product enthusiasts!
      </p>
    </div>

    <!-- Benefits Section -->
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 20px;">What You'll Get:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Latest product Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Real Estate Market Trends
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Exclusive product Deals
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Investment Opportunities
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #10b981, #047857); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
        Explore Properties
      </a>
    </div>

    <!-- Important Note -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        <strong style="color: #047857;">📝 Note:</strong> To ensure you don't miss our updates, please add
        <a href="mailto:inquiries@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">inquiries@Anzia Electronics .co.ke</a>
        to your contacts.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px; color: #10b981; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #10b981; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #10b981; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Anzia Electronics . All rights reserved.
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
      You can <a href="#" style="color: #10b981; text-decoration: none;">unsubscribe</a> at any time.
    </p>
  </div>
</div>
`;

export const getWelcomeTemplate = (name) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Anzia Electronics !</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Dream Home Awaits</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #10b981;">${name}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Welcome to our community of product enthusiasts! Your account has been successfully created.
      </p>
    </div>

    <!-- Features Section -->
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 20px;">Unlock These Features:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Browse Premium product Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Schedule product Viewings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Save Favorite Properties
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #d1fae5; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #10b981;">✓</span>
          Direct Contact with product Owners
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}/properties"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #10b981, #047857); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
        Start Exploring Properties
      </a>
    </div>

    <!-- Support Section -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Need Assistance?</h3>
      <p style="margin: 0; color: #4b5563;">
        Our support team is available 24/7:
        <br>
        📧 <a href="mailto:inquiries@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">inquiries@Anzia Electronics .co.ke</a>
        <br>
        📞 <a href="tel:+254 726171515" style="color: #10b981; text-decoration: none;">+254 726171515</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Anzia Electronics . All rights reserved.
    </p>
    <div style="margin-top: 10px;">
      <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    </div>
  </div>
</div>
`;

export const getproductNotificationTemplate = (product) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New product Alert!</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Fresh listing just added</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- product Details -->
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 24px;">${product.title}</h2>
      <p style="margin: 8px 0; color: #374151; font-size: 16px;">
        <strong>📍 Location:</strong> ${product.location}
      </p>
      <p style="margin: 8px 0; color: #374151; font-size: 16px;">
        <strong>💰 Price:</strong> KSh ${product.price?.toLocaleString() || 'Contact for price'}
      </p>
      ${product.beds ? `<p style="margin: 8px 0; color: #374151; font-size: 16px;"><strong>🛏️ Bedrooms:</strong> ${product.beds}</p>` : ''}
      ${product.baths ? `<p style="margin: 8px 0; color: #374151; font-size: 16px;"><strong>🚿 Bathrooms:</strong> ${product.baths}</p>` : ''}
      ${product.sqft ? `<p style="margin: 8px 0; color: #374151; font-size: 16px;"><strong>📐 Size:</strong> ${product.sqft} sqft</p>` : ''}
      <p style="margin: 8px 0; color: #374151; font-size: 16px;">
        <strong>🏠 Type:</strong> ${product.type || 'Residential'}
      </p>
    </div>

    ${product.description ? `
    <div style="margin-bottom: 30px;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Description</h3>
      <p style="color: #4b5563; line-height: 1.6;">${product.description}</p>
    </div>
    ` : ''}

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL || 'https://Anzia Electronics .co.ke'}/properties/${product._id}"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #10b981, #047857); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
        View product Details
      </a>
    </div>

    <!-- Contact Info -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Interested? Contact Us</h3>
      <p style="margin: 0; color: #4b5563;">
        📧 <a href="mailto:inquiries@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">inquiries@Anzia Electronics .co.ke</a>
        <br>
        📞 <a href="tel:+254726171515" style="color: #10b981; text-decoration: none;">+254 726 171 515</a>
        ${product.phone ? `<br>📱 <a href="tel:${product.phone}" style="color: #10b981; text-decoration: none;">${product.phone}</a>` : ''}
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <p style="color: #6b7280; font-size: 14px;">
      © ${new Date().getFullYear()} Makini Realtors. All rights reserved.
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
      You can <a href="#" style="color: #10b981; text-decoration: none;">unsubscribe</a> at any time.
    </p>
  </div>
</div>
`;

export const getCustomNewsletterTemplate = (subject, content) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${subject}</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Makini Realtors Newsletter</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <div style="color: #374151; line-height: 1.8;">
      ${content.replace(/\n/g, '<br>')}
    </div>

    <!-- Contact Info -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Contact Us</h3>
      <p style="margin: 0; color: #4b5563;">
        📧 <a href="mailto:inquiries@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">inquiries@Anzia Electronics .co.ke</a>
        <br>
        📞 <a href="tel:+254726171515" style="color: #10b981; text-decoration: none;">+254 726 171 515</a>
        <br>
        🌐 <a href="${process.env.WEBSITE_URL || 'https://Anzia Electronics .co.ke'}" style="color: #10b981; text-decoration: none;">Anzia Electronics .co.ke</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <p style="color: #6b7280; font-size: 14px;">
      © ${new Date().getFullYear()} Makini Realtors. All rights reserved.
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
      You can <a href="#" style="color: #10b981; text-decoration: none;">unsubscribe</a> at any time.
    </p>
  </div>
</div>
`;

export const getPasswordResetTemplate = (resetUrl) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Anzia Electronics  Account Security</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Security Notice Box -->
      <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #047857; margin: 0 0 15px 0; font-size: 20px;">Password Reset Request</h2>
        <p style="margin: 8px 0; color: #374151;">
          We received a request to reset your password for your Anzia Electronics  account. For your security, this link will expire in 10 minutes.
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #10b981, #047857); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
          Reset Password
        </a>
      </div>

      <!-- Security Tips -->
      <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Security Notice</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fde68a; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #92400e;">!</span>
            If you didn't request this password reset, please ignore this email
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fde68a; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #92400e;">!</span>
            Never share this email or your password with anyone
          </li>
        </ul>
      </div>

      <!-- Support Section -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          If you didn't request this reset or need assistance:
          <br>
          📧 <a href="mailto:management@Anzia Electronics .co.ke" style="color: #10b981; text-decoration: none;">management@Anzia Electronics .co.ke</a>
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
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #10b981; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;
