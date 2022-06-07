import { HttpException, Injectable } from '@nestjs/common';
import decompress from 'decompress'
import { rm } from 'fs';
import { join } from 'path';
import constantsUtils from 'src/constants.utils';
import { XmlService } from 'src/XML/xml.service';
const { rota_upload, rota_extraido } = constantsUtils

@Injectable()
export class UploadService {
    constructor(private readonly xmlService: XmlService) { }
    async descompactar(nomeArquivo: string) {
        const [nome, extensao] = nomeArquivo.split('.');
        try {            
            await decompress(join(rota_upload, nomeArquivo), join(rota_extraido, nome))
            return this.xmlService.gerarRelatorio(nome);
        }
        catch (e) {
            console.log(e)
            throw e
        }
        finally {
            //console.log(join(rota_upload, nomeArquivo));
            rm(join(rota_extraido, nome), {recursive: true} ,err => console.log(err))
            rm(join(rota_upload, nomeArquivo), {recursive: true} ,err => console.log(err))
        }
    }
}
