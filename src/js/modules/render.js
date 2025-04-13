import { mainElements } from '../dictionaries/elements.js';
import typeIcons from '../dictionaries/typeIcons.js';

import { applyCurrentSort } from './handlers/filter.js';

import { POKEMONS_PER_PAGE, fetchPokemonData, getPokemonIDFromURL } from './api.js'
import { state, openPokemonDetails } from './state.js';
import { capitalizeFirstLetter } from './utils.js';

export async function loadPokemons() {
  try {
    mainElements.loader.style.display = "flex";
    
    // Определяем какие покемоны показывать
    const pokemonsToShow = (state.searchTerm || state.currentFilterType)
      ? state.filteredPokemons
      : state.allPokemons;

    // Пагинация
    state.totalPages = Math.ceil(pokemonsToShow.length / POKEMONS_PER_PAGE);
    state.currentPage = Math.min(state.currentPage, state.totalPages || 1);

    // Получаем данные для текущей страницы
    const pagePokemons = pokemonsToShow.slice(
      (state.currentPage - 1) * POKEMONS_PER_PAGE,
      state.currentPage * POKEMONS_PER_PAGE
    );

    // Отображаем
    const pokemonData = await Promise.all(
      pagePokemons.map(p => fetchPokemonData(getPokemonIDFromURL(p.url)))
    );
    displayPokemons(pagePokemons, pokemonData);
    
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

function updatePaginationUI() {
  // Обновляем информацию о странице
  mainElements.pageInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
  mainElements.pageInput.value = state.currentPage;
  
  // Десктопные кнопки
  mainElements.firstButton.disabled = state.currentPage === 1;
  mainElements.prevButton.disabled = state.currentPage === 1;
  mainElements.nextButton.disabled = state.currentPage === state.totalPages;
  mainElements.lastButton.disabled = state.currentPage === state.totalPages;
  
  // Мобильные кнопки
  mainElements.mobileFirstButton.disabled = state.currentPage === 1;
  mainElements.mobilePrevButton.disabled = state.currentPage === 1;
  mainElements.mobileNextButton.disabled = state.currentPage === state.totalPages;
  mainElements.mobileLastButton.disabled = state.currentPage === state.totalPages;
  
  // Добавляем/удаляем классы для стилизации
  const allButtons = [
      mainElements.firstButton,
      mainElements.prevButton,
      mainElements.nextButton,
      mainElements.lastButton,
      mainElements.mobileFirstButton,
      mainElements.mobilePrevButton,
      mainElements.mobileNextButton,
      mainElements.mobileLastButton
  ];
  
  allButtons.forEach(btn => {
      if (btn.disabled) {
          btn.classList.add('disabled');
          btn.setAttribute('aria-disabled', 'true');
      } else {
          btn.classList.remove('disabled');
          btn.setAttribute('aria-disabled', 'false');
      }
  });
}

export async function displayFilteredPokemons() {
    mainElements.listWrapper.innerHTML = "";
    mainElements.loader.style.display = "flex";
  
    try {
      const start = (state.currentPage - 1) * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      const pokemonsToLoad = state.filteredPokemons.slice(start, end);
  
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

export function displayNoResultsMessage() {
  mainElements.listWrapper.innerHTML = `
    <div class="no-results">No Pokémon found</div>
  `;
}

export async function loadPage(page) {
  page = Math.max(1, Math.min(page, state.totalPages));
  if (page === state.currentPage) return;

  state.currentPage = page;

  // Всегда используем loadPokemons, который сам решит, какие данные загружать
  await loadPokemons();
}

export function syncUIWithState() {
  // Синхронизируем фильтр
  mainElements.filterSelect.value = state.currentFilterType || '';
  
  // Синхронизируем поиск
  mainElements.searchInput.value = state.searchTerm || '';
  mainElements.searchClear.style.display = state.searchTerm ? 'block' : 'none';
  
  // Синхронизируем сортировку
  mainElements.sortSelect.value = state.sortOption;
}