import jwt from 'jsonwebtoken';

export const authMiddleware = (handler) => async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; 
    return handler(req, res);
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

