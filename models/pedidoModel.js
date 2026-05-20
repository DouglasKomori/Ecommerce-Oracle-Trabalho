const Database = require("../db/database");
const ProdutoModel = require("./produtoModel");

const conexao = new Database();

class PedidoModel {

    #pedidoId;

    get pedidoId() {
        return this.#pedidoId;
    }

    set pedidoId(pedidoId){
        this.#pedidoId = pedidoId;
    }

    constructor() {

    }

    async validarPedido(listaPedido) {
        var listaErros = [];
        var produto = new ProdutoModel();
        if(listaPedido.length > 0){
            for(var i = 0; i< listaPedido.length; i++){
                var idProduto = listaPedido[i].id;
                produto = await produto.buscarProduto(idProduto);
                if(produto.produtoQuantidade < listaPedido[i].quantidade) {
                    listaErros.push(produto.produtoNome);
                }
            }
        }


        return listaErros;
    }

    async debitarQuantidade(produtoId, produtoQuantidade){

        var produto = new ProdutoModel();
        produto = await produto.buscarProduto(produtoId);

        produto.produtoQuantidade = produto.produtoQuantidade - produtoQuantidade;

        await produto.gravar();
    }

    async gravar() {
        let sql = "insert into tb_pedido (ped_id) values (null)";
        var idGerado = await conexao.ExecutaComandoLastInserted(sql);
        this.#pedidoId = idGerado;
    }

    async listarProdutosMaisPedidos() {
        let sql = `select sum(prd_quantidade) as qtde, pr.prd_nome
                    from tb_pedido p 
                    inner join tb_pedidoitens i 
                    on p.ped_id = i.ped_id
                    inner join tb_produto pr 
                    on i.prd_id = pr.prd_id
                    group by pr.prd_id order by 1 desc
                    limit 5`;
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];
        for(let i = 0; i< rows.length; i++){
            var row = rows[i];
            listaRetorno.push({
                quantidade: row["qtde"],
                nome: row["prd_nome"]
            })
        }

        return listaRetorno;
    }
}

module.exports = PedidoModel;