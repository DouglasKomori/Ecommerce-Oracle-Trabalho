const express = require('express');
const multer = require("multer");
const ProdutoController = require('../controllers/produtoController');
const Autenticacao = require('../middlewares/autenticacao');

class ProdutoRoute {

    #router;
    get router() {
        return this.#router;
    }
    set router(router) {
        this.#router = router
    }

    constructor() {
        this.#router = express.Router();

        let storage = multer.diskStorage({
            destination: function(req, res, cb) {
                cb(null, 'public/img/Produtos');
            },
            filename: function(req, file, cb) {
                var ext = file.originalname.split(".")[1];
                cb(null, Date.now().toString() + "." + ext);
            }
        })

        let upload = multer({storage});
        let auth = new Autenticacao();
        let ctrl = new ProdutoController
        this.#router.get('/', auth.usuarioIsAdmin, ctrl.listarView);
        this.#router.get('/cadastro', auth.usuarioIsAdmin, ctrl.cadastroView);
        this.#router.post("/cadastro", auth.usuarioIsAdmin, upload.single("inputImagem"), ctrl.cadastrarProduto);
        this.#router.post("/excluir", auth.usuarioIsAdmin, ctrl.excluirProduto);
        this.#router.get("/alterar/:id", auth.usuarioIsAdmin, ctrl.alterarView);
        this.#router.post("/alterar", auth.usuarioIsAdmin, upload.single("inputImagem"),ctrl.alterarProduto);
        this.#router.post("/buscar", ctrl.buscaProduto);
    }
}

module.exports = ProdutoRoute;