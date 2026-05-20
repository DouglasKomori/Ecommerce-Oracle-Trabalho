const Database = require('../db/database');

const conexao = new Database();

class UsuarioModel {
    #usuarioId;
    #usuarioNome;
    #usuarioEmail;
    #usuarioSenha;
    #usuarioAtivo;
    #perfilId;
    #perfilNome;


    get usuarioId() { 
        return this.#usuarioId;
    }

    set usuarioId(usuarioId) {
        this.#usuarioId = usuarioId;
    }

    get usuarioNome() {
        return this.#usuarioNome;
    }

    set usuarioNome(usuarioNome) {
        this.#usuarioNome = usuarioNome;
    }

    get usuarioEmail() {
        return this.#usuarioEmail;
    }

    set usuarioEmail(usuarioEmail){
        this.#usuarioEmail = usuarioEmail;
    }

    get usuarioSenha() {
        return this.#usuarioSenha;
    }

    set usuarioSenha(usuarioSenha) {
        this.#usuarioSenha = usuarioSenha;
    }

    get usuarioAtivo(){
        return this.#usuarioAtivo;
    }

    set usuarioAtivo(usuarioAtivo) {
        this.#usuarioAtivo = usuarioAtivo;
    }

    get perfilId() {
        return this.#perfilId;
    }

    set perfilId(perfilId) {
        this.#perfilId = perfilId;
    }

    get perfilNome() {
        return this.#perfilNome;
    }

    set perfilNome(perfilNome){
        this.#perfilNome = perfilNome;
    }

    constructor(usuarioId, usuarioNome, 
        usuarioEmail, usuarioSenha, usuarioAtivo, perfilId, perfilNome) {
        this.#usuarioId = usuarioId;
        this.#usuarioNome = usuarioNome;
        this.#usuarioEmail = usuarioEmail;
        this.#usuarioSenha = usuarioSenha;
        this.#usuarioAtivo = usuarioAtivo;
        this.#perfilId = perfilId;
        this.#perfilNome = perfilNome;
    }

    async buscarUsuario(id){
        let sql = "select * from tb_usuario where usu_id = ?"
        let valores = [id];

        let rows = await conexao.ExecutaComando(sql, valores);
        if(rows.length > 0){
            return new UsuarioModel(rows[0]["usu_id"], rows[0]["usu_nome"], rows[0]["usu_email"], rows[0]["usu_senha"], rows[0]["usu_ativo"],
            rows[0]["per_id"]);
        }
        return null;
    }

    async listarUsuarios() {
        let sql = 'select * from tb_usuario u inner join tb_perfil p on u.per_id = p.per_id';
        let rows = await conexao.ExecutaComando(sql);

        let listaUsuarios = [];

        for(let i = 0; i<rows.length; i++){
            let row = rows[i];
            listaUsuarios.push(
                new UsuarioModel(row['usu_id'], row['usu_nome'], 
                row['usu_email'], row['usu_senha'], 
                row['usu_ativo'], row['per_id'], row['per_nome'])
            );
        }

        return listaUsuarios;
    }

    async gravarUsuario() {
        let result = false;
        if(this.#usuarioId == 0){
            let sql = "insert into tb_usuario (usu_nome, usu_email, usu_senha, usu_ativo, per_id) values (?, ?, ?, ?, ?)";
            let valores = [this.#usuarioNome, this.#usuarioEmail, this.#usuarioSenha, this.#usuarioAtivo, this.#perfilId];
    
            result = await conexao.ExecutaComandoNonQuery(sql, valores);
        }
        else{
            let sql = "update tb_usuario set usu_nome = ?, usu_email = ?, usu_senha = ?, usu_ativo = ?, per_id = ? where usu_id = ?";
            let valores = [this.#usuarioNome, this.#usuarioEmail, this.#usuarioSenha, this.#usuarioAtivo, this.#perfilId, this.#usuarioId];

            result = await conexao.ExecutaComandoNonQuery(sql, valores);
        }

        return result;

    }

    async deletarUsuario(usuarioId) {
        let sql = "delete from tb_usuario where usu_id = ?"
        let valores = [usuarioId];

        let result = conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async autenticarUsuario(email, senha){
        let sql = "select * from tb_usuario where usu_email = ? and usu_senha = ? and usu_ativo = 'S'"
        let valores = [email, senha];
        let rows = await conexao.ExecutaComando(sql, valores);
        if(rows.length > 0){
            return new UsuarioModel(rows[0]["usu_id"], rows[0]["usu_nome"], rows[0]["usu_email"], rows[0]["usu_senha"], rows[0]["usu_ativo"],
            rows[0]["per_id"]);
        }
        
        return null;
    }

}

module.exports = UsuarioModel;