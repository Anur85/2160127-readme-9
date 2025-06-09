import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

const GLOBAL_PREFIX = 'blog';
const SPEC_PREFIX = 'spec';
const PORT = process.env.PORT || '3002';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
      .setTitle('Blog-сервис')
      .setDescription('Описание Blog-сервиса')
      .setVersion('1.0')
      .addTag(GLOBAL_PREFIX)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SPEC_PREFIX, app, document);

  await app.listen(PORT);

  Logger.log(`🚀 Swagger is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`);
}

bootstrap();
