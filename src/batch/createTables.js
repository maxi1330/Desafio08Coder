const knex = require('knex');
const { db } = require('../utils/config.js');

const knexCli = knex(db);

knexCli.schema.dropTableIfExists('mensajes')
    .then(()=>{
        knexCli.schema.createTable('mensajes', table => {
            table.increments('id').primary();
            table.string('mail', 50).notNullable();
            table.string('hora', 50).notNullable();
            table.string('texto', 50).notNullable();
        })
            .then(()=> console.log("Tabla mensajes creada"))
            .catch(err=> {
                console.log(err);
                throw err;
            })
            .finally(()=>{
                knexCli.destroy();
            });
    });

knexCli.schema.dropTableIfExists('productos')
    .then(()=>{
        knexCli.schema.createTable('productos', table => {
            table.increments('id').primary();
            table.string('title', 50).notNullable();
            table.integer('price', 50).notNullable();
            table.string('thumbnail').notNullable();
        })
            .then(()=> console.log("Tabla productos creada"))
            .catch(err=> {
                console.log(err);
                throw err;
            })
            .finally(()=>{
                knexCli.destroy();
            });
    });
