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
import { handleSearch } from './modules/handlers/search.js';
import { sortPokemons } from './modules/handlers/sort.js';

import { fetchAllPokemons } from './modules/api.js'
import { loadPokemons } from './modules/render.js';
import { state } from './modules/state.js';

async function initApp() {
  try {
    mainElements.loader.style.display = "flex";
    
    // 1. Сначала загружаем всех покемонов (основа для работы)
    await fetchAllPokemons();
    
    // 2. Проверяем, что данные загрузились
    if (!state.allPokemons || !state.allPokemons.length) {
      throw new Error("Failed to load Pokémon data");
    }
    
    // 3. Инициализируем filteredPokemons
    state.filteredPokemons = [...state.allPokemons];
    
    // 4. Загружаем сохраненное состояние
    const savedState = localStorage.getItem('pokedexState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      // 5. Восстанавливаем параметры (с проверками)
      state.sortOption = parsedState.currentSort || 'id-asc';
      state.currentFilterType = parsedState.currentFilterType || '';
      state.searchTerm = parsedState.searchTerm || '';
      
      // 6. Синхронизируем UI с состоянием
      mainElements.sortSelect.value = state.sortOption;
      mainElements.filterSelect.value = state.currentFilterType;
      mainElements.searchInput.value = state.searchTerm;
      
      // 7. Применяем фильтры/поиск (если есть)
      if (state.searchTerm) {
        await handleSearch(); // Используем существующий обработчик
      } else if (state.currentFilterType) {
        await filterPokemonsByType(state.currentFilterType);
      }
    }
    
    // 8. Применяем сортировку к актуальным данным
    sortPokemons();
    
    // 9. Загружаем данные для отображения
    await loadPokemons();
    
    // 10. Настраиваем обработчики
    setupEventListeners();
    
  } catch (error) {
    console.error("Error initializing app:", error);
    // Показываем пользователю сообщение об ошибке
    mainElements.listWrapper.innerHTML = `
      <div class="error-message">
        Failed to initialize. <button id="retry-btn">Retry</button>
      </div>
    `;
    document.getElementById('retry-btn').addEventListener('click', initApp);
  } finally {
    mainElements.loader.style.display = "none";
  }
}

initApp()