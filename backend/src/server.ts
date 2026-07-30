import { config } from 'dotenv';
config();

import app from './app';
import { logger } from './config/logger';
import { prisma } from './config/database';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Base de datos conectada');

    app.listen(PORT, () => {
      logger.info(`Servidor iniciado en el puerto ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Error al iniciar el servidor');
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido. Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recibido. Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
