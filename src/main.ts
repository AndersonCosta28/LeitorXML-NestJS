import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import constantsUtils from './utils/constants.utils';
import { recriar_pastas } from './utils/function.utils'; 
const { rota_extraido, rota_upload } = constantsUtils

async function bootstrap() {
  const { cors, swagger, httpsOptions } = constantsUtils
  const port = process.env.PORT || 8080
  const app = await NestFactory.create(AppModule, {httpsOptions});
  const document = SwaggerModule.createDocument(app, swagger.config);

  app.enableCors(cors.options)
  app.useGlobalPipes(new ValidationPipe());
  app.use(require('express-status-monitor')());

  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    recriar_pastas(rota_extraido)
    recriar_pastas(rota_upload)
    console.log('Servidor iniciado na porta: ' + port)
  })
}
bootstrap();
