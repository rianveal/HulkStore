rutaServicio = 'http://localhost:8080/ApiRestHulkStore/recursosWeb/servicios'
tablaProductos = null, idProductoGeneral = null
vectorProductos = []
document.addEventListener('DOMContentLoaded', ()=>{
  inicializaciones()
  obtenerProductos()
  obtenerMarcasYCategorias()
  validarAgregarProducto()
  btnActualizar = document.querySelector('#btnActualizar')
  btnActualizar.addEventListener('click', (event)=>{
    capturarEventoActualizarProducto()
  })
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
    }else if( valorVenta === '' ){
      focusAndNotification('valorVenta','info','Valor venta de producto es requerido',1000)
    }else if( topeMinimo === '' ){
      focusAndNotification('topeMinimoProducto','info','Tope mínimo de producto es requerido',1000)
    }else if( topeMaximo === '' ){
      focusAndNotification('topeMaximoProducto','info','Tope máximo de producto es requerido',1000)
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
        capturarEventoAgregarRestarCantidad(id, data.minimumExistence, data.maximumExistence)
        //capturarEventoActualizarProducto(id)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al consultar el producto, intentelo de nuevo', 1500)
    })
}

function capturarEventoAgregarRestarCantidad(id, topeMinimo, topeMaximo){
  btnAgregarCantidad =  document.querySelector('#btnAgregarCantidad')
  btnRestarCantidad = document.querySelector('#btnRestarCantidad')
  saldoActual = document.querySelector('#saldo_op').value
  if( Number(saldoActual) === 0 ){
    AgregarORemoverClaseDisabled('btnAgregarCantidad','a')
    AgregarORemoverClaseDisabled('btnRestarCantidad','a')
  }else if( Number(saldoActual) > 0 ){
    AgregarORemoverClaseDisabled('btnAgregarCantidad','r')
    AgregarORemoverClaseDisabled('btnRestarCantidad','r')
    btnAgregarCantidad.addEventListener('click', ()=>{
      cantidad = document.querySelector('#cantidad').value
      if( cantidad === '' ){
        focusAndNotification('cantidad','info','Cantidad no puede ser vacío',1400)
      }else{
        total = Number(saldoActual) + Number(cantidad)
        if( total > topeMaximo ){
          notificacion('info','El tope máximo ('+topeMaximo+') ha sido superado',1300)
        }else{
          agregarMovimientoProducto(id, 's', cantidad, total)
        }
      }
    })
  
    btnRestarCantidad.addEventListener('click', ()=>{
      cantidad = document.querySelector('#cantidad').value
      if( cantidad === '' ){
        focusAndNotification('cantidad','info','Cantidad no puede ser vacío',1400)
      }else{
        total = Number(saldoActual) - Number(cantidad)
        if( total < 0 ){
          notificacion('info','No se puede realizar el proceso, STOCK negativo.',1300)
        }else if( total < topeMinimo ){
          notificacion('info','El tope mínimo ('+topeMinimo+') ha sido superado',1300)
        }else {
          agregarMovimientoProducto(id, 'r', cantidad, total)
        }
      }
    })
  }
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
      if( validaRespuestaPeticion(data, 'Movimiento de producto no fue realizado.') ){
        AgregarORemoverClaseNone('loading','a')
        document.querySelector('#cantidad').value = ''
        document.querySelector('#saldo_op').value = total
        //obtenerProductos()
        notificacion('success','Movimiento registrado',1000)
      }
    })
    .catch( error => {
      console.error(error.message)
      notificacion('error','Ha ocurrido un error al realizar movimiento de producto, intentelo de nuevo', 1500)
    })
}

function capturarEventoActualizarProducto(){
  console.log(idProductoGeneral)
    
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
  }else if( valorVenta === '' ){
    focusAndNotification('valorVenta_op','info','Valor venta de producto es requerido',1000)
  }else if( topeMinimo === '' ){
    focusAndNotification('topeMinimoProducto_op','info','Tope mínimo de producto es requerido',1000)
  }else if( topeMaximo === '' ){
    focusAndNotification('topeMaximoProducto_op','info','Tope máximo de producto es requerido',1000)
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