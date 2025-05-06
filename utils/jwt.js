const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET_KEY, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken };
