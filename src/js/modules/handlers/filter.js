import { mainElements } from "../../dictionaries/elements";

import { fetchPokemonData, getPokemonIDFromURL } from "../api";
import { displayNoResultsMessage, loadPokemons } from "../render";
import { state } from "../state";
import { toggleLoader } from "../utils";
import { sortPokemons } from "./sort";

import { filterBySearch, updateCurrentDisplay } from "./search";

export async function handleTypeFilterChange() {
    const selectedType = mainElements.filterSelect.value;
    state.currentFilterType = selectedType;
  
    if (!state.allPokemons.length) {
        console.warn("Pokemons are not yet loaded.");
        return;
    }
  
    // если выбран all types, сбрасываем фильтры
    if (selectedType === "") {
        resetTypeFilter();
    } else {
        await filterPokemonsByType(selectedType);
    }
}

export async function filterPokemonsByType(type) {
  try {
      toggleLoader(true);
      mainElements.listWrapper.innerHTML = "";

      // 1. Фильтруем покемонов по выбранному типу
      if (!type) {
          state.typeFiltered = [...state.allPokemons];
          state.currentFilterType = "";
      } else {
          const pokemonDataList = await Promise.all(
              state.allPokemons.map(pokemon => 
                  fetchPokemonData(getPokemonIDFromURL(pokemon.url))
          ));
          
          state.typeFiltered = state.allPokemons.filter((pokemon, index) => {
              const pokemonData = pokemonDataList[index];
              return pokemonData?.types.some(t => t.type.name === type);
          });
          state.currentFilterType = type;
      }

      // 2. Если есть активный поиск, применяем его к отфильтрованным по типу покемонам
      if (state.searchTerm) {
          state.searchResults = state.typeFiltered.filter(pokemon => {
              const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
              const pokemonName = pokemon.name.toLowerCase();
              return pokemonID.includes(state.searchTerm) || pokemonName.includes(state.searchTerm);
          });
      }

      // 3. Обновляем текущее отображение
      updateCurrentDisplay();

      // 4. Проверяем, есть ли покемоны для отображения
      if (state.currentDisplay.length === 0) {
          displayNoResultsMessage();
          // Не загружаем покемонов, если их нет
          return;
      }

      // 5. Если есть что показать - загружаем
      state.currentPage = 1;
      sortPokemons();
      await loadPokemons();

  } catch (error) {
      console.error("Error filtering pokemons by type:", error);
      displayErrorState();
  } finally {
      toggleLoader(false);
  }
}
  
export function resetTypeFilter() {
    state.currentFilterType = "";
    state.typeFiltered = [...state.allPokemons]; 
    
    if (state.searchTerm) {
        // Пересчитываем searchResults по всем покемонам
        state.searchResults = state.allPokemons.filter(pokemon => {
            const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
            const pokemonName = pokemon.name.toLowerCase();
            return pokemonID.includes(state.searchTerm) || pokemonName.includes(state.searchTerm);
        });
    }
    
    updateCurrentDisplay(); // Обновляем currentDisplay
    state.currentPage = 1;
    sortPokemons();
    loadPokemons();
}
