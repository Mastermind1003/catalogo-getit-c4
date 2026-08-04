const $ = s => document.querySelector(s);
const clp = new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });
let CAT = null, termino = '';

async function init(){
  CAT = await (await fetch('/api/catalogo')).json();
  $('#buscar').addEventListener('input', e => { termino = e.target.value.trim().toLowerCase(); router(); });
  window.addEventListener('hashchange', router);
  router();
}
function router(){
  if (termino.length >= 2) return renderBusqueda();
  const m = location.hash.match(/^#\/categoria\/(.+)$/);
  if (m){ const c = CAT.categorias.find(x => x.id === m[1]); if (c) return renderCategoria(c); }
  renderHome();
}
function renderHome(){
  $('#main').innerHTML = `<h2 class="titulo-cat">Categorías</h2><div class="grid-cats">` +
    CAT.categorias.map(c => `<a class="cat-btn" href="#/categoria/${c.id}">
      <span class="icono">${c.icono}</span><span class="titulo">${c.titulo}</span>
      <span class="count">${c.productos.length} ofertas</span></a>`).join('') + `</div>`;
}
function tarjeta(p, cat, icono){
  return `<article class="card">
    <div class="foto">${p.img ? `<img src="img/${p.img}" alt="${p.nombre}" onerror="this.outerHTML='<span class=emoji>${icono||'🛒'}</span>'">` : `<span class="emoji">${icono||'🛒'}</span>`}</div>
    <div class="cuerpo">
      ${cat ? `<span class="meta" style="color:var(--rojo);font-weight:600">${cat}</span>` : ''}
      <h3>${p.nombre}</h3>
      <div class="precio">${clp.format(p.precio)}</div>
      <div class="ref">Precio referencia <s>${clp.format(p.referencia)}</s></div>
      <span class="badge">Ahorro: ${clp.format(p.ahorro)}</span>
      <div class="meta">Vigencia: julio–agosto${p.digitar ? ` · Digitar: <b>${p.digitar}</b>` : ''}</div>
      <div class="meta">📍 ${p.sucursal || 'Todas las Sucursales'}</div>
    </div></article>`;
}
function renderCategoria(c){
  $('#main').innerHTML = `<a href="#" class="back">← VOLVER</a>
    <h2 class="titulo-cat">${c.icono} ${c.titulo}</h2>
    <div class="grid-prods">${c.productos.map(p => tarjeta(p, null, c.icono)).join('')}</div>`;
}
function renderBusqueda(){
  const res = [];
  CAT.categorias.forEach(c => c.productos.forEach(p => {
    if (p.nombre.toLowerCase().includes(termino)) res.push(tarjeta(p, c.titulo, c.icono));
  }));
  $('#main').innerHTML = `<h2 class="titulo-cat">Resultados (${res.length})</h2>
    <div class="grid-prods">${res.join('') || '<p>Sin resultados.</p>'}</div>`;
}
init();
