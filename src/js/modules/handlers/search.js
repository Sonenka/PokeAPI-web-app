import { mainElements } from "../../dictionaries/elements";
import { getPokemonIDFromURL, POKEMONS_PER_PAGE, fetchPokemonData } from "../api";
import { displayNoResultsMessage, displayFilteredPokemons, loadPokemons } from "../render";
import { state } from "../state";

import { filterPokemonsByType } from "./filter";
import { sortPokemons } from "./sort";

export function handleSearch() {
    const searchTerm = mainElements.searchInput.value.toLowerCase().trim();
    state.searchTerm = searchTerm;

    mainElements.searchClear.style.display = searchTerm ? "block" : "none";

    if (searchTerm) {
        filterBySearch(searchTerm);
    } else {
        resetSearch();
  }
}

export function filterBySearch(searchTerm) {
  const basePokemons = state.currentFilterType 
      ? state.typeFiltered 
      : state.allPokemons;

  state.searchResults = basePokemons.filter(pokemon => {
      const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
      const pokemonName = pokemon.name.toLowerCase();
      return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });
  state.searchTerm = searchTerm;

  updateCurrentDisplay();
  updateDisplayAfterSearch();
}

function updateDisplayAfterSearch() {
    state.totalPages = Math.ceil(state.currentDisplay.length / POKEMONS_PER_PAGE);
    state.currentPage = 1;

    if (state.currentDisplay.length === 0) {
        displayNoResultsMessage();
    } else {
        displayFilteredPokemons();
    }
}

export function clearSearch() {
    if (mainElements.searchInput) {
        mainElements.searchInput.value = "";
    }
    
    if (mainElements.searchClear) {
        mainElements.searchClear.style.display = "none";
    }
    
    resetSearch();
    
    // Анимация для плавности
    if (mainElements.listWrapper) {
        mainElements.listWrapper.style.opacity = "0";
        setTimeout(() => {
            mainElements.listWrapper.style.opacity = "1";
        }, 150);
    }
}

export function resetSearch() {
  state.searchTerm = "";
  state.searchResults = [];
  
  if (state.currentFilterType) {
      // Если есть активный фильтр по типу, оставляем только его
      state.currentDisplay = [...state.typeFiltered];
  } else {
      // Иначе показываем всех покемонов
      state.currentDisplay = [...state.allPokemons];
  }
  
  state.filteredPokemons = [...state.currentDisplay];
  state.currentPage = 1;
  sortPokemons();
  loadPokemons();
}

export function updateCurrentDisplay() {
  // Если есть и фильтр по типу, и поиск - используем результаты поиска
  // (они уже отфильтрованы по типу)
  if (state.currentFilterType && state.searchTerm) {
      state.currentDisplay = [...state.searchResults];
  } 
  // Если только фильтр по типу
  else if (state.currentFilterType) {
      state.currentDisplay = [...state.typeFiltered];
  } 
  // Если только поиск
  else if (state.searchTerm) {
      state.currentDisplay = [...state.searchResults];
  } 
  // Если ничего не активно - все покемоны
  else {
      state.currentDisplay = [...state.allPokemons];
  }

  // Для обратной совместимости
  state.filteredPokemons = [...state.currentDisplay];
}