# Backend Configuration

This application is configured to use the Netlify backend environment.

## Backend Environment

**Netlify Backend**
- API URL: `https://anziabackend.netlify.app/api`
- Backend URL: `https://anziabackend.netlify.app`

## Backend Indicator

The application includes a backend indicator component that appears in the bottom-right corner of the screen, showing that the Netlify backend is being used.

## Health Check

The application includes an API health check component that appears in the bottom-left corner of the screen. This component will show the connection status to the current backend environment.

## Environment Variables

The backend URLs are configured in the `.env` file:

```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
VITE_NETLIFY_API_URL=https://anziabackend.netlify.app/api
VITE_NETLIFY_BACKEND_URL=https://anziabackend.netlify.app
```

If you need to change these URLs, update the `.env` file and restart the development server.