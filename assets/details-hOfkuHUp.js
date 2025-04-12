import{m as f,w,s as b,r as k,p as C,a as v,n as $,i as I,g as B,b as x,c as E,f as D,d as P,e as F,h as A,j as _,k as M,l as j}from"./water-Q0tGQRc_.js";const g={bug:f,dark:j,dragon:M,electric:_,fire:A,fairy:F,fighting:P,flying:D,ghost:E,grass:x,ground:B,ice:I,normal:$,poison:v,psychic:C,rock:k,steel:b,water:w};console.log(g.bug);const h=new URLSearchParams(window.location.search).get("id")||localStorage.getItem("currentPokemonID");h?(L(h),S()):window.location.href="./index.html";async function L(e){try{const t=await U(e),n=await H(e);T(t,n)}catch(t){console.error("Failed to load Pokémon:",t),window.location.href="./index.html"}}function S(){var e;(e=document.getElementById("backButton"))==null||e.addEventListener("click",()=>{window.location.href="./index.html"})}async function U(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`)).json()}catch(t){throw console.error(`Failed to fetch Pokemon data for ID ${e}:`,t),t}}async function H(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon-species/${e}/`)).json()}catch(t){return console.error(`Failed to fetch Pokemon species data for ID ${e}:`,t),{color:{name:"blue"}}}}function T(e,t){var l,d,m,p,u;const n=R(((l=t.color)==null?void 0:l.name)||"blue");document.documentElement.style.setProperty("--pokemon-color",n),document.body.style.background=`
        linear-gradient(
            135deg,
            ${n} 0%,
            ${G(n,30)} 100%
        )
    `,document.getElementById("pokemonName").textContent=e.name.charAt(0).toUpperCase()+e.name.slice(1),document.getElementById("pokemonID").textContent=`#${String(e.id).padStart(4,"0")}`;const s=((m=(d=e.sprites.other)==null?void 0:d.home)==null?void 0:m.front_default)||((u=(p=e.sprites.other)==null?void 0:p["official-artwork"])==null?void 0:u.front_default)||e.sprites.front_default;document.getElementById("pokemonImage").src=s;const i=document.getElementById("typesContainer"),r=e.types.map(o=>{const a=o.type.name;return`
          <div class="card__type ${a}">
            <img src="${g[a]}" title="${a}" alt="${a}" />
            <div>${a.charAt(0).toUpperCase()+a.slice(1)}</div>
          </div>
        `}).join("");i.innerHTML=r,document.getElementById("pokemonHeight").textContent=`${e.height/10} m`,document.getElementById("pokemonWeight").textContent=`${e.weight/10} kg`,document.getElementById("pokemonBaseExp").textContent=e.base_experience||"Unknown";const c=document.getElementById("statsContainer");c.innerHTML=e.stats.map(o=>`
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
    `).join("")}function R(e){return{black:"#303030",blue:"#429BED",brown:"#B1736C",gray:"#A0A2A0",green:"#64D368",pink:"#F85888",purple:"#7C538C",red:"#FA6555",white:"#bfbfbf",yellow:"#F6C747"}[e]||"#68A090"}function G(e,t){const n=parseInt(e.replace("#",""),16),s=Math.round(2.55*t),i=(n>>16)+s,r=(n>>8&255)+s,c=(n&255)+s;return`#${(16777216+(i<255?i<1?0:i:255)*65536+(r<255?r<1?0:r:255)*256+(c<255?c<1?0:c:255)).toString(16).slice(1)}`}
