const CategoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcaModel");
const ProdutoModel = require("../models/produtoModel");

class ProdutoController {

    async listarView(req, res) {
        let prod = new ProdutoModel();
        let lista = await prod.listarProdutos();
        res.render('produto/listar', {lista: lista});
    }

    async buscaProduto(req, res) {
        var ok = true;
        var msg = ""
        var retorno = null;
        if(req.body.id != null && req.body.id != ""){
            let prod = new ProdutoModel();
            prod = await prod.buscarProduto(req.body.id);

            retorno = {
                nome: prod.produtoNome,
                preco: prod.produtoPreco,
                id: prod.produtoId,
                marcaNome: prod.marcaNome,
                categoriaNome: prod.categoriaNome,
                imagem: prod.produtoImagem
            };
        }
        else {
            ok = false;
            msg = "Parâmetro inválido!";
        }

        res.send({ ok: ok, msg: msg, retorno: retorno })
    }

    async excluirProduto(req, res){
        var ok = true;
        var msg = "";
        try {
            if(req.body.codigo != "") {
                let produto = new ProdutoModel();
                ok = await produto.excluir(req.body.codigo);
            }
            else{
                ok = false;
                msg = "Código inválido";
            }
        } catch(e) {
            console.error("Erro ao excluir produto:", e);
            ok = false;
            if(e.code === 'ER_ROW_IS_REFERENCED_2') {
                msg = "Não é possível excluir: produto possui pedidos vinculados";
            } else {
                msg = "Erro ao excluir produto";
            }
        }

        res.send({ok: ok, msg: msg});
    }

    async cadastrarProduto(req, res){
        var ok = true;
        try {
            if(req.uploadError) {
                return res.send({ ok: false, msg: req.uploadError });
            }

            if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade  != '0' && req.body.marca != '0' && req.body.categoria  != '0' && req.file != null && (req.file.originalname.includes(".jpg") || req.file.originalname.includes(".png")) && req.body.preco != '' && req.body.preco > '0' ) {

                let produto = new ProdutoModel(0, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", req.file.location, req.body.preco);

                ok = await produto.gravar();
            }
            else{
                ok = false;
            }
        } catch(e) {
            console.error("Erro ao cadastrar produto:", e);
            ok = false;
        }

        res.send({ ok: ok })
    }

    async alterarView(req, res){
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        
        let categoria = new CategoriaModel();
        if(req.params.id != undefined && req.params.id != ""){
            produto = await produto.buscarProduto(req.params.id);
        }

        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategorias();
        res.render("produto/alterar", {produtoAlter: produto, listaMarcas: listaMarca, listaCategorias: listaCategoria});
    }

    async alterarProduto(req, res) {
        var ok = true;
        try {
            if(req.uploadError) {
                return res.send({ ok: false, msg: req.uploadError });
            }

            const temArquivo = req.file != null;
            const arquivoValido = !temArquivo || (req.file.originalname.includes(".jpg") || req.file.originalname.includes(".png"));

            if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade != '0' && req.body.marca != '0' && req.body.categoria != '0' && arquivoValido && req.body.preco != '' && req.body.preco > '0') {

                let imagem = temArquivo ? req.file.location : req.body.imagemAtual;

                let produto = new ProdutoModel(req.body.id, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", imagem, req.body.preco);

                ok = await produto.gravar();
            }
            else{
                ok = false;
            }
        } catch(e) {
            console.error("Erro ao alterar produto:", e);
            ok = false;
        }

        res.send({ ok: ok })
    }

    async cadastroView(req, res) {

        let listaMarcas = [];
        let listaCategorias = [];

        let marca = new MarcaModel();
        listaMarcas = await marca.listarMarcas();

        let categoria = new CategoriaModel();
        listaCategorias = await categoria.listarCategorias();

        res.render('produto/cadastro', { listaMarcas: listaMarcas, listaCategorias: listaCategorias });
    }
}

module.exports = ProdutoController;