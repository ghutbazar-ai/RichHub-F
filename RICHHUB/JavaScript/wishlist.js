/* Browser-persisted wishlist controls and count. */
(() => {
  const KEY='richhub-wishlist-v2';let saved=JSON.parse(localStorage.getItem(KEY)||'[]');
  function sync(){document.querySelectorAll('[data-wishlist]').forEach(btn=>{const active=saved.includes(btn.dataset.wishlist);btn.classList.toggle('saved',active);btn.textContent=active?'♥':'♡';btn.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-wishlist-count]').forEach(el=>el.textContent=saved.length);}
  function toggle(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem(KEY,JSON.stringify(saved));sync();const toast=document.querySelector('.toast');if(toast){toast.textContent=saved.includes(id)?'Saved to your wishlist':'Removed from your wishlist';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2000)}}
  document.addEventListener('click',e=>{const button=e.target.closest('[data-wishlist]');if(button){e.preventDefault();toggle(button.dataset.wishlist)}});
  document.addEventListener('DOMContentLoaded',sync);sync();window.RichWishlist={get items(){return saved},toggle,sync};
})();
