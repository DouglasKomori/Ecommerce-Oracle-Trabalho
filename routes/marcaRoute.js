const express = require('express');
const MarcaController = require('../controllers/marcaController');

class MarcaRoute {

    #router;
    get router() {
        return this.#router;
    }
    set router(router) {
        this.#router = router
    }

    constructor() {
        this.#router = express.Router();

        let ctrl = new MarcaController();
        this.#router.get('/', ctrl.listarView);
    }
}

module.exports = MarcaRoute;