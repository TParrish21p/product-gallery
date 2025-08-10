'use strict';

// --- Data ---------------------------------------------------------------
const products = [
  {id:'p1', title:'Wireless Headphones', price:159, rating:4.7, category:'Audio', img:'https://picsum.photos/seed/p1/640/400', desc:'Over-ear, 30h battery.'},
  {id:'p2', title:'Bluetooth Speaker',   price:79,  rating:4.5, category:'Audio', img:'https://picsum.photos/seed/p2/640/400', desc:'Water-resistant mini speaker.'},
  {id:'p3', title:'4K Action Cam',       price:219, rating:4.2, category:'Cameras', img:'https://picsum.photos/seed/p3/640/400', desc:'Stabilized 4K60 video.'},
  {id:'p4', title:'Smartwatch',          price:249, rating:4.3, category:'Wearables', img:'https://picsum.photos/seed/p4/640/400', desc:'Heart rate + GPS.'},
  {id:'p5', title:'Mechanical Keyboard', price:99,  rating:4.6, category:'Computers', img:'https://picsum.photos/seed/p5/640/400', desc:'Hot-swap tactile switches.'},
  {id:'p6', title:'Ergonomic Mouse',     price:69,  rating:4.4, category:'Computers', img:'https://picsum.photos/seed/p6/640/400', desc:'Silent clicks + BT.'}
];

// --- DOM refs -----------------------------------------------------------
const $ = (s, el=document) => el.querySelector(s);
const grid   = $('#grid');
const empty  = $('#empty');
const y      = $('#y');
const status = $('#status');
const form   = $('#controls');
const catSel = $('#cat');
const maxInp = $('#max');
const priceOut = $('#priceOut');
const params = new URLSearchParams(location.search);

// --- Setup --------------------------------------------------------------
y.textContent = new Date().getFullYear();

// Inject categories
[...new Set(products.map(p => p.category))].forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = c;
  catSel.append(opt);
});

// Seed form from URL params
for (const [k,v] of params) {
  if (form.elements[k]) form.elements[k].value = v;
}
if (!params.has('max')) params.set('max', maxInp.value);
priceOut.textContent = `$${params.get('max')}`;

// --- Render -------------------------------------------------------------
function currency(n){ return `$${Number(n).toFixed(2)}`; }

function card(p){
  const article = document.createElement('article');
  article.className = 'card';
  article.setAttribute('role', 'listitem');
  article.innerHTML = `
    <img src="${p.img}" alt="${p.title}" loading="lazy" width="640" height="400">
    <div class="pad">
      <h2>${p.title}</h2>
      <div class="meta">
        <span class="price">${currency(p.price)}</span>
        <span class="rating" aria-label="Rating ${p.rating} out of 5">★ ${p.rating}</span>
      </div>
      <div class="meta">
        <span class="badge">${p.category}</span>
        <span class="muted">${p.desc}</span>
      </div>
    </div>`;
  return article;
}

function render(list){
  grid.innerHTML = '';
  grid.setAttribute('aria-busy', 'true');
  status.textContent = `Showing ${list.length} of ${products.length} products`;
  list.forEach(p => grid.append(card(p)));
  empty.hidden = list.length !== 0;
  grid.setAttribute('aria-busy', 'false');
}

// --- Filtering / Sorting ------------------------------------------------
function apply(){
  const q = (form.q.value || '').toLowerCase();
  const cat = form.cat.value;
  const sort = form.sort.value;
  const max = Number(form.max.value);

  let list = products.filter(p =>
    (cat === 'all' || p.category === cat) &&
    p.price <= max &&
    p.title.toLowerCase().includes(q)
  );

  switch (sort) {
    case 'price_asc':  list.sort((a,b)=> a.price - b.price); break;
    case 'price_desc': list.sort((a,b)=> b.price - a.price); break;
    case 'rating_desc':list.sort((a,b)=> b.rating - a.rating); break;
    default:           list.sort((a,b)=> (b.rating - a.rating) || (a.price - b.price));
  }

  // sync URL (shareable state)
  params.set('q', form.q.value);
  params.set('cat', cat);
  params.set('sort', sort);
  params.set('max', String(max));
  history.replaceState(null, '', '?' + params.toString());

  render(list);
}

// simple debounce for search typing
let t; form.q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 200); });
form.addEventListener('input', (e) => {
  if (e.target === maxInp) priceOut.textContent = `$${maxInp.value}`;
  if (e.target !== form.q) apply();
});
form.addEventListener('reset', () => {
  setTimeout(() => { // wait for native reset
    form.sort.value = 'relevance';
    form.cat.value = 'all';
    form.max.value = 300;
    priceOut.textContent = '$300';
    params.set('q',''); params.set('cat','all'); params.set('sort','relevance'); params.set('max','300');
    history.replaceState(null,'','?'+params.toString());
    apply();
  }, 0);
});

// initial render
apply();