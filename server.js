//importando os packages instalados
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const HomeRoute = require('./routes/homeRoute');
const ProdutoRoute = require('./routes/produtoRoute');
const MarcaRoute = require('./routes/marcaRoute');
const CategoriaRoute = require('./routes/categoriaRoute');
const VitrineRoute = require('./routes/vitrineRoute');
const UsuariosRoute = require('./routes/usuariosRoute');
const LoginRoute = require('./routes/loginRoute');
const Autenticacao = require('./middlewares/autenticacao');
const cookieParser = require('cookie-parser');
const PedidoRoute = require('./routes/pedidoRoute');

const app = express();

//configurando a nossa pasta public como o nosso repositorio de arquivos estáticos (css, js, imagens)
app.use(express.static(__dirname + "/public"))
app.use(cookieParser());
//configuração das nossas views para utilizar a ferramenta EJS
app.set('view engine', 'ejs');
//Configuração de onde ficará nossas views
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configuração da nossa página de layout
app.set('layout', './layout');
app.use(expressLayouts);

//definindo as rotas que o nosso sistema vai reconhecer através da url do navegador
//rotas publicas
let vitrineRota = new VitrineRoute();
app.use('/', vitrineRota.router);
let loginRota = new LoginRoute()
app.use('/login', loginRota.router);

//essa rota é privada mas será definido separadamente dentro da produtoroute
let produtoRota = new ProdutoRoute();
app.use('/admin/produto', produtoRota.router);

let auth = new Autenticacao();

app.use(auth.usuarioIsAdmin);

//rotas privadas
let homeRota = new HomeRoute();
app.use('/admin', homeRota.router)
let marcaRota = new MarcaRoute();
app.use("/admin/marcas", marcaRota.router);
let categoriaRota = new CategoriaRoute();
app.use("/admin/categorias", categoriaRota.router);
let usuarioRota = new UsuariosRoute();
app.use("/admin/usuarios", usuarioRota.router);
let pedidoRota = new PedidoRoute();
app.use("/admin/pedidos", pedidoRota.router);


global.PRODUTO_IMG_CAMINHO = "/img/Produtos/";
global.RAIZ_PROJETO = __dirname;

//ponto de inicio do nosso servidor web
const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});
