/* Header live search suggestions and shop search routing. */
(() => {
  document.addEventListener('input',e=>{if(!e.target.matches('[data-search-input]'))return;const query=e.target.value.trim().toLowerCase();const box=document.querySelector('.search-suggestions');if(!box)return;if(!query){box.innerHTML='';return}const results=RICHHUB.catalog.filter(p=>`${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query)).slice(0,5);box.innerHTML=results.length?results.map(p=>`<a href="product-details.html?id=${p.id}">${p.name} <span>· ${RICHHUB.money(p.price)}</span></a>`).join(''):'<a href="shop.html">No exact match — browse all styles ↗</a>';});
  document.addEventListener('submit',e=>{if(!e.target.matches('[data-search-form]'))return;e.preventDefault();const query=e.target.querySelector('[data-search-input]').value.trim();location.href=`shop.html?q=${encodeURIComponent(query)}`;});
  document.addEventListener('click',e=>{if(!e.target.closest('.header-search')){const box=document.querySelector('.search-suggestions');if(box)box.innerHTML=''}});
})();
