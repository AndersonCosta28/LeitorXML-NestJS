import { extname, join } from 'path';
import constantsUtils from 'src/utils/constants.utils';

const { rota_upload } = constantsUtils

export const nomeArquivo = (req, file, callback) => {    
    //callback(null,`XMLs${extname(file.originalname)}`)
    callback(null,`XMLs${Date.now().toString().concat(extname(file.originalname))}`) // Sempre gerar um arquivo diferente
}

export const rotaArquivoUpload = rota_upload;

export const filtroArquivo = (req, file, callback) => {
    if (!file.originalname.match(/\.(zip)$/)) {
        return callback(new Error('Only zip files are allowed!'), false);
    }
    callback(null, true);
};