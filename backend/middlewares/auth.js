const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    errorHandler(res, 401, 'Invalid or expired token');
  }
};

module.exports = protect;