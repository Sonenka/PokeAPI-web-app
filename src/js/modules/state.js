import { mainElements } from "../dictionaries/elements";

export const state = {
    allPokemons: [],
    typeFiltered: [],    // Покемоны, отфильтрованные по типу
    searchResults: [],   // Результаты поиска
    currentDisplay: [],  // Текущие покемоны для отображения
    filteredPokemons: [], // Для обратной совместимости
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
        currentFilterType: state.currentFilterType || "",
        searchTerm: mainElements.searchInput.value.trim() 
    };
  
    localStorage.setItem('pokedexState', JSON.stringify(stateToSave));
    localStorage.setItem('currentPokemonID', pokemonID);
  
    window.location.href = `details.html?id=${pokemonID}`;
  }