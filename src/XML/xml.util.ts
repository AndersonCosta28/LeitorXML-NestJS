import { existsSync, mkdirSync, rmSync } from 'fs';
export function recriar_pastas(rota: string){
    if (!existsSync(rota)) {
        mkdirSync(rota);
    }
    else {
        rmSync(rota, { recursive: true })
        mkdirSync(rota);
    }
}