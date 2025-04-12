import { mainElements } from "../dictionaries/elements";

export const state = {
    allPokemons: [],
    filteredPokemons: [],
    currentPage: 1,
    itemsPerPage: 12,
    sortOption: 'id-asc',
    currentFilterType: "",
    searchTerm: '',
};

export function openPokemonDetails(pokemonID) {
    const stateToSave = {
      currentPage: state.currentPage,
      currentSort: state.sortOption,
      currentFilterType: state.currentFilterType || "", // гарантируем строку
      searchTerm: mainElements.searchInput.value.trim() // используем актуальное значение
    };
  
    localStorage.setItem('pokedexState', JSON.stringify(stateToSave));
    localStorage.setItem('currentPokemonID', pokemonID);
  
    window.location.href = `details.html?id=${pokemonID}`;
  }