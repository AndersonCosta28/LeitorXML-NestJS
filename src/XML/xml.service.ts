import { HttpException, Injectable } from '@nestjs/common';
import constantsUtils from 'src/constants.utils';
import Iniciar from './xml.parse';
import { Soma_Dia, Todas_As_Notas, total_de_erros, Total, Soma_CFOP, Todos_Os_Eventos } from './xml.reports';
import { recriar_pastas } from './xml.util';

const { rota_arquivo_extraido } = constantsUtils

@Injectable()
export class XmlService {
    gerarRelatorio(nomeArquivo: string): Promise<Object> {


        const { certos, erros, eventos } = Iniciar(rota_arquivo_extraido(nomeArquivo));
        console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------')
        return new Promise((resolve, rejects) => {
            Promise.all([Soma_Dia(certos), Todas_As_Notas(certos), Total(certos), Soma_CFOP(certos), total_de_erros(erros), Todos_Os_Eventos(eventos)])
                .then(result => resolve(result))
                .catch(error => {
                    if(error == 'TypeError: Reduce of empty array with no initial value'){
                        rejects(new HttpException('Arquivo inválido, verifique se todos há algum XML válido para operação, em caso de dúvida descompacte e compacte novamente para importação',500))
                    }
                    else                    
                    rejects(error)
                })
            // .finally(() => {
            //     //recriar_pastas(rota_arquivo_extraido(nomeArquivo))
            // })
        })
    }
}
