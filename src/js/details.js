const pokemonID = new URLSearchParams(window.location.search).get('id') || 
                 localStorage.getItem('currentPokemonID');

if (!pokemonID) {
  window.location.href = 'index.html';
} else {
  loadAndDisplayPokemon(pokemonID);
  setupBackButton();
}

async function loadAndDisplayPokemon(id) {
  try {
    const data = await fetchPokemonData(id);
    displayPokemonDetails(data);
  } catch (error) {
    console.error("Failed to load Pokémon:", error);
    window.location.href = 'index.html'; 
  }
}

function setupBackButton() {
  document.getElementById('backButton')?.addEventListener('click', () => {
    window.location.href = 'index.html';
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

function displayPokemonDetails(pokemon) {
    // Основная информация
    document.getElementById('pokemonName').textContent = 
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('pokemonID').textContent = `#${String(pokemon.id).padStart(4, '0')}`;
    
    // Изображение (используем лучший доступный вариант)
    const imgUrl = pokemon.sprites.other?.home?.front_default || 
                  pokemon.sprites.other?.['official-artwork']?.front_default || 
                  pokemon.sprites.front_default;
    document.getElementById('pokemonImage').src = imgUrl;
    
    // Типы
    const typesContainer = document.getElementById('typesContainer');
    typesContainer.innerHTML = pokemon.types.map(type => `
        <div class="pokemon-type ${type.type.name}">
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
            ${ability.ability.name.replace('-', ' ').charAt(0).toUpperCase() + ability.ability.name.replace('-', ' ').slice(1)}
            ${ability.is_hidden ? '<span class="hidden-ability">(hidden)</span>' : ''}
        </div>
    `).join('');
}