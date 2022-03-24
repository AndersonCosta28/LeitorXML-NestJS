import { XmlModule } from './XML/xml.module';
import { XmlController } from './XML/xml.controller';
import { UploadModule } from './upload/upload.module';
import { UploadController } from './upload/upload.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [XmlModule, UploadModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
