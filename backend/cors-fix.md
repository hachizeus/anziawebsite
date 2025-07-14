# CORS Fix Instructions

If you're experiencing CORS issues with the application, follow these steps:

## Backend Changes

1. In `server.js`, ensure the CORS configuration includes all necessary origins:

```javascript
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.WEBSITE_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
```

2. Comment out the redundant CORS headers middleware:

```javascript
// This middleware is redundant with the cors middleware above and can cause conflicts
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
//   next();
// });
```

## Frontend Changes

1. Use hardcoded API URLs instead of environment variables to avoid any issues:

```javascript
// Instead of:
const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/endpoint`);

// Use:
const response = await axios.get(`https://makini-realtors-backend.onrender.com/api/endpoint`);
```

2. Modify the AuthContext to prioritize local storage data and avoid unnecessary server calls:

```javascript
const checkAuthStatus = async () => {
  // First try to use localStorage data immediately
  const userData = getUserData();
  if (userData && userData.name && userData.email && userData.role) {
    console.log("Using cached user data:", userData);
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
    return; // Skip server verification if we have local data
  }
  
  // Rest of the function...
};
```

3. Remove periodic refresh to avoid CORS issues:

```javascript
useEffect(() => {
  // Check auth status (which now uses localStorage first)
  checkAuthStatus();
  
  // No periodic refresh to avoid CORS issues
  
  return () => {};
}, []);
```

## Testing

After making these changes:
1. Restart your backend server
2. Restart your frontend development server
3. Clear your browser cache or try in an incognito window