import { mainElements } from "../../dictionaries/elements";

import { getPokemonIDFromURL } from "../api";
import { loadPokemons } from "../render";
import { state } from "../state";

export function sortPokemons() {
    const sortOption = mainElements.sortSelect.value;
    state.sortOption = sortOption;

    // Определяем, какие покемоны сортировать (отфильтрованные или все)
    const pokemonsToSort = state.filteredPokemons.length > 0 
        ? state.filteredPokemons 
        : state.allPokemons;

    // Применяем сортировку
    switch(sortOption) {
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

    // Сбрасываем на первую страницу и перезагружаем
    state.currentPage = 1;
    loadPokemons();
}