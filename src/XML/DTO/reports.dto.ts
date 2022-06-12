export interface ISoma_dia {
    data: String;
    total: number;
    quantidade: number;
}

export interface ISoma_por_CFOP {
    cfop: number; 
    total: number; 
    quantidade: number; 
    icms: number
}

export interface ITotal{
    total: number; 
    quantidade: number; 
    icms: number; 
    outro: number; 
    frete: number; 
    substituicao: number; 
    desconto: number; 
    ipi: number;
    ipidevolvido: number;
    valor_dos_produtos: number;
}

export interface IErro{
    nome: string;
    motivo: string;
}