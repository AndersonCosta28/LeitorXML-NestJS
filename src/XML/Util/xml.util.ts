import { readdirSync, readFileSync } from 'fs';
import convert from 'xml-js';
import { IEvento } from '../DTO/evento.dto';
import { INfe } from '../DTO/nfe.dto';
import { PegarCapa, PegarInfoEvento } from './parse.util';
import { IErro, ISoma_dia, ISoma_por_CFOP, ITotal } from "../DTO/reports.dto";

class Total implements ITotal {
    total: number = 0;
    quantidade: number = 0;
    icms: number = 0;
    outro: number = 0;
    frete: number = 0;
    substituicao: number = 0;
    desconto: number = 0;
    ipi: number = 0;
    ipidevolvido: number = 0;
    valor_dos_produtos: number = 0;
}

export class XmlUtil {
    private caminho: string;
    private erros: Array<IErro>;
    private eventos: Array<IEvento>;
    private validos: Array<INfe>;
    private Soma_Dia: Map<String, ISoma_dia>;
    private Soma_CFOP: Map<number, ISoma_por_CFOP>;
    private Totalizador: Total;
    private Todas_As_Notas: Array<INfe>;

    private FiltrarArquivos(arquivo: string): void {
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

            else {
                let InformacoesDoXML: INfe = PegarCapa(json);
                this.Todas_As_Notas.push(InformacoesDoXML);
                this.TratarInformacoes(InformacoesDoXML);
            }
        }
        catch (e) {
            console.log(e)
            this.erros.push({ nome: arquivo, motivo: 'Arquivo inválido/Sem documentação' })
        }
    };

    private TratarInformacoes(XML: INfe) {
        this.PorDia(XML);
        this.PorCFOP(XML);
        this.Totalizar(XML);
    }

    private PorDia(XML: INfe): void {
        const chave: String = XML.data;
        const ValorAtual: ISoma_dia = {total: XML.valor_total, quantidade: 1, data: chave};

        if (this.Soma_Dia.has(chave)) {
            let ValorAnterior: ISoma_dia = this.Soma_Dia.get(chave);
            let NovoValor : ISoma_dia = { quantidade: ValorAtual.quantidade + ValorAnterior.quantidade , data: chave, total: ValorAnterior.total + ValorAtual.total}
            this.Soma_Dia.set(chave, NovoValor)
        }
        else
            this.Soma_Dia.set(chave, ValorAtual)
    }

    private PorCFOP(XML: INfe): void {
        XML.produto.forEach(produto => {
            let chave: number = produto.CFOP;
            let ValorAtual: ISoma_por_CFOP = { total: produto.vProd + produto.ipi + produto.vicmsST + produto.vOutro + produto.vFrete + produto.ipidevolvido, icms: produto.vicms, quantidade: 1, cfop: chave };
            if (this.Soma_CFOP.has(chave)) {
                let ValorAnterior: ISoma_por_CFOP = this.Soma_CFOP.get(chave);
                let NovoValor: ISoma_por_CFOP = { total: ValorAtual.total + ValorAnterior.total, icms: ValorAtual.icms + ValorAnterior.icms, quantidade: ValorAnterior.quantidade + ValorAtual.quantidade, cfop: chave }
                this.Soma_CFOP.set(chave, NovoValor)
            }
            else
                this.Soma_CFOP.set(chave, ValorAtual)
        })
    }

    private Totalizar(XML: INfe): void {
        this.Totalizador.total += XML.valor_total
        this.Totalizador.valor_dos_produtos += XML.valor_dos_produtos
        this.Totalizador.icms += XML.vICMS
        this.Totalizador.outro += XML.vOutro
        this.Totalizador.frete += XML.vFrete
        this.Totalizador.desconto += XML.desconto
        this.Totalizador.substituicao += XML.vST
        this.Totalizador.ipi += XML.IPI
        this.Totalizador.ipidevolvido += XML.IPIdevolvido
        this.Totalizador.quantidade += 1;
    }

    public Iniciar(rota: string) {
        this.erros = [];
        this.eventos = []
        this.validos = [];
        this.Todas_As_Notas = [];
        this.caminho = rota;
        this.Soma_Dia = new Map<String, ISoma_dia>();
        this.Soma_CFOP = new Map<number, ISoma_por_CFOP>();
        this.Totalizador = new Total();

        readdirSync(this.caminho)
            .forEach(this.FiltrarArquivos.bind(this))

        return (
            [Array.from(this.Soma_Dia.values()), this.Todas_As_Notas, this.Totalizador, Array.from(this.Soma_CFOP.values()), this.erros, this.eventos]
        )
    }
}
