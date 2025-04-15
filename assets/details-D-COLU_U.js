import{d as a,t as w}from"./typeIcons-C-irFVEd.js";const g="https://pokeapi.co/api/v2",$="No description available.",C={hp:255,attack:190,defense:230,"special-attack":194,"special-defense":230,speed:200},y=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");y?(x(y),b()):window.location.href="./index.html";function _(t,e){const n=parseInt(t.replace("#",""),16),s=Math.round(2.55*e),i=p=>Math.max(0,Math.min(255,p)),c=i((n>>16)+s),l=i((n>>8&255)+s),d=i((n&255)+s);return`#${(c<<16|l<<8|d).toString(16).padStart(6,"0")}`}async function x(t){try{const e=await A(t),n=await S(t);P(e,n)}catch(e){console.error("Failed to load Pokémon:",e),window.location.href="./index.html"}}function b(){var t;(t=a.backButton)==null||t.addEventListener("click",()=>{window.location.href="./index.html"})}async function A(t){try{return await(await fetch(`${g}/pokemon/${t}`)).json()}catch(e){throw console.error(`Failed to fetch Pokemon data for ID ${t}:`,e),e}}async function S(t){try{return await(await fetch(`${g}/pokemon-species/${t}/`)).json()}catch(e){return console.error(`Failed to fetch Pokemon species data for ID ${t}:`,e),{color:{name:"blue"}}}}function P(t,e){var d,p,m,f,h;a.details.style.opacity="0";const n=D(((d=e.color)==null?void 0:d.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",n),document.body.style.background=`
        linear-gradient(
            135deg,
            ${n} 0%,
            ${_(n,30)} 100%
        )
    `,a.pokemonName.textContent=t.name.charAt(0).toUpperCase()+t.name.slice(1),a.pokemonID.textContent=`#${String(t.id).padStart(4,"0")}`;const s=((m=(p=t.sprites.other)==null?void 0:p.home)==null?void 0:m.front_default)||((h=(f=t.sprites.other)==null?void 0:f["official-artwork"])==null?void 0:h.front_default)||t.sprites.front_default;a.pokemonImage.src=s;const i=t.types.map(o=>{const r=o.type.name;return`
          <div class="card__type ${r}">
            <img src="${w[r]}" title="${r}" alt="${r}" />
            <div>${r.charAt(0).toUpperCase()+r.slice(1)}</div>
          </div>
        `}).join("");a.typesContainer.innerHTML=i,a.pokemonHeight.textContent=`${t.height/10} m`,a.pokemonWeight.textContent=`${t.weight/10} kg`,a.statsContainer.innerHTML=t.stats.map(o=>{const r=o.stat.name,u=o.base_stat,v=C[r]||100,k=u/v*100;return`
            <div class="details__stat darker">
                <div class="details__stat-name">${r.replace("-"," ")}</div>
                <div class="details__stat-bar-container">
                    <div class="details__stat-bar" style="width: ${k}%"></div>
                    <div class="details__stat-value">${u}</div>
                </div>
            </div>
        `}).join(""),a.abilitiesContainer.innerHTML=t.abilities.map(o=>`
        <div class="details__ability darker">
            ${o.ability.name.replace("-"," ").charAt(0).toUpperCase()+o.ability.name.replace("-"," ").slice(1)}
            ${o.is_hidden?'<span class="details__ability--hidden">(hidden)</span>':""}
        </div>
    `).join("");const c=F(e);c?a.flavorText.textContent=c:a.flavorText.textContent=$;const l=_(n,-50);console.log(l),document.querySelectorAll(".darker").forEach(o=>{o.style.color=l}),a.details.style.opacity="1"}function D(t){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#a38f7e",yellow:"#F6C747"}[t]||"#68A090"}function F(t){var s;const e=(s=t.flavor_text_entries)==null?void 0:s.filter(i=>i.language.name==="en");return e!=null&&e.length?e[e.length-1].flavor_text.replace(/\n/g," ").replace(/\f/g," "):null}
