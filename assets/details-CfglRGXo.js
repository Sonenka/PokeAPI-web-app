import{d as a,t as f}from"./typeIcons-EVy8AarX.js";const h=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");h?(u(h),y()):window.location.href="./index.html";async function u(t){try{const e=await w(t),n=await _(t);b(e,n)}catch(e){console.error("Failed to load Pokémon:",e),window.location.href="./index.html"}}function y(){var t;(t=a.backButton)==null||t.addEventListener("click",()=>{window.location.href="./index.html"})}async function w(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${t}`)).json()}catch(e){throw console.error(`Failed to fetch Pokemon data for ID ${t}:`,e),e}}async function _(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon-species/${t}/`)).json()}catch(e){return console.error(`Failed to fetch Pokemon species data for ID ${t}:`,e),{color:{name:"blue"}}}}function b(t,e){var s,i,d,p,m;a.details.style.opacity="0";const n=g(((s=e.color)==null?void 0:s.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",n),document.body.style.background=`
        linear-gradient(
            135deg,
            ${n} 0%,
            ${k(n,30)} 100%
        )
    `,a.pokemonName.textContent=t.name.charAt(0).toUpperCase()+t.name.slice(1),a.pokemonID.textContent=`#${String(t.id).padStart(4,"0")}`;const c=((d=(i=t.sprites.other)==null?void 0:i.home)==null?void 0:d.front_default)||((m=(p=t.sprites.other)==null?void 0:p["official-artwork"])==null?void 0:m.front_default)||t.sprites.front_default;a.pokemonImage.src=c;const l=t.types.map(o=>{const r=o.type.name;return`
          <div class="card__type ${r}">
            <img src="${f[r]}" title="${r}" alt="${r}" />
            <div>${r.charAt(0).toUpperCase()+r.slice(1)}</div>
          </div>
        `}).join("");a.typesContainer.innerHTML=l,a.pokemonHeight.textContent=`${t.height/10} m`,a.pokemonWeight.textContent=`${t.weight/10} kg`,a.pokemonBaseExp.textContent=t.base_experience||"Unknown",a.statsContainer.innerHTML=t.stats.map(o=>`
        <div class="details__stat">
            <div class="details__stat-name">${o.stat.name.replace("-"," ")}</div>
            <div class="details__stat-bar-container">
                <div class="details__stat-bar" style="width: ${Math.min(100,o.base_stat)}%"></div>
                <div class="details__stat-value">${o.base_stat}</div>
            </div>
        </div>
    `).join(""),a.abilitiesContainer.innerHTML=t.abilities.map(o=>`
        <div class="details__ability">
            ${o.ability.name.replace("-"," ").charAt(0).toUpperCase()+o.ability.name.replace("-"," ").slice(1)}
            ${o.is_hidden?'<span class="details__ability--hidden">(hidden)</span>':""}
        </div>
    `).join(""),a.details.style.opacity="1"}function g(t){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#bfbfbf",yellow:"#F6C747"}[t]||"#68A090"}function k(t,e){const n=parseInt(t.replace("#",""),16),c=Math.round(2.55*e),l=(n>>16)+c,s=(n>>8&255)+c,i=(n&255)+c;return`#${(16777216+(l<255?l<1?0:l:255)*65536+(s<255?s<1?0:s:255)*256+(i<255?i<1?0:i:255)).toString(16).slice(1)}`}
