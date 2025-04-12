import { mainElements } from '../dictionaries/elements.js';
import { state } from './state.js';
import { POKEMONS_PER_PAGE, fetchPokemonData, getPokemonIDFromURL } from './api.js'
import typeIcons from '../dictionaries/typeIcons.js';
import { capitalizeFirstLetter } from './utils.js';
import { openPokemonDetails } from './state.js';
import { filterPokemonsByType } from './handlers/filter.js';

export async function loadPokemons() {
  try {
    mainElements.listWrapper.innerHTML = "";
    mainElements.loader.style.display = "flex";

    // Всегда используем filteredPokemons, если они есть (даже если пустые)
    const pokemonsToLoad = state.filteredPokemons.length > 0 ? state.filteredPokemons : state.allPokemons;
    
    // Пересчитываем общее количество страниц
    state.totalPages = Math.ceil(pokemonsToLoad.length / POKEMONS_PER_PAGE);
    
    // Корректируем текущую страницу, если она выходит за пределы
    if (state.currentPage > state.totalPages && state.totalPages > 0) {
      state.currentPage = state.totalPages;
    }

    const start = (state.currentPage - 1) * POKEMONS_PER_PAGE;
    const end = start + POKEMONS_PER_PAGE;
    const currentPagePokemons = pokemonsToLoad.slice(start, end);

    const pokemonDataList = await Promise.all(
      currentPagePokemons.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
    );

    displayPokemons(currentPagePokemons, pokemonDataList);
    updatePaginationUI();
  } catch (error) {
    console.error("Error loading pokemons:", error);
  } finally {
    mainElements.loader.style.display = "none";
  }
}


export function displayPokemons(pokemons, pokemonDataList) {
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

export function createPokemonCard(pokemon, pokemonID, pokemonData) {
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

export function updatePaginationUI() {
  mainElements.pageInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
  mainElements.pageInput.value = state.currentPage;

  mainElements.firstButton.disabled = state.currentPage === 1;
  mainElements.prevButton.disabled = state.currentPage === 1;
  mainElements.nextButton.disabled = state.currentPage === state.totalPages || state.totalPages === 0;
  mainElements.lastButton.disabled = state.currentPage === state.totalPages || state.totalPages === 0;
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
