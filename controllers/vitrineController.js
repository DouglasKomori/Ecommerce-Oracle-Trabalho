const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");

class VitrineController {

    async listarProdutosView(req, res) {
        let produto = new ProdutoModel();
        let listaProdutos = await produto.listarProdutos();

        res.render('vitrine/index', { produtos: listaProdutos, layout: 'vitrine/index' });
    }

    async gravarPedido(req, res){
        var ok = false;
        var msg = "";
        if(req.body != null && req.body != ""){

            if(req.body.length > 0) {               
                let pedido = new PedidoModel();
                let listaPedido = req.body;
                let listaErros = await pedido.validarPedido(listaPedido);
                if(listaErros.length == 0){
                    await pedido.gravar();
                    if(pedido.pedidoId > 0){
                        for(let i = 0; i<listaPedido.length; i++){
                            let pedidoItem = new PedidoItemModel();
                            pedidoItem.pedidoId = pedido.pedidoId;
                            pedidoItem.produtoId = listaPedido[i].id;
                            pedidoItem.pedidoQuantidade = listaPedido[i].quantidade;

                            ok = await pedidoItem.gravar();
                            if(ok){
                                pedido.debitarQuantidade(pedidoItem.produtoId, pedidoItem.pedidoQuantidade);
                            }
                        }
                    }
                    else{
                        msg = "Erro ao gerar pedido!";
                    }
                }
                else{
                    var msgErro = listaErros.join("\n");  
                    msgErro = msgErro.trim(",");
                    msg = "Os seguintes produtos não possuem a quantidade desejada: \n" + msgErro;  
                }
            }
            else{
                msg = "Carrinho vazio!";
            }
        }
        else{
            msg = "Parâmetros inválidos";
        }

        res.send({ok: ok, msg: msg});
    }
}

module.exports = VitrineController;