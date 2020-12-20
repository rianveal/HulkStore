document.addEventListener('DOMContentLoaded', ()=>{
  perfil = localStorage.getItem('hs_pe')
  cargarCabecera()
  cargarMenuOpciones()
  cargarOpciones()
  inicializaciones()
}, false)

function cargarCabecera(){
  nav = document.querySelector('#navPrincipal')
  contenindoNav = '<div class="nav-wrapper indigo darken-4">' +
                    '<a href="home.html" class="brand-logo left titulo-logo">HulkStore</a>' +
                 '</div>'
  nav.innerHTML =  contenindoNav              

  sideNav = document.querySelector('.sideNav')                
}

function cargarOpciones(){
  page = document.querySelector('#page')
  if( page !== null ){
    if( page.value === 'home' ){
      contenedor = document.querySelector('#contenedorMenuOpciones')
      opcionesUsuario = '<div class="col s10 offset-s1 m8">' +
                          '<div class="card small">' +
                            '<div class="card-image waves-effect waves-block waves-light">' +
                              '<img class="activator" src="image/marvel-comics.jpg">' +
                            '</div>' +
                            '<div class="card-content">' +
                              '<span class="card-title activator grey-text text-darken-4">Productos<i class="material-icons right">more_vert</i></span>' +
                              '<p><a href="products.html">Acceder</a></p>' +
                            '</div>' +
                            '<div class="card-reveal">' +
                              '<span class="card-title grey-text text-darken-4">Productos<i class="material-icons right">close</i></span>' +
                              '<p>Opción para la adminsitración de productos</p>' +
                            '</div>' +
                          '</div>' +
                        '</div>' 

      contenedor.innerHTML = opcionesUsuario            
    }
  }
}

function cargarMenuOpciones(){
  menu = document.querySelector('#menu-opciones')
  opciones = '<a class="btn-floating btn-large purple darken-4">' +
                '<i class="large material-icons">more_vert</i>' +
              '</a>' +
              '<ul>' +
                '<li>' +
                  '<a class="btn-floating purple darken-2 tooltipped" href="home.html" data-position="left" data-tooltip="Ir al inicio">' +
                    '<i class="material-icons">home</i>' +
                  '</a>' +
                '</li>' +
                '<li>' +
                  '<a class="btn-floating purple darken-2 tooltipped" href="index.html" data-position="left" data-tooltip="Salir">' +
                    '<i class="material-icons">exit_to_app</i>' +
                  '</a>' +
                '</li>' +
              '</ul>'
  menu.innerHTML = opciones            
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};