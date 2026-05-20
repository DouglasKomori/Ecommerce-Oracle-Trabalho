const express = require('express');
const CategoriaController = require('../controllers/categoriaController');

class CategoriaRoute {

    #router;
    get router() {
        return this.#router;
    }
    set router(router) {
        this.#router = router
    }

    constructor() {
        this.#router = express.Router();

        let ctrl = new CategoriaController()
        this.#router.get('/', ctrl.listarView);
    }
}

module.exports = CategoriaRoute;