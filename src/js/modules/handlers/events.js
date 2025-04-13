import { mainElements } from "../../dictionaries/elements";

import { handleTypeFilterChange } from "./filter";
import { handleSearch, clearSearch } from "./search";
import { sortPokemons } from "./sort";

import { loadPage } from "../render";
import { state } from "../state";

export function setupEventListeners() {
  document.querySelectorAll(".firstButton").forEach(button => {
    button.addEventListener("click", () => loadPage(1));
});

document.querySelectorAll(".prevButton").forEach(button => {
    button.addEventListener("click", () => loadPage(state.currentPage - 1));
});

document.querySelectorAll(".nextButton").forEach(button => {
    button.addEventListener("click", () => loadPage(state.currentPage + 1));
});

document.querySelectorAll(".lastButton").forEach(button => {
    button.addEventListener("click", () => loadPage(state.totalPages));
});
    mainElements.goButton.addEventListener("click", handleGoButtonClick);
    mainElements.pageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleGoButtonClick();
    });
    
    mainElements.filterSelect.addEventListener("change", handleTypeFilterChange);
    mainElements.searchInput.addEventListener("input", handleSearch);
    mainElements.searchClear.addEventListener("click", clearSearch);
    mainElements.sortSelect.addEventListener('change', () => {
      state.sortOption = mainElements.sortSelect.value;
      sortPokemons(); // Используем единую функцию сортировки
      
      // Сохраняем состояние
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
  