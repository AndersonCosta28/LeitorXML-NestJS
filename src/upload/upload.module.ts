import { UploadService } from './upload.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { XmlService } from 'src/XML/xml.service';

@Module({
    imports: [],
    controllers: [UploadController],
    providers: [UploadService, XmlService],
    exports: []
})
export class UploadModule { }
