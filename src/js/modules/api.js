import { state } from './state.js';

export const POKEMONS_PER_PAGE = 12;

export async function fetchAllPokemons() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    const data = await response.json();
    
    state.allPokemons = data.results.filter(pokemon => {
      const id = getPokemonIDFromURL(pokemon.url);
      return id < 10000;
    });
    
    console.log("Pokemons loaded:", state.allPokemons); // Выводим загруженные покемоны

    state.totalPages = Math.ceil(state.allPokemons.length / POKEMONS_PER_PAGE);
  } catch (error) {
    console.error("Error fetching all pokemons:", error);
    throw error;
  }
}

export async function fetchPokemonData(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch Pokemon data for ID ${id}:`, error);
      return null;
    }
}

export function getPokemonIDFromURL(url) {
    const segments = url.split("/").filter(Boolean);
    return parseInt(segments[segments.length - 1], 10);
}

export async function fetchTotalPokemonCount() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=11000");
    const data = await response.json();
    
    const filteredPokemons = data.results.filter(pokemon => getPokemonIDFromURL(pokemon.url) < 10000);
    state.totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
    
    state.allPokemons = filteredPokemons;
  } catch (error) {
    console.error("Error fetching total Pokémon count:", error);
  }
}