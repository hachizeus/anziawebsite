/**
 * Token utilities for authentication
 */

import jwt from 'jsonwebtoken';

// Generate access token (short-lived)
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret_key_for_development', {
    expiresIn: '15m' // Short-lived token
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_for_development', {
    expiresIn: '7d' // Longer-lived token
  });
};
