import { mainElements } from "../../dictionaries/elements";
import { fetchPokemonData, getPokemonIDFromURL, POKEMONS_PER_PAGE } from "../api";
import { displayNoResultsMessage, displayPokemons, updatePaginationUI, loadPokemons } from "../render";
import { state } from "../state";

export async function handleTypeFilterChange() {
    const selectedType = mainElements.filterSelect.value;
    state.currentFilterType = selectedType;
  
    if (!state.allPokemons.length) {
      console.warn("Pokemons are not yet loaded.");
      return;
    }
  
    // Если выбран пустой тип (All Types), сбрасываем фильтр
    if (selectedType === "") {
      resetTypeFilter();
    } else {
      await filterPokemonsByType(selectedType);
    }
  }

export async function filterPokemonsByType(type) {
    try {
      mainElements.listWrapper.innerHTML = "";
      mainElements.loader.style.display = "flex";
  
      // Приводим тип к пустой строке, если это "All types" (на случай сохранённого состояния)
      const normalizedType = type === "All types" ? "" : type;
  
      // Если тип пустой, показываем всех покемонов
      if (!normalizedType) {
        console.log("Filtering pokemons by type: All Types");
        state.filteredPokemons = [...state.allPokemons];
        state.totalPages = Math.ceil(state.filteredPokemons.length / POKEMONS_PER_PAGE);
        state.currentPage = 1;
      } else {
        console.log(`Filtering pokemons by type: ${normalizedType}`);
        const pokemonDataList = await Promise.all(
          state.allPokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
        );
        state.filteredPokemons = state.allPokemons.filter((pokemon, index) => {
          const pokemonData = pokemonDataList[index];
          return pokemonData && pokemonData.types.some(t => t.type.name === normalizedType);
        });
        console.log("Filtered pokemons:", state.filteredPokemons);
        state.totalPages = Math.ceil(state.filteredPokemons.length / POKEMONS_PER_PAGE);
        state.currentPage = 1;
      }
  
      const start = (state.currentPage - 1) * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      const currentPagePokemons = state.filteredPokemons.slice(start, end);
  
      console.log("Current page pokemons after filter:", currentPagePokemons);
  
      const currentPageData = await Promise.all(
        currentPagePokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
      );
  
      displayPokemons(currentPagePokemons, currentPageData);
      updatePaginationUI();
  
    } catch (error) {
      console.error("Error filtering pokemons by type:", error);
    } finally {
      mainElements.loader.style.display = "none";
    }
  }
  

export function resetTypeFilter() {
  console.log("Resetting type filter, showing all pokemons.");
  state.currentFilterType = "";
  state.filteredPokemons = [...state.allPokemons];  // Показываем всех покемонов
  state.currentPage = 1;
  loadPokemons();
}
