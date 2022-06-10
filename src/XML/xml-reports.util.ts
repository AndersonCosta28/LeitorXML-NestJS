import { HttpException } from "@nestjs/common";
import { appendFileSync, writeFileSync } from "fs";
import { Evento } from "./Entity/evento.entity";
import { Nfe } from "./Entity/nfe.entity";
import { erro, soma_dia, soma_por_CFOP, total } from "./Entity/reports.entity";

const somatorio = (acumulador = 0, atual = 0) => acumulador + atual;

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
                    .map(nota => nota.valor_total)
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

    Total_de_erros(): Promise<Array<erro>> {
        return new Promise((resolve, rejects) => {
            console.log('Função: total_de_erros - OK')
            resolve(this.listaXMLerros)
        })
    }

    Total(): Promise<total> {
        return new Promise((resolve, rejects) => {
            const total = this.listaXML.map(nota => nota.valor_total).reduce(somatorio);
            const valor_dos_produtos = this.listaXML.map(nota => nota.valor_dos_produtos).reduce(somatorio);
            const icms = this.listaXML.map(nota => nota.vICMS).reduce(somatorio);
            const outro = this.listaXML.map(nota => nota.vOutro).reduce(somatorio);
            const frete = this.listaXML.map(nota => nota.vFrete).reduce(somatorio);
            const desconto = this.listaXML.map(nota => nota.desconto).reduce(somatorio);
            const substituicao = this.listaXML.map(nota => nota.vST).reduce(somatorio);
            const ipi = this.listaXML.map(nota => nota.IPI).reduce(somatorio);
            const ipidevolvido = this.listaXML.map(nota => nota.IPIdevolvido).reduce(somatorio);
            const quantidade = this.listaXML.length;

            console.log('Função: Total - OK')
            resolve({ total, quantidade, icms, outro, frete, substituicao, desconto, ipi, ipidevolvido, valor_dos_produtos })
        })
    };

    Soma_CFOP(): Promise<Array<soma_por_CFOP>> {
        writeFileSync('./itens.txt', '');
        return new Promise((resolve, rejects) => {
            const todos_produtos = []
            const soma_por_CFOP = []
            this.listaXML.forEach(nota => {
                nota.produto.forEach(produto => {
                    todos_produtos.push({
                        CFOP: produto.CFOP,
                        valor_total: produto.vProd + produto.ipi + produto.vicmsST + produto.vOutro + produto.vFrete + produto.ipidevolvido,
                        ICMS: produto.vicms
                    })
                    if (produto.ipidevolvido)
                        console.log(produto.ipidevolvido);
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
        this.listaXMLEventos = eventos;
        return new Promise((resolve, rejects) => {
            Promise.all([this.Soma_Dia(), this.Todas_As_Notas(), this.Total(), this.Soma_CFOP(), this.Total_de_erros(), this.Todos_Os_Eventos()])
                .then(result => resolve(result))
                .catch(error => {
                    if (error == 'TypeError: Reduce of empty array with no initial value') {
                        rejects(new HttpException('Arquivo inválido, verifique se todos há algum XML válido para operação, em caso de dúvida descompacte e compacte novamente para importação.', 500))
                    }
                    else
                        rejects(error)
                })
        })
    }
}