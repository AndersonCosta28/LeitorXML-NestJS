import { readdirSync, readFileSync } from 'fs';
import convert from 'xml-js';
import { Evento } from './evento.entity';
import { Nfe } from './nfe.entity';
import { PegarCapa, PegarInfoEvento } from './parse.util';
import { erro } from './reports.entity';

let caminho : string;

const LerArquivo = (arquivo : string) => readFileSync(caminho.concat(`/${arquivo}`))

const ExtrairInformacoes = (conteudo: Buffer) => { 
    let json = JSON.parse(convert.xml2json(conteudo.toString(), { compact: true }));
    if (json.nfeProc !== undefined && json.nfeProc.protNFe !== undefined) // Se não tiver a tag principal, a primeira do XML && Se não tiver a tag do retorno da sefaz
        return PegarCapa(json)

    else {
        console.error(`${String(json.NFe.infNFe.Id).replace('NFe', '')}\n`)
    }
}
export default function Iniciar(rota: string) {
    caminho = rota
    const erros : Array<erro> = [];
    const eventos : Array<Evento> = [];
    const listaXML: Array<Nfe> = readdirSync(rota).filter(arquivo => {
        try { //Se der erro ao no parse, podendo ser algum XML com erro, irá cair no catch
            const json = JSON.parse(convert.xml2json(readFileSync(rota.concat(`/${arquivo}`), 'utf-8'), { compact: true }));
            if (readFileSync(rota.concat(`/${arquivo}`), 'utf-8').length <= 2)
                erros.push({ nome: arquivo, motivo: 'Arquivo vazio' })
            else if (json.procEventoNFe && json.procEventoNFe.retEvento)
                eventos.push(PegarInfoEvento(json))
            else if (json.procEventoNFe)
                erros.push({ nome: arquivo, motivo: 'Arquivo de evento sem autorização' })
            else if (json.nfeProc == undefined)
                erros.push({ nome: arquivo, motivo: 'Sem autorização da SEFAZ' })
            else
                return json
        }
        catch (e) {
            {                
                console.log('arquivos inválidos --> ' + arquivo)
                erros.push({ nome: arquivo, motivo: 'Arquivo inválido/Sem documentação' })
            }
        }
    }).map(LerArquivo).map(ExtrairInformacoes).filter((Nfe) => { if (Nfe == null || undefined || NaN) { /* Não faz nada */ } else { return Nfe } })
    return { certos: listaXML, erros, eventos }
}
