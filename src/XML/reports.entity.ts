export interface soma_dia {
    data: String;
    total: number;
    quantidade: number;
}

export interface soma_por_CFOP {
    cfop: number; 
    total: number; 
    quantidade: number; 
    icms: number
}

export interface total{
    total: number; 
    quantidade: number; 
    icms: number; 
    outro: number; 
    frete: number; 
    substituicao: number; 
    desconto: number; 
    ipi: number;
}

export interface erro{
    nome: string;
    motivo: string;
}