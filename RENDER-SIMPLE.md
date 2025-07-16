# Deploying to Render

## Simple Backend Deployment

1. Go to your Render dashboard: https://dashboard.render.com/
2. Delete any existing services related to this project
3. Click "New" > "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: anzia-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: Free

6. Add the following environment variables:
   - `PORT`: 10000
   - `NODE_ENV`: production
   - `MONGODB_URI`: mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics
   - `MONGODB_DB_NAME`: anziaelectronics
   - `JWT_SECRET`: cd57c4c40415b68b920360bc1537f5d026ea58496733d8f37a948b12794e82c30e5b2a809f87a6c6ccc50f830aacedbe2b8922306ba90b322b17f41b3e03fc6c
   - `IMAGEKIT_PUBLIC_KEY`: public_ahoxvdF2fShMnKvheyP8TQrAKhE=
   - `IMAGEKIT_PRIVATE_KEY`: private_2giGXPBneW+SEkkpeZIG7djjhqw=
   - `IMAGEKIT_URL_ENDPOINT`: https://ik.imagekit.io/q5jukn457

7. Click "Create Web Service"

## Testing the Deployment

Once deployed, you can test the API with these endpoints:

- Health check: `https://your-render-url.onrender.com/health`
- Status: `https://your-render-url.onrender.com/status`
- API check: `https://your-render-url.onrender.com/api/db/check`