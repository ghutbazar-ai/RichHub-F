/* Shared catalog, product templates, shop filtering, and sorting. */
(() => {
  const raw=[
    ['linen-shirt','Everyday Linen Shirt','Men','Natural linen',68,86,'4.9',128,'photo-1598033129183-c4f50c736f10','featured,bestseller'],
    ['studio-dress','Studio Midi Dress','Women','Cotton poplin',94,118,'4.8',96,'photo-1515886657613-9f3515b0c78f','featured,new'],
    ['school-blazer','Classic School Blazer','Uniform','Easy-care twill',72,null,'4.9',74,'photo-1503919005314-30d93d07d823','featured,bestseller'],
    ['weekend-knit','Weekend Cotton Knit','Men','Organic cotton',58,null,'4.7',62,'photo-1576566588028-4147f3842f27','featured'],
    ['utility-jacket','The Utility Jacket','Men','Cotton canvas',112,null,'4.9',24,'photo-1551028719-00167b16eac5','new'],
    ['soft-rib-top','Soft Rib Everyday Top','Women','Organic cotton',46,null,'4.8',18,'photo-1564257577-7a9a6bb2d4c6','new'],
    ['modern-overshirt','Modern Overshirt','Men','Brushed cotton',88,null,'5.0',11,'photo-1591047139829-d91aecb6caea','new'],
    ['weekender-trouser','The Weekender Trouser','Women','Cotton blend',76,null,'4.9',31,'photo-1473966968600-fa801b869a1a','new'],
    ['team-polo','Everyday Team Polo','Sports','Performance cotton',42,54,'4.9',108,'photo-1625910513413-5fc4b45aa6b1','bestseller'],
    ['work-trouser','Tailored Work Trouser','Uniform','Stretch twill',79,null,'4.8',86,'photo-1594633312681-425c7b97ccd1','bestseller'],
    ['kids-uniform','Kids’ School Set','Kids','Cotton blend',64,80,'4.9',92,'photo-1503454537195-1dcabb73ffb9','bestseller'],
    ['track-set','Performance Track Set','Sports','Quick-dry fabric',86,null,'4.8',57,'photo-1517466787929-bc90951d0974','bestseller']
  ];
  const catalog=raw.map(([id,name,category,material,price,old,rating,reviews,image,tags])=>({id,name,category,material,price,old,rating,reviews,image,tags:tags.split(',')}));
  const photo=(id,width=650)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
  const money=n=>`$${Number(n).toFixed(2)}`;
  function card(p){return `<article class="product-card" data-product="${p.id}"><div class="product-photo"><a href="product-details.html?id=${p.id}" aria-label="View ${p.name}"><img src="${photo(p.image)}" loading="lazy" alt="${p.name}"></a>${p.old?'<span class="product-badge sale">SALE</span>':p.tags.includes('new')?'<span class="product-badge">NEW</span>':''}<div class="product-actions"><button type="button" data-wishlist="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button></div><button class="quick-view-button" type="button" data-quick-view="${p.id}">QUICK VIEW</button></div><div class="product-info"><h3><a href="product-details.html?id=${p.id}">${p.name}</a></h3><p class="product-meta">${p.category} · ${p.material}</p><div class="product-price-row"><span class="product-price">${money(p.price)}${p.old?`<del class="old-price">${money(p.old)}</del>`:''}</span><span class="product-rating">★ ${p.rating}</span></div><div class="product-price-row" style="margin-top:9px"><span></span><button class="add-cart" data-add-cart="${p.id}">ADD TO BAG +</button></div></div></article>`}
  function renderAll(){
    document.querySelectorAll('[data-products]').forEach(target=>{
      const type=target.dataset.products;
      if(type==='shop'){renderShop();return}
      let list=type==='new'?catalog.filter(p=>p.tags.includes('new')):type==='bestseller'?catalog.filter(p=>p.tags.includes('bestseller')):catalog.filter(p=>p.tags.includes('featured'));
      target.innerHTML=list.map(card).join('');
    });
    renderDetail();
  }
  function renderShop(){
    const target=document.querySelector('[data-products="shop"]');if(!target)return;
    const params=new URLSearchParams(location.search);const activeCats=[...document.querySelectorAll('[data-filter="category"]:checked')].map(x=>x.value);const requested=params.get('category');const cats=activeCats.length?activeCats:requested?[requested]:[];const searchTerm=params.get('q')?.toLowerCase()||'';const tag=params.get('tag');const price=document.querySelector('[name="price"]:checked')?.value||'all';const sort=document.querySelector('#sort-products')?.value||'featured';
    let list=catalog.filter(p=>(!cats.length||cats.includes(p.category)||cats.includes('Uniform')&&p.category==='Uniform')&&(!searchTerm||`${p.name} ${p.category} ${p.material}`.toLowerCase().includes(searchTerm))&&(!tag||tag==='new'&&p.tags.includes('new')||tag==='sale'&&p.old)&& (price==='all'||price==='under75'&&p.price<75||price==='75to100'&&p.price>=75&&p.price<=100||price==='over100'&&p.price>100));
    if(sort==='price-asc')list.sort((a,b)=>a.price-b.price);if(sort==='price-desc')list.sort((a,b)=>b.price-a.price);if(sort==='rating')list.sort((a,b)=>Number(b.rating)-Number(a.rating));
    target.innerHTML=list.map(card).join('');const count=document.querySelector('.result-count');if(count)count.textContent=`${list.length} styles`;const empty=document.querySelector('.no-results');if(empty)empty.hidden=Boolean(list.length);
  }
  function renderDetail(){
    const root=document.querySelector('#product-detail');if(!root)return;
    const id=new URLSearchParams(location.search).get('id')||catalog[0].id;const p=catalog.find(x=>x.id===id)||catalog[0];
    root.innerHTML=`<div class="detail-gallery"><div class="thumb-list">${[p.image,'photo-1483985988355-763728e1935b','photo-1529139574466-a303027c1d8b'].map((im,i)=>`<button class="${i===0?'active':''}" data-gallery="${im}" aria-label="Show product image ${i+1}"><img src="${photo(im,150)}" alt=""></button>`).join('')}</div><img class="detail-main-image" src="${photo(p.image,1000)}" alt="${p.name}"></div><div class="detail-info"><p class="eyebrow">${p.category.toUpperCase()} · RICHHUB ESSENTIALS</p><h1>${p.name}</h1><span class="detail-rating">★★★★★ &nbsp; ${p.rating} (${p.reviews} reviews)</span><p class="detail-price">${money(p.price)} ${p.old?`<del>${money(p.old)}</del>`:''}</p><p class="detail-description">A considered everyday essential in ${p.material.toLowerCase()}. Thoughtful details, an easy fit, and comfort made to last. Designed to move with you, season after season.</p><span class="variant-label">Color: <span class="selected-color">Navy</span></span><div class="color-options"><button class="color-option selected" data-color="Navy" aria-label="Navy"><span style="--swatch:#17253b"></span></button><button class="color-option" data-color="Ivory" aria-label="Ivory"><span style="--swatch:#e8dfcf"></span></button><button class="color-option" data-color="Black" aria-label="Black"><span style="--swatch:#222"></span></button></div><span class="variant-label">Size: <span class="selected-size">Choose a size</span></span><div class="size-options">${['XS','S','M','L','XL','XXL'].map(size=>`<button class="size-option" data-size="${size}">${size}</button>`).join('')}</div><div class="quantity-row"><div class="quantity-control"><button data-quantity="-1" aria-label="Decrease quantity">−</button><input type="number" value="1" min="1" aria-label="Quantity"><button data-quantity="1" aria-label="Increase quantity">+</button></div><button class="button gold detail-add" data-detail-add="${p.id}">Add to bag · ${money(p.price)}</button><button class="tool-button" data-wishlist="${p.id}" aria-label="Add to wishlist">♡</button></div><div class="detail-service"><span>Complimentary shipping over $100</span><span>Easy returns within 30 days</span><span>Secure checkout</span></div></div>`;
    const crumb=document.querySelector('[data-detail="name"]');if(crumb)crumb.textContent=p.name;document.title=`${p.name} | RICHHUB`;
  }
  window.RICHHUB={catalog,photo,money,card,renderAll,renderShop,renderDetail};
})();
