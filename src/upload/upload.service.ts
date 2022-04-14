import { HttpException, Injectable } from '@nestjs/common';
import decompress from 'decompress'
import { join } from 'path';
import constantsUtils from 'src/constants.utils';
import { XmlService } from 'src/XML/xml.service';

const { rota_upload, rota_extraido } = constantsUtils

@Injectable()
export class UploadService {
    constructor(private readonly xmlService: XmlService) { }
    async descompactar(nomeArquivo: string) {
        try {
            const [nome, extensao] = nomeArquivo.split('.')
            await decompress(join(rota_upload, nomeArquivo), join(rota_extraido, nome))
            return this.xmlService.gerarRelatorio(nome);
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }
}
