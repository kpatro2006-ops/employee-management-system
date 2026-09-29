import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

// Authentication verification middleware
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'staffpulse_super_secret_jwt_key_2026'
      );

      req.user = await Employee.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in with a valid token'
    });
  }
};

// Strict Role-Based Access Control (RBAC) middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const currentRole = req.user.userRole || 'Employee';

    if (!roles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role "${currentRole}" is not authorized for this operation. Required: ${roles.join(' or ')}`
      });
    }

    next();
  };
};
