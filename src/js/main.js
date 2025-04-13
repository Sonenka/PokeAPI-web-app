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

import { fetchAllPokemons } from './modules/api.js'
import { loadPokemons } from './modules/render.js';
import { state } from './modules/state.js';

async function initApp() {
  try {
    mainElements.loader.style.display = "flex";
    
    await fetchAllPokemons();
    
    // по умолчанию all types
    state.filteredPokemons = [...state.allPokemons];
    
    await loadPokemons();
    
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