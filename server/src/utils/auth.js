const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'testsecret';

function generateToken(user) {
  const payload = { id: user._id ? user._id.toString() : user.id, email: user.email };
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, authMiddleware };
