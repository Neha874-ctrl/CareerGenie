const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes by checking token validity.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token is invalid or has expired' });
  }
};

/**
 * Authorize specific roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user ? req.user.role : 'anonymous'} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
