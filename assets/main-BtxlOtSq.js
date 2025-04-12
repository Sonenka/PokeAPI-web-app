import{m as n,t as $}from"./typeIcons-wyGrPWsT.js";const e={allPokemons:[],filteredPokemons:[],currentPage:1,itemsPerPage:12,sortOption:"id-asc",currentFilterType:"",searchTerm:""};function M(t){const r={currentPage:e.currentPage,currentSort:e.sortOption,currentFilterType:e.currentFilterType||"",searchTerm:n.searchInput.value.trim()};localStorage.setItem("pokedexState",JSON.stringify(r)),localStorage.setItem("currentPokemonID",t),window.location.href=`details.html?id=${t}`}const u=12;async function L(){try{const r=await(await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")).json();e.allPokemons=r.results.filter(a=>c(a.url)<1e4),console.log("Pokemons loaded:",e.allPokemons),e.totalPages=Math.ceil(e.allPokemons.length/u)}catch(t){throw console.error("Error fetching all pokemons:",t),t}}async function h(t){try{return await(await fetch(`https://pokeapi.co/api/v2/pokemon/${t}`)).json()}catch(r){return console.error(`Failed to fetch Pokemon data for ID ${t}:`,r),null}}function c(t){const r=t.split("/").filter(Boolean);return parseInt(r[r.length-1],10)}function x(t){return t.charAt(0).toUpperCase()+t.slice(1)}async function m(){try{n.listWrapper.innerHTML="",n.loader.style.display="flex";const t=e.filteredPokemons.length>0?e.filteredPokemons:e.allPokemons;e.totalPages=Math.ceil(t.length/u),e.currentPage>e.totalPages&&e.totalPages>0&&(e.currentPage=e.totalPages);const r=(e.currentPage-1)*u,a=r+u,o=t.slice(r,a),i=await Promise.all(o.map(d=>h(c(d.url))));E(o,i),I()}catch(t){console.error("Error loading pokemons:",t)}finally{n.loader.style.display="none"}}function E(t,r){n.listWrapper.innerHTML="",n.listWrapper.style.opacity="0";const a=document.createDocumentFragment(),o=[];t.forEach((i,d)=>{if(r[d]){const P=c(i.url),{card:l,imageLoadPromise:f}=B(i,P,r[d]);o.push(f),a.appendChild(l)}}),n.listWrapper.appendChild(a),Promise.all(o).then(()=>{n.listWrapper.style.opacity="1"})}function B(t,r,a){if(!a)return document.createElement("div");const o=document.createElement("div");o.className="card",o.dataset.id=r;const d=a.types.map(s=>s.type.name).map(s=>`
    <div class="card__type ${s}">
      <img src="${$[s]}" title="${s}" alt="${s}" />
      <div>${s}</div>
    </div>
  `).join("");o.innerHTML=`
    <div class="card__id">#${String(r).padStart(4,"0")}</div>
    <div class="card__img"></div>
    <div class="card__name">${x(t.name)}</div>
    <div class="card__types">${d}</div>
  `;const P=(s,C)=>{var k,v,S,T;return s!=null&&s.sprites?((v=(k=s.sprites.other)==null?void 0:k.home)==null?void 0:v.front_default)||((T=(S=s.sprites.other)==null?void 0:S["official-artwork"])==null?void 0:T.front_default)||s.sprites.front_default:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${C}.png`},l=document.createElement("img");l.src=P(a,r),l.alt=t.name,l.loading="lazy",l.onerror=()=>{l.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${r}.png`,l.onerror=()=>{l.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${r}.png`}};const f=new Promise(s=>{l.onload=()=>{l.classList.add("loaded"),s()},l.onerror=()=>s()});return o.querySelector(".card__img").appendChild(l),o.addEventListener("click",()=>{M(r)}),{card:o,imageLoadPromise:f}}function I(){n.pageInfo.textContent=`Page ${e.currentPage} of ${e.totalPages}`,n.pageInput.value=e.currentPage,n.firstButton.disabled=e.currentPage===1,n.prevButton.disabled=e.currentPage===1,n.nextButton.disabled=e.currentPage===e.totalPages||e.totalPages===0,n.lastButton.disabled=e.currentPage===e.totalPages||e.totalPages===0}async function b(){n.listWrapper.innerHTML="",n.loader.style.display="flex";try{const t=(e.currentPage-1)*u,r=t+u,a=e.filteredPokemons.slice(t,r),o=await Promise.all(a.map(i=>h(c(i.url))));E(a,o),I()}catch(t){console.error("Error displaying filtered pokemons:",t)}finally{n.loader.style.display="none"}}function N(){n.listWrapper.innerHTML=`
    <div class="no-results">No Pokémon found</div>
  `}async function p(t){t=Math.max(1,Math.min(t,e.totalPages)),t!==e.currentPage&&(e.currentPage=t,await m())}async function A(){const t=n.filterSelect.value;if(e.currentFilterType=t,!e.allPokemons.length){console.warn("Pokemons are not yet loaded.");return}t===""?g():await F(t)}async function F(t){try{if(n.listWrapper.innerHTML="",n.loader.style.display="flex",!t)e.filteredPokemons=[],e.currentFilterType="";else{const r=await Promise.all(e.allPokemons.map(a=>h(c(a.url))));e.filteredPokemons=e.allPokemons.filter((a,o)=>{const i=r[o];return i&&i.types.some(d=>d.type.name===t)}),e.currentFilterType=t}e.currentPage=1,await m()}catch(r){console.error("Error filtering pokemons by type:",r)}finally{n.loader.style.display="none"}}function g(){console.log("Resetting type filter, showing all pokemons."),e.currentFilterType="",e.filteredPokemons=[...e.allPokemons],e.currentPage=1,m()}function H(){const t=n.searchInput.value.toLowerCase().trim();e.searchTerm=t,t?O(t):_(),n.searchClear.style.display=t?"block":"none"}function O(t){e.filteredPokemons=e.allPokemons.filter(r=>{const a=c(r.url).toString(),o=r.name.toLowerCase();return a.includes(t)||o.includes(t)}),e.totalPages=Math.ceil(e.filteredPokemons.length/u),e.currentPage=1,e.filteredPokemons.length===0?N():b()}function _(){e.filteredPokemons=[...e.allPokemons],e.searchTerm="",e.currentPage=1,n.searchInput.value="",n.searchClear.style.display="none",m();const t=JSON.parse(localStorage.getItem("pokedexState")||"{}");t.searchTerm="",localStorage.setItem("pokedexState",JSON.stringify(t))}function W(){_()}function y(){e.currentSort==="id-asc"?e.allPokemons.sort((t,r)=>c(t.url)-c(r.url)):e.currentSort==="id-desc"?e.allPokemons.sort((t,r)=>c(r.url)-c(t.url)):e.currentSort==="name-asc"?e.allPokemons.sort((t,r)=>t.name.localeCompare(r.name)):e.currentSort==="name-desc"&&e.allPokemons.sort((t,r)=>r.name.localeCompare(t.name)),e.currentPage=1,m()}function J(){n.firstButton.addEventListener("click",()=>p(1)),n.prevButton.addEventListener("click",()=>p(e.currentPage-1)),n.nextButton.addEventListener("click",()=>p(e.currentPage+1)),n.lastButton.addEventListener("click",()=>p(e.totalPages)),n.goButton.addEventListener("click",w),n.pageInput.addEventListener("keypress",t=>{t.key==="Enter"&&w()}),n.filterSelect.addEventListener("change",A),n.searchInput.addEventListener("input",H),n.searchClear.addEventListener("click",W),n.sortSelect.addEventListener("change",()=>{e.currentSort=n.sortSelect.value,y()})}function w(){const t=parseInt(n.pageInput.value,10);!isNaN(t)&&t>=1&&t<=e.totalPages?p(t):n.pageInput.value=e.currentPage}n.loader.innerHTML=`
  <div class="loader-container">
    <div class="o-pokeball u-tada"></div>
    <p class="loader-text">Pokémons are coming...</p>
  </div>
`;document.body.appendChild(n.loader);async function R(){try{const t=localStorage.getItem("pokedexState");if(n.filterSelect.value="",e.currentFilterType="",t){const r=JSON.parse(t);n.searchInput.value=r.searchTerm||"",n.sortSelect.value=r.currentSort||"id-asc",r.currentFilterType&&(n.filterSelect.value=r.currentFilterType,e.currentFilterType=r.currentFilterType),await L(),y(),r.searchTerm||(r.currentFilterType?await F(r.currentFilterType):g())}else n.loader.style.display="flex",await L(),y(),g();J()}catch(t){console.error("Error initializing app:",t)}finally{n.loader.style.display="none"}}R();
