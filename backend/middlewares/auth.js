const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorHandler(res, 401, 'No token provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; // Attach user ID to request
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    return errorHandler(res, 401, 'Invalid or expired token');
  }
};