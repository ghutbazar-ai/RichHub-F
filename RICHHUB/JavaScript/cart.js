/* LocalStorage cart, cart drawer, cart page, and demo checkout. */
(() => {
  const KEY='richhub-cart-v2';let cart=JSON.parse(localStorage.getItem(KEY)||'[]');
  const save=()=>{localStorage.setItem(KEY,JSON.stringify(cart));render();};
  const count=()=>cart.reduce((sum,row)=>sum+row.qty,0);
  const subtotal=()=>cart.reduce((sum,row)=>sum+(RICHHUB.catalog.find(p=>p.id===row.id)?.price||0)*row.qty,0);
  function add(id,qty=1){const row=cart.find(x=>x.id===id);row?row.qty+=qty:cart.push({id,qty});save();toast('Added to your bag');}
  function remove(id){cart=cart.filter(x=>x.id!==id);save();}
  function change(id,delta){const row=cart.find(x=>x.id===id);if(row){row.qty=Math.max(1,row.qty+delta);save();}}
  function line(row){const p=RICHHUB.catalog.find(x=>x.id===row.id);if(!p)return '';return `<div class="drawer-line"><img src="${RICHHUB.photo(p.image,180)}" alt=""><div><b>${p.name}</b><small>${RICHHUB.money(p.price)} · Qty ${row.qty}</small><button data-remove-cart="${p.id}">Remove</button></div><b>${RICHHUB.money(p.price*row.qty)}</b></div>`}
  function render(){
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count());
    const drawer=document.querySelector('.drawer-items');if(drawer)drawer.innerHTML=cart.map(line).join('')||'<p class="muted">Your bag is waiting for something good.</p>';
    const total=document.querySelector('.drawer-subtotal');if(total)total.textContent=RICHHUB.money(subtotal());
    const page=document.querySelector('.cart-page-items');if(page){page.innerHTML=cart.length?cart.map(row=>{const p=RICHHUB.catalog.find(x=>x.id===row.id);return p?`<article class="cart-page-line"><img src="${RICHHUB.photo(p.image,250)}" alt="${p.name}"><div><h3>${p.name}</h3><p>${p.category} · ${p.material}</p><b>${RICHHUB.money(p.price)}</b><button data-remove-cart="${p.id}">Remove</button></div><div class="cart-qty"><button data-page-qty="-1" data-id="${p.id}">−</button><span>${row.qty}</span><button data-page-qty="1" data-id="${p.id}">+</button></div><strong>${RICHHUB.money(p.price*row.qty)}</strong></article>`:''}).join(''):'<div class="empty-cart"><h2>Your bag is taking a little break.</h2><p>Find something you love and come back here.</p><a class="button gold" href="shop.html">Shop the collection ↗</a></div>';const sub=document.querySelector('[data-cart-subtotal]');if(sub)sub.textContent=RICHHUB.money(subtotal());}
  }
  function toast(text){const el=document.querySelector('.toast');if(!el)return;el.textContent=text;el.classList.add('show');clearTimeout(window.richToastTimer);window.richToastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
  const open=()=>document.querySelector('.cart-drawer-overlay')?.classList.add('open');const close=()=>document.querySelector('.cart-drawer-overlay')?.classList.remove('open');
  window.RichCart={add,remove,change,render,open,close,get items(){return cart}};
  document.addEventListener('click',e=>{
    const addBtn=e.target.closest('[data-add-cart]');if(addBtn){add(addBtn.dataset.addCart);return}
    const detail=e.target.closest('[data-detail-add]');if(detail){const size=document.querySelector('.size-option.selected');if(!size){toast('Choose a size first');return}const qty=Number(document.querySelector('.quantity-control input')?.value||1);add(detail.dataset.detailAdd,Math.max(1,qty));return}
    const rem=e.target.closest('[data-remove-cart]');if(rem){remove(rem.dataset.removeCart);return}
    const qtyBtn=e.target.closest('[data-page-qty]');if(qtyBtn){change(qtyBtn.dataset.id,Number(qtyBtn.dataset.pageQty));return}
    if(e.target.closest('[data-open-cart]')){open();return}
    if(e.target.closest('.drawer-close')||e.target.classList.contains('cart-drawer-overlay')){close();return}
    const q=e.target.closest('[data-quantity]');if(q){const input=document.querySelector('.quantity-control input');input.value=Math.max(1,Number(input.value)+Number(q.dataset.quantity));}
  });
  document.addEventListener('submit',e=>{if(e.target.id!=='checkout-form')return;e.preventDefault();const id=`RH-${Date.now().toString().slice(-7)}`;cart=[];save();e.target.reset();const box=document.querySelector('.checkout-box');if(box)box.innerHTML=`<h2>Thank you for your order!</h2><p>Your demo order <strong>${id}</strong> has been placed. No payment was collected.</p><a class="button gold" href="shop.html">Continue shopping ↗</a>`;else toast(`Demo order ${id} placed. Thank you!`);});
  document.querySelector('.checkout-start')?.addEventListener('click',()=>{if(!cart.length){toast('Your bag is empty');return}const box=document.querySelector('.checkout-box');box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'center'});});
  document.addEventListener('DOMContentLoaded',render);render();
})();
