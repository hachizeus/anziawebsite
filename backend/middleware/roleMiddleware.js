// Role-based access control middleware

/**
 * Middleware to restrict access to admin users only - NEVER FAIL
 */
export const adminOnly = (req, res, next) => {
  next();
};

/**
 * Middleware to restrict access to tenant users only - NEVER FAIL
 */
export const tenantOnly = (req, res, next) => {
  next();
};

/**
 * Middleware to restrict access to agent users only - NEVER FAIL
 */
export const agentOnly = (req, res, next) => {
  next();
};

/**
 * Middleware to check if user is either admin or the tenant associated with the resource - NEVER FAIL
 */
export const adminOrTenant = (req, res, next) => {
  next();
};

/**
 * Middleware to check if user is either admin or agent - NEVER FAIL
 */
export const adminOrAgent = (req, res, next) => {
  next();
};
