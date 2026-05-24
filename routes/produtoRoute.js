const express = require('express');
const multer = require("multer");
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const ProdutoController = require('../controllers/produtoController');
const Autenticacao = require('../middlewares/autenticacao');
require('dotenv').config();

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

        const ep = new aws.Endpoint(`https://${process.env.OCI_NAMESPACE}.compat.objectstorage.${process.env.OCI_REGION}.oraclecloud.com`);
        const s3 = new aws.S3({
            endpoint: ep,
            region: process.env.OCI_REGION,
            accessKeyId: process.env.OCI_ACCESS_KEY,
            secretAccessKey: process.env.OCI_SECRET_KEY,
            signatureVersion: 'v4'
        });

        let upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.OCI_BUCKET_NAME,
                acl: 'public-read', 
                key: function (req, file, cb) {
                    var ext = file.originalname.split(".")[1];
                    cb(null, Date.now().toString() + "." + ext);
                }
            })
        });

        let auth = new Autenticacao();
        let ctrl = new ProdutoController();

        this.#router.get('/', auth.usuarioIsAdmin, ctrl.listarView);
        this.#router.get('/cadastro', auth.usuarioIsAdmin, ctrl.cadastroView);
        this.#router.post("/cadastro", auth.usuarioIsAdmin, upload.single("inputImagem"), ctrl.cadastrarProduto);
        this.#router.post("/excluir", auth.usuarioIsAdmin, ctrl.excluirProduto);
        this.#router.get("/alterar/:id", auth.usuarioIsAdmin, ctrl.alterarView);
        this.#router.post("/alterar", auth.usuarioIsAdmin, upload.single("inputImagem"), ctrl.alterarProduto);
        this.#router.post("/buscar", ctrl.buscaProduto);
    }
}

module.exports = ProdutoRoute;