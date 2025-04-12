import app from './app';
import prisma from './utils/prisma';
import config from './config';

const startServer = async () => {
  await prisma.$connect();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer().catch(async (e) => {
  await prisma.$disconnect();
  console.error(e);
  process.exit(1);
});