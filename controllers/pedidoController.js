const PedidoItemModel = require("../models/pedidoItemModel")

class PedidoController {

    async listaView(req, res) {
        let pedidoItem = new PedidoItemModel();
        let relatorio = await pedidoItem.listar();
        res.render('pedido/listar', {lista: relatorio});
    }

    async listarPedidos(req, res){
        let ok = false;
        let listaRetorno = [];
        if(req.body != undefined){
            let termo = req.body.termo;
            let busca = req.body.busca;
            let ordenacao = req.body.ordenacao;
            let pedido = new PedidoItemModel();
            listaRetorno = await pedido.listar(termo, busca, ordenacao);
            ok = true;
        }

        res.send({ok: ok, listaRetorno: listaRetorno});
    }
}

module.exports = PedidoController;