import { mainElements } from "../../dictionaries/elements";

import { fetchPokemonData, getPokemonIDFromURL } from "../api";
import { loadPokemons } from "../render";
import { state } from "../state";
import { toggleLoader } from "../utils";

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
        mainElements.listWrapper.innerHTML = "";
        toggleLoader(true);

        if (!type) {
            // если тип пустой, сбрасываем фильтрацию
            state.filteredPokemons = [];
            state.currentFilterType = "";
        } else {
            const pokemonDataList = await Promise.all(
                state.allPokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
            );
            
            state.filteredPokemons = state.allPokemons.filter((pokemon, index) => {
                const pokemonData = pokemonDataList[index];
                return pokemonData && pokemonData.types.some(t => t.type.name === type);
            });

            state.currentFilterType = type;
        }
        
        state.currentPage = 1;
        await loadPokemons();
    } catch (error) {
        console.error("Error filtering pokemons by type:", error);
    } finally {
        toggleLoader(false);
    }
}
  
export function resetTypeFilter() {
    state.currentFilterType = "";
    state.filteredPokemons = [...state.allPokemons];
    
    state.currentPage = 1;
    loadPokemons();
}
