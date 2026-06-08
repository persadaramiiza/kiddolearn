import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

export async function createNestApp(adapter?: AbstractHttpAdapter) {
  const logger = new Logger('Bootstrap');
  const app = adapter
    ? await NestFactory.create<NestExpressApplication>(AppModule, adapter, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      })
    : await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      });

  app.use(helmet());

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3333',
    'https://edutoon.space',
    'https://www.edutoon.space',
    ...(process.env.FRONTEND_URL?.split(',') ?? []),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('EduToon API')
    .setDescription('API untuk platform edukasi webtoon anak')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Profiles', 'Profile management')
    .addTag('Videos', 'Video management')
    .addTag('Quizzes', 'Quiz management')
    .addTag('Watch History', 'Watch history and video progress tracking')
    .addTag('Health', 'Health check endpoints')
    .addTag('Root', 'Root endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  return app;
}
