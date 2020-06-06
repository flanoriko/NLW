import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate , Joi} from 'celebrate';
//import Joi from '@hapi/joi';
//import { celebrate, Joi } from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);

//desacoplar as rotas do arquivo do server para este arquivos
const pointController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index); //qnd é lista, tem que colocar index como nome, pq eh padrao na comunidade!!
routes.get('/points/:id', pointController.show);
routes.get('/points', pointController.index); //criando uma nova rota com get lista

routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name:Joi.string().required(),
            email:Joi.string().required().email(),
            whatsapp:Joi.number().required(),
            latitude:Joi.number().required(),
            longitude:Joi.number().required(),
            city:Joi.string().required(),
            uf:Joi.string().required(),
            items:Joi.string().required()

        })
    },
    {abortEarly:false}
    ),
    pointController.create);
//single pq eh soh um arquivo. se fosse mais, usava o array
export default routes;
