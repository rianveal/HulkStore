
function focus(id){
  document.querySelector('#'+id).focus()
}

function notificacion(icono, mensaje, tiempo){
  Swal.fire({
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: tiempo
  })
}

function focusAndNotification(id,icono, mensaje, tiempo){
  document.querySelector('#'+id).focus()
  Swal.fire({
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: tiempo
  })
}

function inicializaciones(){
  options = null
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, options);

  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, options);

  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, options);

  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, options);
}

function validaRespuestaPeticion(datos, mensajeRespuestaNo){
  resp = datos[0]
  validaRespuesta = false
  if( resp === 'NCDB' ){
    notificacion('info','Algó salió mal - NCDB', 1000)
  }else if(  resp === 'NO' ){
    notificacion('info',mensajeRespuestaNo, 1000)
  }else{
    validaRespuesta = true
  }

  return validaRespuesta
}