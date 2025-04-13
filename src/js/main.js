import '../css/reset.css';
import '../css/variables.css';
import '../css/style.css';
import '../css/pagination.css';
import '../css/card.css';
import '../css/search.css';
import '../css/loader.css';
import '../css/media.css';

import { mainElements } from './dictionaries/elements.js';

import { setupEventListeners } from './modules/handlers/events.js';
import { filterPokemonsByType, resetTypeFilter } from './modules/handlers/filter.js';
import { sortPokemons } from './modules/handlers/sort.js';

import { fetchAllPokemons } from './modules/api.js'
import { state } from './modules/state.js';

mainElements.loader.innerHTML = `
  <div class="loader-container">
    <div class="o-pokeball u-tada"></div>
    <p class="loader-text">Pokémons are coming...</p>
  </div>
`;

document.body.appendChild(mainElements.loader);

async function initApp() {
  try {
    const savedState = localStorage.getItem('pokedexState');
    
    // Явно устанавливаем "All Types" по умолчанию
    mainElements.filterSelect.value = "";
    state.currentFilterType = "";

    if (savedState) {
      const parsedState = JSON.parse(savedState);

      // Обновляем UI из сохраненного состояния
      mainElements.searchInput.value = parsedState.searchTerm || '';
      mainElements.sortSelect.value = parsedState.currentSort || 'id-asc';
      
      // Важно: только если есть значение фильтра, обновляем UI и состояние
      if (parsedState.currentFilterType) {
        mainElements.filterSelect.value = parsedState.currentFilterType;
        state.currentFilterType = parsedState.currentFilterType;
      }

      await fetchAllPokemons();
      sortPokemons();

      // Обработка сохраненного состояния
      if (parsedState.searchTerm) {
        // ... существующая логика поиска ...
      } else if (parsedState.currentFilterType) {
        await filterPokemonsByType(parsedState.currentFilterType);
      } else {
        resetTypeFilter(); // Явный сброс при отсутствии фильтра
      }
    } else {
      // Первая загрузка
      mainElements.loader.style.display = "flex";
      await fetchAllPokemons();
      sortPokemons();
      resetTypeFilter(); // Явный сброс фильтров
    }

    setupEventListeners();
  } catch (error) {
    console.error("Error initializing app:", error);
  } finally {
    mainElements.loader.style.display = "none";
  }
}

initApp()