import knex from 'knex';
import path from 'path';

module.exports =
{
    client: 'sqlite3',
    connection:{
        //ql o arquivo que vamos armazenar as coisas
        //quando usar caminhos, é bem bom usar a biblioteca path
        //ele retorna de acordo com o sistema operacional, padronizando
        // as barras, os acessos 
        filename: path.resolve(__dirname,'src', 'database', 'database.sqlite'),
    },
    migrations:{
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds:{
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
}


