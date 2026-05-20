const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class UsuariosController {

    constructor() {

    }

    async deletarUsuario(req, res){
        let ok = false;
        if(req.body.usuarioId != null && req.body.usuarioId > 0){
            let usuarioModel = new UsuarioModel();
            ok = usuarioModel.deletarUsuario(req.body.usuarioId);
        }
        res.send({ok: ok})
    }

    async criarView(req, res) {
        //chame o método que lista os perfis
        let perfilModel = new PerfilModel();
        let listaPerfil = await perfilModel.listar();
        res.render('usuarios/criar', { lista: listaPerfil });
    }

    async alterarView(req, res) {
        let usuarioModel = new UsuarioModel();
        if(req.params != null && req.params.id != null){
            let usuarioId = req.params.id;           
            usuarioModel = await usuarioModel.buscarUsuario(usuarioId);
        }
        let perfilModel = new PerfilModel();
        let listaPerfil = await perfilModel.listar();
        res.render('usuarios/alterar', { lista: listaPerfil, usuAlteracao: usuarioModel });
    }

    async listarView(req, res) {
        let usuario = new UsuarioModel();
        let listaUsuarios = await usuario.listarUsuarios();
        res.render('usuarios/listar', { lista: listaUsuarios });
    }

    async listarUsuarios(req, res){
        let usuario = new UsuarioModel();
        let listaUsuarios = await usuario.listarUsuarios();

        let listaUsu = [];

        for(let i = 0; i<listaUsuarios.length; i++){
            listaUsu.push({
                id: listaUsuarios[i].usuarioId,
                nome: listaUsuarios[i].usuarioNome,
                email: listaUsuarios[i].usuarioEmail,
                ativo: listaUsuarios[i].usuarioAtivo,
                perfilId: listaUsuarios[i].perfilId
            })
        }

        res.send({ lista: listaUsu, ok: true })
    }

    async alterarUsuario(req, res){
        let ok = false;
        if(req.body != null) {
            if(req.body.id > 0 && req.body.nome != null && req.body.email != null && req.body.senha != null && req.body.confSenha != null && req.body.perfilId != null && req.body.ativo != null) {
                if(req.body.senha == req.body.confSenha && req.body.perfilId > 0) {
                    let ativo = req.body.ativo ? "S" : "N";
                    let usuario = new UsuarioModel(req.body.id, req.body.nome, req.body.email, req.body.senha, ativo, req.body.perfilId);
                    usuario.usuarioId = req.body.id;
                    ok = usuario.gravarUsuario();
                }
            }
        }

        res.send({ ok: ok})
    }

    async gravarUsuario(req, res) {

        let ok = false;
        if(req.body != null) {
            if(req.body.nome != null && req.body.email != null && req.body.senha != null && req.body.confSenha != null && req.body.perfilId != null && req.body.ativo != null) {
                if(req.body.senha == req.body.confSenha && req.body.perfilId > 0) {
                    let ativo = req.body.ativo ? "S" : "N";
                    let usuario = new UsuarioModel(0, req.body.nome, req.body.email, req.body.senha, ativo, req.body.perfilId);
                    ok = usuario.gravarUsuario();
                }
            }
        }

        res.send({ ok: ok})
    }
}

module.exports = UsuariosController;