/* ============================================================
   The Oliviata Catalog — shared client logic
   - global search index across the whole catalog
   - sidebar toggle (mobile)
   - glossary filtering
   - a few affectionate easter eggs
   ============================================================ */

// ---- Global search index (everything findable in one place) ----
const CATALOG_INDEX = [
  // Products
  { t: "Data Catalog", s: "The flagship. Metadata that makes data understandable, traceable & actionable.", ico: "📚", tag: "Product", url: "marketplace.html#data-catalog" },
  { t: "Data Governance Foundations", s: "From zero to a trusted, compliant, transparent data org.", ico: "🏛️", tag: "Product", url: "marketplace.html#governance-foundations" },
  { t: "Data Product Marketplace", s: "Self-service, domain-driven data products powering the data mesh.", ico: "🛍️", tag: "Product", url: "marketplace.html#marketplace" },
  { t: "PO Booster", s: "Turns Product Owners into data-product superheroes.", ico: "🚀", tag: "Product", url: "marketplace.html#po-booster" },
  { t: "Talk with Data", s: "Generative-AI layer — ask your data anything, in plain words.", ico: "🤖", tag: "Product", url: "marketplace.html#talk-with-data" },
  { t: "A Great Team", s: "Her finest build: a multidisciplinary crew that ships excellence.", ico: "💛", tag: "Product", url: "marketplace.html#great-team" },
  // Glossary
  { t: "Creativity", s: "A perpetual generator of innovative ideas. No rate limit.", ico: "💡", tag: "Term", url: "glossary.html#creativity" },
  { t: "Connection", s: "The art of building living links between people.", ico: "🔗", tag: "Term", url: "glossary.html#connection" },
  { t: "Elegance", s: "Schema-validated style. Saint Laurent by default.", ico: "👗", tag: "Term", url: "glossary.html#elegance" },
  { t: "Multiculturality", s: "A natively multi-source identity: 🇻🇳 🇫🇷 🇱🇧.", ico: "🌍", tag: "Term", url: "glossary.html#multiculturality" },
  { t: "Wanderlust", s: "A globally distributed presence. Low latency everywhere.", ico: "✈️", tag: "Term", url: "glossary.html#wanderlust" },
  { t: "Conviction", s: "The immutable primary key of her identity — stays true to herself.", ico: "✨", tag: "Term", url: "glossary.html#conviction" },
  { t: "Hospitality", s: "Event orchestration with five-star data quality.", ico: "🍽️", tag: "Term", url: "glossary.html#hospitality" },
  { t: "Smile", s: "Her documented source of truth and core strength.", ico: "😊", tag: "Term", url: "glossary.html#smile" },
  // Domains
  { t: "Domains", s: "The business & life domains Olivia has mastered.", ico: "🗂️", tag: "Page", url: "domains.html" },
  { t: "Data Governance", s: "Policies, principles & the Chief Data Steward herself.", ico: "⚖️", tag: "Page", url: "governance.html" },
  { t: "Kering", s: "Head of Metadata & Data Catalog — 5 years of impact.", ico: "🏢", tag: "Domain", url: "domains.html#kering" },
  { t: "Luxury Maisons", s: "Saint Laurent, Balenciaga, Gucci, Boucheron, BV...", ico: "💎", tag: "Domain", url: "domains.html#maisons" },
];

function escapeHtml(s){ return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function highlight(text, q){
  if(!q) return escapeHtml(text);
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if(i < 0) return escapeHtml(text);
  return escapeHtml(text.slice(0,i)) + '<em>' + escapeHtml(text.slice(i,i+q.length)) + '</em>' + escapeHtml(text.slice(i+q.length));
}

function initSearch(){
  const input = document.getElementById('catalogSearch');
  const box = document.getElementById('searchResults');
  if(!input || !box) return;
  let sel = -1, items = [];

  function render(q){
    const query = q.trim();
    if(!query){ box.classList.remove('show'); return; }
    const matches = CATALOG_INDEX.filter(x =>
      (x.t + ' ' + x.s + ' ' + x.tag).toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    if(matches.length === 0){
      box.innerHTML = '<div class="sr-empty">No results — but Olivia would say: every gap is just an undocumented opportunity. ✨</div>';
      box.classList.add('show'); items = []; sel = -1; return;
    }
    box.innerHTML = matches.map((m,i) =>
      `<a class="sr-item${i===0?' sel':''}" href="${m.url}">
         <span class="sr-ico">${m.ico}</span>
         <span>
           <div class="sr-title">${highlight(m.t, query)}</div>
           <div class="sr-sub">${escapeHtml(m.s)}</div>
         </span>
         <span class="sr-tag">${m.tag}</span>
       </a>`).join('');
    box.classList.add('show');
    items = [...box.querySelectorAll('.sr-item')]; sel = 0;
  }

  function move(d){
    if(!items.length) return;
    items[sel]?.classList.remove('sel');
    sel = (sel + d + items.length) % items.length;
    items[sel]?.classList.add('sel');
    items[sel]?.scrollIntoView({block:'nearest'});
  }

  input.addEventListener('input', e => render(e.target.value));
  input.addEventListener('keydown', e => {
    if(e.key === 'ArrowDown'){ e.preventDefault(); move(1); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); move(-1); }
    else if(e.key === 'Enter'){ if(items[sel]) window.location.href = items[sel].getAttribute('href'); }
    else if(e.key === 'Escape'){ box.classList.remove('show'); }
  });
  document.addEventListener('click', e => { if(!box.contains(e.target) && e.target !== input) box.classList.remove('show'); });
  // "/" focuses search
  document.addEventListener('keydown', e => {
    if(e.key === '/' && document.activeElement !== input){ e.preventDefault(); input.focus(); }
  });
}

// ---- Sidebar toggle (mobile) ----
function initSidebar(){
  const btn = document.getElementById('menuBtn');
  const sb = document.getElementById('sidebar');
  if(btn && sb){ btn.addEventListener('click', () => sb.classList.toggle('open')); }
}

// ---- Glossary filtering ----
function initGlossary(){
  const chips = document.querySelectorAll('[data-filter]');
  const terms = document.querySelectorAll('.term[data-class]');
  if(!chips.length) return;
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    terms.forEach(t => {
      t.style.display = (f === 'all' || t.dataset.class === f) ? '' : 'none';
    });
  }));
}

// ---- Easter eggs / winks ----
function toast(msg){
  let el = document.getElementById('eggToast');
  if(!el){ el = document.createElement('div'); el.id = 'eggToast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 4200);
}

function initEasterEggs(){
  // Click the brand mark -> rotating Olivia-isms
  const mark = document.querySelector('.brand-mark');
  const winks = [
    "Métadonnée du jour : tu es la source de vérité. ✨",
    "Sourire détecté — qualité des données : 100%. 😊",
    "Nouvelle robe Saint Laurent indexée dans le catalogue. 👗",
    "Lineage tracé : de Hô Chi Minh à Paris, en passant par le monde. 🌍",
    "Aimer plus, donner plus, recommencer. — gouvernance approuvée. 💛",
    "Idée innovante n°"+ (Math.floor(Math.random()*9000)+1000) +" générée automatiquement. 💡",
  ];
  let i = 0;
  if(mark){ mark.style.cursor = 'pointer'; mark.addEventListener('click', () => { toast(winks[i % winks.length]); i++; }); }

  // Konami-lite: type "olivia"
  let buf = '';
  document.addEventListener('keydown', e => {
    if(e.key.length === 1) buf = (buf + e.key.toLowerCase()).slice(-6);
    if(buf === 'olivia'){ toast("👑 Chief Data Steward mode unlocked. Merci pour tout, Olivia !"); buf=''; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initSidebar();
  initGlossary();
  initEasterEggs();
});
