import * as User from '../models/userModel.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  revokeRefreshToken,
  revokeAllUserTokens
} from '../services/tokenService.js';

// Refresh access token using refresh token
export const refreshAccessToken = async (req, res) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token required' 
      });
    }
    
    // Verify refresh token
    const tokenDoc = await verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findById(tokenDoc.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user._id, user.role);
    
    // Send new access token
    res.json({ 
      success: true, 
      accessToken 
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid refresh token' 
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Revoke refresh token
      await revokeRefreshToken(refreshToken);
      
      // Clear cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Revoke a specific token (admin or user can revoke their own tokens)
export const revokeToken = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    if (!tokenId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token ID required' 
      });
    }
    
    // Only admins or the token owner can revoke tokens
    if (req.user.role !== 'admin' && req.user._id !== tokenId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }
    
    await revokeRefreshToken(tokenId);
    
    res.json({ 
      success: true, 
      message: 'Token revoked successfully' 
    });
  } catch (error) {
    console.error('Revoke token error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
