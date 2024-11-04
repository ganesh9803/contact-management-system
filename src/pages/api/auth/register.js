import bcrypt from 'bcryptjs';
import prisma from '@/utils/db';
import { validateUser } from '@/middleware/validation';

const registerUser = async (req, res) => {
  // Use the validateUser middleware for validation
  await validateUser(req, res, async () => {
    if (req.method === 'POST') {
      const { name, email, password } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        // Create the user in the database
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });
        res.status(201).json(user);
      } catch (error) {
        // Handle potential unique constraint violations
        if (error.code === 'P2002') { // Prisma unique constraint error
          return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ error: 'User registration failed' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

export default registerUser;
