const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
