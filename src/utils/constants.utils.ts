import { DocumentBuilder } from "@nestjs/swagger";
import { dirname, join } from "path"
import { readFileSync } from "fs"

const currentDir = dirname('./')
const constantsUtils =  {
    rota_raiz: currentDir,
    rota_upload: join(currentDir, 'src/upload/uploaded_file'),
    rota_extraido: join(currentDir, 'src/upload/uncompressed_files'),
    rota_arquivo_extraido: (nomeArquivo: string): string => join(currentDir, 'src/upload/uncompressed_files', nomeArquivo),
    rota_arquivo_upado: (nomeArquivo: string): string => join(currentDir, 'src/upload/uploaded_file', nomeArquivo),
    cors: {
        options: {
            origin: ['https://leitorxml.herokuapp.com', 'http://leitorxml.herokuapp.com', 'https://localhost:3891'],
            methods: ['GET', 'PUT', 'POST'],
            preflightContinue: false
        }
    },
    swagger: {
        get config() {
            return new DocumentBuilder()
                .setTitle('Leitor XML')
                .setDescription('...')
                .setVersion('1.0')
                .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'access-token') // Definir para para quem for usar a anotação @ApiBearerAuth('access-token') no controller. Fonte: https://stackoverflow.com/questions/54802832/is-it-possible-to-add-authentication-to-access-to-nestjs-swagger-explorer
                .build();
        }
    },
    httpsOptions: {
        key: readFileSync(join(currentDir, 'private.pem')),
        cert: readFileSync(join(currentDir, 'cert.pem'))
    }
}
export default constantsUtils;