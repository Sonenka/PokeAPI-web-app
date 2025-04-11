import '../css/reset.css';
import '../css/variables.css';
import '../css/style.css';
import '../css/details.css';
import '../css/card.css';

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
    document.getElementById('backButton')?.addEventListener('click', () => {
        window.location.href = './index.html';
    });
}

async function fetchPokemonData(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch Pokemon data for ID ${id}:`, error);
        throw error;
    }
}

async function fetchPokemonSpeciesData(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch Pokemon species data for ID ${id}:`, error);
        return { color: { name: 'blue' } }; // Fallback color
    }
}

function displayPokemonDetails(pokemon, speciesData) {
    // Устанавливаем основной цвет покемона
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
    document.getElementById('pokemonName').textContent = 
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('pokemonID').textContent = `#${String(pokemon.id).padStart(4, '0')}`;
    
    // Изображение покемона
    const imgUrl = pokemon.sprites.other?.home?.front_default || 
                 pokemon.sprites.other?.['official-artwork']?.front_default || 
                 pokemon.sprites.front_default;
    document.getElementById('pokemonImage').src = imgUrl;
    
    // Типы покемона
    const typesContainer = document.getElementById('typesContainer');
    typesContainer.innerHTML = pokemon.types.map(type => `
        <div class="pokemon-type ${type.type.name}" 
             style="background: ${getTypeColor(type.type.name)};">
            <img src="img/types/${type.type.name}.svg" alt="${type.type.name}">
            <span>${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</span>
        </div>
    `).join('');
    
    // Основные характеристики
    document.getElementById('pokemonHeight').textContent = `${pokemon.height / 10} m`;
    document.getElementById('pokemonWeight').textContent = `${pokemon.weight / 10} kg`;
    document.getElementById('pokemonBaseExp').textContent = pokemon.base_experience || 'Unknown';
    
    // Статистика
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = pokemon.stats.map(stat => `
        <div class="stat-item">
            <div class="stat-name">${stat.stat.name.replace('-', ' ')}</div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(100, stat.base_stat)}%"></div>
                <div class="stat-value">${stat.base_stat}</div>
            </div>
        </div>
    `).join('');
    
    // Способности
    const abilitiesContainer = document.getElementById('abilitiesContainer');
    abilitiesContainer.innerHTML = pokemon.abilities.map(ability => `
        <div class="ability-item">
            ${ability.ability.name.replace('-', ' ').charAt(0).toUpperCase() + 
             ability.ability.name.replace('-', ' ').slice(1)}
            ${ability.is_hidden ? '<span class="hidden-ability">(hidden)</span>' : ''}
        </div>
    `).join('');
}

// Цветовая палитра для типов покемонов
function getTypeColor(type) {
    const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
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
        white: '#F8F8F8',
        yellow: '#F6C747'
    };
    return colorMap[colorName] || '#68A090'; // fallback цвет
}

// Функция для осветления цвета
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
}