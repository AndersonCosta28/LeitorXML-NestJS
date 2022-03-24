import { Evento } from "./evento.entity";
import { Nfe } from "./nfe.entity";
import { erro, soma_dia, soma_por_CFOP, total } from "./reports.entity";

const somatorio = (acumulador = 0, atual = 0) => acumulador + atual;

export function Soma_Dia(listaXML: Array<Nfe>): Promise<Array<soma_dia>> {
    return new Promise((resolve, rejects) => {
        const result = [...new Set(listaXML.map(item => item.data))].sort().map(dia =>
        ({
            data: dia, total: listaXML.filter(nota => { if (dia == nota.data) return nota }).map(nota => nota.valor).reduce(somatorio), quantidade: listaXML.filter(nota => { if (dia == nota.data) return nota }).length
        })
        )
        console.log('Função: soma_dia - OK')
        resolve(result);
    })
}

export function Todas_As_Notas(listaXML: Array<Nfe>): Promise<Nfe[]>{
    return new Promise((resolve, rejects) => {
        console.log('Função: Todas_As_Notas - OK')
       resolve(listaXML);
    })
}

export function Todos_Os_Eventos(listaXML: Array<Evento>): Promise<Evento[]> {
    return new Promise((resolve, rejects) => {
        console.log('Função: Todas_As_Notas - OK')
       resolve(listaXML);
    })
}


export function total_de_erros(erros: Array<erro>): Promise<Array<erro>> {
    return new Promise((resolve, rejects) => {
        console.log('Função: total_de_erros - OK')
        resolve(erros)
    })
}

export function Total(listaXML: Array<Nfe>): Promise<total> {
    return new Promise((resolve, rejects) => {
        const total = listaXML.map(a => a.valor).reduce(somatorio);
        const icms = listaXML.map(a => a.vICMS).reduce(somatorio);
        const outro = listaXML.map(a => a.vOutro).reduce(somatorio);
        const frete = listaXML.map(a => a.vFrete).reduce(somatorio);
        const desconto = listaXML.map(a => a.desconto).reduce(somatorio);
        const substituicao = listaXML.map(a => a.vST).reduce(somatorio);
        const ipi = listaXML.map(a => a.IPI).reduce(somatorio);
        const quantidade = listaXML.length;
        console.log('Função: Total - OK')
        //console.log({ total, quantidade, icms, outro, frete, substituicao, desconto, ipi })
        resolve({ total, quantidade, icms, outro, frete, substituicao, desconto, ipi })
    })
};

export function Soma_CFOP(listaXML: Array<Nfe>): Promise<Array<soma_por_CFOP>> {
    return new Promise((resolve, rejects) => {
        const todos_produtos = []
        const soma_por_CFOP = []
        listaXML.forEach(nota => {
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