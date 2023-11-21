let page = 1
const POKEMONS_STORAGE_KEY = 'pokemon-favorites'

let pokemonFavorites = JSON.parse(localStorage.getItem(POKEMONS_STORAGE_KEY)) ?? []

const fetchPokemons = async (page = 1) => {
  const limit = 9
  const offset = (page - 1) * limit
  const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`

  const response = await axios.get(url)
  const dataResults = response.data.results.map(pokemon => {
    // "https://pokeapi.co/api/v2/pokemon/1/"
    const id = pokemon.url.split('/').at(6)  //[6]
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    const currentFavorites = JSON.parse(localStorage.getItem(POKEMONS_STORAGE_KEY)) ?? []
    const foundFavorite = currentFavorites.find(favorite => favorite.id === id)
    return {
      ...pokemon, //name, url
      id,
      image,
      isFavorite: Boolean(foundFavorite)
    }
  })
  // console.log(dataResults);

  return dataResults

}



const documentReady = async () => {
  const prePage = document.getElementById('prevPage')
  const currentPage = document.getElementById('currentPage')
  const nextPage = document.getElementById('nextPage')


  nextPage.addEventListener('click', async () => {
    const pokemons = await fetchPokemons(++page)
    renderPokemons(pokemons)
    currentPage.innerHTML = page
  })

  prePage.addEventListener('click', async () => {
    // page = page - 1
    const pokemons = await fetchPokemons(--page)
    renderPokemons(pokemons)
    currentPage.innerHTML = page
  })


  const pokemons = await fetchPokemons()

  console.log(pokemons);

  renderPokemons(pokemons)

}

document.addEventListener('DOMContentLoaded', documentReady)


const renderPokemons = (pokemons) => {
  const pokemonsList = document.getElementById('pokemonsList')

  let elements = ''

  pokemons.forEach(pokemon => {
    elements += `
    <article class="pokemons-item">
      <img src="${pokemon.image}" width="150" height="150"/>
      <h2>${pokemon.name}</h2>
      <div class="pokemons-item__buttons">
        <button onclick="toggleFavorite('${pokemon.id}', '${pokemon.name}')" >
          <svg class="${pokemon.isFavorite ? 'is-favorite' : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-star"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </button>
      </div>
    </article>
    `
  })

  pokemonsList.innerHTML = elements
}

const toggleFavorite = async (id, name) => {
  const foundPokemonFavorite = pokemonFavorites.filter(favorite => favorite.id === id)
  const existPokemonFavorite = foundPokemonFavorite.length > 0

  if(existPokemonFavorite){
    pokemonFavorites = pokemonFavorites.filter(favorite => favorite.id !== id)
  } else {
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    pokemonFavorites.push({id, name, image})
  }
  // console.log('POKEMON SELECCIONADO', id, name);
  
  localStorage.setItem(POKEMONS_STORAGE_KEY, JSON.stringify(pokemonFavorites))

  const pokemons = await fetchPokemons(page)
  renderPokemons(pokemons)


}