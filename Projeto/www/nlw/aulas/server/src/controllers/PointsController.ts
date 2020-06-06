import { Request, Response } from 'express';
import knex from '../database/connection';


class PointsController {
    async index(request: Request, response: Response) {
        //cidade, uf, items --query parms
        //quando usa como filtro nao obrigatorio, usa o query parms

        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city)) //sempre fazer o  cast do formato quando vier de fora
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        
        const serializedPoints = points.map(point => {
            return {
                ...point,
               //image_url: `http://192.168.0.103:3333/uploads/${point.image}`,
              // image_url: `hhttp://192.168.15.7:3333/uploads/${point.image}`,
              image_url: `http://localhost:3333/uploads/${point.image}`,
            };
        });


        return response.json(serializedPoints);

    }

    async show(request: Request, response: Response) {
        const id = request.params.id;
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' });
        }
        const serializedPoint = {
            ...point,
            //image_url: `http://192.168.0.103:3333/uploads/${point.image}`,
           // image_url: `http://192.168.15.7:3333/uploads/${point.image}`,
           image_url: `http://localhost:3333/uploads/${point.image}`,
        };



        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');



        return response.json({point: serializedPoint, items });
    }

    //serializacao
    //api transform
    async create(request: Request, response: Response) {
        //quando se sabe os itens da tabela, pode colocar as colunas assim:
        //é igual a const name = request.body.name;

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        //é o begin!!!

        //quando o nome da variavel é igual ao da propriedade do banco, 
        //pode omitir.
        //dai nao precisa fazer name = name
        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            })
            console.log (request.body);     
        await trx('point_items').insert(pointItems); //é o end
        trx.commit();
        return response.json({
            id: point_id,
            ...point,
        });

    }



}
export default PointsController;