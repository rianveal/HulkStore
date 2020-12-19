rutaServicio = 'http://localhost:8080/ApiRestHulkStore/recursosWeb/servicios'
document.addEventListener('DOMContentLoaded', ()=>{
  capturarEventoIniciar()
}, false)

function capturarEventoIniciar(){
  btnIniciar = document.querySelector('#btnIniciar')
  btnIniciar.addEventListener('click', ()=>{
    usuario = document.querySelector('#usuario')
    contrasena = document.querySelector('#contrasena')
    if( usuario.value === '' ){
      focus('usuario')
      notificacion('info','Haz olvidado digitar tu usuario.', 1200)
    }else if( contrasena.value === '' ){
      focus('contrasena')
      notificacion('info','Haz olvidado digitar tu contraseña.', 1200)
    }else{
      validarCredenciales(usuario.value, contrasena.value)
    }
  })
}

function validarCredenciales(usuario, contrasena){
  url = rutaServicio+'/user/validateCredentials/'+usuario+'/'+contrasena
  fetch(url)
    .then(response => {
      return response.json()
    })
    .then( datos => {
      if( validaRespuestaPeticion(datos, 'Acceso denegado') ){
        localStorage.setItem('hs_us', usuario)
        localStorage.setItem('hs_do', documento)
        localStorage.setItem('hs_pe', perfil)
      }
    })
    .catch( error => {
      console.error(error.message)
    })
}