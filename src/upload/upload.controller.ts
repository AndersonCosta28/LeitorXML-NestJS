import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { nomeArquivo, filtroArquivo, rotaArquivoUpload } from './uploads.utils';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: rotaArquivoUpload, filename: nomeArquivo }), fileFilter: filtroArquivo }))
    uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Object> {
        return this.uploadService.descompactar(file.filename);
    }
}
