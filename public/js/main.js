const socket = io();

socket.on('update-products', data => {
    renderProductos(data.DB_PRODUCTOS);
});

socket.on('from-server-mensajes', data => {
    renderHistorial(data.DB_MENSAJES)
});

function renderProductos(productos) {
    const cuerpoProductosHTML = productos.map((producto)=>{
        return `<tr>
                    <td>${producto.id}</td>
                    <td>${producto.title}</td>
                    <td>${producto.price}</td>
                    <td><img src=${producto.thumbnail} height="50px" width="50px" alt="Imagen no disponible"></td>
                </tr>`
    });
    const tablaProductos = `<div class="table-responsive">
                                <table class="table table-dark">
                                    <tr style="color: yellow;"> <th>ID</th> <th>Titulo</th> <th>Precio</th> <th>Imagen</th></tr>
                                    ${cuerpoProductosHTML}
                                </table>
                            </div>`
    document.querySelector('#listadoProductos').innerHTML = tablaProductos;
}

function renderHistorial(mensajes) {
    const cuerpoMensajesHTML = mensajes.map((msj)=>{
        return `<span>
                    <b style="color: blue; font-weight: bold">${msj.mail} </b>
                    <span style="color: brown;">${msj.hora}</span>
                    <span style="color: green; font-style: italic">: ${msj.texto}</span>
                </span>`;
    }).join('<br>');
    document.querySelector('#Historial').innerHTML = cuerpoMensajesHTML;
}

function enviarMensaje(){
    const textoMensaje = document.getElementById('contenidoMensaje').value;
    const mailMensaje = document.getElementById('autor').value;
    if(mailMensaje == ""){
        alert("Ingrese un mail");
        return;
    }
    if(textoMensaje == ""){
        alert("Ingrese un mensaje");
        return;
    }
    const mensaje = {
        mail: mailMensaje,
        hora: new Date().toLocaleString(),
        texto: textoMensaje
    };
    socket.emit('from-client-mensaje', mensaje);
    mailMensaje.value = "";
}