import { Produto } from "./produto.entity";

export class Nfe {
    numero: number;
    modelo: number;
    serie: number;
    chave: number;
    valor: number;
    data: String;
    status: String;
    IPI: number;
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
    produto: Array<Produto>;
    emitente: String;
}