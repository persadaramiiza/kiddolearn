import { Logger } from '@nestjs/common';
import { createNestApp } from './bootstrap';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await createNestApp();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  logger.log(`❤️ Health check: http://localhost:${port}/api/health`);
}
bootstrap();
