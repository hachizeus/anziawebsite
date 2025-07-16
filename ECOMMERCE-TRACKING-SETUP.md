# E-commerce Tracking Setup Guide

This guide explains how to set up the e-commerce tracking system for Anzia Electronics.

## Database Setup

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the SQL from `supabase-ecommerce-tracking.sql` file
4. Run the SQL to create all necessary tables and functions

## Backend Setup

The backend API endpoints for tracking are already set up in:
- `backend/controller/trackingController.js`
- `backend/routes/trackingRoutes.js`

Make sure these files are included in your project and the routes are registered in `server.js`.

## Environment Variables

Add the following environment variables to your backend `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

## Frontend Integration

The frontend is already integrated with the tracking system through:
- `frontend/src/services/trackingService.js`
- `frontend/src/utils/apiClient.js`

These services are used in:
- Product detail page for tracking product views and add to cart actions
- Cart page for tracking cart updates and checkout

## Testing the Tracking System

1. Open your website and browse products
2. Add products to cart
3. Complete a checkout process
4. Check the Supabase tables to verify data is being recorded:
   - `user_actions` - All user interactions
   - `carts` - Active shopping carts
   - `cart_items` - Items in carts
   - `orders` - Completed orders
   - `order_items` - Items in orders
   - `recently_viewed` - Recently viewed products

## Analytics Dashboard

To create an analytics dashboard:

1. Connect your Supabase database to a BI tool like Metabase, PowerBI, or Tableau
2. Create visualizations for:
   - Product views over time
   - Add to cart conversion rate
   - Checkout conversion rate
   - Popular products
   - User journey analysis

## Extending the Tracking System

You can extend the tracking system by:

1. Adding more action types in `trackingController.js`
2. Creating new tracking functions in `trackingService.js`
3. Adding more tables to the Supabase database

## Troubleshooting

If tracking data is not being recorded:

1. Check browser console for errors
2. Verify API endpoints are working using browser developer tools
3. Check Supabase logs for any database errors
4. Ensure environment variables are correctly set

## Security Considerations

The tracking system uses:
- Row Level Security (RLS) in Supabase for data protection
- Session IDs for anonymous users
- JWT authentication for logged-in users

Make sure to regularly audit access to the tracking data and follow data privacy regulations.