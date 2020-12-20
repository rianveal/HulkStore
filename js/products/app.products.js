origen = 'http://209.97.145.250:8080'
//origen = 'http://localhost:8080'
rutaServicio = origen+'/ApiRestHulkStore/recursosWeb/servicios'
tablaProductos = null, idProductoGeneral = null, topeMinimo = null, topeMaximo = null
vectorProductos = []
document.addEventListener('DOMContentLoaded', ()=>{
  inicializaciones()
  obtenerProductos()
  obtenerMarcasYCategorias()
  validarAgregarProducto()
  capturarEventoAgregarMarca()
  capturarEventoAgregarCategoria()
  btnActualizar = document.querySelector('#btnActualizar')
  btnActualizar.addEventListener('click', (event)=>{
    capturarEventoActualizarProducto()
  })
  capturarEventoAgregarRestarCantidad()
}, false)

function obtenerProductos(){
  vectorProductos = []
  AgregarORemoverClaseNone('loading','r')
  url = rutaServicio+'/products'
  fetch(url)
    .then(response => {
      return response.json()
    })
    .then( datos => {
      if( validaRespuestaPeticion(datos, 'No se encontraron productos') ){
        if( datos.length > 0 ){
          datos.forEach(el => {
            obj = {
              'id': el.id,
              'nombre': el.name,
              'marca': el.brand,
              'categoria': el.category,
              'valorUnitario': el.unitValue,
              'valorVenta': el.saleValue,
              'topeMinimo': el.minimumExistence,
              'topeMaximo': el.maximumExistence,
              'saldo': el.balance,
              'opcion': '<a class="waves-effect waves-light btn blue" id="'+el.id+'"><i class="material-icons">autorenew</i></a>'
            }
            vectorProductos.push(obj)
          });
        }else{
          notificacion('info','No hay productos registrados',1200)
          AgregarORemoverClaseNone('loading','a')
        }
      }
      if( vectorProductos.length > 0 ){
        cargarProductosEnTabla(vectorProductos)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al cargar los productos, intentelo de nuevo', 1500)
    })
}

function cargarProductosEnTabla(productos){
  if( tablaProductos !== null ){ limpiarTabalProductos()}
  tablaProductos = $('#tabla-productos').DataTable({
    data: productos,
    destroy: true,
    responsive: false,
    columns:[
        {data: 'nombre'},  
        {data: 'marca'},
        {data: 'categoria'},
        {data: 'valorUnitario'},
        {data: 'valorVenta'},
        {data: 'topeMinimo'},
        {data: 'topeMaximo'},
        {data: 'saldo'},
        {data: 'opcion'}
    ],
    "pagingType": "full_numbers",
    "responsive": true,
    "dom": "Bfrtip",
    "paging": true,
    select: true,
    buttons: [
        {
            extend: 'excelHtml5',
            title: 'Registro de productos'
        },
        "csvHtml5",
        "pdfHtml5"
    ]
  });

  $('.dt-buttons').css('margin','15px 0 0 30px');
  $('.buttons-excel').addClass('btn waves-effect waves-light indigo lighten-2');
  $('.buttons-csv').addClass('btn waves-effect waves-light indigo lighten-2');
  $('.buttons-pdf').addClass('btn waves-effect waves-light indigo lighten-2');
  document.querySelector('#tabla-productos').style = "width: 100%;"
  AgregarORemoverClaseNone('loading','a')
  AgregarORemoverClaseNone('contenedorTablaProductos','r') 
  capturarEventoEnTabla()
}

function capturarEventoEnTabla(){
  tabla = document.querySelectorAll('#tabla-productos td a')
  tabla.forEach( el =>{
    el.addEventListener('click', btn => {
      id = el.id
      consultarProducto(id)
      idProductoGeneral = id
    })
  })
}

function validarAgregarProducto(){
  btnAgregarProducto = document.querySelector('#btnAgregarProducto')
  btnAgregarProducto.addEventListener('click', () => {
    nombre = document.querySelector('#nombreProducto').value
    marca = document.querySelector('#marcaProducto').value
    categoria = document.querySelector('#categoriaProducto').value
    valorUnitario = document.querySelector('#valorUnitario').value
    valorVenta = document.querySelector('#valorVenta').value
    topeMinimo = document.querySelector('#topeMinimoProducto').value
    topeMaximo = document.querySelector('#topeMaximoProducto').value
    saldo = document.querySelector('#saldo').value
    if( nombre === '' ){
      focusAndNotification('nombreProducto','info','Nombre de producto es requerido',1000)
    }else if( marca === '' ){
      focusAndNotification('marcaProducto','info','Marca de producto es requerida',1000)
    }else if( categoria === '' ){
      focusAndNotification('categoriaProducto','info','Categroría de producto es requerida',1000)
    }else if( valorUnitario === '' ){
      focusAndNotification('valorUnitario','info','Valor unitario de producto es requerido',1000)
    }else if( Number(valorUnitario) < 0 ){
      focusAndNotification('valorUnitario','info','Valor unitario no puede ser menor que cero',1200)
    }else if( valorVenta === '' ){
      focusAndNotification('valorVenta','info','Valor venta de producto es requerido',1000)
    }else if( Number(valorVenta) < 0 ){
      focusAndNotification('valorVenta','info','Valor venta no puede ser menor que cero',1200)
    }else if( topeMinimo === '' ){
      focusAndNotification('topeMinimoProducto','info','Tope mínimo de producto es requerido',1000)
    }else if( Number(topeMinimo) < 0 ){
      focusAndNotification('topeMinimoProducto','info','Tope mínimo no puede ser menor que cero',1200)
    }else if( topeMaximo === '' ){
      focusAndNotification('topeMaximoProducto','info','Tope máximo de producto es requerido',1000)
    }else if( Number(topeMaximo) < 0 ){
      focusAndNotification('topeMaximoProducto','info','Tope máximo no puede ser menor que cero',1000)
    }else if( Number(topeMaximo) < Number(topeMinimo) ){
      focusAndNotification('topeMaximoProducto','info','Tope máximo no puede ser menor que tope mínimo',1300)
    }else{
      if( saldo === '' ){
        saldo = 0
      }
      obj ={
        'name': nombre,
        'brandId': marca,
        'categoryId': categoria,
        'unitValue': valorUnitario,
        'unitSale': valorVenta,
        'minimumExistence': topeMinimo,
        'maximumExistence': topeMaximo,
        'balance': saldo,
        'user': localStorage.getItem('hs_us')
      }
      objData = JSON.stringify(obj)
      agregarProducto(objData)
    }
  })
}

function agregarProducto(producto){
  url = rutaServicio+'/product/add/'+producto
  fetch(url)
    .then( response =>{
      return response.json()
    })
    .then( data =>{
      if(validaRespuestaPeticion(data, 'Algo salió mal, producto no registrado')){
        obtenerProductos()
        mostrarModal('modalAgregarProducto','c')
        notificacion('info','Producto registrado',1200)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al registrar el producto, intentelo de nuevo', 1500)
    })
}

function consultarProducto(id){
  AgregarORemoverClaseNone('loading','r')
  url = rutaServicio+'/product/find/'+id
  fetch(url)
    .then( response =>{
      return response.json()
    })
    .then( data =>{
      if(validaRespuestaPeticion(data, 'Algo salió mal, producto no encontrado.')){
        document.querySelector('#nombreProducto_op').value = data.name
        document.querySelector('#valorUnitario_op').value = data.unitValue
        document.querySelector('#valorVenta_op').value = data.saleValue
        document.querySelector('#topeMinimoProducto_op').value = data.minimumExistence
        document.querySelector('#topeMaximoProducto_op').value = data.maximumExistence
        document.querySelector('#saldo_op').value = data.balance
        obtenerMarcas()
          .then(dataMarcas =>{ 
            cargarSelectorEspecifico('marcaProducto_op', dataMarcas, data.brandId)
          });
        
        obtenerCategorias()
          .then(dataCategorias =>{ 
            cargarSelectorEspecifico('categoriaProducto_op', dataCategorias, data.categoryId)
          });  
        
        AgregarORemoverClaseNone('loading','a')  
        mostrarModal('modalActualizarProducto','o')
        topeMinimo = data.minimumExistence
        topeMaximo = data.maximumExistence
        //capturarEventoAgregarRestarCantidad(id, data.minimumExistence, data.maximumExistence)
        //capturarEventoActualizarProducto(id)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al consultar el producto, intentelo de nuevo', 1500)
    })
}

function capturarEventoAgregarRestarCantidad(){
  id = idProductoGeneral
  btnAgregarCantidad =  document.querySelector('#btnAgregarCantidad')
  btnRestarCantidad = document.querySelector('#btnRestarCantidad')
  btnAgregarCantidad.addEventListener('click', ()=>{
    saldoActual = document.querySelector('#saldo_op').value
    cantidad = document.querySelector('#cantidad').value
    if( cantidad === '' ){
      focusAndNotification('cantidad','info','Cantidad no puede ser vacío',1400)
    }else{
      AgregarORemoverClaseDisabled('btnAgregarCantidad','a')
      total = Number(saldoActual) + Number(cantidad)
      if( total > topeMaximo ){
        focus('cantidad')
        AgregarORemoverClaseDisabled('btnAgregarCantidad','r')
        notificacion('info','El tope máximo ('+topeMaximo+') ha sido superado',1300)
      }else{
        agregarMovimientoProducto(id, 's', cantidad, total)
      }
    }
  })

  btnRestarCantidad.addEventListener('click', ()=>{
    saldoActual = document.querySelector('#saldo_op').value
    cantidad = document.querySelector('#cantidad').value
    if( Number(saldoActual) === 0 ){
      focus('cantidad')
      notificacion('info','Stock en cero, no es posible vender.',1200)
    }else if( Number(saldoActual) > 0 ){
      if( cantidad === '' ){
        focusAndNotification('cantidad','info','Cantidad no puede ser vacío',1400)
      }else{
        AgregarORemoverClaseDisabled('btnRestarCantidad','a')
        total = Number(saldoActual) - Number(cantidad)
        if( total < 0 ){
          focus('cantidad')
          AgregarORemoverClaseDisabled('btnRestarCantidad','r')
          notificacion('info','No se puede realizar el proceso, STOCK negativo.',1300)
        }else if( total < topeMinimo ){
          focus('cantidad')
          AgregarORemoverClaseDisabled('btnRestarCantidad','r')
          notificacion('info','El tope mínimo ('+topeMinimo+') ha sido superado',1300)
        }else {
          agregarMovimientoProducto(id, 'r', cantidad, total)
        }
      }
    }
  })
}

function agregarMovimientoProducto(id, tipoMovimiento, cantidad, total){
  AgregarORemoverClaseNone('loading','r')
  obj = {
    'id': id,
    'movementType': tipoMovimiento,
    'quantity': cantidad,
    'total': total,
    'user': localStorage.getItem('hs_us')
  }
  objData = JSON.stringify(obj)
  url = rutaServicio+'/product/addMovement/'+objData
  fetch(url)
    .then( response =>{
      return response.json()
    })
    .then( data =>{
      AgregarORemoverClaseDisabled('btnAgregarCantidad','r')
      AgregarORemoverClaseDisabled('btnRestarCantidad','r')
      if( validaRespuestaPeticion(data, 'Movimiento de producto no fue realizado.') ){
        AgregarORemoverClaseNone('loading','a')
        document.querySelector('#cantidad').value = ''
        document.querySelector('#saldo_op').value = total
        obtenerProductos()
        notificacion('success','Movimiento registrado',1000)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al realizar movimiento de producto, intentelo de nuevo', 1500)
    })
}

function capturarEventoActualizarProducto(){
  nombre = document.querySelector('#nombreProducto_op').value
  marca = document.querySelector('#marcaProducto_op').value
  categoria = document.querySelector('#categoriaProducto_op').value
  valorUnitario = document.querySelector('#valorUnitario_op').value
  valorVenta = document.querySelector('#valorVenta_op').value
  topeMinimo = document.querySelector('#topeMinimoProducto_op').value
  topeMaximo = document.querySelector('#topeMaximoProducto_op').value
  if( nombre === '' ){
    focusAndNotification('nombreProducto_op','info','Nombre de producto es requerido',1000)
  }else if( marca === '' ){
    focusAndNotification('marcaProducto_op','info','Marca de producto es requerida',1000)
  }else if( categoria === '' ){
    focusAndNotification('categoriaProducto_op','info','Categroría de producto es requerida',1000)
  }else if( valorUnitario === '' ){
    focusAndNotification('valorUnitario_op','info','Valor unitario de producto es requerido',1000)
  }else if( Number(valorUnitario) < 0 ){
    focusAndNotification('valorUnitario_op','info','Valor unitario no puede ser menor que cero',1200)
  }else if( valorVenta === '' ){
    focusAndNotification('valorVenta_op','info','Valor venta de producto es requerido',1000)
  }else if( Number(valorVenta) < 0 ){
    focusAndNotification('valorVenta_op','info','Valor venta no puede ser menor que cero',1200)
  }else if( topeMinimo === '' ){
    focusAndNotification('topeMinimoProducto_op','info','Tope mínimo de producto es requerido',1000)
  }else if( Number(topeMinimo) < 0 ){
    focusAndNotification('topeMinimoProducto_op','info','Tope mínimo no puede ser menor que cero',1200)
  }else if( topeMaximo === '' ){
    focusAndNotification('topeMaximoProducto_op','info','Tope máximo de producto es requerido',1000)
  }else if( Number(topeMaximo) < 0 ){
    focusAndNotification('topeMaximoProducto_op','info','Tope máximo no puede ser menor que cero',1000)
  }else if( Number(topeMaximo) < Number(topeMinimo) ){
    focusAndNotification('topeMaximoProducto_op','info','Tope máximo no puede ser menor que tope mínimo',1300)
  }else{
    obj ={
      'id': idProductoGeneral,
      'name': nombre,
      'brandId': marca,
      'categoryId': categoria,
      'unitValue': valorUnitario,
      'unitSale': valorVenta,
      'minimumExistence': topeMinimo,
      'maximumExistence': topeMaximo,
      'user': localStorage.getItem('hs_us')
    }
    objData = JSON.stringify(obj)
    actualizarProducto(objData)
  }
    
  
}

function actualizarProducto(producto){
  url = rutaServicio+'/product/update/'+producto
  fetch(url)
    .then( response =>{
      return response.json()
    })
    .then( data =>{
      if(validaRespuestaPeticion(data, 'Algo salió mal, producto no actualizado.')){
        obtenerProductos()
        mostrarModal('modalActualizarProducto','c')
        notificacion('info','Producto actualizado.',1200)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al actualizar el producto, intentelo de nuevo', 1500)
    })
}

function capturarEventoAgregarMarca(){
  btnAgregarMarca = document.querySelector('#btnAgregarMarca')
  btnAgregarMarca.addEventListener('click', ()=>{
    marca = document.querySelector('#marcaAgregar').value
    if( marca === '' ){
      focusAndNotification('marcaAgregar','info','Digite la marca',1200)
    }else{
      AgregarORemoverClaseDisabled('btnAgregarMarca','a')
      obj = { 'name': marca, 'user': localStorage.getItem('hs_us') }
      objData = JSON.stringify(obj)
      url = rutaServicio+'/brand/add/'+objData
      fetch(url)
        .then( response =>{
          return response.json()
        })
        .then( data =>{
          AgregarORemoverClaseDisabled('btnAgregarMarca','r')
          if( validaRespuestaPeticion(data, 'Marca no registrada, intentelo de nuevo.') ){
            obtenerMarcas()
              .then(data =>{ 
                cargarSelector('marcaProducto', data)
                document.querySelector('#marcaAgregar').value = ''
                notificacion('success','Marca agregada.',1000)
              })
          }
        })
        .catch( error => {
          console.error(error.message)
          notificacion('error','Ha ocurrido un error al guardar la marca, intentelo de nuevo', 1500)
        })
    }
  })
}

function capturarEventoAgregarCategoria(){
  btnAgregarCategoria = document.querySelector('#btnAgregarCategoria')
  btnAgregarCategoria.addEventListener('click', ()=>{
    categoria = document.querySelector('#categoriaAgregar').value
    if( categoria === '' ){
      focusAndNotification('categoriaAgregar','info','Digite la categoría.',1200)
    }else{
      AgregarORemoverClaseDisabled('btnAgregarCategoria','a')
      obj = { 'name': categoria, 'user': localStorage.getItem('hs_us') }
      objData = JSON.stringify(obj)
      url = rutaServicio+'/category/add/'+objData
      fetch(url)
      .then( response =>{
        return response.json()
      })
      .then( data =>{
        AgregarORemoverClaseDisabled('btnAgregarCategoria','r')
        if( validaRespuestaPeticion(data, 'Categoría no registrada, intentelo de nuevo.') ){
          obtenerCategorias()
            .then(data =>{ 
              cargarSelector('categoriaProducto', data)
              document.querySelector('#categoriaAgregar').value = ''
              notificacion('success','Categoría agregada.',1000)
            })
        }
      })
      .catch( error => {
        console.error(error.message)
        notificacion('error','Ha ocurrido un error al guardar la categoría, intentelo de nuevo.', 1500)
      })
    }
  })
}

function obtenerMarcasYCategorias(){
  obtenerMarcas()
    .then(data =>{ 
      cargarSelector('marcaProducto', data)
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al cargar las marcas, intentelo de nuevo', 1500)
    }) 

  obtenerCategorias()
    .then( data =>{
      cargarSelector('categoriaProducto', data)
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al cargar las categorías, intentelo de nuevo', 1500)
    })   
}

async function obtenerMarcas() {
  url = rutaServicio+'/brands'
  let response = await fetch(url);
  let data = await response.json()
  return data;
}

async function obtenerCategorias() {
  url = rutaServicio+'/categories'
  let response = await fetch(url);
  let data = await response.json()
  return data;
}

function limpiarTabalProductos(){
  tablaProductos.rows().remove().draw();
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};