const Database = require('../db/database');

const conexao = new Database();

class PedidoItemModel {

    #pedidoItemId;
    #pedidoId;
    #produtoId;
    #pedidoQuantidade;

    get pedidoItemId() {
        return this.#pedidoItemId;
    }

    set pedidoItemId(pedidoItemId){
        this.#pedidoItemId = pedidoItemId;
    }

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId){
        this.#pedidoId = pedidoId;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(produtoId){
        this.#produtoId = produtoId;
    }

    get pedidoQuantidade() {
        return this.#pedidoQuantidade;
    }
    set pedidoQuantidade(pedidoQuantidade){
        this.#pedidoQuantidade = pedidoQuantidade;
    }

    constructor() {

    }

    async gravar() {
        let sql = "insert into tb_pedidoitens (ped_id, prd_id, pit_quantidade) values (?, ?, ?)";
        let valores = [this.#pedidoId, this.#produtoId, this.#pedidoQuantidade];

        return await conexao.ExecutaComandoNonQuery(sql, valores);
    }

    async listar(termo, busca, ordenacao) {

        let sqlWhere = "";
        if(termo != undefined && termo != ""){
            if(busca == "1") {
                sqlWhere = ` where po.prd_nome like '%${termo}%'  `;
            }
            else if(busca == "2") {
                if(isNaN(termo) == false)
                    sqlWhere = ` where po.prd_cod = ${termo} `;
            }
            else if(busca == "3") {
                if(isNaN(termo) == false)
                    sqlWhere = ` where p.ped_id = ${termo} `
            };
        }

        let sqlOrder = "";
        if(ordenacao == "1"){
            sqlOrder = " order by p.ped_id ";
        }
        else if(ordenacao == "2"){
            sqlOrder = " order by valor ";
        }
        else if (ordenacao == "3"){
            sqlOrder = " order by pi.pit_quantidade ";
        }

        let sql = `select p.ped_id, po.prd_id, pi.pit_quantidade, po.prd_cod, 
        po.prd_nome, po.prd_preco, (po.prd_preco * pi.pit_quantidade) as valor 
        from tb_pedido p 
        inner join tb_pedidoitens pi on p.ped_id = pi.ped_id 
        inner join tb_produto po on po.prd_id = pi.prd_id
        ${sqlWhere}
        ${sqlOrder}`;

        var rows = await conexao.ExecutaComando(sql);

        var relatorio = [];

        for(var i = 0; i < rows.length; i++){
            var row = rows[i];
            var data = {
                nomeProduto: row["prd_nome"],
                produtoCodigo: row["prd_cod"],
                produtoId: row["prd_id"],
                pedidoId: row["ped_id"],
                pedidoItemQuantidade: row["pit_quantidade"],
                precoUnitario: row["prd_preco"],
                pedidoItemValor: row["valor"]
            }

            relatorio.push(data);
        }

        return relatorio;
    }
}

module.exports = PedidoItemModel;