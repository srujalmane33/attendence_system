import { PrismaClient } from '@prisma/client';

// Initialize the single Prisma Client instance
const prisma = new PrismaClient();

// Named export for the connection verification function
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('MongoDB Atlas connected cleanly via Prisma ORM! 🚀');
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

// CRITICAL FIX: Explicit default export so controllers can read 'prisma' smoothly
export default prisma;