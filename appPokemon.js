const primerUrlPokemonListado =  "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
var siguienteUrl;
const PrimeUrlRickYMorty = "https://rickandmortyapi.com/api/character";
const tituloPagina = document.title;

window.onload = function() {
   
    obtenerDatosApiPokemon(primerUrlPokemonListado)         // solicitamos la data de las urls
        .then(data => {
            console.log('Datos obtenidos:', data);
            agregarPersonajes(data)            //agregamos los personajes con la data obtenida
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
}


function obtenerDatosApiPokemon(url)   //solicita los datos de una api con la url indicada
{
    agregarAvisoCargandoInformacion();
    const promesa = buscarDatosPokemon(url);
    
    return promesa
    .then(data => {
                        
        return data;    
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
        throw error; // Propagar el error para que sea manejado por la llamada a la función
    });
}

function buscarDatosPokemon(url)             //solicita la lista de los personajes
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
        
                siguienteUrl = data.next   //se guarda la siguiente url para poder cargar mas
            
                const promesas = data.results.map(pokemon => 
                {
                    return fetch(pokemon.url)               //Solicita con la url de cada uno la información de los personajes
                    .then(response => response.json())
                    . finally(() =>{
                        quitarAvisoCargandoInformación();
                    });
                });
              
              return Promise.all(promesas);
            });
}

function agregarPersonajes(json) //agregamos cada personaje 
{
    const divContenedor = document.getElementById("panel-pokemon");
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
    pokemonImagen.src = personaje.sprites.front_default
    div.appendChild(pokemonImagen)
}

function agregarBotonCargarMas(seccion)    //agrega el boton cargar mas a la seccion 
{
    const botonCargarMas = document.createElement("div");
    botonCargarMas.className = "boton";
    botonCargarMas.id = "boton-cargar-mas";
    botonCargarMas.textContent = "Cargar más"
    botonCargarMas.addEventListener("click",function() {
            obtenerDatosApiPokemon(siguienteUrl)
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