import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/refreshTokenModel.js';

// Generate access token (short-lived)
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived token
  );
};

// Generate refresh token (long-lived)
export const generateRefreshToken = async (userId, userAgent, ipAddress) => {
  // Generate a secure random token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Set expiration to 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Save refresh token to database
  await RefreshToken.create({
    userId,
    token: refreshToken,
    expiresAt,
    userAgent,
    ipAddress
  });
  
  return refreshToken;
};

// Verify refresh token
export const verifyRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!refreshToken) {
    throw new Error('Invalid or expired refresh token');
  }
  
  return refreshToken;
};

// Revoke refresh token
export const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate(
    { token },
    { isRevoked: true }
  );
};

// Revoke all refresh tokens for a user
export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId },
    { isRevoked: true }
  );
};

// Get token from authorization header
export const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};
