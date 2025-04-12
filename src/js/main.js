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

// Настройка обработчиков событий
function setupEventListeners() {
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

function handleGoButtonClick() {
  const page = parseInt(mainElements.pageInput.value, 10);
  if (!isNaN(page) && page >= 1 && page <= state.totalPages) {
    loadPage(page);
  } else {
    mainElements.pageInput.value = currentPage;
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleSearch() {
  const searchTerm = mainElements.searchInput.value.toLowerCase().trim();

  if (!searchTerm) {
    // Если строка поиска пустая, возвращаем стандартное отображение
    resetSearch();
  } else {
    filterAndDisplayPokemons(searchTerm);
  }

  // Показываем или скрываем крестик
  mainElements.searchClear.style.display = searchTerm ? "block" : "none";
}

function resetSearch() {
  filteredPokemons = [];
  currentPage = 1;
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  loadPokemons();
  
  // Очищаем только поисковую часть состояния
  const savedState = localStorage.getItem('pokedexState');
  if (savedState) {
    const state = JSON.parse(savedState);
    state.searchTerm = '';
    localStorage.setItem('pokedexState', JSON.stringify(state));
  }
}
// Функция для фильтрации покемонов по поисковому запросу
function filterAndDisplayPokemons(searchTerm) {
  filteredPokemons = state.allPokemons.filter(pokemon => {
    const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
    const pokemonName = pokemon.name.toLowerCase();
    return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });

  state.totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
  currentPage = 1; 

  if (filteredPokemons.length === 0) {
    displayNoResultsMessage();
  } else {
    displayFilteredPokemons();
  }
}

function clearSearch() {
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  resetSearch();
}

function sortPokemons() {
    if (currentSort === 'id-asc') {
        state.allPokemons.sort((a, b) => getPokemonIDFromURL(a.url) - getPokemonIDFromURL(b.url));
    } else if (currentSort === 'id-desc') {
        state.allPokemons.sort((a, b) => getPokemonIDFromURL(b.url) - getPokemonIDFromURL(a.url));
    } else if (currentSort === 'name-asc') {
        state.allPokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'name-desc') {
        state.allPokemons.sort((a, b) => b.name.localeCompare(a.name));
    }

    loadPokemons(); // Перерисовываем список покемонов
}

async function handleTypeFilterChange() {
  currentFilterType = mainElements.filterSelect.value;
  
  // Сохраняем состояние перед изменением
  saveCurrentState();
  
  if (currentFilterType === "") {
    resetTypeFilter();
  } else {
    await filterPokemonsByType(currentFilterType);
  }
}

function saveCurrentState() {
  const state = {
    currentPage,
    currentSort,
    currentFilterType,
    searchTerm: mainElements.searchInput.value
  };
  localStorage.setItem('pokedexState', JSON.stringify(state));
}

async function filterPokemonsByType(type) {
  try {
    mainElements.listWrapper.innerHTML = "";
    mainElements.loader.style.display = "flex";
    
    // Сначала получаем данные всех покемонов
    const pokemonDataList = await Promise.all(
      state.allPokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
    );
    
    // Фильтруем покемонов по типу
    filteredPokemons = state.allPokemons.filter((pokemon, index) => {
      const pokemonData = pokemonDataList[index];
      return pokemonData && pokemonData.types.some(t => t.type.name === type);
    });
    
    state.totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
    currentPage = 1;
    
    if (filteredPokemons.length === 0) {
      displayNoResultsMessage();
    } else {
      // Загружаем данные для отображения (только для текущей страницы)
      const start = (currentPage - 1) * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      const currentPagePokemons = filteredPokemons.slice(start, end);
      
      const currentPageData = await Promise.all(
        currentPagePokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
      );
      
      displayPokemons(currentPagePokemons, currentPageData);
    }
    
    updatePaginationUI();
  } catch (error) {
    console.error("Error filtering pokemons by type:", error);
  } finally {
    mainElements.loader.style.display = "none";
  }
}

function resetTypeFilter() {
    currentFilterType = "";
    filteredPokemons = [];
    currentPage = 1;
    loadPokemons();
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
