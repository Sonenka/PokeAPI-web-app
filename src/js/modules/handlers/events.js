import { mainElements } from "../../dictionaries/elements";
import { handleTypeFilterChange } from "./filter";
import { handleSearch, clearSearch } from "./search";

export function setupEventListeners() {
    mainElements.firstButton.addEventListener("click", () => loadPage(1));
    mainElements.prevButton.addEventListener("click", () => loadPage(currentPage - 1));
    mainElements.nextButton.addEventListener("click", () => loadPage(currentPage + 1));
    mainElements.lastButton.addEventListener("click", () => loadPage(state.totalPages));
    mainElements.goButton.addEventListener("click", handleGoButtonClick);
    mainElements.pageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleGoButtonClick();
    });
    
    mainElements.filterSelect.addEventListener("change", handleTypeFilterChange);
    mainElements.searchInput.addEventListener("input", handleSearch);
    mainElements.searchClear.addEventListener("click", clearSearch);
    mainElements.sortSelect.addEventListener("change", () => {
      currentSort = mainElements.sortSelect.value;
      sortPokemons();
  });
}

function handleGoButtonClick() {
    const page = parseInt(mainElements.pageInput.value, 10);
    if (!isNaN(page) && page >= 1 && page <= state.totalPages) {
      loadPage(page);
    } else {
      mainElements.pageInput.value = currentPage;
    }
}
  