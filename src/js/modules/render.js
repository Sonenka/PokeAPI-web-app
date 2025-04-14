import { mainElements } from '../dictionaries/elements.js';
import typeIcons from '../dictionaries/typeIcons.js';

import { POKEMONS_PER_PAGE, fetchPokemonData, getPokemonIDFromURL } from './api.js'
import { state, openPokemonDetails } from './state.js';
import { capitalizeFirstLetter, toggleLoader } from './utils.js';

export async function loadPokemons() {
    try {
        mainElements.listWrapper.innerHTML = "";
        toggleLoader(true);

        const pokemonsToLoad = state.filteredPokemons.length > 0 
            ? state.filteredPokemons 
            : state.allPokemons;

        state.totalPages = Math.max(1, Math.ceil(pokemonsToLoad.length / POKEMONS_PER_PAGE));
        state.currentPage = Math.max(1, Math.min(state.currentPage, state.totalPages));

        // данные текущей страницы
        const pagePokemons = pokemonsToLoad.slice(
            (state.currentPage - 1) * POKEMONS_PER_PAGE,
            state.currentPage * POKEMONS_PER_PAGE
        );

        const pokemonData = await Promise.all(
            pagePokemons.map(async pokemon => {
                try {
                    return await fetchPokemonData(getPokemonIDFromURL(pokemon.url));
                } catch (error) {
                    console.error(`Failed to load pokemon ${pokemon.name}:`, error);
                    return null;
                }
            })
        );
        
        await displayPokemons(pagePokemons, pokemonData); 
    } catch {
      console.error("Error loading pokemons:", error);
      displayErrorState();
    } finally {
        toggleLoader(false);
        updatePaginationUI();
    }
}

function displayPokemons(pokemons, pokemonDataList) {
    mainElements.listWrapper.innerHTML = "";
    mainElements.listWrapper.style.opacity = "0"; // cкрываем, пока не загрузятся все картинки

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

    // ждём, пока загрузятся ВСЕ картинки, потом показываем карточки
    Promise.all(imageLoadPromises).then(() => {
        mainElements.listWrapper.style.opacity = "1";
    });
}

function createPokemonCard(pokemon, pokemonID, pokemonData) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = pokemonID;

    const types = pokemonData?.types?.map(type => type.type.name) || [];
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

    // гибридный выбор источника изображения
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

    const imageLoadPromise = new Promise((resolve) => {
        img.onload = () => {
            img.classList.add('loaded');
            resolve();
        };

        img.onerror = () => resolve(); // разрешаем промис даже при ошибке
    });

    card.querySelector(".card__img").appendChild(img);

    card.addEventListener("click", () => {
      openPokemonDetails(pokemonID);
    });

    return { card, imageLoadPromise };
}

function updatePaginationUI() {
  mainElements.pageInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
  mainElements.pageInput.value = state.currentPage;

  document.querySelectorAll(".firstButton, .prevButton").forEach(button => {
      button.disabled = state.currentPage === 1;
      button.classList.toggle("disabled", state.currentPage === 1);
  });

  document.querySelectorAll(".nextButton, .lastButton").forEach(button => {
      button.disabled = state.currentPage === state.totalPages || state.totalPages === 0;
      button.classList.toggle("disabled", state.currentPage === state.totalPages || state.totalPages === 0);
  });
}

export async function displayFilteredPokemons() {
    mainElements.listWrapper.innerHTML = "";
    toggleLoader(true);
  
    try {
      const start = (state.currentPage - 1) * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      const pokemonsToLoad = state.filteredPokemons.slice(start, end);
  
      const pokemonDataList = await Promise.all(
        pokemonsToLoad.map(pokemon => fetchPokemonData(getPokemonIDFromURL(pokemon.url)))
      );
  
      displayPokemons(pokemonsToLoad, pokemonDataList);
      updatePaginationUI();
    } catch (error) {
      console.error("Error displaying filtered pokemons:", error);
    } finally {
      toggleLoader(false);
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

  await loadPokemons();
}

function displayErrorState() {
  mainElements.listWrapper.innerHTML = `
      <div class="error-state">
          <p>Failed to load Pokémon data</p>
          <button class="retry-button">Try Again</button>
      </div>
  `;
  
  mainElements.listWrapper.querySelector(".retry-button")?.addEventListener("click", loadPokemons);
}