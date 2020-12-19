rutaServicio = 'http://localhost:8080/ApiRestHulkStore/recursosWeb/servicios'
document.addEventListener('DOMContentLoaded', ()=>{
  inicializaciones()
  validarAgregarProducto()
}, false)

function validarAgregarProducto(){
  btnAgregarProducto = document.querySelector('#btnAgregarProducto')
  btnAgregarProducto.addEventListener('click', () => {
    nombre = document.querySelector('#nombreProducto').value
    marca = document.querySelector('#marcaProducto').value
    categoria = document.querySelector('#categoriaProducto').value
    proveedor = document.querySelector('#proveedorProducto').value
    valorUnitario = document.querySelector('#valorUnitario').value
    valorVenta = document.querySelector('#valorVenta').value
    topeMinimo = document.querySelector('#topeMinimoProducto').value
    topeMaximo = document.querySelector('#topeMaximoProducto').value
    if( nombre === '' ){
      focusAndNotification('nombreProducto','info','Nombre de producto es requerido',1000)
    }else if( marca === '' ){
      focusAndNotification('marcaProducto','info','Marca de producto es requerida',1000)
    }else if( categoria === '' ){
      focusAndNotification('categoriaProducto','info','Categroría de producto es requerida',1000)
    }else if( proveedor === '' ){
      focusAndNotification('proveedorProducto','info','Proveedor del producto es requerido',1000)
    }else if( valorUnitario === '' ){
      focusAndNotification('valorUnitario','info','Valor unitario de producto es requerido',1000)
    }else if( valorVenta === '' ){
      focusAndNotification('valorVenta','info','Valor venta de producto es requerido',1000)
    }else if( topeMinimo === '' ){
      focusAndNotification('topeMinimoProducto','info','Tope mínimo de producto es requerido',1000)
    }else if( topeMaximo === '' ){
      focusAndNotification('topeMaximoProducto','info','Tope máximo de producto es requerido',1000)
    }else{
      console.log()
    }
  })
}