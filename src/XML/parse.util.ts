import { Nfe } from "./nfe.entity";
import { Produto } from "./produto.entity";

function PegarIPI(tributos: any): Number {
    if (tributos.IPI !== undefined) {
        return tributos.IPI.IPITrib === undefined ? 0 : Number(tributos.IPI.IPITrib.vIPI._text);
    } else {
        return 0
    };
}

function PegarIPIDevolvido(tributos: any) : number{
    if (tributos.impostoDevol !== undefined) {
        return tributos.impostoDevol.IPI.vIPIDevol === undefined ? 0 : Number(tributos.impostoDevol.IPI.vIPIDevol._text);
    } else {
        return 0
    };
}
function PegarItens(ListaDeProdutos: any): Array<Produto> {
    const listaprod = ListaDeProdutos[0].imposto !== undefined ? ListaDeProdutos : ListaDeProdutos[0]; // Encontrando em qual o "Body" podemos extrair os produtos
    const novalista = []
    for (let i = 0; i < listaprod.length; i++) {
        let produto = listaprod[i].prod;
        let icms = String(Object.keys(listaprod[i].imposto.ICMS))//
        let tributos = listaprod[i].imposto;
        let tributos_icms = tributos.ICMS[icms]
        let cstcsosn = tributos_icms.CSOSN !== undefined ? tributos_icms.CSOSN._text : tributos_icms.CST._text;
        let vDesc = produto.vDesc != undefined ? Number(produto.vDesc._text) : 0;
        let vBC = tributos_icms.vBC !== undefined ? Number(tributos_icms.vBC._text) : 0;
        let picms = tributos_icms.pICMS !== undefined ? Number(tributos_icms.pICMS._text) : 0;
        let vicms = tributos_icms.vICMS !== undefined ? Number(tributos_icms.vICMS._text) : 0;
        let vicmsST = tributos_icms.vICMSST !== undefined ? Number(tributos_icms.vICMSST._text) : 0;
        let vOutro = produto.vOutro !== undefined ? Number(produto.vOutro._text) : 0;
        let vFrete = produto.vFrete !== undefined ? Number(produto.vFrete._text) : 0;
        let CFOP = produto.CFOP !== undefined ? Number(produto.CFOP._text) : 0;
        let ipi = PegarIPI(tributos)
        let ipidevolvido = PegarIPIDevolvido(listaprod[i])
        let descricao = String(produto.xProd._text).replace('"', '');
        let vProd = Number(produto.vProd._text);
        let NCM = produto.NCM._text;
        let CodigoBarras = produto.cEAN._text;
        let embalagem = produto.uCom._text;
        let quantidade = Number(produto.qCom._text);
        let valorUnitario = Number(produto.vUnCom._text)
        novalista.push({ produto, tributos, icms, tributos_icms, cstcsosn, vDesc, vBC, picms, vicms, vicmsST, vOutro, vFrete, CFOP, descricao, ipi, vProd, NCM, CodigoBarras, embalagem, quantidade, valorUnitario, ipidevolvido })
    }
    return novalista
}
export function PegarCapa(json: any): Nfe {
    const Total = json.nfeProc.NFe.infNFe.total.ICMSTot;
    const IDE = json.nfeProc.NFe.infNFe.ide;
    return {
        numero: parseInt(IDE.nNF._text),
        modelo: parseInt(IDE.mod._text),
        serie: parseInt(IDE.serie._text),
        chave: (json.nfeProc.protNFe.infProt.chNFe._text),
        valor_dos_produtos: parseFloat(Total.vProd._text),
        valor_total: parseFloat(Total.vNF._text),
        data: new Date(String(json.nfeProc.protNFe.infProt.dhRecbto._text).trim()).toLocaleDateString('pt-BR'),
        status: json.nfeProc.protNFe.infProt.cStat._text,
        IPI: parseFloat(Total.vIPI._text),
        IPIdevolvido: parseFloat(Total.vIPIDevol._text),
        vOutro: parseFloat(Total.vOutro._text),
        vFrete: parseFloat(Total.vFrete._text),
        vBCST: parseFloat(Total.vBCST._text),
        vST: parseFloat(Total.vST._text),
        vBC: parseFloat(Total.vBC._text),
        vICMS: parseFloat(Total.vICMS._text),
        vPIS: parseFloat(Total.vPIS._text),
        vCOFINS: parseFloat(Total.vCOFINS._text),
        vTotTrib: Total.vTotTrib !== undefined ? parseFloat(Total.vTotTrib._text) : 0,
        desconto: parseFloat(Total.vDesc._text),
        data_recebimento: new Date(String(json.nfeProc.protNFe.infProt.dhRecbto._text).trim()),
        produto: PegarItens(Array(json.nfeProc.NFe.infNFe.det)),
        emitente: json.nfeProc.NFe.infNFe.emit.CNPJ._text
    }
}

export function PegarInfoEvento(json: any) {
    /* https://atendimento.tecnospeed.com.br/hc/pt-br/articles/360014146074-Rejei%C3%A7%C3%A3o-491-O-tpEvento-informado-inv%C3%A1lido
    Manifestação Destinatário: 210200, 210210, 210220, 210240
    Cancelar NF-e por Evento: 110111
    Envio de Pedido de Prorrogação: 111500, 111501
    Cancelar Pedido de Prorrogação: 111502, 111503
    Carta de Correção Eletrônica (CC-e): 110110 
*/
    const obj = {
        numero: parseInt(String(json.procEventoNFe.retEvento.infEvento.chNFe._text).substring(25,34)),
        modelo: parseInt(String(json.procEventoNFe.retEvento.infEvento.chNFe._text).substring(20,22)),
        serie: parseInt(String(json.procEventoNFe.retEvento.infEvento.chNFe._text).substring(22,25)),
        tpEvento : json.procEventoNFe.evento.infEvento.tpEvento._text,
        nSeqEvento: json.procEventoNFe.evento.infEvento.nSeqEvento._text,
        descEvento: json.procEventoNFe.evento.infEvento.detEvento.descEvento._text,
        xJust: json.procEventoNFe.evento.infEvento.detEvento.xJust._text,
        chave: json.procEventoNFe.retEvento.infEvento.chNFe._text,
        cStat: json.procEventoNFe.retEvento.infEvento.cStat._text,
        xMotivo: json.procEventoNFe.retEvento.infEvento.xMotivo._text,
        data: new Date(String(json.procEventoNFe.retEvento.infEvento.dhRegEvento._text).trim()).toLocaleDateString('pt-BR')
    }
    return obj;
}