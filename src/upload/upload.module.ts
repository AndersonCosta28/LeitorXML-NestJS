import { UploadService } from './upload.service';
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { XmlModule } from 'src/XML/xml.module';

@Module({
    imports: [XmlModule],
    controllers: [UploadController],
    providers: [UploadService],
    exports: []
})
export class UploadModule { }
