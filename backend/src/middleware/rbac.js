// backend/src/middleware/rbac.js

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Middleware to check if user has a specific role
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SUPER_ADMIN)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admins only.' });
};

// Middleware to check if user is Super Admin
export const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Super Admins only.' });
};
