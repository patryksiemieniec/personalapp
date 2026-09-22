import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { RequestValidationException } from './common/http/request-validation.exception.js';
import { mapValidationErrors } from './common/http/validation-errors.mapper.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      exceptionFactory: (errors) => {
        return new RequestValidationException(mapValidationErrors(errors));
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
