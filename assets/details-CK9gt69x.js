import{d as n,t as f}from"./typeIcons-wyGrPWsT.js";const h=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");h?(u(h),y()):window.location.href="./index.html";async function u(t){try{const e=await w(t),o=await b(t);g(e,o)}catch(e){console.error("Failed to load Pokémon:",e),window.location.href="./index.html"}}function y(){var t;(t=n.backButton)==null||t.addEventListener("click",()=>{window.location.href="./index.html"})}async function w(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${t}`)).json()}catch(e){throw console.error(`Failed to fetch Pokemon data for ID ${t}:`,e),e}}async function b(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon-species/${t}/`)).json()}catch(e){return console.error(`Failed to fetch Pokemon species data for ID ${t}:`,e),{color:{name:"blue"}}}}function g(t,e){var i,s,d,p,m;const o=k(((i=e.color)==null?void 0:i.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",o),document.body.style.background=`
        linear-gradient(
            135deg,
            ${o} 0%,
            ${v(o,30)} 100%
        )
    `,n.pokemonName.textContent=t.name.charAt(0).toUpperCase()+t.name.slice(1),n.pokemonID.textContent=`#${String(t.id).padStart(4,"0")}`;const c=((d=(s=t.sprites.other)==null?void 0:s.home)==null?void 0:d.front_default)||((m=(p=t.sprites.other)==null?void 0:p["official-artwork"])==null?void 0:m.front_default)||t.sprites.front_default;n.pokemonImage.src=c;const l=t.types.map(a=>{const r=a.type.name;return`
          <div class="card__type ${r}">
            <img src="${f[r]}" title="${r}" alt="${r}" />
            <div>${r.charAt(0).toUpperCase()+r.slice(1)}</div>
          </div>
        `}).join("");n.typesContainer.innerHTML=l,n.pokemonHeight.textContent=`${t.height/10} m`,n.pokemonWeight.textContent=`${t.weight/10} kg`,n.pokemonBaseExp.textContent=t.base_experience||"Unknown",n.statsContainer.innerHTML=t.stats.map(a=>`
        <div class="stat-item">
            <div class="stat-name">${a.stat.name.replace("-"," ")}</div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(100,a.base_stat)}%"></div>
                <div class="stat-value">${a.base_stat}</div>
            </div>
        </div>
    `).join(""),n.abilitiesContainer.innerHTML=t.abilities.map(a=>`
        <div class="ability-item">
            ${a.ability.name.replace("-"," ").charAt(0).toUpperCase()+a.ability.name.replace("-"," ").slice(1)}
            ${a.is_hidden?'<span class="hidden-ability">(hidden)</span>':""}
        </div>
    `).join("")}function k(t){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#bfbfbf",yellow:"#F6C747"}[t]||"#68A090"}function v(t,e){const o=parseInt(t.replace("#",""),16),c=Math.round(2.55*e),l=(o>>16)+c,i=(o>>8&255)+c,s=(o&255)+c;return`#${(16777216+(l<255?l<1?0:l:255)*65536+(i<255?i<1?0:i:255)*256+(s<255?s<1?0:s:255)).toString(16).slice(1)}`}
