export const state = {
    allPokemons: [],
    filteredPokemons: [],
    currentPage: 1,
    itemsPerPage: 12,
    sortOption: 'id-asc',
    filterType: null,
    searchQuery: '',
  };
  
export function saveCurrentState() {
    const stateToSave = {
      currentPage: state.currentPage,
      currentSort: state.sortOption,
      currentFilterType: state.filterType,
      searchTerm: state.searchQuery,
    };
    localStorage.setItem('pokedexState', JSON.stringify(stateToSave));
}