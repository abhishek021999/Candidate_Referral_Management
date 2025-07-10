const jwt = require('jsonwebtoken');

module.exports = function (roles = []) {
  // roles param can be a single role string (e.g. 'admin') or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient role' });
      }
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
}; 