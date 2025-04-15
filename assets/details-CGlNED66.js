import{d as a,t as v}from"./typeIcons-C-irFVEd.js";const y="https://pokeapi.co/api/v2",k="No description available.",w={hp:255,attack:190,defense:230,"special-attack":194,"special-defense":230,speed:200},u=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");u?($(u),C()):window.location.href="./index.html";async function $(t){try{const e=await x(t),n=await b(t);A(e,n)}catch(e){console.error("Failed to load Pokémon:",e),window.location.href="./index.html"}}function C(){var t;(t=a.backButton)==null||t.addEventListener("click",()=>{window.location.href="./index.html"})}async function x(t){try{return await(await fetch(`${y}/pokemon/${t}`)).json()}catch(e){throw console.error(`Failed to fetch Pokemon data for ID ${t}:`,e),e}}async function b(t){try{return await(await fetch(`${y}/pokemon-species/${t}/`)).json()}catch(e){return console.error(`Failed to fetch Pokemon species data for ID ${t}:`,e),{color:{name:"blue"}}}}function A(t,e){var l,d,p,m,f;a.details.style.opacity="0";const n=P(((l=e.color)==null?void 0:l.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",n),document.body.style.background=`
        linear-gradient(
            135deg,
            ${n} 0%,
            ${S(n,30)} 100%
        )
    `,a.pokemonName.textContent=t.name.charAt(0).toUpperCase()+t.name.slice(1),a.pokemonID.textContent=`#${String(t.id).padStart(4,"0")}`,a.pokemonName.style.color=n,a.pokemonName.style.filter="brightness(50%)";const s=((p=(d=t.sprites.other)==null?void 0:d.home)==null?void 0:p.front_default)||((f=(m=t.sprites.other)==null?void 0:m["official-artwork"])==null?void 0:f.front_default)||t.sprites.front_default;a.pokemonImage.src=s;const i=t.types.map(r=>{const o=r.type.name;return`
          <div class="card__type ${o}">
            <img src="${v[o]}" title="${o}" alt="${o}" />
            <div>${o.charAt(0).toUpperCase()+o.slice(1)}</div>
          </div>
        `}).join("");a.typesContainer.innerHTML=i,a.pokemonHeight.textContent=`${t.height/10} m`,a.pokemonWeight.textContent=`${t.weight/10} kg`,a.statsContainer.innerHTML=t.stats.map(r=>{const o=r.stat.name,h=r.base_stat,_=w[o]||100,g=h/_*100;return`
            <div class="details__stat">
                <div class="details__stat-name">${o.replace("-"," ")}</div>
                <div class="details__stat-bar-container">
                    <div class="details__stat-bar" style="width: ${g}%"></div>
                    <div class="details__stat-value">${h}</div>
                </div>
            </div>
        `}).join(""),a.abilitiesContainer.innerHTML=t.abilities.map(r=>`
        <div class="details__ability">
            ${r.ability.name.replace("-"," ").charAt(0).toUpperCase()+r.ability.name.replace("-"," ").slice(1)}
            ${r.is_hidden?'<span class="details__ability--hidden">(hidden)</span>':""}
        </div>
    `).join("");const c=D(e);c?a.flavorText.textContent=c:a.flavorText.textContent=k,a.details.style.opacity="1"}function P(t){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#a38f7e",yellow:"#F6C747"}[t]||"#68A090"}function S(t,e){const n=parseInt(t.replace("#",""),16),s=Math.round(2.55*e),i=p=>Math.max(0,Math.min(255,p)),c=i((n>>16)+s),l=i((n>>8&255)+s),d=i((n&255)+s);return`#${(c<<16|l<<8|d).toString(16).padStart(6,"0")}`}function D(t){var s;const e=(s=t.flavor_text_entries)==null?void 0:s.filter(i=>i.language.name==="en");return e!=null&&e.length?e[e.length-1].flavor_text.replace(/\n/g," ").replace(/\f/g," "):null}
