import { XmlModule } from './XML/xml.module';
import { UploadModule } from './upload/upload.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig),XmlModule, UploadModule, AuthModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
