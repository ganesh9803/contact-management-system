// src/pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/utils/db';
import { validateUser } from '@/middleware/validation';

const loginHandler = async (req, res) => {
  // Use the validateUser middleware for validation
  await validateUser(req, res, async () => {
    if (req.method === 'POST') {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      // Check for user existence and password match
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ token });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

export default loginHandler;
