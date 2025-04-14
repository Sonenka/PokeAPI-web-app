import{d as a,t as u}from"./typeIcons-C-irFVEd.js";const f=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");f?(y(f),g()):window.location.href="./index.html";async function y(t){try{const e=await v(t),n=await _(t);w(e,n)}catch(e){console.error("Failed to load Pokémon:",e),window.location.href="./index.html"}}function g(){var t;(t=a.backButton)==null||t.addEventListener("click",()=>{window.location.href="./index.html"})}async function v(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${t}`)).json()}catch(e){throw console.error(`Failed to fetch Pokemon data for ID ${t}:`,e),e}}async function _(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon-species/${t}/`)).json()}catch(e){return console.error(`Failed to fetch Pokemon species data for ID ${t}:`,e),{color:{name:"blue"}}}}function w(t,e){var l,d,p,m,h;a.details.style.opacity="0";const n=k(((l=e.color)==null?void 0:l.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",n),document.body.style.background=`
        linear-gradient(
            135deg,
            ${n} 0%,
            ${x(n,30)} 100%
        )
    `,a.pokemonName.textContent=t.name.charAt(0).toUpperCase()+t.name.slice(1),a.pokemonID.textContent=`#${String(t.id).padStart(4,"0")}`,a.pokemonName.style.color=n,a.pokemonName.style.filter="brightness(50%)";const s=((p=(d=t.sprites.other)==null?void 0:d.home)==null?void 0:p.front_default)||((h=(m=t.sprites.other)==null?void 0:m["official-artwork"])==null?void 0:h.front_default)||t.sprites.front_default;a.pokemonImage.src=s;const r=t.types.map(o=>{const c=o.type.name;return`
          <div class="card__type ${c}">
            <img src="${u[c]}" title="${c}" alt="${c}" />
            <div>${c.charAt(0).toUpperCase()+c.slice(1)}</div>
          </div>
        `}).join("");a.typesContainer.innerHTML=r,a.pokemonHeight.textContent=`${t.height/10} m`,a.pokemonWeight.textContent=`${t.weight/10} kg`,a.statsContainer.innerHTML=t.stats.map(o=>`
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
    `).join("");const i=$(e);i?a.flavorText.textContent=i:a.flavorText.textContent="No description available.",a.details.style.opacity="1"}function k(t){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#a38f7e",yellow:"#F6C747"}[t]||"#68A090"}function x(t,e){const n=parseInt(t.replace("#",""),16),s=Math.round(2.55*e),r=(n>>16)+s,i=(n>>8&255)+s,l=(n&255)+s;return`#${(16777216+(r<255?r<1?0:r:255)*65536+(i<255?i<1?0:i:255)*256+(l<255?l<1?0:l:255)).toString(16).slice(1)}`}function $(t){var s;const e=(s=t.flavor_text_entries)==null?void 0:s.filter(r=>r.language.name==="en");return e!=null&&e.length?e[e.length-1].flavor_text.replace(/\n/g," ").replace(/\f/g," "):null}
