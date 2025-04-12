import '../css/reset.css';
import '../css/variables.css';
import '../css/style.css';
import '../css/pagination.css';
import '../css/card.css';
import '../css/search.css';
import '../css/loader.css';
import '../css/media.css';

import typeIcons from './dictionaries/typeIcons.js';
import { mainElements } from './dictionaries/elements.js';

import { state } from './modules/state.js';

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
        filteredPokemons = allPokemons.filter(pokemon => {
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
    totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
    
    allPokemons = filteredPokemons;
  } catch (error) {
    console.error("Error fetching total Pokémon count:", error);
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
    mainElements.firstButton.addEventListener("click", () => loadPage(1));
    mainElements.prevButton.addEventListener("click", () => loadPage(currentPage - 1));
    mainElements.nextButton.addEventListener("click", () => loadPage(currentPage + 1));
    mainElements.lastButton.addEventListener("click", () => loadPage(totalPages));
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

async function loadPokemons() {
    try {
      mainElements.listWrapper.innerHTML = "";
      mainElements.loader.style.display = "flex";
      
      // Определяем, какие покемоны загружать (все или отфильтрованные)
      const pokemonsToLoad = currentFilterType ? filteredPokemons : allPokemons;
      totalPages = Math.ceil(pokemonsToLoad.length / POKEMONS_PER_PAGE);
      
      // Получаем покемонов для текущей страницы
      const start = (currentPage - 1) * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      const currentPagePokemons = pokemonsToLoad.slice(start, end);
      
      // Загружаем данные для каждого покемона
      const pokemonDataList = await Promise.all(
        currentPagePokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
      );
      
      // Отображаем покемонов
      displayPokemons(currentPagePokemons, pokemonDataList);
      updatePaginationUI();
    } catch (error) {
      console.error("Error loading pokemons:", error);
    } finally {
      mainElements.loader.style.display = "none";
    }
  }

function displayPokemons(pokemons, pokemonDataList) {
    mainElements.listWrapper.innerHTML = "";
    mainElements.listWrapper.style.opacity = "0"; // Скрываем, пока не загрузятся все картинки

    const fragment = document.createDocumentFragment();
    const imageLoadPromises = [];

    pokemons.forEach((pokemon, index) => {
        if (pokemonDataList[index]) {
            const pokemonID = getPokemonIDFromURL(pokemon.url);
            const { card, imageLoadPromise } = createPokemonCard(pokemon, pokemonID, pokemonDataList[index]);

            imageLoadPromises.push(imageLoadPromise);
            fragment.appendChild(card);
        }
    });

    mainElements.listWrapper.appendChild(fragment);

    // Ждём, пока загрузятся ВСЕ картинки, потом показываем карточки
    Promise.all(imageLoadPromises).then(() => {
        mainElements.listWrapper.style.opacity = "1";
    });
}

function createPokemonCard(pokemon, pokemonID, pokemonData) {
  if (!pokemonData) return document.createElement("div");

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = pokemonID; // Сохраняем ID в data-атрибуте

  const types = pokemonData.types.map(type => type.type.name);
  const typesHTML = types.map(type => `
    <div class="card__type ${type}">
      <img src="${typeIcons[type]}" title="${type}" alt="${type}" />
      <div>${type}</div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="card__id">#${String(pokemonID).padStart(4, '0')}</div>
    <div class="card__img"></div>
    <div class="card__name">${capitalizeFirstLetter(pokemon.name)}</div>
    <div class="card__types">${typesHTML}</div>
  `;

  // Гибридный выбор источника изображения
  const getPokemonImage = (pokemonData, pokemonID) => {
    if (pokemonData?.sprites) {
      return pokemonData.sprites.other?.home?.front_default || 
             pokemonData.sprites.other?.['official-artwork']?.front_default || 
             pokemonData.sprites.front_default;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonID}.png`;
  };

  const img = document.createElement("img");
  img.src = getPokemonImage(pokemonData, pokemonID);
  img.alt = pokemon.name;
  img.loading = "lazy";

  // Fallback-цепочка при ошибках загрузки
  img.onerror = () => {
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`;
    img.onerror = () => {
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;
    };
  };

  const imageLoadPromise = new Promise((resolve) => {
    img.onload = () => {
      img.classList.add('loaded');
      resolve();
    };
    img.onerror = () => resolve(); // Разрешаем промис даже при ошибке
  });

  card.querySelector(".card__img").appendChild(img);

  card.addEventListener("click", () => {
    openPokemonDetails(pokemonID);
  });

  return { card, imageLoadPromise };
}

async function fetchPokemonData(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch Pokemon data for ID ${id}:`, error);
    return null;
  }
}

function getPokemonIDFromURL(url) {
  const segments = url.split("/").filter(Boolean);
  return parseInt(segments[segments.length - 1], 10);
}

async function loadPage(page) {
    page = Math.max(1, Math.min(page, totalPages));
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
  if (!isNaN(page) && page >= 1 && page <= totalPages) {
    loadPage(page);
  } else {
    mainElements.pageInput.value = currentPage;
  }
}

function updatePaginationUI() {
  mainElements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  mainElements.pageInput.value = currentPage;

  mainElements.firstButton.disabled = currentPage === 1;
  mainElements.prevButton.disabled = currentPage === 1;
  mainElements.nextButton.disabled = currentPage === totalPages;
  mainElements.lastButton.disabled = currentPage === totalPages;
}

function capitalizeFirstLetter(string) {
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
  filteredPokemons = allPokemons.filter(pokemon => {
    const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
    const pokemonName = pokemon.name.toLowerCase();
    return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });

  totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
  currentPage = 1; 

  if (filteredPokemons.length === 0) {
    displayNoResultsMessage();
  } else {
    displayFilteredPokemons();
  }
}

function displayNoResultsMessage() {
  mainElements.listWrapper.innerHTML = `
    <div class="no-results">No Pokémon found</div>
  `;
}

async function displayFilteredPokemons() {
  mainElements.listWrapper.innerHTML = "";
  mainElements.loader.style.display = "flex";

  try {
    const start = (currentPage - 1) * POKEMONS_PER_PAGE;
    const end = start + POKEMONS_PER_PAGE;
    const pokemonsToLoad = filteredPokemons.slice(start, end);

    const pokemonDataList = await Promise.all(
      pokemonsToLoad.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
    );

    displayPokemons(pokemonsToLoad, pokemonDataList);
    updatePaginationUI(); // Обновляем пагинацию после поиска
  } catch (error) {
    console.error("Error displaying filtered pokemons:", error);
  } finally {
    mainElements.loader.style.display = "none";
  }
}

function clearSearch() {
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  resetSearch();
}

function sortPokemons() {
    if (currentSort === 'id-asc') {
        allPokemons.sort((a, b) => getPokemonIDFromURL(a.url) - getPokemonIDFromURL(b.url));
    } else if (currentSort === 'id-desc') {
        allPokemons.sort((a, b) => getPokemonIDFromURL(b.url) - getPokemonIDFromURL(a.url));
    } else if (currentSort === 'name-asc') {
        allPokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'name-desc') {
        allPokemons.sort((a, b) => b.name.localeCompare(a.name));
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
      allPokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
    );
    
    // Фильтруем покемонов по типу
    filteredPokemons = allPokemons.filter((pokemon, index) => {
      const pokemonData = pokemonDataList[index];
      return pokemonData && pokemonData.types.some(t => t.type.name === type);
    });
    
    totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
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

async function fetchAllPokemons() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=11000");
    const data = await response.json();
    
    // Фильтруем только покемонов с ID < 10000
    allPokemons = data.results.filter(pokemon => {
      const id = getPokemonIDFromURL(pokemon.url);
      return id < 10000;
    });
    
    totalPages = Math.ceil(allPokemons.length / POKEMONS_PER_PAGE);
  } catch (error) {
    console.error("Error fetching all pokemons:", error);
    throw error;
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

const POKEMONS_PER_PAGE = 12;
let currentPage = 1;
let totalPages = 1;
let allPokemons = [];
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
