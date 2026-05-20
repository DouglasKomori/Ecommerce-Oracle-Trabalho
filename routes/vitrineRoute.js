const express = require('express');
const VitrineController = require('../controllers/vitrineController');

class VitrineRoute {

    #router;

    get router() {
        return this.#router;
    }
    set router(router) {
        this.#router = router
    }

    constructor() {

        this.#router = express.Router();

        let ctrl = new VitrineController();

        this.#router.get('/', ctrl.listarProdutosView);
        this.#router.post('/gravar-pedido', ctrl.gravarPedido);
    }
}

module.exports = VitrineRoute;