const Database = require('../db/database');

const conexao = new Database();

class PerfilModel {

    #perfilId;
    #perfilNome;

    get perfilId(){
        return this.#perfilId;
    }

    set perfilId(perfilId) {
        this.#perfilId = perfilId;
    }

    get perfilNome(){
        return this.#perfilNome;
    }

    set perfilNome(perfilNome) {
        this.#perfilNome = perfilNome;
    } 
    
    constructor(perfilId, perfilNome){
        this.#perfilId = perfilId;
        this.#perfilNome = perfilNome;
    }

    async listar() {
        let sql = "select * from tb_perfil";
        let listaRetorno = [];
        let rows = await conexao.ExecutaComando(sql);

        for(var i= 0; i < rows.length; i++){
            let row = rows[i];
            listaRetorno.push(new PerfilModel(row["per_id"], row["per_nome"]));
        }

        return listaRetorno;
    }

}

module.exports = PerfilModel;