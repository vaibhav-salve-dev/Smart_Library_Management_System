import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  app.enableCors({
    origin: 'https://vaibhav-library.vercel.app',
    credentials: true,
  });

  const config =
    new DocumentBuilder()
      .setTitle(
        'Smart Library Management System API',
      )
      .setDescription(
        'API documentation for Library Management System',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  await app.listen(
    process.env.PORT ?? 3000,
  );
}

bootstrap();
