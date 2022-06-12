import { IProduto } from "./produto.dto";

export interface INfe {
    numero: number;
    modelo: number;
    serie: number;
    chave: number;
    valor_total: number;
    valor_dos_produtos: number;
    data: String;
    status: String;
    IPI: number;
    IPIdevolvido: number;
    vOutro: number;
    vFrete: number;
    vBCST: number;
    vST: number;
    vBC: number;
    vICMS: number;
    vPIS: number;
    vCOFINS: number;
    vTotTrib: number;
    desconto: number;
    data_recebimento: Date;
    produto: Array<IProduto>;
    emitente: String;
}