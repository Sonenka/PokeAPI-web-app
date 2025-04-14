import { state } from './state.js';

export const POKEMONS_PER_PAGE = 12;

export async function fetchAllPokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        const data = await response.json();
        
        state.allPokemons = data.results.filter(pokemon => {
            return getPokemonIDFromURL(pokemon.url) < 10000;
        });
        
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
    try {
        const segments = url.split("/").filter(Boolean);
        return parseInt(segments[segments.length - 1], 10);
    } catch (error) {
        console.error(`Error parsing Pokemon URL: ${url}`, error);
        return null;
    }
}