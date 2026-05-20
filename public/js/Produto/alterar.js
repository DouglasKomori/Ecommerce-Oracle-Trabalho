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
    var inputFile = document.getElementById("inputImagem")
    var inputPreco = document.getElementById("inputPreco");

    //if de validação básica
    if(inputCodigo.value != "" && inputNome.value != "" && inputQtde.value != "" && inputQtde.value != '0' && selMarca.value != '0' && selCategoria.value != '0' && inputFile.files.length > 0 && inputPreco.value != "" && inputPreco.value > '0'){

        var inputValue = inputFile.files[0];
        if(inputValue.name.includes(".jpg") ||inputValue.name.includes(".png")) {

            var formData = new FormData();

            formData.append("id", inputId.value);
            formData.append("codigo", inputCodigo.value);
            formData.append("nome", inputNome.value);
            formData.append("quantidade", inputQtde.value);         
            formData.append("marca", selMarca.value);
            formData.append("categoria", selCategoria.value);
            formData.append("inputImagem", inputValue);
            formData.append("preco", inputPreco.value);

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
        else {
            alert("Imagem com formato inválido!");
            return;
        }
        /*var data = {
            id: inputId.value,
            codigo: inputCodigo.value,
            nome: inputNome.value,
            quantidade: inputQtde.value,
            marca: selMarca.value,
            categoria: selCategoria.value
        }*/

    }
    else{
        alert("Preencha todos os campos corretamente!");
        return;
    }
}