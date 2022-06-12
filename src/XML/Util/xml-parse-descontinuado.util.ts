import { readdirSync, readFileSync } from 'fs';
import convert from 'xml-js';
import { IEvento } from '../DTO/evento.dto';
import { INfe } from '../DTO/nfe.dto';
import { PegarCapa, PegarInfoEvento } from './parse.util';
import { IErro } from '../DTO/reports.dto';

class XmlParse {
    private caminho: string;
    private erros: Array<IErro>;
    private eventos: Array<IEvento>;
    private listaXML: Array<INfe>;

    private FiltrarArquivos(arquivo: string): void {
        try { //Se der IErro ao no parse, podendo ser algum XML com IErro, irá cair no catch
            const json = JSON.parse(convert.xml2json(readFileSync(this.caminho.concat(`/${arquivo}`), 'utf-8'), { compact: true }));
            if (readFileSync(this.caminho.concat(`/${arquivo}`), 'utf-8').length <= 2)
                this.erros.push({ nome: arquivo, motivo: 'Arquivo vazio' })

            else if (json.procEventoNFe && json.procEventoNFe.retEvento)
                this.eventos.push(PegarInfoEvento(json))

            else if (json.procEventoNFe)
                this.erros.push({ nome: arquivo, motivo: 'Arquivo de evento sem autorização' })

            else if (json.nfeProc == undefined)
                this.erros.push({ nome: arquivo, motivo: 'Sem autorização da SEFAZ' })

            else if (json.nfeProc !== undefined && json.nfeProc.protNFe !== undefined) // Se não tiver a tag principal, a primeira do XML && Se não tiver a tag do retorno da sefaz
                this.listaXML.push(PegarCapa(json))

            else
                console.error(`${String(json.NFe.infNFe.Id).replace('NFe', '')}\n`)
        }
        catch (e) {
            this.erros.push({ nome: arquivo, motivo: 'Arquivo inválido/Sem documentação' })
        }
    };

    public Iniciar(rota: string) {
        this.erros = [];
        this.eventos = []
        this.listaXML = [];
        this.caminho = rota;
        readdirSync(this.caminho)
            .filter(this.FiltrarArquivos.bind(this))
        return {
            certos: this.listaXML,
            erros: this.erros != undefined ? this.erros : [],
            eventos: this.eventos != undefined ? this.eventos : []
        }
    }
}