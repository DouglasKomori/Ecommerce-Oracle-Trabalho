document.addEventListener("DOMContentLoaded", function() {
    carregarDashboard();
})

function carregarDashboard() {

    fetch('/admin/dashboard')
    .then(r => {
        return r.json();
    })
    .then(r => {

        let listaProduto = [];
        let listaQuantidades = [];
        for(let i =0; i< r.lista.length; i++) {
            listaProduto.push(r.lista[i].nome);
            listaQuantidades.push(r.lista[i].quantidade);
        }

        const ctx = document.getElementById('grafico');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: listaProduto,
            datasets: [{
              label: "Produtos mais pedidos",
              data: listaQuantidades,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
    })
    .catch(e => {
        console.log(e);
    })
}