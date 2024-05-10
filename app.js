const primerUrlPokemonListado =  "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
var siguiente;

window.onload = function() {
obtenerDatosApi(primerUrlPokemonListado)         // solicitamos la data de las urls
    .then(data => {
        console.log('Datos obtenidos:', data);
        agregarPokemones(data)            //agregamos los personajes con la data obtenida
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
    });
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
                siguiente = data.next
                console.log(siguiente)
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


function agregarPokemones(json) //agregamos cada personaje 
{
    const seccion = document.getElementById("panel-pokemon");
    const cuerpo = document.getElementById("cuerpo")
    json.forEach(pokemon => {

        var div =  document.createElement("div");
        div.className = "div-personaje";
        agregarImagen(div,pokemon);    
        agregarId(div,pokemon);     
        agregarNombre(div,pokemon);   

        seccion.appendChild(div)      //agrega el div del personaje a la seccion del pokemon
    });
    if(!document.getElementById("boton-cargar-mas"))
    {
        agregarBotonCargarMas(cuerpo);
    }
    
}
function agregarId(div,pokemon)  //agrega el id a al div del personaje
{
    var pokemonId = document.createElement("b")
    pokemonId.className = "personaje-id"
    var texto = document.createTextNode(pokemon.id) 
    pokemonId.appendChild(texto)
    div.appendChild(pokemonId)
}
function agregarNombre(div,pokemon) //agrega el nombre a al div del personaje
{
    var pokemonNombre = document.createElement("b")
    pokemonNombre.className = "personaje-nombre"
    pokemonNombre.textContent = pokemon.name
    div.appendChild(pokemonNombre)
}

function agregarImagen(div,pokemon) //agrega la imagen a al div del personaje
{
    var pokemonImagen = document.createElement("img")
    pokemonImagen.className = "personaje-imagen"
    pokemonImagen.src = pokemon.sprites.front_default
    div.appendChild(pokemonImagen)
}

function agregarBotonCargarMas(seccion)    //agrega el boton cargar mas a la seccion 
{
    const botonCargarMas = document.createElement("div");
    botonCargarMas.className = "boton";
    botonCargarMas.id = "boton-cargar-mas";
    botonCargarMas.textContent = "Cargar más"
    botonCargarMas.addEventListener("click",function() {
            obtenerDatosApi(siguiente)
                .then(data => {
                    console.log('Datos obtenidos:', data);
                    agregarPokemones(data)            //agregamos los pokemones con la data obtenida
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