
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

  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, options);

  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems, options);
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

function AgregarORemoverClaseNone(id, proccess){
  if( proccess === 'a' ){
    document.querySelector('#'+id).classList.add('none')
  }else if( proccess === 'r' ){
    document.querySelector('#'+id).classList.remove('none')
  }
}

function AgregarORemoverClaseDisabled(id, proccess){
  if( proccess === 'a' ){
    document.querySelector('#'+id).classList.add('disabled')
  }else if( proccess === 'r' ){
    document.querySelector('#'+id).classList.remove('disabled')
  }
}

function cargarSelector(idSelect, data){
  selectElement = document.querySelector('#'+idSelect)
  selectElement.innerHTML = ''
  M.FormSelect.init(selectElement)
  optionSelection = document.createElement('option')
  optionSelection.setAttribute('value', '')
  optionSelection.setAttribute('disabled', 'true')
  optionSelection.setAttribute('selected', 'true')
  optionSelection.innerText = 'Seleccione'
  selectElement.append(optionSelection)
  data.forEach( el => {
    option = document.createElement('option')
    option.setAttribute('value', el.id)
    option.innerText = el.value
    selectElement.append(option)
  })
  M.FormSelect.init(selectElement)
}

function cargarSelectorEspecifico(idSelect, data, idSelected){
  selectElement = document.querySelector('#'+idSelect)
  data.forEach( el => {
    option = document.createElement('option')
    if( el.id === idSelected ){
      option.setAttribute('selected', 'true') 
    }
    option.setAttribute('value', el.id)
    option.innerText = el.value
    selectElement.append(option)
  })
  M.FormSelect.init(selectElement)
}

function mostrarModal(idModal, proceso){
  elem = document.querySelector('#'+idModal)
  instance  = M.Modal.getInstance(elem);
  if( proceso === 'o' ){ 
    instance.open();
  }else if( proceso === 'c' ){
    instance.close();
  }
}