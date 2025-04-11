import{w as W,s as A,r as H,p as O,a as J,n as j,i as q,g as z,b as R,c as U,f as G,d as K,e as Q,h as V,j as X,k as Y,l as Z,m as D}from"./water-CcDrKTzB.js";const ee={bug:D,dark:Z,dragon:Y,electric:X,fire:V,fairy:Q,fighting:K,flying:G,ghost:U,grass:R,ground:z,ice:q,normal:j,poison:J,psychic:O,rock:H,steel:A,water:W},t={listWrapper:document.querySelector(".list-wrapper"),firstButton:document.getElementById("firstButton"),prevButton:document.getElementById("prevButton"),nextButton:document.getElementById("nextButton"),lastButton:document.getElementById("lastButton"),pageInput:document.getElementById("pageInput"),pageInfo:document.getElementById("pageInfo"),goButton:document.querySelector(".pagination__button--go"),loader:document.querySelector(".loader-container"),filterSelect:document.getElementById("filterSelect"),sortSelect:document.getElementById("sortSelect"),searchInput:document.getElementById("search__input"),searchClear:document.getElementById("search__clear")},f=12;let s=1,g=1,p=[],d=[],h="id-asc",i="";t.loader.innerHTML=`
  <div class="loader-container">
    <div class="o-pokeball u-tada"></div>
    <p class="loader-text">Pokémons are coming...</p>
  </div>
`;document.body.appendChild(t.loader);te();async function te(){try{const e=localStorage.getItem("pokedexState");if(e){const n=JSON.parse(e);s=n.currentPage,h=n.currentSort,i=n.currentFilterType,t.searchInput.value=n.searchTerm||"",t.sortSelect.value=h,t.filterSelect.value=i,t.searchClear.style.display=n.searchTerm?"block":"none",await $(),I(),n.searchTerm?(d=p.filter(r=>{const a=u(r.url).toString(),l=r.name.toLowerCase();return a.includes(n.searchTerm.toLowerCase())||l.includes(n.searchTerm.toLowerCase())}),await N()):i?await w(i):await y()}else t.loader.style.display="flex",await $(),I(),await y();ne()}catch(e){console.error("Error initializing app:",e)}finally{t.loader.style.display="none"}}function ne(){t.firstButton.addEventListener("click",()=>k(1)),t.prevButton.addEventListener("click",()=>k(s-1)),t.nextButton.addEventListener("click",()=>k(s+1)),t.lastButton.addEventListener("click",()=>k(g)),t.goButton.addEventListener("click",M),t.pageInput.addEventListener("keypress",e=>{e.key==="Enter"&&M()}),t.filterSelect.addEventListener("change",ie),t.searchInput.addEventListener("input",se),t.searchClear.addEventListener("click",le),t.sortSelect.addEventListener("change",()=>{h=t.sortSelect.value,I()})}async function y(){try{t.listWrapper.innerHTML="",t.loader.style.display="flex";const e=i?d:p;g=Math.ceil(e.length/f);const n=(s-1)*f,r=n+f,a=e.slice(n,r),l=await Promise.all(a.map(m=>P(u(m.url))));E(a,l),L()}catch(e){console.error("Error loading pokemons:",e)}finally{t.loader.style.display="none"}}function E(e,n){t.listWrapper.innerHTML="",t.listWrapper.style.opacity="0";const r=document.createDocumentFragment(),a=[];e.forEach((l,m)=>{if(n[m]){const v=u(l.url),{card:c,imageLoadPromise:S}=re(l,v,n[m]);a.push(S),r.appendChild(c)}}),t.listWrapper.appendChild(r),Promise.all(a).then(()=>{t.listWrapper.style.opacity="1"})}function re(e,n,r){if(!r)return document.createElement("div");const a=document.createElement("div");a.className="card",a.dataset.id=n;const m=r.types.map(o=>o.type.name).map(o=>`
    <div class="card__type ${o}">
      <img src="${ee[o]}" title="${o}" alt="${o}" />
      <div>${o}</div>
    </div>
  `).join("");a.innerHTML=`
    <div class="card__id">#${String(n).padStart(4,"0")}</div>
    <div class="card__img"></div>
    <div class="card__name">${ae(e.name)}</div>
    <div class="card__types">${m}</div>
  `;const v=(o,F)=>{var B,C,T,_;return o!=null&&o.sprites?((C=(B=o.sprites.other)==null?void 0:B.home)==null?void 0:C.front_default)||((_=(T=o.sprites.other)==null?void 0:T["official-artwork"])==null?void 0:_.front_default)||o.sprites.front_default:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${F}.png`},c=document.createElement("img");c.src=v(r,n),c.alt=e.name,c.loading="lazy",c.onerror=()=>{c.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${n}.png`,c.onerror=()=>{c.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${n}.png`}};const S=new Promise(o=>{c.onload=()=>{c.classList.add("loaded"),o()},c.onerror=()=>o()});return a.querySelector(".card__img").appendChild(c),a.addEventListener("click",()=>{ue(n)}),{card:a,imageLoadPromise:S}}async function P(e){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`)).json()}catch(n){return console.error(`Failed to fetch Pokemon data for ID ${e}:`,n),null}}function u(e){const n=e.split("/").filter(Boolean);return parseInt(n[n.length-1],10)}async function k(e){e=Math.max(1,Math.min(e,g)),e!==s&&(s=e,i?await w(i):await y())}function M(){const e=parseInt(t.pageInput.value,10);!isNaN(e)&&e>=1&&e<=g?k(e):t.pageInput.value=s}function L(){t.pageInfo.textContent=`Page ${s} of ${g}`,t.pageInput.value=s,t.firstButton.disabled=s===1,t.prevButton.disabled=s===1,t.nextButton.disabled=s===g,t.lastButton.disabled=s===g}function ae(e){return e.charAt(0).toUpperCase()+e.slice(1)}function se(){const e=t.searchInput.value.toLowerCase().trim();e?oe(e):b(),t.searchClear.style.display=e?"block":"none"}function b(){d=[],s=1,t.searchInput.value="",t.searchClear.style.display="none",y();const e=localStorage.getItem("pokedexState");if(e){const n=JSON.parse(e);n.searchTerm="",localStorage.setItem("pokedexState",JSON.stringify(n))}}function oe(e){d=p.filter(n=>{const r=u(n.url).toString(),a=n.name.toLowerCase();return r.includes(e)||a.includes(e)}),g=Math.ceil(d.length/f),s=1,d.length===0?x():N()}function x(){t.listWrapper.innerHTML=`
    <div class="no-results">No Pokémon found</div>
  `}async function N(){t.listWrapper.innerHTML="",t.loader.style.display="flex";try{const e=(s-1)*f,n=e+f,r=d.slice(e,n),a=await Promise.all(r.map(l=>P(u(l.url))));E(r,a),L()}catch(e){console.error("Error displaying filtered pokemons:",e)}finally{t.loader.style.display="none"}}function le(){t.searchInput.value="",t.searchClear.style.display="none",b()}function I(){h==="id-asc"?p.sort((e,n)=>u(e.url)-u(n.url)):h==="id-desc"?p.sort((e,n)=>u(n.url)-u(e.url)):h==="name-asc"?p.sort((e,n)=>e.name.localeCompare(n.name)):h==="name-desc"&&p.sort((e,n)=>n.name.localeCompare(e.name)),y()}async function ie(){i=t.filterSelect.value,ce(),i===""?de():await w(i)}function ce(){const e={currentPage:s,currentSort:h,currentFilterType:i,searchTerm:t.searchInput.value};localStorage.setItem("pokedexState",JSON.stringify(e))}async function w(e){try{t.listWrapper.innerHTML="",t.loader.style.display="flex";const n=await Promise.all(p.map(r=>P(u(r.url))));if(d=p.filter((r,a)=>{const l=n[a];return l&&l.types.some(m=>m.type.name===e)}),g=Math.ceil(d.length/f),s=1,d.length===0)x();else{const r=(s-1)*f,a=r+f,l=d.slice(r,a),m=await Promise.all(l.map(v=>P(u(v.url))));E(l,m)}L()}catch(n){console.error("Error filtering pokemons by type:",n)}finally{t.loader.style.display="none"}}function de(){i="",d=[],s=1,y()}async function $(){try{p=(await(await fetch("https://pokeapi.co/api/v2/pokemon?limit=11000")).json()).results.filter(r=>u(r.url)<1e5),g=Math.ceil(p.length/f)}catch(e){throw console.error("Error fetching all pokemons:",e),e}}function ue(e){const n={currentPage:s,currentSort:h,currentFilterType:i,searchTerm:t.searchInput.value,filteredPokemons:i||t.searchInput.value?d:null};localStorage.setItem("pokedexState",JSON.stringify(n)),localStorage.setItem("currentPokemonID",e),window.location.href=`details.html?id=${e}`}
