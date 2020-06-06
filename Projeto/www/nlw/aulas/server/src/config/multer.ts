import multer from 'multer';
import path from 'path';
import crypto from 'crypto';


export default {
    storage: multer.diskStorage(
        {
            destination: path.resolve(__dirname, '..', '..', 'uploads'),
            //onde as imagens serao guardadas no servidor?
            filename(request, file, callback) {
                const hash = crypto.randomBytes(6).toString('hex');
                //nao pode usar o nome do arquivo q vem do pc do usuario, 
                //tem q gerar um nome unico

                const filename = `${hash}-${file.originalname}`;
                callback(null, filename);


            }

        }
    )
}