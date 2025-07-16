# Anzia Electronics Backend

## MongoDB User Authentication Fix

If you're experiencing issues where users can log in but aren't saved in the MongoDB database, follow these steps to fix the problem:

### Quick Fix

Run the following command to fix the users and start the server:

```bash
npm run fix-all
```

This will:
1. Create any missing test users in the database
2. Start the server with the fixed database

### Step-by-Step Fix

1. Check MongoDB connection:
```bash
npm run check-mongodb
```

2. Fix missing users:
```bash
npm run fix-users
```

3. Start the server:
```bash
npm run dev
```

### Default Test Users

The fix creates the following test users if they don't exist:

1. **Admin User**
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. **Customer User**
   - Email: customer@example.com
   - Password: customer123
   - Role: customer

3. **Test User**
   - Email: test@example.com
   - Password: password123
   - Role: customer

### Verifying the Fix

After running the fix, you can check if users are properly saved in the database by visiting:

```
http://localhost:4000/api/db/check
```

This endpoint will show:
- MongoDB connection status
- List of collections
- Number of users in the database
- Sample user data (without password)

## MongoDB Connection

The application uses MongoDB for data storage. Make sure MongoDB is running and accessible.

- Default connection: `mongodb://localhost:27017/anziaelectronics`
- You can override this by setting the `MONGODB_URI` environment variable

## User Roles

- New users are automatically assigned the `customer` role
- Only users with the `admin` role can access the admin features
- Admin users can change user roles