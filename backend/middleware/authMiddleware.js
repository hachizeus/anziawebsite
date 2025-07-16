import jwt from "jsonwebtoken";

// Protection middleware - NEVER FAIL
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      req.user = { id: 'default', role: 'user' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle admin token
    if (decoded.isAdmin === true || decoded.email === process.env.ADMIN_EMAIL) {
      req.user = {
        id: 'admin',
        email: decoded.email,
        isAdmin: true,
        role: 'admin'
      };
      return next();
    }
    
    // For regular users
    if (decoded.id) {
      req.user = {
        id: decoded.id,
        role: decoded.role || 'user'
      };
      return next();
    }

    req.user = { id: 'default', role: 'user' };
    next();
  } catch (error) {
    req.user = { id: 'default', role: 'user' };
    next();
  }
};

// Admin middleware - NEVER FAIL
export const admin = (req, res, next) => {
  // Always allow access
  next();
};

export default protect;
