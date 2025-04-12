import { mainElements } from "../../dictionaries/elements";

export function handleSearch() {
    const searchTerm = mainElements.searchInput.value.toLowerCase().trim();
  
    if (!searchTerm) {
      // Если строка поиска пустая, возвращаем стандартное отображение
      resetSearch();
    } else {
      filterAndDisplayPokemons(searchTerm);
    }
  
    // Показываем или скрываем крестик
    mainElements.searchClear.style.display = searchTerm ? "block" : "none";
}

export function filterAndDisplayPokemons(searchTerm) {
  filteredPokemons = state.allPokemons.filter(pokemon => {
    const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
    const pokemonName = pokemon.name.toLowerCase();
    return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });

  state.totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
  currentPage = 1; 

  if (filteredPokemons.length === 0) {
    displayNoResultsMessage();
  } else {
    displayFilteredPokemons();
  }
}

export function resetSearch() {
  filteredPokemons = [];
  currentPage = 1;
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  loadPokemons();
  
  // Очищаем только поисковую часть состояния
  const savedState = localStorage.getItem('pokedexState');
  if (savedState) {
    const state = JSON.parse(savedState);
    state.searchTerm = '';
    localStorage.setItem('pokedexState', JSON.stringify(state));
  }
}

export function clearSearch() {
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  resetSearch();
}