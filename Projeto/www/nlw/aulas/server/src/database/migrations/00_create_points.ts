import Knex from 'knex';
//quando quer pegar o TIPO do type script, usa letra maiuscula
//como String, Number.

export async function up(knex:Knex) //Apenas colocando o tipo Knex, 
                                    //aparecem todos os metodos.
{
    //UP: realizar as criações no banco
 return knex.schema.createTable('points', table => {
     table.increments('id').primary();
     table.string('image').notNullable;
     table.string('name').notNullable;
     table.string('email').notNullable;
     table.string('whatsapp').notNullable;
     table.decimal('latitude').notNullable;
     table.decimal('longitude').notNullable;
     table.string('city').notNullable; //senao coloca nada, qual o tamanho?
     table.string('uf',2).notNullable; 
  })
} 
export async function down (knex:Knex)
//DOWN:voltar atras, deletar a tabela. 
//Faz o contrario do metodo up.
//Se o up cria tabela, o down dropa a tabela
//se o up cria coluna, o down dropa a coluna
{
  return knex.schema.dropTable('points');
}