# Electronics E-commerce Website

A full-stack e-commerce website for electronics products built with React, Node.js, Express, and MongoDB.

## Project Structure

- **frontend**: React application for the customer-facing website
- **admin**: React application for the admin dashboard
- **backend**: Node.js/Express API server

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd admin && npm install
   cd backend && npm install
   ```

3. Create a `.env` file in the backend directory (see `.env.example` for required variables)

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Features

- User authentication (signup, login, logout)
- Product browsing and filtering
- Shopping cart functionality
- Admin dashboard for product management
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Image Storage**: ImageKit

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name
...
```