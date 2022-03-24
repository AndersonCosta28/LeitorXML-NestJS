import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { nomeArquivo, filtroArquivo, rotaArquivoUpload } from './uploads.utils';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: rotaArquivoUpload, filename: nomeArquivo }), fileFilter: filtroArquivo }))
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Object> {
        console.log(file);
        return this.uploadService.descompactar(file.filename);
    }
}
