import { dirname, join } from "path"

const currentDir = dirname('./')
export default {
    rota_raiz: currentDir,
    rota_upload: join(currentDir, 'src/upload/uploaded_file'),    
    rota_extraido: join(currentDir, 'src/upload/uncompressed_files'),
    rota_arquivo_extraido: (nomeArquivo: string):string => join(currentDir, 'src/upload/uncompressed_files',nomeArquivo)
    }
