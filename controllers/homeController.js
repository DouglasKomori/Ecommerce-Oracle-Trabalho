const PedidoModel = require("../models/pedidoModel");

class HomeController {

    constructor() {

    }

    homeView(req, res) {
        res.render('home/index', {});
    }

    async dashboard(req, res){
        let pedido = new PedidoModel();
        let lista = await pedido.listarProdutosMaisPedidos();

        res.send({lista: lista});
    }
}


module.exports = HomeController;