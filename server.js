/* ---------------------- Modulos ----------------------*/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const ContenedorSql = require("./src/Container/ContenedorSQL");

//Instancia de Server
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* ---------------------- Base de datos ---------------------- */
const contenedorMensajes = new ContenedorSql('mensajes');
const contenedorProductos = new ContenedorSql("productos");

/* ---------------------- Middlewares ---------------------- */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Motor de Plantillas
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* ---------------------- Rutas ----------------------*/
app.get('/', async (req, res) => {
    return res.render('vista', {productos: await contenedorProductos.getAll()});
});

app.post('/productos', async (req, res) => {
    let {title, price, thumbnail} = req.body;
    if (!title || !price || !thumbnail) {
        return res.redirect('/');
    }

    const nuevoProducto = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    };
    await contenedorProductos.save(nuevoProducto);
    res.redirect('/');
    io.sockets.emit('update-products', {DB_PRODUCTOS: await contenedorProductos.getAll()});
});

/* ---------------------- Servidor ----------------------*/
const PORT = 3000;
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
});

/* ---------------------- WebSocket ----------------------*/
io.on('connection', async (socket) => {
    console.log(`Nuevo cliente conectado! ${socket.id}`);
    socket.emit('from-server-mensajes', {DB_MENSAJES: await contenedorMensajes.getAll()});

    socket.on('from-client-mensaje', async mensaje => {
        await contenedorMensajes.save(mensaje).then(id => console.log(`Agregado el producto con el id: ${id}`));
        io.sockets.emit('from-server-mensajes', {DB_MENSAJES: await contenedorMensajes.getAll()});
    });
});
