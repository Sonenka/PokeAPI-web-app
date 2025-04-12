const mainElements = {
    listWrapper: document.querySelector(".list-wrapper"),
    firstButton: document.getElementById("firstButton"),
    prevButton: document.getElementById("prevButton"),
    nextButton: document.getElementById("nextButton"),
    lastButton: document.getElementById("lastButton"),
    pageInput: document.getElementById("pageInput"),
    pageInfo: document.getElementById("pageInfo"),
    goButton: document.querySelector(".pagination__button--go"),
    loader: document.querySelector(".loader-container"),
    filterSelect: document.getElementById("filterSelect"),
    sortSelect: document.getElementById("sortSelect"),
    searchInput: document.getElementById("search__input"),
    searchClear: document.getElementById("search__clear")
};
  
const detailsElements = {
    backButton: document.getElementById("backButton"),
    pokemonName: document.getElementById('pokemonName'),
    pokemonID: document.getElementById('pokemonID'),
    pokemonImage: document.getElementById('pokemonImage'),
    typesContainer: document.getElementById('typesContainer'),
    pokemonHeight: document.getElementById('pokemonHeight'),
    pokemonWeight: document.getElementById('pokemonWeight'),
    pokemonBaseExp: document.getElementById('pokemonBaseExp'),
    statsContainer: document.getElementById('statsContainer'),
    abilitiesContainer: document.getElementById('abilitiesContainer')
};
  
export { mainElements, detailsElements };