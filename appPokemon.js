const primerUrlPokemonListado =  "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
var siguienteUrl;
const PrimeUrlRickYMorty = "https://rickandmortyapi.com/api/character";
const tituloPagina = document.title;

window.onload = function() {
    const url = asignarUrl();
    obtenerDatosApi(url)         // solicitamos la data de las urls
        .then(data => {
            console.log('Datos obtenidos:', data);
            agregarPersonajes(data)            //agregamos los personajes con la data obtenida
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
}

function asignarUrl()
{
    if(tituloPagina==="Pokémon")
    {
        return primerUrlPokemonListado;
    }else
    {
        return PrimeUrlRickYMorty;
    }
}
function obtenerDatosApi(url)   //solicita los datos de una api con la url indicada
{
    agregarAvisoCargandoInformacion();
    const promesa = buscarDatos(url);
    
    return promesa
    .then(data => {
                        
        return data;    
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
        throw error; // Propagar el error para que sea manejado por la llamada a la función
    });
}

function buscarDatos(url)             //solicita la lista de los personajes
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
            .then(data =>
            {   
                if(tituloPagina==="Pokémon")
                    {
                        siguienteUrl = data.next 
                    }else
                    {
                        siguienteUrl = data.info.next 
                    }                       
                   //se guarda la siguienteUrl para poder cargar mas
                const promises = data.results.map(pokemon => 
                {
                    return fetch(pokemon.url)               //Solicita con la url de cada uno la información de los personajes
                    .then(response => response.json())
                    . finally(() =>{
                        quitarAvisoCargandoInformación();
                    });
                });
              
              return Promise.all(promises);
            });
}


function agregarPersonajes(json) //agregamos cada personaje 
{
    var divContenedor = null;
    if(tituloPagina==="Pokémon")
    {
        divContenedor = document.getElementById("panel-pokemon");
    }else
    {
        divContenedor = document.getElementById("panel-rick-y-morty");
    }
    const cuerpo = document.getElementById("cuerpo")
    json.forEach(personaje => {

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
    var pokemonImagen = document.createElement("img")
    pokemonImagen.className = "personaje-imagen"
    if(tituloPagina==="Pokémon")
    {
        pokemonImagen.src = personaje.sprites.front_default
    }else if(tituloPagina==="Rick Y Morty")
    {
        pokemonImagen.src = personaje.image
    }
    div.appendChild(pokemonImagen)
}

function agregarBotonCargarMas(seccion)    //agrega el boton cargar mas a la seccion 
{
    const botonCargarMas = document.createElement("div");
    botonCargarMas.className = "boton";
    botonCargarMas.id = "boton-cargar-mas";
    botonCargarMas.textContent = "Cargar más"
    botonCargarMas.addEventListener("click",function() {
            obtenerDatosApi(siguienteUrl)
                .then(data => {
                    console.log('Datos obtenidos:', data);
                    agregarPersonajes(data)            //agregamos los pokemones con la data obtenida
                })
                .catch(error => {
                    console.error('Error al obtener datos:', error);
                });
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