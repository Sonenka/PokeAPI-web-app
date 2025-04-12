import '../css/reset.css';
import '../css/variables.css';
import '../css/style.css';
import '../css/pagination.css';
import '../css/card.css';
import '../css/search.css';
import '../css/loader.css';
import '../css/media.css';

import { mainElements } from './dictionaries/elements.js';

import { state } from './modules/state.js';
import { POKEMONS_PER_PAGE, getPokemonIDFromURL, fetchPokemonData, fetchAllPokemons } from './modules/api.js'
import { loadPokemons, displayFilteredPokemons, displayNoResultsMessage } from './modules/render.js';
import { setupEventListeners } from './modules/handlers/events.js';
import { sortPokemons } from './modules/handlers/sort.js';
import { saveCurrentState } from './modules/state.js';

async function initApp() {
  try {
    // Восстанавливаем состояние из localStorage
    const savedState = localStorage.getItem('pokedexState');
    if (savedState) {
      const state = JSON.parse(savedState);
      
      // Восстанавливаем все параметры
      currentPage = state.currentPage;
      currentSort = state.currentSort;
      currentFilterType = state.currentFilterType;
      mainElements.searchInput.value = state.searchTerm || '';
      
      // Устанавливаем значения в селекторы
      mainElements.sortSelect.value = currentSort;
      mainElements.filterSelect.value = currentFilterType;
      
      // Показываем крестик очистки, если есть поисковый запрос
      mainElements.searchClear.style.display = state.searchTerm ? 'block' : 'none';
      
      // Загружаем всех покемонов
      await fetchAllPokemons();
      
      // Применяем сортировку
      sortPokemons();
      
      // Если был поисковый запрос - применяем фильтрацию
      if (state.searchTerm) {
        filteredPokemons = state.allPokemons.filter(pokemon => {
          const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
          const pokemonName = pokemon.name.toLowerCase();
          return pokemonID.includes(state.searchTerm.toLowerCase()) || 
                 pokemonName.includes(state.searchTerm.toLowerCase());
        });
        await displayFilteredPokemons();
      } 
      // Если был активен фильтр по типу
      else if (currentFilterType) {
        await filterPokemonsByType(currentFilterType);
      }
      // Иначе загружаем обычную страницу
      else {
        await loadPokemons();
      }
    } else {
      // Стандартная инициализация, если нет сохраненного состояния
      mainElements.loader.style.display = "flex";
      await fetchAllPokemons();
      sortPokemons();
      await loadPokemons();
    }
    
    // Настраиваем обработчики событий
    setupEventListeners();
  } catch (error) {
    console.error("Error initializing app:", error);
  } finally {
    mainElements.loader.style.display = "none";
  }
}

async function fetchTotalPokemonCount() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20000");
    const data = await response.json();
    
    const filteredPokemons = data.results.filter(pokemon => getPokemonIDFromURL(pokemon.url) < 10000);
    state.totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
    
    state.allPokemons = filteredPokemons;
  } catch (error) {
    console.error("Error fetching total Pokémon count:", error);
  }
}

async function loadPage(page) {
    page = Math.max(1, Math.min(page, state.totalPages));
    if (page === currentPage) return;
  
    currentPage = page;
    
    if (currentFilterType) {
      await filterPokemonsByType(currentFilterType);
    } else {
      await loadPokemons();
    }
  }

function openPokemonDetails(pokemonID) {
  // Сохраняем текущее состояние приложения
  const state = {
    currentPage,
    currentSort,
    currentFilterType,
    searchTerm: mainElements.searchInput.value,
    // Добавляем дополнительные параметры, если нужно
    filteredPokemons: currentFilterType || mainElements.searchInput.value ? filteredPokemons : null
  };
  
  localStorage.setItem('pokedexState', JSON.stringify(state));
  localStorage.setItem('currentPokemonID', pokemonID);
  
  window.location.href = `details.html?id=${pokemonID}`;
}

let currentPage = 1;
let filteredPokemons = [];
let currentSort = 'id-asc';
let currentFilterType = "";

mainElements.loader.innerHTML = `
  <div class="loader-container">
    <div class="o-pokeball u-tada"></div>
    <p class="loader-text">Pokémons are coming...</p>
  </div>
`;

document.body.appendChild(mainElements.loader);

initApp()
