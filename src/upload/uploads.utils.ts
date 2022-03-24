import { extname, join } from 'path';
import constantsUtils from 'src/constants.utils';

const { rota_upload } = constantsUtils

export const nomeArquivo = (req, file, callback) => {    
    callback(null,`XMLs${Date.now().toString().concat(extname(file.originalname))}`)
}

export const rotaArquivoUpload = rota_upload;

export const filtroArquivo = (req, file, callback) => {
    // console.log(file.mimetype === 'application/x-zip-compressed')
    // console.log(extname(file.originalname))
    // console.log(!!file.originalname.match(/\.(zip)$/))
    if (!file.originalname.match(/\.(zip)$/)) {
        return callback(new Error('Only zip files are allowed!'), false);
    }
    callback(null, true);
};