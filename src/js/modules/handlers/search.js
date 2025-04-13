import { mainElements } from "../../dictionaries/elements";
import { getPokemonIDFromURL, POKEMONS_PER_PAGE, fetchPokemonData } from "../api";
import { displayNoResultsMessage, displayFilteredPokemons, loadPokemons } from "../render";
import { state } from "../state";

// Инициализация поиска
export function initSearch() {
  if (mainElements.searchInput) {
    mainElements.searchInput.addEventListener("input", handleSearch);
    mainElements.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }
  
  if (mainElements.searchClear) {
    mainElements.searchClear.addEventListener("click", clearSearch);
    mainElements.searchClear.style.display = "none";
  }
}

export function handleSearch() {
  const searchTerm = mainElements.searchInput.value.toLowerCase().trim();
  state.searchTerm = searchTerm;

  // Показываем/скрываем кнопку очистки
  if (mainElements.searchClear) {
    mainElements.searchClear.style.display = searchTerm ? "block" : "none";
  }

  if (searchTerm) {
    filterBySearch(searchTerm);
  } else {
    resetSearch();
  }
}

function filterBySearch(searchTerm) {
  // Базовый список - либо отфильтрованные по типу, либо все покемоны
  const basePokemons = state.currentFilterType 
    ? state.typeFiltered 
    : state.allPokemons;

  // Фильтруем по поисковому запросу
  const searchResults = basePokemons.filter(pokemon => {
    const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
    const pokemonName = pokemon.name.toLowerCase();
    return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });

  // Обновляем состояние
  state.currentDisplay = searchResults;
  state.filteredPokemons = searchResults; // Добавим для совместимости
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

function resetSearch() {
  state.searchTerm = "";
  
  // Возвращаемся к базовому списку
  state.currentDisplay = state.currentFilterType 
    ? state.typeFiltered 
    : state.allPokemons;
  
  // Обновляем отображение
  state.currentPage = 1;
  loadPokemons();
}