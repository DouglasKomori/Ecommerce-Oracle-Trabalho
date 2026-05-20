document.addEventListener("DOMContentLoaded", function() {

    var btnPesquisa = document.getElementById("btnPesquisa");

    /*document.getElementById("inputPesquisa").addEventListener("keyup", function() {
        var termo = document.getElementById("inputPesquisa").value;
        filtrarTabela(termo);
    })*/

    btnPesquisa.addEventListener("click", function() {
        var termo = document.getElementById("inputPesquisa").value;
        var busca = document.getElementById("selBusca").value;
        var ordenacao = document.querySelector("input[name='rdOrdenacao']:checked").value;
        filtrarTabela(termo, busca, ordenacao);
    })

    var btnExportar = document.getElementById("btnExportarExcel");

    btnExportar.addEventListener("click", function() {

        var wb = XLSX.utils.table_to_book(document.getElementById("tabelaPedidos"));
        /* Export to file (start a download) */
        XLSX.writeFile(wb, "relatorio-pedidos.xlsx");

    })
})

function filtrarTabela(termo, busca, ordenacao) {


    fetch('/admin/pedidos/listar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {termo: termo, busca: busca, ordenacao: ordenacao}
            )
    })
    .then(function(r) {
        return r.json();
    })
    .then(r=> {
        if(r.ok){
            if(r.listaRetorno.length > 0){
                let html = "";

                for(let i = 0; i < r.listaRetorno.length; i++){
                    var obj = r.listaRetorno[i];

                    html += ` <tr>
                                <td>${obj.pedidoId}</td>
                                <td>${obj.produtoCodigo}</td>
                                <td>${obj.nomeProduto}</td>
                                <td>R$ ${obj.precoUnitario}</td>
                                <td>${obj.pedidoItemQuantidade}</td>
                                <td>R$ ${obj.pedidoItemValor}</td>
                            </tr>`;                  
                }

                document.getElementById("rotuloQtdePedidos").innerHTML = "<b>Quantidade de pedidos: "+ r.listaRetorno.length +"</b>"
                document.getElementById("corpoTabelaPedido").innerHTML = html;
            }
            else{
                alert("Nenhum pedido encontrado!");
            }
        }
    })
    .catch(e => {
        console.log(e);
    })
}