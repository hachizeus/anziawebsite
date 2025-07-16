# API Tests

This directory contains tests for the API endpoints.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   API_URL=http://localhost:4000/api
   NETLIFY_URL=https://anziabackend.netlify.app/.netlify/functions
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```

3. Add a test image named `test-image.jpg` in this directory.

## Running Tests

```
npm test
```

This will run all the API tests and output the results to the console.