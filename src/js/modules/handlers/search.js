import { mainElements } from "../../dictionaries/elements";

import { applyCurrentSort } from "./filter";

import { getPokemonIDFromURL, POKEMONS_PER_PAGE, fetchPokemonData } from "../api";
import { displayNoResultsMessage, displayFilteredPokemons, loadPokemons } from "../render";
import { state } from "../state";

export function handleSearch() {
  const searchTerm = mainElements.searchInput.value.toLowerCase().trim();
  state.searchTerm = searchTerm;

  mainElements.searchClear.style.display = searchTerm ? "block" : "none";

  // Всегда обновляем отображение при любом изменении поиска
  if (searchTerm) {
    filterAndDisplayPokemons(searchTerm);
  } else {
    resetSearch();
  }
}

function filterAndDisplayPokemons(searchTerm) {
  // Базовый список - либо уже отфильтрованные по типу, либо все
  const basePokemons = state.currentFilterType 
    ? state.filteredPokemons.length > 0 
      ? state.filteredPokemons 
      : state.allPokemons.filter(p => checkPokemonType(p, state.currentFilterType))
    : state.allPokemons;

  // Применяем поиск
  state.filteredPokemons = basePokemons.filter(pokemon => {
    const pokemonID = getPokemonIDFromURL(pokemon.url).toString();
    const pokemonName = pokemon.name.toLowerCase();
    return pokemonID.includes(searchTerm) || pokemonName.includes(searchTerm);
  });

  updateAfterFilter();
}

function updateAfterFilter() {
  state.totalPages = Math.ceil(state.filteredPokemons.length / POKEMONS_PER_PAGE);
  state.currentPage = 1;

  if (state.filteredPokemons.length === 0) {
    displayNoResultsMessage();
  } else {
    displayFilteredPokemons();
  }
}

async function resetSearch() {
  state.searchTerm = '';
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';

  // Если есть активный фильтр по типу - применяем его
  if (state.currentFilterType) {
    state.filteredPokemons = state.allPokemons.filter(pokemon => {
      // Используем кешированные данные о типах
      const pokemonId = getPokemonIDFromURL(pokemon.url);
      if (typeCache.has(pokemonId)) {
        return typeCache.get(pokemonId).includes(state.currentFilterType);
      }
      // Если нет в кеше - временно включаем, потом обновим
      return true;
    });
    
    // Догружаем данные для покемонов, которых нет в кеше
    await loadMissingTypeData();
  } else {
    // Если фильтра нет - показываем всех покемонов
    state.filteredPokemons = [...state.allPokemons];
  }

  // Применяем сортировку и обновляем UI
  applyCurrentSort();
  state.currentPage = 1;
  loadPokemons();
}

const typeCache = new Map(); // Кеш для хранения типов покемонов

async function checkPokemonType(pokemon, type) {
  const pokemonId = getPokemonIDFromURL(pokemon.url);
  
  // Проверяем кеш
  if (!typeCache.has(pokemonId)) {
    const pokemonData = await fetchPokemonData(pokemonId);
    typeCache.set(pokemonId, pokemonData?.types.map(t => t.type.name) || []);
  }
  
  return typeCache.get(pokemonId).includes(type);
}

export function clearSearch() {
  // Полностью сбрасываем поиск
  mainElements.searchInput.value = '';
  mainElements.searchClear.style.display = 'none';
  
  // Вызываем resetSearch с forceUpdate
  resetSearch();
  
  // Добавляем анимацию для визуального отклика
  mainElements.listWrapper.style.opacity = '0';
  setTimeout(() => {
    mainElements.listWrapper.style.opacity = '1';
  }, 150);
}

async function loadMissingTypeData() {
  // Находим покемонов без данных о типах
  const pokemonsToLoad = state.filteredPokemons.filter(pokemon => {
    const id = getPokemonIDFromURL(pokemon.url);
    return !typeCache.has(id);
  });

  // Параллельно загружаем данные
  await Promise.all(pokemonsToLoad.map(async pokemon => {
    const id = getPokemonIDFromURL(pokemon.url);
    const data = await fetchPokemonData(id);
    typeCache.set(id, data.types.map(t => t.type.name));
  }));

  // Повторно фильтруем с актуальными данными
  state.filteredPokemons = state.filteredPokemons.filter(pokemon => {
    const id = getPokemonIDFromURL(pokemon.url);
    return typeCache.get(id)?.includes(state.currentFilterType);
  });
}