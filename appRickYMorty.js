
const PrimeUrlRickYMorty = "https://rickandmortyapi.com/api/character";
var siguienteUrl;

window.onload = function() {
    obtenerDatosApiRickYMorty(PrimeUrlRickYMorty);
}

async function obtenerDatosApiRickYMorty(PrimeUrlRickYMorty)   //solicita los datos de una api con la url indicada
{
    agregarAvisoCargandoInformacion();
    try
    {
        const respuesta = await buscarDatosRickYMorty(PrimeUrlRickYMorty);
        console.log(respuesta);
        agregarPersonajes(respuesta);
        siguienteUrl = respuesta.info.next
    }catch
    {
        console.error('Error al obtener datos:', error);
    }finally{
        quitarAvisoCargandoInformación();
    }
}

function buscarDatosRickYMorty(url)
{
    return fetch(url)
            .then(response => 
            {
                if (!response.ok) 
                {
                    reject(new Error(`Error al realizar la solicitud. Código de estado: ${response.status}`));
                }
                return response.json();
            })
}

function agregarPersonajes(json) //agregamos cada personaje 
{
    const divContenedor = document.getElementById("panel-rick-y-morty");
    const cuerpo = document.getElementById("cuerpo")
    json.results.forEach(personaje => {

        var div =  document.createElement("div");
        div.className = "div-personaje";
        agregarImagen(div,personaje);    
        agregarId(div,personaje);     
        agregarNombre(div,personaje);   

        divContenedor.appendChild(div)      //agrega el div del personaje a la seccion del pokemon
    });
    if(!document.getElementById("boton-cargar-mas"))
    {
        agregarBotonCargarMas(cuerpo);
    }
    
}



function agregarId(div,personaje)  //agrega el id a al div del personaje
{
    var personajeId = document.createElement("b")
    personajeId.className = "personaje-id"
    var texto = document.createTextNode(personaje.id) 
    personajeId.appendChild(texto)
    div.appendChild(personajeId)
}

function agregarNombre(div,personaje) //agrega el nombre a al div del personaje
{
    var personajeNombre = document.createElement("b")
    personajeNombre.className = "personaje-nombre"
    personajeNombre.textContent = personaje.name
    div.appendChild(personajeNombre)
}

function agregarImagen(div,personaje) //agrega la imagen a al div del personaje
{
    var personajeImagen = document.createElement("img")
    personajeImagen.className = "personaje-imagen"
    personajeImagen.src = personaje.image
    div.appendChild(personajeImagen)
}

function agregarBotonCargarMas(seccion)    //agrega el boton cargar mas a la seccion 
{
    const botonCargarMas = document.createElement("div");
    botonCargarMas.className = "boton";
    botonCargarMas.id = "boton-cargar-mas";
    botonCargarMas.textContent = "Cargar más"
    botonCargarMas.addEventListener("click",function() {
            obtenerDatosApiRickYMorty(siguienteUrl)
      });
    seccion.appendChild(botonCargarMas);
}
function agregarAvisoCargandoInformacion()
{
    document.getElementById("div-cargando").style.display = "block";
}
function quitarAvisoCargandoInformación()
{
   
    document.getElementById("div-cargando").style.display = "none";
}