const baseUrl= "https://pokeapi.co/api/v2/pokemon/"; //Url de la api Pokemon
const tamanoLotes = 20;
var urls = []

obtenerUrls();

obtenerMultiplesDatosApi()          // solicitamos la data de las urls
    .then(data => {
        console.log('Datos obtenidos:', data);
        agregarPokemones(data)
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
    });
    

function obtenerUrls()
{
    for(let i=1;i<=tamanoLotes;i++)
    {
        let urlPokemon = baseUrl+i;
        urls.push(urlPokemon)
    }
}

function obtenerMultiplesDatosApi()
{
    const promesas = urls.map(url => buscarDatos(url));
    
    return Promise.all(promesas)
    .then(data => {
        // Devolver los datos obtenidos
        return data;
    })
    .catch(error => {
        // Manejar cualquier error que ocurra durante el proceso
        console.error('Error al obtener datos:', error);
        throw error; // Propagar el error para que sea manejado por la llamada a la función
    });
}

function buscarDatos(url)             //pedimos la lista pokemon a la api
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

function agregarPokemones(json)
{
    const seccion = document.getElementById("panel-pokemon");
    json.forEach(pokemon => {

        var div =  document.createElement("div");
        div.className = "div-pokemon";
        agregarId(div,pokemon);     
        agregarNombre(div,pokemon);   
        agregarImagen(div,pokemon);      

        seccion.appendChild(div)      //agrega el div del pokemon a la seccion del pokemon
    });
}
function agregarId(div,pokemon)  //agrega el id a al div del pokemon
{
    var pokemonId = document.createElement("b")
    pokemonId.className = "pokmeon-id"
    var texto = document.createTextNode(pokemon.id) 
    pokemonId.appendChild(texto)
    div.appendChild(pokemonId)
}
function agregarNombre(div,pokemon) //agrega el nombre a al div del pokemon
{
    var pokemonNombre = document.createElement("b")
    pokemonNombre.className = "pokemon-nombre"
    var texto = document.createTextNode(pokemon.name) 
    pokemonNombre.appendChild(texto)
    div.appendChild(pokemonNombre)
}
/*
function agregarImagen(div,pokemon) //agrega la imagen a al div del pokemon
{
    var pokemonImagen = document.createElement("img")
    pokemonImagen.className = "pokemon-imagen"
    pokemonImagen.src = pokemon.nombreImagen  
    div.appendChild(pokemonImagen)
}*/