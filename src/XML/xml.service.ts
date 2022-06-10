import { Injectable } from '@nestjs/common';
import constantsUtils from 'src/utils/constants.utils';
import { XmlParse } from './xml-parse.util';
import { XmlReports } from './xml-reports.util';

const { rota_arquivo_extraido } = constantsUtils

@Injectable()
export class XmlService {
    constructor(private xmlParse: XmlParse, private xmlReports: XmlReports) { }

    async gerarRelatorio(nomeArquivo: string): Promise<Object> {
        const ArrayXML = this.xmlParse.Iniciar(rota_arquivo_extraido(nomeArquivo));
        console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------')
        return await this.xmlReports.GerarRelatorio(ArrayXML);
    }
}
