import { mainElements } from "../../dictionaries/elements";

import { getPokemonIDFromURL, POKEMONS_PER_PAGE } from "../api";
import { displayNoResultsMessage, displayFilteredPokemons, loadPokemons } from "../render";
import { state } from "../state";

export function handleSearch() {
  const searchTerm = mainElements.searchInput.value.toLowerCase().trim();
  state.searchTerm = searchTerm;

  if (!searchTerm) {
      // При пустом поиске показываем всех покемонов
      resetSearch();
  } else {
      // При наличии поискового запроса фильтруем
      filterAndDisplayPokemons(searchTerm);
  }

  mainElements.searchClear.style.display = searchTerm ? "block" : "none";
}

function filterAndDisplayPokemons(searchTerm) {
  state.filteredPokemons = state.allPokemons.filter(pokemon => {
      const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
      const pokemonName = pokemon.name.toLowerCase();
      return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });

  state.totalPages = Math.ceil(state.filteredPokemons.length / POKEMONS_PER_PAGE);
  state.currentPage = 1;

  if (state.filteredPokemons.length === 0) {
      displayNoResultsMessage();
  } else {
      displayFilteredPokemons();
  }
}

function resetSearch() {
  // Восстанавливаем полный список покемонов
  state.filteredPokemons = [...state.allPokemons];
  state.searchTerm = '';
  state.currentPage = 1;
  
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  
  // Обновляем отображение
  loadPokemons();
  
  // Обновляем localStorage
  const savedState = JSON.parse(localStorage.getItem('pokedexState') || '{}');
  savedState.searchTerm = '';
  localStorage.setItem('pokedexState', JSON.stringify(savedState));
}

export function clearSearch() {
  // Просто вызываем resetSearch
  resetSearch();
}