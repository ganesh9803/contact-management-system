// src/pages/api/users/profileRoute.js

import { authMiddleware } from '@/middleware/auth';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client // Adjust the path if necessary

const prisma = new PrismaClient(); // Instantiate Prisma Client

const handler = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the middleware
  console.log(userId);
  

  try {
    // Fetch user data from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
};

// Wrap the handler with the authentication middleware
export default authMiddleware(handler);
