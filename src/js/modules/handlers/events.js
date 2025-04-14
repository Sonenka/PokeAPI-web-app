import { mainElements } from "../../dictionaries/elements";

import { handleTypeFilterChange } from "./filter";
import { handleSearch, clearSearch } from "./search";
import { sortPokemons } from "./sort";

import { loadPage } from "../render";
import { state } from "../state";

export function setupEventListeners() {
    // декстопные кнопки
    mainElements.firstButton.addEventListener("click", () => loadPage(1));
    mainElements.prevButton.addEventListener("click", () => loadPage(state.currentPage - 1));
    mainElements.nextButton.addEventListener("click", () => loadPage(state.currentPage + 1));
    mainElements.lastButton.addEventListener("click", () => loadPage(state.totalPages));

    // мобильные кнопки
    mainElements.firstButtonMobile.addEventListener("click", () => loadPage(1));
    mainElements.prevButtonMobile.addEventListener("click", () => loadPage(state.currentPage - 1));
    mainElements.nextButtonMobile.addEventListener("click", () => loadPage(state.currentPage + 1));
    mainElements.lastButtonMobile.addEventListener("click", () => loadPage(state.totalPages));

    mainElements.pageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleGoButtonClick();
    });

    mainElements.goButton.addEventListener("click", handleGoButtonClick);
    
    mainElements.filterSelect.addEventListener("change", handleTypeFilterChange);
    mainElements.searchInput.addEventListener("input", handleSearch);
    mainElements.searchClear.addEventListener("click", clearSearch);
    mainElements.sortSelect.addEventListener('change', () => {
        state.sortOption = mainElements.sortSelect.value;
        sortPokemons();
        
        const stateToSave = {
            currentPage: state.currentPage,
            currentSort: state.sortOption,
            currentFilterType: state.currentFilterType,
            searchTerm: state.searchTerm
        };

        localStorage.setItem('pokedexState', JSON.stringify(stateToSave));
    });
}

function handleGoButtonClick() {
    const page = parseInt(mainElements.pageInput.value, 10);
    if (!isNaN(page) && page >= 1 && page <= state.totalPages) {
        loadPage(page);
    } else {
        mainElements.pageInput.value = state.currentPage;
    }
}
  