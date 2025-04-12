import { mainElements } from "../../dictionaries/elements";
import { saveCurrentState, state } from "../state";
import { fetchPokemonData, getPokemonIDFromURL, POKEMONS_PER_PAGE } from "../api";
import { displayNoResultsMessage, displayPokemons, updatePaginationUI } from "../render";

export async function handleTypeFilterChange() {
    state.currentFilterType = mainElements.filterSelect.value;
    
    // Сохраняем состояние перед изменением
    saveCurrentState();
    
    if (state.currentFilterType === "") {
      resetTypeFilter();
    } else {
      await filterPokemonsByType(state.currentFilterType);
    }
}

export async function filterPokemonsByType(type) {
  try {
    mainElements.listWrapper.innerHTML = "";
    mainElements.loader.style.display = "flex";
    
    // Сначала получаем данные всех покемонов
    const pokemonDataList = await Promise.all(
      state.allPokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
    );
    
    // Фильтруем покемонов по типу
    state.filteredPokemons = state.allPokemons.filter((pokemon, index) => {
      const pokemonData = pokemonDataList[index];
      return pokemonData && pokemonData.types.some(t => t.type.name === type);
    });
    
    state.totalPages = Math.ceil(state.filteredPokemons.length / POKEMONS_PER_PAGE);
    state.currentPage = 1;
    
    if (state.filteredPokemons.length === 0) {
      displayNoResultsMessage();
    } else {
      // Загружаем данные для отображения (только для текущей страницы)
      const start = (state.currentPage - 1) * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      const currentPagePokemons = state.filteredPokemons.slice(start, end);
      
      const currentPageData = await Promise.all(
        currentPagePokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
      );
      
      displayPokemons(currentPagePokemons, currentPageData);
    }
    
    updatePaginationUI();
  } catch (error) {
    console.error("Error filtering pokemons by type:", error);
  } finally {
    mainElements.loader.style.display = "none";
  }
}

export function resetTypeFilter() {
    state.currentFilterType = "";
    state.filteredPokemons = [];
    state.currentPage = 1;
    loadPokemons();
}