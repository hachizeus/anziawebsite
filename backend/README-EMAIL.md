# Setting Up Gmail for Sending Inquiry Emails

To receive property inquiry emails at inquiries@Anzia Electronics .co.ke, follow these steps:

## 1. Create a Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Select "Security" from the left menu
3. Under "Signing in to Google," select "2-Step Verification" (enable it if not already enabled)
4. At the bottom of the page, select "App passwords"
5. Select "Mail" as the app and "Other" as the device
6. Enter "Makini Realtors" as the name
7. Click "Generate"
8. Google will display a 16-character password - **copy this password**

## 2. Update Your .env File

Update your `.env` file with:

```
EMAIL_USER=your_gmail@gmail.com  # The Gmail account you want to send FROM
EMAIL_PASS=your_16_character_app_password  # The app password you generated
INQUIRY_EMAIL=inquiries@Anzia Electronics .co.ke  # The email to receive inquiries
```

## 3. Important Notes

- Do NOT use your regular Gmail password - it won't work
- The app password is 16 characters without spaces
- Make sure NODE_ENV is set to "production" in your .env file
- The sending Gmail account needs enough quota (Gmail limits to 500 emails/day)
- Check your spam folder if emails aren't arriving

## 4. Testing

After setting up:

1. Restart your server
2. Submit a test inquiry through your website
3. Check both inbox and spam folders at inquiries@Anzia Electronics .co.ke

## 5. Troubleshooting

If emails still aren't arriving:

1. Check server logs for any SMTP errors
2. Verify the app password was entered correctly (no spaces)
3. Try using the same Gmail account for both sending and receiving