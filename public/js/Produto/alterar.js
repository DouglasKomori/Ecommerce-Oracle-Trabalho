document.addEventListener("DOMContentLoaded", function(){

    var btnGravar = document.getElementById("btnAlterar");

    btnGravar.addEventListener("click", alterarProduto);

    
    var inputImagem = document.getElementById("inputImagem");

    inputImagem.addEventListener("change", exibirImagem);
})

function exibirImagem() {
    
    var inputValue = document.getElementById("inputImagem").files[0];

    if(inputValue.name.includes(".jpg") || inputValue.name.includes(".png")) {
        var imgInput = document.getElementById("imgInput");
        imgInput.src = URL.createObjectURL(inputValue);
        imgInput.style["display"] = "block";
    }
    else{
        alert("Formato inválido (Apenas .jpg e .png)");
    }

}

function alterarProduto() {

    var inputId = document.getElementById("inputId");
    var inputCodigo = document.getElementById("inputCodigo");
    var inputNome = document.getElementById("inputNome");
    var inputQtde = document.getElementById("inputQtde");
    var selMarca = document.getElementById("selMarca");
    var selCategoria = document.getElementById("selCategoria");
    var inputFile = document.getElementById("inputImagem");
    var inputPreco = document.getElementById("inputPreco");
    var imagemAtual = document.getElementById("imagemAtual");

    if(inputCodigo.value != "" && inputNome.value != "" && inputQtde.value != "" && inputQtde.value != '0' && selMarca.value != '0' && selCategoria.value != '0' && inputPreco.value != "" && inputPreco.value > '0'){

        var formData = new FormData();
        formData.append("id", inputId.value);
        formData.append("codigo", inputCodigo.value);
        formData.append("nome", inputNome.value);
        formData.append("quantidade", inputQtde.value);
        formData.append("marca", selMarca.value);
        formData.append("categoria", selCategoria.value);
        formData.append("preco", inputPreco.value);
        formData.append("imagemAtual", imagemAtual ? imagemAtual.value : "");

        if(inputFile.files.length > 0) {
            var inputValue = inputFile.files[0];
            if(!inputValue.name.includes(".jpg") && !inputValue.name.includes(".png")) {
                alert("Imagem com formato inválido! Use .jpg ou .png");
                return;
            }
            formData.append("inputImagem", inputValue);
        }

        fetch('/admin/produto/alterar', {
            method: "POST",
            body: formData
        })
        .then(r => {
            return r.json();
        })
        .then(r=> {
            if(r.ok) {
                alert("Produto alterado!");
            }
            else{
                alert("Erro ao alterar produto");
            }
        })
        .catch(e => {
            console.log(e);
        })

    }
    else{
        alert("Preencha todos os campos corretamente!");
        return;
    }
}