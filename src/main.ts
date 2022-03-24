import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: ['https://leitorxml.herokuapp.com', 'http://leitorxml.herokuapp.com', 'leitorxml.herokuapp.com', 'https://leitorxml.herokuapp.com/upload', 'http://leitorxml.herokuapp.com/upload', 'leitorxml.herokuapp.com/upload', 'http://localhost:3001'],
    methods: ['GET', 'PUT', 'POST'],
    preflightContinue: false
  }
  app.enableCors(options)
  await app.listen(3000);
}
bootstrap();
