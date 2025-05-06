const { verifyToken } = require('../utils/jwt');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).send({ message: 'Token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;  // Attach user info to the request
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

module.exports = authenticateJWT;
