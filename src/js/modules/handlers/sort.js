import { state } from "../state";
import { loadPokemons } from "../render";
import { getPokemonIDFromURL } from "../api";

export function sortPokemons() {
    if (state.currentSort === 'id-asc') {
        state.allPokemons.sort((a, b) => getPokemonIDFromURL(a.url) - getPokemonIDFromURL(b.url));
    } else if (state.currentSort === 'id-desc') {
        state.allPokemons.sort((a, b) => getPokemonIDFromURL(b.url) - getPokemonIDFromURL(a.url));
    } else if (state.currentSort === 'name-asc') {
        state.allPokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.currentSort === 'name-desc') {
        state.allPokemons.sort((a, b) => b.name.localeCompare(a.name));
    }
    state.currentPage = 1;
    loadPokemons(); // Перерисовываем список покемонов
}