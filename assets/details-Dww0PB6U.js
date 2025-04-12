import{t as f}from"./typeIcons-Cr3LCB7A.js";const h=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");h?(g(h),w()):window.location.href="./index.html";async function g(e){try{const t=await b(e),n=await C(e);k(t,n)}catch(t){console.error("Failed to load Pokémon:",t),window.location.href="./index.html"}}function w(){var e;(e=document.getElementById("backButton"))==null||e.addEventListener("click",()=>{window.location.href="./index.html"})}async function b(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`)).json()}catch(t){throw console.error(`Failed to fetch Pokemon data for ID ${e}:`,t),t}}async function C(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon-species/${e}/`)).json()}catch(t){return console.error(`Failed to fetch Pokemon species data for ID ${e}:`,t),{color:{name:"blue"}}}}function k(e,t){var l,d,m,p,u;const n=v(((l=t.color)==null?void 0:l.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",n),document.body.style.background=`
        linear-gradient(
            135deg,
            ${n} 0%,
            ${$(n,30)} 100%
        )
    `,document.getElementById("pokemonName").textContent=e.name.charAt(0).toUpperCase()+e.name.slice(1),document.getElementById("pokemonID").textContent=`#${String(e.id).padStart(4,"0")}`;const i=((m=(d=e.sprites.other)==null?void 0:d.home)==null?void 0:m.front_default)||((u=(p=e.sprites.other)==null?void 0:p["official-artwork"])==null?void 0:u.front_default)||e.sprites.front_default;document.getElementById("pokemonImage").src=i;const s=document.getElementById("typesContainer"),r=e.types.map(o=>{const a=o.type.name;return`
          <div class="card__type ${a}">
            <img src="${f[a]}" title="${a}" alt="${a}" />
            <div>${a.charAt(0).toUpperCase()+a.slice(1)}</div>
          </div>
        `}).join("");s.innerHTML=r,document.getElementById("pokemonHeight").textContent=`${e.height/10} m`,document.getElementById("pokemonWeight").textContent=`${e.weight/10} kg`,document.getElementById("pokemonBaseExp").textContent=e.base_experience||"Unknown";const c=document.getElementById("statsContainer");c.innerHTML=e.stats.map(o=>`
        <div class="stat-item">
            <div class="stat-name">${o.stat.name.replace("-"," ")}</div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(100,o.base_stat)}%"></div>
                <div class="stat-value">${o.base_stat}</div>
            </div>
        </div>
    `).join("");const y=document.getElementById("abilitiesContainer");y.innerHTML=e.abilities.map(o=>`
        <div class="ability-item">
            ${o.ability.name.replace("-"," ").charAt(0).toUpperCase()+o.ability.name.replace("-"," ").slice(1)}
            ${o.is_hidden?'<span class="hidden-ability">(hidden)</span>':""}
        </div>
    `).join("")}function v(e){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#bfbfbf",yellow:"#F6C747"}[e]||"#68A090"}function $(e,t){const n=parseInt(e.replace("#",""),16),i=Math.round(2.55*t),s=(n>>16)+i,r=(n>>8&255)+i,c=(n&255)+i;return`#${(16777216+(s<255?s<1?0:s:255)*65536+(r<255?r<1?0:r:255)*256+(c<255?c<1?0:c:255)).toString(16).slice(1)}`}
