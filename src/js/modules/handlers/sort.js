import { mainElements } from "../../dictionaries/elements";

import { getPokemonIDFromURL } from "../api";
import { loadPokemons } from "../render";
import { state } from "../state";

export function sortPokemons() {
    const arrayToSort = state.filteredPokemons.length > 0 
      ? state.filteredPokemons 
      : state.allPokemons;
  
    switch(state.sortOption) {
      case 'id-asc':
        arrayToSort.sort((a, b) => getPokemonIDFromURL(a.url) - getPokemonIDFromURL(b.url));
        break;
      case 'id-desc':
        arrayToSort.sort((a, b) => getPokemonIDFromURL(b.url) - getPokemonIDFromURL(a.url));
        break;
      case 'name-asc':
        arrayToSort.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        arrayToSort.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  
    loadPokemons();
  }