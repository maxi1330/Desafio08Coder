const knex = require('knex');
const { db } = require('../utils/config.js');

class ContenedorSQL {

    constructor(nombreTabla){
        this.knexCli = knex(db);
        this.nombreTabla = nombreTabla;
    }

    async getAll(){
        try {
            return await this.knexCli.from(this.nombreTabla).select('*').orderBy('id', 'asc');
        } catch (error) {
            throw error;
        }
    }

    async getById(id){
        try {
            return await this.knexCli.from(this.nombreTabla).select('*').where({id: id});
        } catch (error) {
            throw error;
        }
    }

    async save(obj){
        try {
            return await this.knexCli(this.nombreTabla).insert(obj);
        } catch (error) {
            throw error;
        }
    }

    async update(id, obj){
        try {
            return await this.knexCli.from(this.nombreTabla).where({id: id}).update(obj);
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id){
        try {
            return await this.knexCli.from(this.nombreTabla).where({id: id}).del();
        } catch (error) {
            throw error;
        }
    }

    cerrarConexion(){
        this.knexCli.destroy();
    }

}

module.exports =  ContenedorSQL;