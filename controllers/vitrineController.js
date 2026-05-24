const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");

require('dotenv').config();
const common = require("oci-common");
const queue = require("oci-queue");
const fs = require('fs');

const privateKey = fs.readFileSync('./douglassatoshi@unoeste.edu.br-2026-05-20T20_10_55.337Z.pem', 'utf-8');
const provider = new common.SimpleAuthenticationDetailsProvider(
    process.env.OCI_TENANCY_OCID,
    process.env.OCI_USER_OCID,
    process.env.OCI_FINGERPRINT,
    privateKey,
    null,
    common.Region.fromRegionId(process.env.OCI_REGION)
);
const queueClient = new queue.QueueClient({ authenticationDetailsProvider: provider });
queueClient.endpoint = process.env.OCI_QUEUE_ENDPOINT;

class VitrineController {

    async listarProdutosView(req, res) {
        let produto = new ProdutoModel();
        let listaProdutos = await produto.listarProdutos();

        res.render('vitrine/index', { produtos: listaProdutos, layout: 'vitrine/index' });
    }

    async gravarPedido(req, res){
        var ok = false;
        var msg = "";

        let emailCliente = req.body.email || ""; 
        let listaPedido = req.body.carrinho || req.body; 

        if(listaPedido != null && listaPedido != ""){

            if(listaPedido.length > 0) {               
                let pedido = new PedidoModel();
                let listaErros = await pedido.validarPedido(listaPedido);
                
                if(listaErros.length == 0){
                    await pedido.gravar();
                    
                    if(pedido.pedidoId > 0){
                        let valorTotalPedido = 0; 
                        
                        for(let i = 0; i < listaPedido.length; i++){
                            let pedidoItem = new PedidoItemModel();
                            pedidoItem.pedidoId = pedido.pedidoId;
                            pedidoItem.produtoId = listaPedido[i].id;
                            pedidoItem.pedidoQuantidade = listaPedido[i].quantidade;

                            if(listaPedido[i].preco) {
                                valorTotalPedido += (listaPedido[i].preco * listaPedido[i].quantidade);
                            }

                            ok = await pedidoItem.gravar();
                            if(ok){
                                pedido.debitarQuantidade(pedidoItem.produtoId, pedidoItem.pedidoQuantidade);
                            }
                        }

                        if(ok && emailCliente !== "") {
                            try {
                                const itensDetalhados = listaPedido.map(item => ({
                                    nome: item.nome || 'Produto',
                                    quantidade: item.quantidade,
                                    preco: parseFloat(item.preco) || 0
                                }));

                                const dadosEmail = {
                                    emailCliente: emailCliente,
                                    numero: pedido.pedidoId,
                                    total: valorTotalPedido.toFixed(2),
                                    itens: itensDetalhados
                                };

                                await queueClient.putMessages({
                                    queueId: process.env.OCI_QUEUE_OCID,
                                    putMessagesDetails: {
                                        messages: [
                                            { content: Buffer.from(JSON.stringify(dadosEmail)).toString('base64') }
                                        ]
                                    }
                                });
                                console.log("Pedido enviado para a fila OCI com sucesso!");
                            } catch (err) {
                                console.error("Erro ao colocar na fila:", err);
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