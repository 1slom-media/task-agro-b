import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub_category/sub_category.module';
import { EventsModule } from './events/events.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
    ],
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.use(cookieParser());
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 1 }),
  );
  const options = new DocumentBuilder()
    .setTitle('swagger api documentation')
    .setDescription('The  API description')
    .setVersion('1.0')
    .addTag('Agrobank Task')
    .build();
  const Document = SwaggerModule.createDocument(app, options, {
    include: [CategoryModule, SubCategoryModule, EventsModule],
  });
  SwaggerModule.setup('api', app, Document);
  await app.listen(3000);
}
bootstrap();
