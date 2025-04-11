import"./card-DJwceVyR.js";const u=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");u?(g(u),h()):window.location.href="./index.html";async function g(e){try{const t=await y(e),o=await f(e);C(t,o)}catch(t){console.error("Failed to load Pokémon:",t),window.location.href="./index.html"}}function h(){var e;(e=document.getElementById("backButton"))==null||e.addEventListener("click",()=>{window.location.href="./index.html"})}async function y(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`)).json()}catch(t){throw console.error(`Failed to fetch Pokemon data for ID ${e}:`,t),t}}async function f(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon-species/${e}/`)).json()}catch(t){return console.error(`Failed to fetch Pokemon species data for ID ${e}:`,t),{color:{name:"blue"}}}}function C(e,t){var c,l,d,m,p;const o=w(((c=t.color)==null?void 0:c.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",o),document.body.style.background=`
        linear-gradient(
            135deg,
            ${o} 0%,
            ${B(o,30)} 100%
        )
    `,document.getElementById("pokemonName").textContent=e.name.charAt(0).toUpperCase()+e.name.slice(1),document.getElementById("pokemonID").textContent=`#${String(e.id).padStart(4,"0")}`;const a=((d=(l=e.sprites.other)==null?void 0:l.home)==null?void 0:d.front_default)||((p=(m=e.sprites.other)==null?void 0:m["official-artwork"])==null?void 0:p.front_default)||e.sprites.front_default;document.getElementById("pokemonImage").src=a;const i=document.getElementById("typesContainer");i.innerHTML=e.types.map(n=>`
        <div class="pokemon-type ${n.type.name}" 
             style="background: ${k(n.type.name)};">
            <img src="img/types/${n.type.name}.svg" alt="${n.type.name}">
            <span>${n.type.name.charAt(0).toUpperCase()+n.type.name.slice(1)}</span>
        </div>
    `).join(""),document.getElementById("pokemonHeight").textContent=`${e.height/10} m`,document.getElementById("pokemonWeight").textContent=`${e.weight/10} kg`,document.getElementById("pokemonBaseExp").textContent=e.base_experience||"Unknown";const r=document.getElementById("statsContainer");r.innerHTML=e.stats.map(n=>`
        <div class="stat-item">
            <div class="stat-name">${n.stat.name.replace("-"," ")}</div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(100,n.base_stat)}%"></div>
                <div class="stat-value">${n.base_stat}</div>
            </div>
        </div>
    `).join("");const s=document.getElementById("abilitiesContainer");s.innerHTML=e.abilities.map(n=>`
        <div class="ability-item">
            ${n.ability.name.replace("-"," ").charAt(0).toUpperCase()+n.ability.name.replace("-"," ").slice(1)}
            ${n.is_hidden?'<span class="hidden-ability">(hidden)</span>':""}
        </div>
    `).join("")}function k(e){return{normal:"#A8A878",fire:"#F08030",water:"#6890F0",electric:"#F8D030",grass:"#78C850",ice:"#98D8D8",fighting:"#C03028",poison:"#A040A0",ground:"#E0C068",flying:"#A890F0",psychic:"#F85888",bug:"#A8B820",rock:"#B8A038",ghost:"#705898",dragon:"#7038F8",dark:"#705848",steel:"#B8B8D0",fairy:"#EE99AC"}[e]||"#68A090"}function w(e){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#F8F8F8",yellow:"#F6C747"}[e]||"#68A090"}function B(e,t){const o=parseInt(e.replace("#",""),16),a=Math.round(2.55*t),i=(o>>16)+a,r=(o>>8&255)+a,s=(o&255)+a;return`#${(16777216+(i<255?i<1?0:i:255)*65536+(r<255?r<1?0:r:255)*256+(s<255?s<1?0:s:255)).toString(16).slice(1)}`}
