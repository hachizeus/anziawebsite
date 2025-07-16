# Running Without MongoDB

If you're having issues with MongoDB connection, you can use the in-memory store as a fallback.

## Using In-Memory Store

The application now includes an in-memory user store that works without MongoDB. This is useful for development and testing when MongoDB is not available.

### Running with In-Memory Store

```bash
npm run dev:memory
```

This will start the server with the in-memory store enabled.

### Default Users

The in-memory store comes with these pre-configured users:

1. **Admin User**
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. **Customer User**
   - Email: customer@example.com
   - Password: customer123
   - Role: customer

### Testing In-Memory Store

To test if the in-memory store is working correctly:

```bash
npm run test-memory
```

## Limitations

When using the in-memory store:

1. Users are not persisted between server restarts
2. Only authentication features work (login, register)
3. User data is lost when the server is restarted

## Switching Back to MongoDB

When MongoDB becomes available, you can switch back to using it:

```bash
npm run dev
```

## Troubleshooting

If you're still having issues:

1. Make sure you're using the correct credentials
2. Try using the test user: test@example.com / password123
3. Check the server logs for any errors