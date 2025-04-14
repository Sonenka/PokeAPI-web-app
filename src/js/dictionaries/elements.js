const mainElements = {
    listWrapper: document.querySelector(".list-wrapper"),
    firstButton: document.getElementById("firstButton"),
    prevButton: document.getElementById("prevButton"),
    nextButton: document.getElementById("nextButton"),
    lastButton: document.getElementById("lastButton"),
    firstButtonMobile: document.getElementById("mobileFirstButton"),
    prevButtonMobile: document.getElementById("mobilePrevButton"),
    nextButtonMobile: document.getElementById("mobileNextButton"),
    lastButtonMobile: document.getElementById("mobileLastButton"),
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
    flavorText: document.querySelector('.details__flavor-text'),
    statsContainer: document.getElementById('statsContainer'),
    abilitiesContainer: document.getElementById('abilitiesContainer'),
    details: document.querySelector(".details")
};
  
export { mainElements, detailsElements };