import { Injectable } from '@nestjs/common';
import constantsUtils from 'src/utils/constants.utils'; 
import { XmlUtil } from './Util/xml.util'; 

const { rota_arquivo_extraido } = constantsUtils

@Injectable()
export class XmlService {
    constructor(private xmlUtil : XmlUtil) { }

    gerarRelatorio(nomeArquivo: string): Object {
        return this.xmlUtil.Iniciar(rota_arquivo_extraido(nomeArquivo));
    }
}
