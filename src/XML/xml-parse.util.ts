import { readdirSync, readFileSync } from 'fs';
import convert from 'xml-js';
import { Evento } from './evento.entity';
import { Nfe } from './nfe.entity';
import { PegarCapa, PegarInfoEvento } from './parse.util';
import { erro } from './reports.entity';

export class XmlParse {
    private caminho: string;
    private erros: Array<erro>;
    private eventos: Array<Evento>;
    private listaXML: Array<Nfe>;

    private LerArquivo(arquivo: string): Buffer {
        return readFileSync(this.caminho.concat(`/${arquivo}`))
    };

    private ExtrairInformacoes(conteudo: Buffer): Nfe {
        let json = JSON.parse(convert.xml2json(conteudo.toString(), { compact: true }));
        if (json.nfeProc !== undefined && json.nfeProc.protNFe !== undefined) // Se não tiver a tag principal, a primeira do XML && Se não tiver a tag do retorno da sefaz
            return PegarCapa(json)
        else {
            console.error(`${String(json.NFe.infNFe.Id).replace('NFe', '')}\n`)
        }
    }

    private RetornarArquivosValidos(arquivo: string) {
        try { //Se der erro ao no parse, podendo ser algum XML com erro, irá cair no catch
            const json = JSON.parse(convert.xml2json(readFileSync(this.caminho.concat(`/${arquivo}`), 'utf-8'), { compact: true }));
            if (readFileSync(this.caminho.concat(`/${arquivo}`), 'utf-8').length <= 2)
                this.erros.push({ nome: arquivo, motivo: 'Arquivo vazio' })

            else if (json.procEventoNFe && json.procEventoNFe.retEvento)
                this.eventos.push(PegarInfoEvento(json))

            else if (json.procEventoNFe)
                this.erros.push({ nome: arquivo, motivo: 'Arquivo de evento sem autorização' })

            else if (json.nfeProc == undefined)
                this.erros.push({ nome: arquivo, motivo: 'Sem autorização da SEFAZ' })

            else
                return json
        }
        catch (e) {
            this.erros.push({ nome: arquivo, motivo: 'Arquivo inválido/Sem documentação' })
        }
    };
    // ValidarArquivosPosTradados(Nfe: Nfe){
    //     if (Nfe != null || undefined || NaN) 
    //         return Nfe 
    // }
    // constructor(){
    //     this.erros = [];
    //     this.eventos = []
    //     this.listaXML = [];
    // }

    public Iniciar(rota: string) {
        this.erros = [];
        this.eventos = []
        this.listaXML = [];
        this.caminho = rota;        
        this.listaXML =
            readdirSync(this.caminho)
                .filter(this.RetornarArquivosValidos.bind(this))
                .map(this.LerArquivo.bind(this))
                .map(this.ExtrairInformacoes.bind(this))
        //.filter(this.ValidarArquivosPosTradados.bind(this))
        return {
            certos: this.listaXML,
            erros: this.erros != undefined ? this.erros : [],
            eventos: this.eventos != undefined ? this.eventos : []
        }

    }
}
