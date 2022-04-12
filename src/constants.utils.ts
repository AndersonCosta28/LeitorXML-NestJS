import { DocumentBuilder } from "@nestjs/swagger";
import { dirname, join } from "path"

const currentDir = dirname('./')
export default {
    rota_raiz: currentDir,
    rota_upload: join(currentDir, 'src/upload/uploaded_file'),
    rota_extraido: join(currentDir, 'src/upload/uncompressed_files'),
    rota_arquivo_extraido: (nomeArquivo: string): string => join(currentDir, 'src/upload/uncompressed_files', nomeArquivo),
    cors: {
        options: {
            origin: ['https://leitorxml.herokuapp.com', 'http://leitorxml.herokuapp.com', 'leitorxml.herokuapp.com', 'https://leitorxml.herokuapp.com/upload', 'http://leitorxml.herokuapp.com/upload', 'leitorxml.herokuapp.com/upload', 'http://localhost:3000', 'https://localhost:3000'],
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
    }
}
