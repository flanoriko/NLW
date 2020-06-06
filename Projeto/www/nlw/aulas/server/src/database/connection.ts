import knex from 'knex';
import path from 'path';


const connection = knex({
  client: 'sqlite3',
  connection:{
      //ql o arquivo que vamos armazenar as coisas
      //quando usar caminhos, é bem bom usar a biblioteca path
      //ele retorna de acordo com o sistema operacional, padronizando
      // as barras, os acessos 
      filename: path.resolve(__dirname,'database.sqlite'),
  },
      //__dirname sempre retorna o diretorio do arquivo q esta executando ele
      //no caso é o database.

      useNullAsDefault: true,
  
});
export default connection;

