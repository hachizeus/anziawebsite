import jwt from 'jsonwebtoken';

// Simple token generation function
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET
  );
};

// No cookie functionality needed
export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return req.headers.authorization?.split(" ")[1] || null;
};
