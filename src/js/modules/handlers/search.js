import { mainElements } from "../../dictionaries/elements";
import { getPokemonIDFromURL, POKEMONS_PER_PAGE, fetchPokemonData } from "../api";
import { displayNoResultsMessage, displayFilteredPokemons, loadPokemons } from "../render";
import { state } from "../state";

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

function filterBySearch(searchTerm) {
    const basePokemons = state.currentFilterType 
        ? state.typeFiltered 
        : state.allPokemons;

    const searchResults = basePokemons.filter(pokemon => {
        const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
        const pokemonName = pokemon.name.toLowerCase();
        return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
    });

    state.currentDisplay = searchResults;
    state.filteredPokemons = searchResults;
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
    
    state.filteredPokemons = state.currentFilterType 
        ? state.typeFiltered 
        : state.allPokemons;
    
    state.currentPage = 1;
    loadPokemons();
}