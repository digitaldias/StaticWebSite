class SearchEngine{constructor(){this.index=null,this.resultsContainer=null,this.searchInput=null,this.debounceTimer=null}async init(){if(this.searchInput=document.getElementById("search-input"),this.resultsContainer=document.getElementById("search-results"),!this.searchInput||!this.resultsContainer)return;try{const e=await fetch("/search-index.json");this.index=await e.json(),this.setupSearch()}catch(e){console.error("Failed to load search index:",e),this.showError("Failed to load search index. Please refresh the page.")}}setupSearch(){this.searchInput.addEventListener("input",e=>{clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>{this.search(e.target.value)},300)}),this.searchInput.addEventListener("keydown",e=>{if(e.key==="Enter"&&this.searchInput.value.trim()){e.preventDefault();const t=this.resultsContainer.querySelector(".search-result-item");t&&t.querySelector("a").click()}})}search(e){const t=e.trim().toLowerCase();if(!t){this.showPlaceholder();return}if(!this.index||this.index.length===0){this.showError("No search index available.");return}const n=this.index.map(e=>({...e,score:this.calculateScore(e,t)})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score).slice(0,15);this.displayResults(n,t)}calculateScore(e,t){let n=0;const s=e.title.toLowerCase(),o=e.excerpt.toLowerCase(),i=e.tags.map(e=>e.toLowerCase()).join(" "),a=e.categories.map(e=>e.toLowerCase()).join(" ");s.includes(t)&&(n+=10,s.startsWith(t)&&(n+=5)),i.includes(t)&&(n+=8),a.includes(t)&&(n+=6),o.includes(t)&&(n+=3);const r=t.split(/\s+/);return r.forEach(e=>{if(e.length<2)return;s.includes(e)&&(n+=2),i.includes(e)&&(n+=1.5),o.includes(e)&&(n+=1)}),n}displayResults(e,t){if(e.length===0){this.resultsContainer.innerHTML=`
                <div class="search-no-results">
                    <p>No results found for "<strong>${this.escapeHtml(t)}</strong>"</p>
                    <p class="search-hint">Try different keywords or check spelling.</p>
                </div>
            `;return}const n=e.map(e=>this.renderResult(e,t)).join("");this.resultsContainer.innerHTML=`
            <div class="search-results-header">
                <p>Found <strong>${e.length}</strong> result${e.length!==1?"s":""}</p>
            </div>
            <div class="search-results-list">
                ${n}
            </div>
        `}renderResult(e,t){const s=this.highlightText(e.title,t),o=this.highlightText(e.excerpt,t),n=e.tags.map(e=>`<span class="search-tag">#${this.escapeHtml(e)}</span>`).join(" ");return`
            <article class="search-result-item">
                <h3 class="search-result-title">
                    <a href="${e.url}">${s}</a>
                </h3>
                <p class="search-result-excerpt">${o}</p>
                <div class="search-result-meta">
                    <span class="search-result-date">${e.date}</span>
                    ${n?`<div class="search-result-tags">${n}</div>`:""}
                </div>
            </article>
        `}highlightText(e,t){const s=t.split(/\s+/).filter(e=>e.length>0);let n=this.escapeHtml(e);return s.forEach(e=>{const t=new RegExp(`(${this.escapeRegex(e)})`,"gi");n=n.replace(t,"<mark>$1</mark>")}),n}showPlaceholder(){this.resultsContainer.innerHTML=`
            <div class="search-placeholder">
                <p>Type to search blog posts...</p>
            </div>
        `}showError(e){this.resultsContainer.innerHTML=`
            <div class="search-error">
                <p>${this.escapeHtml(e)}</p>
            </div>
        `}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}escapeRegex(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{const e=new SearchEngine;e.init()});else{const e=new SearchEngine;e.init()}