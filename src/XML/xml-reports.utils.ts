import { HttpException } from "@nestjs/common";
import constantsUtils from "src/constants.utils";
import { Evento } from "./evento.entity";
import { Nfe } from "./nfe.entity";
import { erro, soma_dia, soma_por_CFOP, total } from "./reports.entity";
import { recriar_pastas } from "./xml.util";

const somatorio = (acumulador = 0, atual = 0) => acumulador + atual;
const { rota_extraido, rota_upload } = constantsUtils

export class XmlReports {
    listaXML: Array<Nfe>;
    listaXMLEventos: Array<Evento>;
    listaXMLerros: Array<erro>;

    Soma_Dia(): Promise<Array<soma_dia>> {
        return new Promise((resolve, rejects) => {
            const result = [...new Set(this.listaXML.map(item => item.data))].sort().map(dia =>
            ({
                data: dia,
                total: this.listaXML.filter(nota => { if (dia == nota.data) return nota })
                    .map(nota => nota.valor)
                    .reduce(somatorio),

                quantidade: this.listaXML.filter(nota => { if (dia == nota.data) return nota }).length
            })
            )
            console.log('Função: soma_dia - OK')
            resolve(result);
        })
    }

    Todas_As_Notas(): Promise<Nfe[]> {
        return new Promise((resolve, rejects) => {
            console.log('Função: Todas_As_Notas - OK')
            resolve(this.listaXML);
        })
    }

    Todos_Os_Eventos(): Promise<Evento[]> {
        return new Promise((resolve, rejects) => {
            console.log('Função: Todas_As_Notas - OK')
            resolve(this.listaXMLEventos);
        })
    }


    total_de_erros(): Promise<Array<erro>> {
        return new Promise((resolve, rejects) => {
            console.log('Função: total_de_erros - OK')
            resolve(this.listaXMLerros)
        })
    }

    Total(): Promise<total> {
        return new Promise((resolve, rejects) => {
            const total = this.listaXML.map(a => a.valor).reduce(somatorio);
            const icms = this.listaXML.map(a => a.vICMS).reduce(somatorio);
            const outro = this.listaXML.map(a => a.vOutro).reduce(somatorio);
            const frete = this.listaXML.map(a => a.vFrete).reduce(somatorio);
            const desconto = this.listaXML.map(a => a.desconto).reduce(somatorio);
            const substituicao = this.listaXML.map(a => a.vST).reduce(somatorio);
            const ipi = this.listaXML.map(a => a.IPI).reduce(somatorio);
            const quantidade = this.listaXML.length;
            console.log('Função: Total - OK')
            resolve({ total, quantidade, icms, outro, frete, substituicao, desconto, ipi })
        })
    };

    Soma_CFOP(): Promise<Array<soma_por_CFOP>> {
        return new Promise((resolve, rejects) => {
            const todos_produtos = []
            const soma_por_CFOP = []
            this.listaXML.forEach(nota => {
                nota.produto.forEach(produto => {
                    todos_produtos.push({
                        CFOP: produto.CFOP,
                        valor_total: produto.vProd + produto.ipi + produto.vicmsST + produto.vOutro + produto.vFrete - produto.vDesc,
                        ICMS: produto.vicms
                    })
                })
            })
            const t = Object.values(todos_produtos)
            const unique = [...new Set(t.map(item => item.CFOP))];
            unique.forEach(cfop => {
                const quantidade = todos_produtos.filter(produto => { if (produto.CFOP == cfop) return produto }).length
                const total = todos_produtos.filter(produto => { if (produto.CFOP == cfop) return produto }).map(produto => produto.valor_total).reduce(somatorio)
                const icms = todos_produtos.filter(produto => { if (produto.CFOP == cfop) return produto }).map(produto => produto.ICMS).reduce(somatorio)
                soma_por_CFOP.push({ cfop, total, quantidade, icms })
            })
            console.log('Função: soma_CFOP - OK')
            resolve(soma_por_CFOP)
        })
    }
    GerarRelatorio(ArrayXML: any) {
        const { certos, erros, eventos } = ArrayXML
        this.listaXML = certos;
        this.listaXMLerros = erros;
        this.listaXMLEventos = eventos
            ;
        return new Promise((resolve, rejects) => {
            Promise.all([this.Soma_Dia(), this.Todas_As_Notas(), this.Total(), this.Soma_CFOP(), this.total_de_erros(), this.Todos_Os_Eventos()])
                .then(result => { console.log(result); resolve(result) })
                .catch(error => {
                    if (error == 'TypeError: Reduce of empty array with no initial value') {
                        rejects(new HttpException('Arquivo inválido, verifique se todos há algum XML válido para operação, em caso de dúvida descompacte e compacte novamente para importação', 500))
                    }
                    else
                        rejects(error)
                })
                .finally(() => {
                    recriar_pastas(rota_extraido)
                    recriar_pastas(rota_upload)
                })
        })
    }
}
