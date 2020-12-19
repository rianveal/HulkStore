document.addEventListener('DOMContentLoaded', ()=>{
  perfil = localStorage.getItem('hs_pe')
  cargarMenu(perfil)
  inicializaciones()
}, false)

function cargarMenu(perfil){
  nav = document.querySelector('#navPrincipal')
  contenindoNav = '<div class="nav-wrapper indigo darken-4">' +
                    '<a href="home.html" class="brand-logo left titulo-logo">HulkStore</a>' +
                 '</div>'
  nav.innerHTML =  contenindoNav              

  sideNav = document.querySelector('.sideNav')

  sideNavCabecera = '<li>' +
                      '<div class="user-view">' +
                        '<div class="background">' +
                          '<img src="image/background.jpg">' +
                        '</div>' +
                        '<a href="#user"><img class="circle" src="image/user.png"></a>' +
                        '<a href="#name"><span class="white-text name">Ricardo Velasquez</span></a>' +
                        '<a href="#email"><span class="white-text email">developer</span></a>' +
                      '</div>' +
                    '</li>'

  sideNavOpciones = '<li>' +
                      '<ul class="collapsible">' +
                        '<li>' +
                          '<div class="collapsible-header"><i class="material-icons">ballot</i>Administracion general</div>' +
                          '<div class="collapsible-body">' +
                            '<ul>' +
                              '<li><a href="products.html" style="margin-left: 30px;">Productos</a></li>' +
                              '<li><a href="" style="margin-left: 30px;">Marcas</a></li>' +
                              '<li><a href="" style="margin-left: 30px;">Categorías</a></li>' +
                              '<li><a href="" style="margin-left: 30px;">Proveedores</a></li>' +
                            '</ul>' +
                          '</div>' +
                        '</li>' +
                        '<li>' +
                          '<div class="collapsible-header"><i class="material-icons">table_view</i>Inventario</div>' +
                          '<div class="collapsible-body">' +
                            '<ul>' +
                              '<li><a href="" style="margin-left: 30px;">Inventario de productos</a></li>' +
                            '</ul>' +
                          '</div>' +
                        '</li>' +
                        '<li>' +
                          '<div class="collapsible-header"><i class="material-icons">settings</i>Configuración</div>' +
                          '<div class="collapsible-body">' +
                            '<ul>' +
                              '<li><a href="" style="margin-left: 30px;">Usuarios</a></li>' +
                            '</ul>' +
                          '</div>' +
                        '</li>' +
                      '</ul>' +
                    '</li>'
                    
  sideNav.innerHTML = sideNavCabecera + sideNavOpciones                  
}