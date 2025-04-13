import { mainElements } from "../../dictionaries/elements";

import { fetchPokemonData, getPokemonIDFromURL } from "../api";
import { loadPokemons } from "../render";
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
  
      if (!type) {
        // Если тип пустой, сбрасываем фильтрацию
        state.filteredPokemons = [];
        state.currentFilterType = "";
      } else {
        // Фильтруем покемонов по типу
        const pokemonDataList = await Promise.all(
          state.allPokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
        );
        
        state.filteredPokemons = state.allPokemons.filter((pokemon, index) => {
          const pokemonData = pokemonDataList[index];
          return pokemonData && pokemonData.types.some(t => t.type.name === type);
        });
        state.currentFilterType = type;
        
        // Применяем текущую сортировку к отфильтрованным покемонам
        applyCurrentSort();
      }
      
      // Всегда сбрасываем на первую страницу при фильтрации
      state.currentPage = 1;
      
      // Загружаем покемонов с учетом фильтра
      await loadPokemons();
  
    } catch (error) {
      console.error("Error filtering pokemons by type:", error);
    } finally {
      mainElements.loader.style.display = "none";
    }
}
  

export function resetTypeFilter() {
    console.log("Resetting type filter, showing all pokemons.");
    state.currentFilterType = "";
    state.filteredPokemons = [...state.allPokemons];
    
    // Применяем текущую сортировку
    applyCurrentSort();
    
    state.currentPage = 1;
    loadPokemons();
  }

export function applyCurrentSort() {
    const pokemonsToSort = state.filteredPokemons.length > 0 
        ? state.filteredPokemons 
        : state.allPokemons;

    switch(state.sortOption) {
        case 'id-asc':
            pokemonsToSort.sort((a, b) => getPokemonIDFromURL(a.url) - getPokemonIDFromURL(b.url));
            break;
        case 'id-desc':
            pokemonsToSort.sort((a, b) => getPokemonIDFromURL(b.url) - getPokemonIDFromURL(a.url));
            break;
        case 'name-asc':
            pokemonsToSort.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            pokemonsToSort.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    // Обновляем соответствующий массив
    if (state.filteredPokemons.length > 0) {
        state.filteredPokemons = pokemonsToSort;
    } else {
        state.allPokemons = pokemonsToSort;
    }
}