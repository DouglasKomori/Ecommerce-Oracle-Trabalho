document.addEventListener("DOMContentLoaded", function() {


    var btnGravar = document.getElementById("btnGravarUsuario");


    btnGravar.addEventListener("click", function() {
        gravarUsuario();
    })
})

function gravarUsuario() {

    limparErros();
    
    var inputNome = document.getElementById("inputNome");
    var inputEmail = document.getElementById("inputEmail");
    var inputSenha = document.getElementById("inputSenha");
    var inputConfSenha = document.getElementById("inputConfSenha");
    var selPerfil = document.getElementById("selPerfil");
    var cbAtivo = document.getElementById("cbAtivo");

    var listaErros = [];

    if(inputNome.value == "" || inputNome.value == undefined || inputNome.value == null){
        listaErros.push("inputNome");
    }
    
    if(inputEmail.value == "" || inputEmail.value == undefined || inputEmail.value == null){
        listaErros.push("inputEmail");
    }

    if(inputSenha.value == "" || inputSenha.value == undefined || inputSenha.value == null){
        listaErros.push("inputSenha");
    }

    if(inputConfSenha.value == "" || inputConfSenha.value == undefined || inputConfSenha.value == null){
        listaErros.push("inputConfSenha");
    }

    if(selPerfil.value == '0'){
        listaErros.push("selPerfil");
    }

    if(inputSenha.value != inputConfSenha.value){
        listaErros.push("inputSenha");
        listaErros.push("inputConfSenha");
    }

    if(listaErros.length == 0){

        var data = {
            nome: inputNome.value,
            email: inputEmail.value,
            senha: inputSenha.value,
            confSenha: inputConfSenha.value,
            perfilId: selPerfil.value,
            ativo: cbAtivo.checked
        };

        fetch('/admin/usuarios/criar', { 
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {          
            if(r.ok) {
                inputNome.value = "";
                inputEmail.value = "";
                inputSenha.value = "";
                inputConfSenha.value = "";
                selPerfil.value = 0;
                cbAtivo.checked = false;

                document.getElementById("alertaSucesso").innerText = "Usuário gravado com sucesso!";
                document.getElementById("alertaSucesso").style = "display:block";
            }
            else{
                document.getElementById("erros").innerText = "Erro ao gravar usuário!";
                document.getElementById("erros").style = "display:block";
            }
        })
        .catch(e=> {
            console.log(e);
        })

    }
    else{
        mostrarErros(listaErros)
    }
}

function mostrarErros(lista) {
    for(var i = 0; i<lista.length; i++){
        let id = lista[i];

        document.getElementById(id).classList.add("campoErro");

        document.getElementById("erros").innerText = "Preencha corretamente os campos destacados abaixo:";

        document.getElementById("erros").style= "display:block";
    }
}

function limparErros() {
    document.getElementById("inputNome").classList.remove("campoErro");
    document.getElementById("inputEmail").classList.remove("campoErro");
    document.getElementById("inputSenha").classList.remove("campoErro");
    document.getElementById("inputConfSenha").classList.remove("campoErro");
    document.getElementById("selPerfil").classList.remove("campoErro");

    document.getElementById("erros").style = "display:none";
    document.getElementById("alertaSucesso").style = "display:none";
}