import '../css/reset.css';
import '../css/variables.css';
import '../css/style.css';
import '../css/details.css';
import '../css/card.css';

import { detailsElements } from './dictionaries/elements.js';
import typeIcons from './dictionaries/typeIcons.js';

// Константы для API
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const FALLBACK_COLOR = 'blue';
const FALLBACK_TEXT = "No description available.";

const MAX_STATS_VALUES = {
    hp: 255,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 200
};

// Получаем ID покемона из URL
const pokemonID = new URLSearchParams(window.location.search).get('id') || 
                 localStorage.getItem('currentPokemonID');

if (!pokemonID) {
    window.location.href = './index.html';
} else {
    loadAndDisplayPokemon(pokemonID);
    setupBackButton();
}



async function loadAndDisplayPokemon(id) {
    try {
        const pokemonData = await fetchPokemonData(id);
        const speciesData = await fetchPokemonSpeciesData(id);
        displayPokemonDetails(pokemonData, speciesData);
    } catch (error) {
        console.error("Failed to load Pokémon:", error);
        window.location.href = './index.html'; 
    }
}

function setupBackButton() {
    detailsElements.backButton?.addEventListener('click', () => {
        window.location.href = './index.html';
    });
}

async function fetchPokemonData(id) {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch Pokemon data for ID ${id}:`, error);
        throw error;
    }
}

async function fetchPokemonSpeciesData(id) {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}/`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch Pokemon species data for ID ${id}:`, error);
        return { color: { name: 'blue' } }; // Fallback color
    }
}

function displayPokemonDetails(pokemon, speciesData) {
    // Устанавливаем основной цвет покемона
    detailsElements.details.style.opacity = "0";
    const mainColor = getPokemonColor(speciesData.color?.name || 'blue');
    document.documentElement.style.setProperty('--pokemon-color', mainColor);

    
    // Устанавливаем градиентный фон
    document.body.style.background = `
        linear-gradient(
            135deg,
            ${mainColor} 0%,
            ${lightenColor(mainColor, 30)} 100%
        )
    `;
    
    // Заполняем данные покемона
    detailsElements.pokemonName.textContent = 
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    detailsElements.pokemonID.textContent = `#${String(pokemon.id).padStart(4, '0')}`;

    detailsElements.pokemonName.style.color = mainColor;
    detailsElements.pokemonName.style.filter = "brightness(50%)";
    
    // Изображение покемона
    const imgUrl = pokemon.sprites.other?.home?.front_default || 
                 pokemon.sprites.other?.['official-artwork']?.front_default || 
                 pokemon.sprites.front_default;
    detailsElements.pokemonImage.src = imgUrl;
    
    // Типы покемона
    const typesHTML = pokemon.types.map(t => {
        const type = t.type.name;
        return `
          <div class="card__type ${type}">
            <img src="${typeIcons[type]}" title="${type}" alt="${type}" />
            <div>${type.charAt(0).toUpperCase() + type.slice(1)}</div>
          </div>
        `;
      }).join('');
      
    detailsElements.typesContainer.innerHTML = typesHTML;
    
    // Основные характеристики
    detailsElements.pokemonHeight.textContent = `${pokemon.height / 10} m`;
    detailsElements.pokemonWeight.textContent = `${pokemon.weight / 10} kg`;
    
    // Статистика
    detailsElements.statsContainer.innerHTML = pokemon.stats.map(stat => {
        const statName = stat.stat.name;
        const baseStat = stat.base_stat;
        const maxStatValue = MAX_STATS_VALUES[statName] || 100; // fallback если стат не найден
        const percentage = (baseStat / maxStatValue) * 100;
        
        return `
            <div class="details__stat">
                <div class="details__stat-name">${statName.replace('-', ' ')}</div>
                <div class="details__stat-bar-container">
                    <div class="details__stat-bar" style="width: ${percentage}%"></div>
                    <div class="details__stat-value">${baseStat}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Способности
    detailsElements.abilitiesContainer.innerHTML = pokemon.abilities.map(ability => `
        <div class="details__ability">
            ${ability.ability.name.replace('-', ' ').charAt(0).toUpperCase() + 
             ability.ability.name.replace('-', ' ').slice(1)}
            ${ability.is_hidden ? '<span class="details__ability--hidden">(hidden)</span>' : ''}
        </div>
    `).join('');

    const flavorText = getFlavorText(speciesData);
    if (flavorText) {
        detailsElements.flavorText.textContent = flavorText;
    } else {
        detailsElements.flavorText.textContent = FALLBACK_TEXT;
    }

    detailsElements.details.style.opacity = "1";
}

// Цветовая палитра для основных цветов покемонов
function getPokemonColor(colorName) {
    const colorMap = {
        black: '#303030',
        blue: '#429BED',
        brown: '#B1736C',
        gray: '#A0A2A0',
        green: '#64D368',
        pink: '#F85888',
        purple: '#7C538C',
        red: '#FA6555',
        white: '#a38f7e',
        yellow: '#F6C747'
    };
    return colorMap[colorName] || '#68A090';
}

// Функция для осветления цвета
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    
    const clamp = (value) => Math.max(0, Math.min(255, value));
    
    const R = clamp((num >> 16) + amt);
    const G = clamp((num >> 8 & 0x00FF) + amt);
    const B = clamp((num & 0x0000FF) + amt);
    
    return `#${(R << 16 | G << 8 | B).toString(16).padStart(6, '0')}`;
}

function getFlavorText(speciesData) {
    const englishEntries = speciesData.flavor_text_entries?.filter(
        entry => entry.language.name === 'en'
    );
    if (!englishEntries?.length) return null;

    // Берем последнюю запись (часто самая актуальная)
    const latestEntry = englishEntries[englishEntries.length - 1];
    return latestEntry.flavor_text
        .replace(/\n/g, ' ') // Убираем переносы строк
        .replace(/\f/g, ' '); // Убираем лишние символы
}