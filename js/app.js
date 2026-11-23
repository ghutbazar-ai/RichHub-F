const products = [
  {id:'linen-shirt',name:'Everyday Linen Shirt',category:'Men’s clothing · Natural linen',price:68,old:86,rating:'4.9',reviews:128,image:'photo-1598033129183-c4f50c736f10',badge:'BESTSELLER',type:'featured'},
  {id:'studio-dress',name:'Studio Midi Dress',category:'Women’s clothing · Cotton poplin',price:94,old:118,rating:'4.8',reviews:96,image:'photo-1515886657613-9f3515b0c78f',badge:'−20%',type:'featured'},
  {id:'school-blazer',name:'Classic School Blazer',category:'School uniform · Easy-care twill',price:72,old:null,rating:'4.9',reviews:74,image:'photo-1503919005314-30d93d07d823',badge:'',type:'featured'},
  {id:'weekend-knit',name:'Weekend Cotton Knit',category:'Everyday · Organic cotton',price:58,old:null,rating:'4.7',reviews:62,image:'photo-1576566588028-4147f3842f27',badge:'POPULAR',type:'featured'},
  {id:'utility-jacket',name:'The Utility Jacket',category:'New season · Cotton canvas',price:112,old:null,rating:'4.9',reviews:24,image:'photo-1551028719-00167b16eac5',badge:'NEW',type:'arrival'},
  {id:'soft-rib-top',name:'Soft Rib Everyday Top',category:'New season · Organic cotton',price:46,old:null,rating:'4.8',reviews:18,image:'photo-1564257577-7a9a6bb2d4c6',badge:'NEW',type:'arrival'},
  {id:'modern-overshirt',name:'Modern Overshirt',category:'New season · Brushed cotton',price:88,old:null,rating:'5.0',reviews:11,image:'photo-1591047139829-d91aecb6caea',badge:'NEW',type:'arrival'},
  {id:'weekender-trouser',name:'The Weekender Trouser',category:'New season · Cotton blend',price:76,old:null,rating:'4.9',reviews:31,image:'photo-1473966968600-fa801b869a1a',badge:'NEW',type:'arrival'},
  {id:'polo-uniform',name:'Everyday Team Polo',category:'Teamwear · Performance cotton',price:42,old:54,rating:'4.9',reviews:108,image:'photo-1625910513413-5fc4b45aa6b1',badge:'TOP RATED',type:'best'},
  {id:'tailored-trouser',name:'Tailored Work Trouser',category:'Workwear · Stretch twill',price:79,old:null,rating:'4.8',reviews:86,image:'photo-1594633312681-425c7b97ccd1',badge:'',type:'best'},
  {id:'kids-school-set',name:'Kids’ School Set',category:'School uniform · Cotton blend',price:64,old:80,rating:'4.9',reviews:92,image:'photo-1503454537195-1dcabb73ffb9',badge:'−20%',type:'best'},
  {id:'team-track',name:'Performance Track Set',category:'Sports uniform · Quick-dry',price:86,old:null,rating:'4.8',reviews:57,image:'photo-1517466787929-bc90951d0974',badge:'POPULAR',type:'best'}
];
const money = amount => `$${Number(amount).toFixed(2)}`;
const imageUrl = (id, width=650) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const cartKey = 'richhub-cart-v1';
const wishKey = 'richhub-wishlist-v1';
let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
let wishlist = JSON.parse(localStorage.getItem(wishKey) || '[]');
let toastTimer;

function productCard(product) {
  return `<article class="product-card" data-product="${product.id}">
    <div class="product-image"><img src="${imageUrl(product.image)}" alt="${product.name}" loading="lazy">
      ${product.badge ? `<span class="product-badge ${product.badge.includes('−')?'sale':product.badge==='NEW'?'new':''}">${product.badge}</span>`:''}
      <button class="heart-button ${wishlist.includes(product.id)?'selected':''}" data-wish="${product.id}" aria-label="${wishlist.includes(product.id)?'Remove from':'Add to'} wishlist">${wishlist.includes(product.id)?'♥':'♡'}</button>
    </div><div class="product-info"><div class="product-title-row"><h3 class="product-title">${product.name}</h3><span class="rating">★ ${product.rating} <span>(${product.reviews})</span></span></div>
    <p class="product-category">${product.category}</p><div class="product-bottom"><span class="product-price">${money(product.price)}${product.old?`<span class="old-price">${money(product.old)}</span>`:''}</span><button class="add-button" data-add="${product.id}">Add to bag&nbsp; +</button></div></div></article>`;
}
function renderProducts() {
  document.querySelector('#featured-grid').innerHTML = products.filter(p=>p.type==='featured').map(productCard).join('');
  document.querySelector('#arrival-grid').innerHTML = products.filter(p=>p.type==='arrival').map(productCard).join('');
  document.querySelector('#bestseller-grid').innerHTML = products.filter(p=>p.type==='best').map(productCard).join('');
  updateCounts();
}
function saveCart(){localStorage.setItem(cartKey,JSON.stringify(cart));renderCart()}
function updateCounts(){
  const count=cart.reduce((sum,line)=>sum+line.qty,0);
  document.querySelector('.cart-count').textContent=count;
  document.querySelector('.wishlist-count').textContent=wishlist.length;
  document.querySelector('.drawer-count').textContent=`(${count})`;
}
function renderCart(){
  const target=document.querySelector('.cart-items');
  const empty=document.querySelector('.cart-empty');
  const items=cart.map(line=>{const p=products.find(item=>item.id===line.id);return p?`<div class="cart-line"><img src="${imageUrl(p.image,160)}" alt=""><div><strong>${p.name}</strong><small>${money(p.price)} · Qty ${line.qty}</small><button data-remove="${p.id}">Remove</button></div><strong>${money(p.price*line.qty)}</strong></div>`:''}).join('');
  target.innerHTML=items;
  empty.style.display=cart.length?'none':'block';
  document.querySelector('.cart-subtotal').textContent=money(cart.reduce((sum,line)=>{const p=products.find(item=>item.id===line.id);return sum+(p?p.price*line.qty:0)},0));
  updateCounts();
}
function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2300)}
function openCart(){document.querySelector('.cart-overlay').classList.add('open');document.querySelector('.cart-overlay').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeCart(){document.querySelector('.cart-overlay').classList.remove('open');document.querySelector('.cart-overlay').setAttribute('aria-hidden','true');document.body.style.overflow=''}
renderProducts();renderCart();

document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');
  if(add){const id=add.dataset.add;const existing=cart.find(line=>line.id===id);existing?existing.qty++:cart.push({id,qty:1});saveCart();toast('Added to your bag');return}
  const wish=event.target.closest('[data-wish]');
  if(wish){const id=wish.dataset.wish;wishlist.includes(id)?wishlist=wishlist.filter(item=>item!==id):wishlist.push(id);localStorage.setItem(wishKey,JSON.stringify(wishlist));renderProducts();toast(wishlist.includes(id)?'Saved to your wishlist':'Removed from wishlist');return}
  const remove=event.target.closest('[data-remove]');
  if(remove){cart=cart.filter(line=>line.id!==remove.dataset.remove);saveCart();return}
});
document.querySelector('.cart-button').addEventListener('click',openCart);
document.querySelector('.close-cart').addEventListener('click',closeCart);
document.querySelector('.cart-overlay').addEventListener('click',event=>{if(event.target===event.currentTarget)closeCart()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart()});
document.querySelector('.checkout-button').addEventListener('click',()=>{
  if(!cart.length){toast('Your bag is empty');return}
  const count=cart.reduce((sum,line)=>sum+line.qty,0);
  document.querySelector('.checkout-summary').textContent=`${count} ${count===1?'item':'items'} · ${document.querySelector('.cart-subtotal').textContent} subtotal`;
  document.querySelector('.checkout-overlay').classList.add('open');
  document.querySelector('.checkout-overlay').setAttribute('aria-hidden','false');
});
function closeCheckout(){document.querySelector('.checkout-overlay').classList.remove('open');document.querySelector('.checkout-overlay').setAttribute('aria-hidden','true')}
document.querySelector('.checkout-close').addEventListener('click',closeCheckout);
document.querySelector('.checkout-overlay').addEventListener('click',event=>{if(event.target===event.currentTarget)closeCheckout()});
document.querySelector('#checkout-form').addEventListener('submit',event=>{
  event.preventDefault();
  const orderId=`RH-${Date.now().toString().slice(-7)}`;
  cart=[];saveCart();event.currentTarget.reset();closeCheckout();closeCart();
  toast(`Order ${orderId} placed. Thank you for shopping RICHHUB!`);
});
document.querySelector('.wishlist-button').addEventListener('click',()=>{
  const saved=products.filter(product=>wishlist.includes(product.id));
  if(!saved.length){toast('Your wishlist is empty');return}
  toast(`You have ${saved.length} saved ${saved.length===1?'item':'items'}`);
});
document.querySelector('.slider-next').addEventListener('click',()=>document.querySelector('.arrival-track').scrollBy({left:300,behavior:'smooth'}));
document.querySelector('.slider-prev').addEventListener('click',()=>document.querySelector('.arrival-track').scrollBy({left:-300,behavior:'smooth'}));
document.querySelector('.menu-toggle').addEventListener('click',event=>{
  const nav=document.querySelector('.main-nav');const isOpen=nav.classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.main-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false')}));
document.querySelector('.search-box').addEventListener('submit',event=>{
  event.preventDefault();const query=event.currentTarget.querySelector('input').value.trim().toLowerCase();
  if(!query)return;
  const match=products.find(product=>`${product.name} ${product.category}`.toLowerCase().includes(query));
  if(match){document.querySelector(`[data-product="${match.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});toast(`Showing ${match.name}`)}else toast('No matching styles found. Try “shirt” or “uniform”.');
});
document.querySelector('#newsletter-form').addEventListener('submit',event=>{
  event.preventDefault();const email=event.currentTarget.querySelector('input').value.trim();
  document.querySelector('.newsletter-message').textContent=`Thanks for joining us, ${email}.`;event.currentTarget.reset();
});
document.querySelector('#quote-form').addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(event.currentTarget);const quantity=data.get('quantity');const fabric=data.get('fabric');
  document.querySelector('.form-message').textContent=`Thanks! Your ${quantity}-piece ${fabric.toLowerCase()} quote request is ready. Our team will be in touch.`;event.currentTarget.reset();
});
