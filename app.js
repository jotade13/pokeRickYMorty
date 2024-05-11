const primerUrlPokemonListado =  "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
var siguienteUrl;
const PrimerUrlRickYMorty = "https://rickandmortyapi.com/api/character";
const tituloPagina = document.title;

if(esPokemon(tituloPagina))
{
    window.onload = function() {
   
        obtenerDatosApiPokemon(primerUrlPokemonListado)         // solicitamos la data de la primera url
            .then(data => {
                console.log('Datos obtenidos:', data);
                agregarPersonajes(data)            //agregamos los personajes con la data obtenida
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }
}else
{
    window.onload = function() {
        obtenerDatosApiRickYMorty(PrimerUrlRickYMorty); // solicita data de la primera url ricky Morty
    }
}


function esPokemon(texto)   //funcion que devuelve tru si es Pokémon
{
    if(texto=="Pokémon")
    {
        return true;
    }else
    {
        return false;
    }
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

async function obtenerDatosApiRickYMorty(PrimeUrlRickYMorty)   //solicita los datos de una api con la url indicada
{
    agregarAvisoCargandoInformacion();
    try
    {
        const respuesta = await buscarDatosRickYMorty(PrimeUrlRickYMorty);
        console.log(respuesta);
        agregarPersonajes(respuesta.results);
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
    const divContenedor = obtenerContenedor();
    const cuerpo = document.getElementById("cuerpo");

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

function obtenerContenedor() //obtiene el contenedor dependiendo de la pagina que esta
{
    if(esPokemon(tituloPagina))
    {
        return document.getElementById("panel-pokemon");
    }
    else
    {
        return document.getElementById("panel-rick-y-morty");
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
    var personajeNombre = document.createElement("b");
    personajeNombre.className = "personaje-nombre";
    personajeNombre.textContent = personaje.name;
    div.appendChild(personajeNombre)
}

function agregarImagen(div,personaje) //agrega la imagen a al div del personaje
{
    var pokemonImagen = document.createElement("img");
    pokemonImagen.className = "personaje-imagen";
    pokemonImagen.src = obtenerImagen(personaje);
    div.appendChild(pokemonImagen);
}

function obtenerImagen(personaje) //obtiene la imagen dependiendo del titulo de la pagina
{
    if(esPokemon(tituloPagina))
    {
        return personaje.sprites.front_default;
    }
    else
    {
        return personaje.image;
    }
}

function agregarBotonCargarMas(contenedor)    //agrega el boton cargar mas a la seccion 
{
    const botonCargarMas = document.createElement("div");
    botonCargarMas.className = "boton";
    botonCargarMas.id = "boton-cargar-mas";
    botonCargarMas.textContent = "Cargar más"
    agregarEventListener(botonCargarMas);
    contenedor.appendChild(botonCargarMas);
}

function agregarEventListener(botonCargarMas) 
{
    if(esPokemon(tituloPagina))
    {
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
    }
    else
    {
        botonCargarMas.addEventListener("click",function() {
            obtenerDatosApiRickYMorty(siguienteUrl)
      });
    }
}

function agregarAvisoCargandoInformacion()
{
    
    document.getElementById("div-cargando").style.display = "block";
}
function quitarAvisoCargandoInformación()
{
   
    document.getElementById("div-cargando").style.display = "none";
}