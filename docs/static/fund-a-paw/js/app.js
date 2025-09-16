// app.js — shared behavior/renderers for all pages
window.FAP = window.FAP || {};

// Tiny helpers
FAP.$  = (sel, root=document) => root.querySelector(sel);
FAP.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
FAP.qs = (k) => new URLSearchParams(location.search).get(k);

/* ---------- path + link helpers that work from both index.html and templates/ ---------- */
const IS_TEMPLATES = location.pathname.includes('/templates/');
const ROOT = IS_TEMPLATES ? '../../' : './';
const resolve = (p) => (p && p.startsWith('./') ? ROOT + p.slice(2) : (p || ''));

const toAnimalsList     = () => (IS_TEMPLATES ? './animals.html'            : `${ROOT}templates/fund-a-paw/animals.html`);
const toAnimalsDetail   = (id) => (IS_TEMPLATES ? `./animals.html?animal=${encodeURIComponent(id)}`
                                               : `${ROOT}templates/fund-a-paw/animals.html?animal=${encodeURIComponent(id)}`);

const toSheltersList    = () => (IS_TEMPLATES ? './shelters.html'           : `${ROOT}templates/fund-a-paw/shelters.html`);
const toShelterDetail   = (id) => (IS_TEMPLATES ? `./shelters.html?shelter=${encodeURIComponent(id)}`
                                               : `${ROOT}templates/fund-a-paw/shelters.html?shelter=${encodeURIComponent(id)}`);

const toNeedDetail      = (id) => (IS_TEMPLATES ? `./donate.html?need=${encodeURIComponent(id)}`
                                               : `${ROOT}templates/fund-a-paw/donate.html?need=${encodeURIComponent(id)}`);
const toDonateForAnimal = (id) => (IS_TEMPLATES ? `./donate.html?animal=${encodeURIComponent(id)}`
                                               : `${ROOT}templates/fund-a-paw/donate.html?animal=${encodeURIComponent(id)}`);

// Resolve a possibly-relative asset path to the right place whether
// you are serving /docs or /docs/templates/fund-a-paw/.
function faResolveAsset(p, fallback) {
  if (!p) return fallback;
  if (/^(https?:)?\/\//i.test(p) || /^data:/i.test(p)) return p;
  return prefix + p.replace(/^\.?\/*/, ''); // prefix is the one you already have
}
const faToShelterHash = (id) => `shelters.html#${encodeURIComponent(id)}`;
const faToAnimal      = (id) => `${PAGES}animal.html?animal=${encodeURIComponent(id)}`;
const faToDonate      = (aid, sid) =>
  `${PAGES}donate.html?animal=${encodeURIComponent(aid)}&shelter=${encodeURIComponent(sid||'')}`;



// ---------- Home renderers (moved from index.html) ----------
FAP.currentShelterId = null;

FAP.showSection = (sectionId) => {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  FAP.$(`#${sectionId}`)?.classList.remove("hidden");
};

FAP.renderUrgentShelterNeeds = () => {
  const urgentRoot = FAP.$("#urgent-shelter-needs-section");
  if (!urgentRoot) return;

  const needs = FAP.shelterNeeds || [];
  if (!needs.length) { urgentRoot.innerHTML = ""; return; }

  urgentRoot.innerHTML = `
    <div class="mt-8 pt-8 border-t-4 border-orange-500 bg-orange-50 rounded-xl p-6 shadow-lg">
      <h3 class="text-2xl font-bold mb-4 text-orange-600">Urgent Shelter Needs</h3>
      <p class="text-gray-600 mb-6">These needs are essential for our partner shelters. Your support keeps doors open and animals cared for.</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        ${needs.map(n => {
          const s = (FAP.shelters || []).find(x => x.id === n.shelterId);
          return `
            <article class="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition cursor-pointer border-4 border-orange-500"
                     onclick="FAP.showShelterDetails('${n.shelterId}')">
              <img src="${n.image}" alt="${n.title}" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h3 class="font-bold text-2xl mb-2">${n.title}</h3>
                <p class="text-gray-600 text-sm mb-4">For: ${s?.name || "Shelter"}</p>
                <p class="text-gray-700">${n.description}</p>
                <a href="donate.html?shelter=${encodeURIComponent(n.shelterId)}" class="btn-primary block w-full mt-4 text-center">Help with this need</a>
              </div>
            </article>`;
        }).join("")}
      </div>
    </div>`;
};

FAP.renderUrgentAnimals = () => {
  const root = FAP.$("#urgent-needs-section");
  if (!root) return;

  const urgent = (FAP.shelters || []).flatMap(s =>
    (s.animals || []).filter(a => a.urgent).map(a => ({...a, shelterName: s.name, shelterId: s.id}))
  );

  if (!urgent.length) { root.innerHTML = ""; return; }

  root.innerHTML = `
    <div class="mt-8 pt-8 border-t-4 border-red-500 bg-red-50 rounded-xl p-6 shadow-lg">
      <h3 class="text-2xl font-bold mb-4 text-red-600">Urgent Animal Needs</h3>
      <p class="text-gray-600 mb-6">These animals require immediate support for critical care.</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        ${urgent.map(a => `
          <article class="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition cursor-pointer border-4 border-red-500"
                   onclick="FAP.showAnimalDetail('${a.id}','${a.shelterId}')">
            <img src="${a.image}" alt="${a.name}" class="w-full h-64 object-cover" />
            <div class="p-6">
              <h3 class="font-bold text-2xl mb-2">${a.name}</h3>
              <p class="text-gray-600 text-sm mb-4">From: ${a.shelterName}</p>
              <p class="text-gray-700">${(a.bio||"").slice(0,100)}...</p>
              <a class="btn-primary block w-full mt-4 text-center" href="donate.html?animal=${a.id}&shelter=${a.shelterId}">Help ${a.name}</a>
            </div>
          </article>`).join("")}
      </div>
    </div>`;
};

FAP.renderShelterCards = () => {
  const grid = FAP.$("#shelter-grid");
  if (!grid) return;
  grid.innerHTML = (FAP.shelters || []).map(s => `
    <article class="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition cursor-pointer"
             onclick="FAP.showShelterDetails('${s.id}')">
      <img src="${s.image}" alt="${s.name}" class="w-full h-48 object-cover" />
      <div class="p-6">
        <h3 class="font-bold text-2xl mb-2">${s.name}</h3>
        <p class="text-gray-700">${(s.bio||"").slice(0,100)}...</p>
      </div>
    </article>`).join("");

  FAP.showSection("shelters-list");
};

FAP.showShelterDetails = (shelterId) => {
  FAP.currentShelterId = shelterId;
  const s = (FAP.shelters || []).find(x => x.id === shelterId);
  if (!s) return;

  const detail = FAP.$("#shelter-detail-content");
  if (!detail) return;

  const types = ["All", ...new Set((s.animals||[]).map(a => a.type))];
  const filterBtns = types.map(t =>
    `<button class="filter-btn" onclick="FAP.filterAnimals('${shelterId}','${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`
  ).join("");

  detail.innerHTML = `
    <div class="flex flex-col md:flex-row gap-8 items-center mb-12">
      <img src="${s.image}" alt="${s.name}" class="w-24 h-24 rounded-full shadow-md" />
      <div>
        <h2 class="text-3xl font-bold mb-2">${s.name}</h2>
        <p class="text-gray-700">${s.bio || ""}</p>
        <div class="mt-4 text-gray-600">
          <h4 class="font-bold">Contact:</h4>
          <p><strong>Name:</strong> ${s.contactName||"-"}</p>
          <p><strong>Email:</strong> <a class="text-blue-500 underline" href="mailto:${s.contactEmail||''}">${s.contactEmail||''}</a></p>
          <p><strong>Phone:</strong> ${s.contactPhone||"-"}</p>
        </div>
      </div>
    </div>
    <h3 class="text-2xl font-bold text-center mb-4">Animals from ${s.name}</h3>
    <div class="flex flex-wrap gap-4 justify-center mb-8">${filterBtns}</div>
    <div id="filtered-animal-grid" class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>`;

  FAP.showSection("shelter-details");
  FAP.filterAnimals(shelterId, "All");
};

FAP.filterAnimals = (shelterId, type) => {
  const s = (FAP.shelters || []).find(x => x.id === shelterId);
  if (!s) return;

  const animals = type === "All" ? (s.animals||[]) : (s.animals||[]).filter(a => a.type === type);
  const grid = FAP.$("#filtered-animal-grid");
  if (!grid) return;

  grid.innerHTML = animals.length ? animals.map(a => `
    <article class="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition cursor-pointer"
             onclick="FAP.showAnimalDetail('${a.id}','${shelterId}')">
      <img src="${a.image}" alt="${a.name}" class="w-full h-64 object-cover" />
      <div class="p-6">
        <h3 class="font-bold text-2xl mb-2">${a.name}</h3>
        <p class="text-gray-600 text-sm mb-4">${s.name}</p>
        <p class="text-gray-700">${(a.bio||"").slice(0,100)}...</p>
        <a class="btn-primary block w-full mt-4 text-center" href="donate.html?animal=${a.id}&shelter=${shelterId}">Help ${a.name}</a>
      </div>
    </article>`).join("")
    : `<div class="p-6 col-span-full bg-white rounded-xl shadow-lg text-center text-gray-500">
         There are no ${type}s listed for this shelter at the moment. Check back soon!
       </div>`;

  // toggle active button
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  FAP.$(`[onclick="FAP.filterAnimals('${shelterId}', '${type}')"]`)?.classList.add("active");
};

FAP.showAnimalDetail = (animalId, shelterId) => {
  const s = (FAP.shelters||[]).find(x => x.id === shelterId);
  const a = s?.animals?.find(x => x.id === animalId);
  if (!s || !a) return;

  const root = FAP.$("#animal-detail-content");
  if (!root) return;

  const updates = (a.updates||[]).length
    ? `<div class="mt-8 pt-8 border-t border-gray-200">
         <h3 class="text-2xl font-bold mb-4">Progress Updates</h3>
         ${(a.updates||[]).map(u => `
            <div class="bg-gray-50 p-6 rounded-lg mb-6">
              <p class="text-gray-500 text-sm font-semibold mb-2">${u.date}</p>
              ${u.image ? `<img src="${u.image}" alt="Update for ${a.name}" class="w-full h-auto rounded-lg mb-4" />` : ""}
              <p class="text-gray-700">${u.text}</p>
            </div>`).join("")}
       </div>`
    : `<div class="mt-8 pt-8 border-t border-gray-200">
         <h3 class="text-2xl font-bold mb-4">Progress Updates</h3>
         <p class="text-gray-500">Check back later for updates on ${a.name}!</p>
       </div>`;

  const urgent = a.urgent ? `<div class="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-center mb-4">URGENT NEED</div>` : "";

  root.innerHTML = `
    ${urgent}
    <div class="flex flex-col md:flex-row gap-8">
      <img src="${a.image}" alt="${a.name}" class="w-full md:w-1/2 h-auto rounded-lg shadow-md" />
      <div class="w-full md:w-1/2">
        <h2 class="text-3xl font-bold mb-2">${a.name}</h2>
        <p class="text-gray-600 text-lg mb-4">${s.name}</p>
        <p class="text-gray-700 leading-relaxed">${a.bio}</p>
        <div class="mt-6 flex gap-4">
          <a class="btn-primary flex-grow text-center" href="donate.html?animal=${a.id}&shelter=${s.id}">Donate to help ${a.name}</a>
        </div>
      </div>
    </div>
    ${updates}`;

  FAP.showSection("animal-details");
};

FAP.showShelterFromAnimal = () => FAP.showShelterDetails(FAP.currentShelterId);

// ---------- Partners & other pages (cleaned paths) ----------
FAP.renderPartners = () => {
  const root = FAP.$('#partners-list') || FAP.$('#partners-grid');
  if(!root) return;
  root.innerHTML = (FAP.partners || FAP.shelters || []).map(s => `
    <article class="card overflow-hidden">
      <img src="${s.image}" alt="${s.name}" class="w-full h-40 object-cover" />
      <div class="p-4">
        <h3 class="font-bold">${s.name}</h3>
        <p class="text-sm text-gray-600">${s.bio || ""}</p>
       <a class="inline-block mt-3 underline font-semibold" href="shelters.html#${s.id}">View animals →</a>
      </div>
    </article>
  `).join('');
};

FAP.renderSheltersPage = () => {
  // Your original IDs & tab structure
  const grid   = document.getElementById('shelter-grid');           // ALL shelters
  const urgent = document.getElementById('urgent-shelter-grid');    // URGENT shelter needs
  const tabs   = Array.from(document.querySelectorAll('.tab'));
  const panels = {
    all: document.getElementById('tab-all'),
    'urgent-shelter': document.getElementById('tab-urgent-shelter'),
  };

  // --- Render "All Shelters" ---
  if (grid) {
    grid.innerHTML = (FAP.shelters || []).map(s => {
      const img = faResolveAsset(
        s.image || s.logo,
        IMG + 'placeholders/shelter-1.jpg'
      );
      return `
        <article id="${s.id}" class="card shelter-card" data-shelter="${s.id}">
          <a class="card__media" href="${faToShelterHash(s.id)}" aria-label="View ${s.name}">
            <img src="${img}" alt="${s.name}" class="w-full h-40 object-cover"
                 loading="lazy" onerror="this.src='${IMG}placeholders/shelter-1.jpg'">
          </a>
          <div class="p-4 card__body">
            <h3 class="font-bold text-lg">
              <a href="${faToShelterHash(s.id)}">${s.name}</a>
            </h3>
            <p class="text-sm text-gray-600">${s.bio || s.description || ""}</p>
            <a href="${faToShelterHash(s.id)}"
               class="inline-block mt-3 underline font-semibold">View animals →</a>
          </div>
        </article>`;
    }).join('');

    // Make whole shelter card clickable (except real links)
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.shelter-card');
      if (!card || e.target.closest('a')) return;
      location.hash = card.dataset.shelter;  // triggers hash router below
    });
  }

  // --- Render "Urgent Shelter Needs" ---
  if (urgent) {
    urgent.innerHTML = (FAP.shelterNeeds || []).map(n => {
      const s   = (FAP.shelters || []).find(x => x.id === n.shelterId);
      const img = faResolveAsset(n.image, IMG + 'placeholders/need-1.jpg');
      return `
        <article class="card border-2 border-orange-400 need-card">
          <a class="card__media" href="${PAGES}donate.html?need=${encodeURIComponent(n.id||'')}"
             aria-label="Help with ${n.title||'shelter need'}">
            <img src="${img}" alt="${n.title || 'Shelter need'}" class="w-full h-40 object-cover"
                 loading="lazy" onerror="this.src='${IMG}placeholders/need-1.jpg'">
          </a>
          <div class="p-4 card__body">
            <h3 class="font-bold">${n.title || 'Shelter need'}</h3>
            <p class="text-sm text-gray-600 mb-2">For: ${s?.name || "Shelter"}</p>
            <p class="text-gray-700">${n.description || n.summary || ''}</p>
            <a href="${PAGES}donate.html?need=${encodeURIComponent(n.id||'')}"
               class="btn-primary mt-3 inline-block">Help with this need</a>
          </div>
        </article>`;
    }).join('');
  }

  // --- Tab toggling (unchanged) ---
  function activateTab(key) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
    Object.entries(panels).forEach(([k, el]) => el?.classList.toggle('hidden', k !== key));
    document.getElementById('shelter-details')?.classList.add('hidden');
  }
  tabs.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    const key = t.dataset.tab;
    activateTab(key);
    if (history.pushState) history.pushState(null, "", `#${key}`);
  }));

  // --- Hash router (unchanged behavior) ---
  function handleHash() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!h || h === "all")            { activateTab('all'); return; }
    if (h === "urgent-shelter")       { activateTab('urgent-shelter'); return; }
    const s = (FAP.shelters || []).find(x => String(x.id) === h);
    if (s) {
      document.getElementById('shelter-details')?.classList.remove('hidden');
      document.getElementById('tab-all')?.classList.add('hidden');
      document.getElementById('tab-urgent-shelter')?.classList.add('hidden');
      FAP.showShelterDetails(h);
      return;
    }
    activateTab('all');
  }
  window.addEventListener('hashchange', handleHash);
  handleHash(); // initial
};



FAP.renderAnimalsPage = () => {
  // Tabs
  FAP.$$('.tab')?.forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    const t = el.dataset.tab;
    FAP.$$('.tab').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    FAP.$$('.tab-panel').forEach(p => p.classList.add('hidden'));
    FAP.$('#tab-' + t)?.classList.remove('hidden');
  }));

  const animalsAll = (FAP.shelters || []).flatMap(s => (s.animals||[]).map(a => ({...a, shelter: s})));
  const urgent = animalsAll.filter(a => a.urgent);
  const urgentRoot = FAP.$('#urgent-animals-grid');
  const allRoot = FAP.$('#animals-grid');

  const card = (a) => `
    <article class="card ${a.urgent ? 'border-2 border-red-400' : ''}">
      <img src="${a.image}" alt="${a.name}" class="w-full h-56 object-cover" />
      <div class="p-4">
        <h3 class="font-bold text-lg">${a.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${a.shelter.name}</p>
        <p class="text-gray-700">${a.bio}</p>
        <div class="mt-3 flex gap-2">
          <a href="donate.html?animal=${a.id}&shelter=${a.shelter.id}" class="btn-primary">Donate</a>
          <button class="px-3 py-1.5 border rounded" data-subscribe-animal="${a.id}" data-shelter="${a.shelter.id}">Get updates</button>
        </div>
      </div>
    </article>
  `;

  if(urgentRoot) urgentRoot.innerHTML = urgent.map(card).join('') || '<p>No urgent animals right now.</p>';
  if(allRoot) allRoot.innerHTML = animalsAll.map(card).join('');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-subscribe-animal]');
    if(btn){
      const animal = btn.dataset.subscribeAnimal;
      const shelter = btn.dataset.shelter;
      alert(`You’ll be subscribed to updates about ${animal.toUpperCase()} (shelter: ${shelter}).`);
    }
  });
};

FAP.renderDonate = () => {
  const rootShelters = FAP.$('#donate-shelters');
  const rootAnimals = FAP.$('#donate-animals');
  if(rootShelters) {
    rootShelters.innerHTML = (FAP.shelters||[]).map(s => `
      <div class="p-4 border rounded-lg flex items-center justify-between">
        <div>
          <div class="font-semibold">${s.name}</div>
          <div class="text-sm text-gray-600">${s.bio||""}</div>
        </div>
        <a href="#" data-checkout="shelter:${s.id}" class="btn-primary">Donate</a>
      </div>
    `).join('');
  }
  if(rootAnimals) {
    const animals = (FAP.shelters||[]).flatMap(s => (s.animals||[]).map(a => ({...a, shelter: s})));
    rootAnimals.innerHTML = animals.map(a => `
      <div class="p-4 border rounded-lg flex items-center justify-between">
        <div>
          <div class="font-semibold">${a.name}</div>
          <div class="text-sm text-gray-600">${a.shelter.name}</div>
        </div>
        <a href="#" data-checkout="animal:${a.shelter.id}:${a.id}" class="btn-primary">Donate</a>
      </div>
    `).join('');
  }
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-checkout]');
    if(link){
      const token = link.dataset.checkout;
      alert("This would redirect to secure checkout for: " + token);
      e.preventDefault();
    }
  });
};

// ---------- Shared nav helpers & partners preview ----------
FAP.initAuthToggle = () => {
  const has = !!localStorage.getItem('fap_auth_token');
  const show = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
  show('link-signup', !has);
  show('link-signup-mobile', !has);
  show('btn-logout', has);
  show('btn-logout-mobile', has);
  document.getElementById('btn-logout')?.addEventListener('click', () => { localStorage.removeItem('fap_auth_token'); location.reload(); });
  document.getElementById('btn-logout-mobile')?.addEventListener('click', () => { localStorage.removeItem('fap_auth_token'); location.reload(); });
};

FAP.initNavInteractions = () => {
  const btn = document.querySelector('.fap-menu__dropdown-btn');
  const group = document.querySelector('.fap-menu__group');
  if(btn && group && !btn.dataset.bound){
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      group.classList.toggle('show');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
    document.addEventListener('click', () => group.classList.remove('show'));
  }
  const burger = document.querySelector('.fap-burger');
  const mobile = document.getElementById('fap-mobile');
  if(burger && mobile && !burger.dataset.bound){
    burger.dataset.bound = '1';
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }
};

// Bigger, image-first partners carousel with captions
FAP.initPartnersCarousel = () => {
  const viewport = document.getElementById('partners-viewport');
  const track    = document.getElementById('partners-track');
  const btnPrev  = document.getElementById('partners-prev');
  const btnNext  = document.getElementById('partners-next');

  if (!viewport || !track || track.dataset.enhanced) return;
  track.dataset.enhanced = '1';

  // Resolve path to partners page no matter where we are
  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const partnersHref = prefix + 'templates/fund-a-paw/partners.html';

  // Build items from FAP.partners (fallback to shelters)
  const data = (FAP.partners && FAP.partners.length) ? FAP.partners : (FAP.shelters || []);
  track.innerHTML = data.map(s => `
    <li class="partner">
      <a class="partner__card" href="${partnersHref}#${s.id}" title="${s.name}">
        <img src="${s.image}" loading="lazy" alt="${s.name}"
             onerror="this.onerror=null;this.src='https://placehold.co/600x400/e5e7eb/666?text=${encodeURIComponent(s.name)}';" />
        <span class="partner__name">${s.name}</span>
      </a>
    </li>
  `).join('');

  // Duplicate for infinite loop
  const clones = track.innerHTML;
  track.insertAdjacentHTML('beforeend', clones);

  // Basic slider: show 3 at a time, slide one card at a time
  let index = 0;
  const item = () => track.querySelector('.partner');
  const itemW = () => (item()?.getBoundingClientRect().width || 320) + 24; // width + gap
  const maxIndex = () => Math.max(0, track.children.length / 2 - 3); // only real items count

  const go = (delta) => {
    index += delta;
    if (index < 0) {
      index = maxIndex();
      track.style.transition = 'none';
      track.style.transform = `translateX(-${itemW() * index}px)`;
      requestAnimationFrame(() => {
        // snap then animate back one step
        track.style.transition = '';
        index -= 1;
        track.style.transform = `translateX(-${itemW() * index}px)`;
      });
      return;
    }
    if (index > maxIndex()) index = 0;
    track.style.transform = `translateX(-${itemW() * index}px)`;
  };

  btnPrev?.addEventListener('click', () => go(-1));
  btnNext?.addEventListener('click', () => go(+1));

  // Autoplay every 5s
  let timer = setInterval(() => go(+1), 5000);
  [viewport, btnPrev, btnNext].forEach(el =>
    el?.addEventListener('mouseenter', () => clearInterval(timer)));
  [viewport, btnPrev, btnNext].forEach(el =>
    el?.addEventListener('mouseleave', () => timer = setInterval(() => go(+1), 5000)));
};


// ---------- Auto-run when DOM is ready ----------
document.addEventListener('DOMContentLoaded', () => {
  // Home page blocks (only render if present)
  FAP.renderUrgentShelterNeeds();
  FAP.renderUrgentAnimals();
  FAP.renderShelterCards();

  // Other pages
  FAP.renderPartners?.();
  FAP.renderSheltersPage?.();
  FAP.renderAnimalsPage?.();
  FAP.renderDonate?.();

  // Shared
  FAP.initAuthToggle();
  FAP.initNavInteractions();
  FAP.initPartnersCarousel();

  // Home subscribe form (if present)
  const sub = FAP.$('#subscribe-form'), note = FAP.$('#subscribe-msg');
  sub?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = new FormData(sub).get('email');
    console.log('Subscribe', email);
    note?.classList.remove('hidden');
    sub.reset();
  });
});


// ===== Impact strip =====
FAP.renderImpact = () => {
  const shelters = (FAP.shelters || []);
  const animals  = shelters.flatMap(s => s.animals || []);
  const nShelters = shelters.length || 53;        // fallback if empty
  const nAnimals  = animals.length  || 1842;      // fallback if empty
  const raised    = 210_000;                      // TODO: wire to real totals when available

  const elS = document.getElementById('impact-shelters');
  const elA = document.getElementById('impact-animals');
  const elR = document.getElementById('impact-raised');
  if (elS) elS.textContent = nShelters.toLocaleString();
  if (elA) elA.textContent = nAnimals.toLocaleString();
  if (elR) elR.textContent = `$${raised.toLocaleString()}`;
};

// ===== Featured urgent appeal (Buddy 67% default) =====
FAP.renderFeaturedUrgent = () => {
  const root = document.getElementById('featured-card');
  if (!root) return;

  const shelters = FAP.shelters || [];
  const animals  = shelters.flatMap(s => (s.animals || []).map(a => ({...a, shelter: s})));
  // Prefer 'buddy' → else any urgent → else first animal
  let a = animals.find(x => x.id === 'buddy') || animals.find(x => x.urgent) || animals[0];
  if (!a) { root.innerHTML = '<p>No appeals to show right now.</p>'; return; }

  // derive progress: fundedPct (0..1) OR raised/goal OR default .67
  let pct = typeof a.fundedPct === 'number' ? a.fundedPct
          : (a.raised && a.goal) ? (a.raised / a.goal)
          : 0.67;
  pct = Math.max(0, Math.min(1, pct));

  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const donateHref = `${prefix}templates/fund-a-paw/donate.html?animal=${encodeURIComponent(a.id)}&shelter=${encodeURIComponent(a.shelter.id)}`;

  root.innerHTML = `
    <article class="featured">
      <img src="${a.image}" alt="${a.name} from ${a.shelter.name}" loading="lazy" class="featured__img"
           onerror="this.onerror=null;this.src='https://placehold.co/1000x560/e5e7eb/666?text=${encodeURIComponent(a.name)}';" />
      <div class="featured__body">
        <h3 class="featured__title">${a.name} — surgery fund</h3>
        <p class="featured__text">${a.bio || 'This animal needs urgent care. Your gift helps immediately.'}</p>
        <div class="featured__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct*100)}">
          <span class="featured__fill" style="width:${(pct*100).toFixed(0)}%"></span>
        </div>
        <div class="featured__pct">${(pct*100).toFixed(0)}% funded</div>
        <a class="btn btn-primary mt-3 inline-block" href="${donateHref}">Donate to help ${a.name}</a>
      </div>
    </article>
  `;
};

// ===== Simple newsletter capture (footer) =====
FAP.initNewsletter = () => {
  const form = document.getElementById('newsletter-form');
  const msg  = document.getElementById('newsletter-msg');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = new FormData(form).get('email');
    console.log('Newsletter subscribe:', email);
    form.reset();
    msg?.classList.remove('hidden');
  });
};

// Urgent mini-grid on homepage
(function () {
  const el = document.getElementById('urgent-needs-minigrid');
  if (!el || !window.FAP || !Array.isArray(FAP.animals)) return;

  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const PAGES  = prefix + 'templates/fund-a-paw/';

  // Take first 4 urgent animals (or fewer if not enough)
  const urgent = FAP.animals.filter(a => a.urgent === true).slice(0, 4);

  el.innerHTML = urgent.map(a => {
    const img = a.image || (prefix + 'static/fund-a-paw/img/placeholder-pet.jpg');
    const pct = Math.max(0, Math.min(100, Number(a.progress || 0)));

    const id = a.id || a.slug || a.name; // best-effort id
    const donateHref = `${PAGES}donate.html?animal=${encodeURIComponent(id)}`;

    return `
      <article class="u-card">
        <div class="u-media">
          <img src="${img}" alt="${a.name}" loading="lazy">
        </div>
        <div class="u-body">
          <h3 class="u-title">${a.name}</h3>
          <div class="u-shelter">${a.shelter?.name || a.shelterName || ''}</div>
          <p class="u-desc">${(a.description || '').slice(0, 110)}${(a.description || '').length > 110 ? '…' : ''}</p>
          ${pct ? `
            <div class="u-progress" aria-hidden="true">
              <span class="u-fill" style="width:${pct}%"></span>
            </div>
            <div class="u-pct">${pct}% funded</div>` : ''
          }
          <a class="btn btn-primary btn-sm btn-block"
             href="${donateHref}"
             data-animal-id="${id}">Help ${a.name}</a>
        </div>
      </article>
    `;
  }).join('');

  // Optional: persist selection for donate page to read if you want
  el.querySelectorAll('[data-animal-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-animal-id');
      if (id) try { localStorage.setItem('selectedAnimalId', id); } catch (_) {}
    });
  });
})();

// Home: Urgent Shelter & Animal Needs mini-grid
(function () {
  const grid = document.querySelector('#urgent2 .urgent2__grid');
  if (!grid || !window.FAP) return;

  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const PAGES  = prefix + 'templates/fund-a-paw/';
  const placeholder = prefix + 'static/fund-a-paw/img/placeholder-pet.jpg';

  // URGENT animals
  const urgentAnimals = (FAP.animals || [])
    .filter(a => a.urgent === true)
    .map(a => ({
      kind: 'animal',
      id: a.id || a.slug || a.name,
      name: a.name,
      shelter: a.shelter?.name || a.shelterName || '',
      desc: a.description || '',
      img: a.image || placeholder,
      pct: Number(a.progress || 0)
    }));

  // URGENT shelter-level needs (best effort if available)
  const urgentShelterNeeds = ((FAP.shelterNeeds) ? FAP.shelterNeeds : (FAP.shelters || [])
    .flatMap(s => (s.urgentNeeds || []).map(n => ({
      kind: 'shelter',
      id: n.id || (s.id ? `${s.id}-${n.title}` : n.title),
      name: n.title || 'Shelter need',
      shelter: s.name || '',
      desc: n.description || '',
      img: n.image || s.image || placeholder,
      pct: Number(n.progress || 0)
    }))))
    .filter(Boolean);

  // choose up to 6 urgent items (animals first, then shelter needs)
  const items = [...urgentAnimals, ...urgentShelterNeeds].slice(0, 6);

  grid.innerHTML = items.map(x => {
    const donateHref =
      x.kind === 'animal'
        ? `${PAGES}donate.html?animal=${encodeURIComponent(x.id)}`
        : `${PAGES}donate.html?shelter=${encodeURIComponent(x.id)}`;
    const desc = x.desc ? `${x.desc.slice(0, 110)}${x.desc.length > 110 ? '…' : ''}` : '';
    const pct  = Math.max(0, Math.min(100, x.pct || 0));

    return `
      <article class="u-card">
        <div class="u-media">
          <img src="${x.img}" alt="${x.name}" loading="lazy" decoding="async" />
        </div>
        <div class="u-body">
          <div class="u-eyebrow">${x.kind === 'animal' ? 'Animal' : 'Shelter'}</div>
          <h3 class="u-title">${x.name}</h3>
          <div class="u-shelter">${x.shelter || ''}</div>
          ${desc ? `<p class="u-desc">${desc}</p>` : ''}

          ${pct ? `
            <div class="u-progress" aria-hidden="true">
              <span class="u-fill" style="width:${pct}%"></span>
            </div>
            <div class="u-meta"><span>${pct}% funded</span></div>` : ''
          }

          <div class="u-cta">
            <a class="btn btn-primary btn-sm btn-block" href="${donateHref}">Help ${x.name}</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
})();



// ===== Endless Partners Carousel (3 visible, no arrows)
(function () {
  const track = document.getElementById('partnersTrack');
  if (!track || !window.FAP) return;

  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const partners = (FAP.partners || []).filter(p => (p.image || p.logo));

  // Build a card
  const card = (p={}) => {
    const img = p.image || p.logo || (prefix + 'static/fund-a-paw/img/placeholder-shelter.jpg');
    const name = p.name || 'Partner';
    const href = p.url  || '#';
    return `
      <li class="partner-card reveal">
        <a href="${href}" target="_blank" rel="noopener">
          <img src="${img}" alt="${name}" loading="lazy" decoding="async">
          <span class="name">${name}</span>
        </a>
      </li>`;
  };

  // Ensure we have enough slides to loop smoothly
  const minSlides = 6;
  const list = partners.length ? partners : new Array(minSlides).fill({});
  const html = [];
  for (let i=0;i<Math.max(minSlides, list.length);i++) html.push(card(list[i % list.length]));
  // Duplicate once for buffer
  track.innerHTML = html.join('') + html.join('');

  // Animation state
  let offset = 0;
  let rafId = null;
  const speed = 0.5; // px per frame (~30px/s @60fps)
  let cardW = track.querySelector('.partner-card').getBoundingClientRect().width;
  let gap = parseFloat(getComputedStyle(track).gap) || 24;

  const step = () => {
    offset -= speed;
    track.style.transform = `translateX(${offset}px)`;
    // when a full card + gap has passed, move first to end
    if (Math.abs(offset) >= cardW + gap) {
      track.appendChild(track.firstElementChild);
      offset += cardW + gap;
      cardW = track.querySelector('.partner-card').getBoundingClientRect().width;
      gap   = parseFloat(getComputedStyle(track).gap) || gap;
    }
    rafId = requestAnimationFrame(step);
  };

  // Start / pause
  const start = () => { if (!rafId) rafId = requestAnimationFrame(step); };
  const stop  = () => { cancelAnimationFrame(rafId); rafId = null; };

  // Pause on hover/focus and when tab is hidden
  const viewport = track.parentElement;
  ['mouseenter','focusin'].forEach(ev => viewport.addEventListener(ev, stop));
  ['mouseleave','focusout'].forEach(ev => viewport.addEventListener(ev, start));
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  window.addEventListener('resize', () => {
    cardW = track.querySelector('.partner-card').getBoundingClientRect().width;
    gap   = parseFloat(getComputedStyle(track).gap) || gap;
  });

  start();
})();


/* app.js — featured animals, animals page, animal details, partners carousel */
(function (FAP) {
  'use strict';

  // Paths (work from /docs and /docs/templates/fund-a-paw)
  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const PAGES  = prefix + 'templates/fund-a-paw/';
  const IMG    = prefix + 'static/fund-a-paw/img/';

  // ---- Data helpers (shelters with nested animals) ----
  const shelters = () => Array.isArray(FAP.shelters) ? FAP.shelters : [];
  const animalsAll = () =>
    shelters().flatMap(s => (s.animals || []).map(a => ({ ...a, shelter: { id: s.id, name: s.name } })));

  // ----------------------------------------------------
  // 1) FEATURED ANIMALS (3 cards on home page)
  // ----------------------------------------------------
  FAP.renderFeaturedAnimals = function () {
    const root = document.getElementById('fa-grid');
    if (!root) return;

    const featured = animalsAll()
      .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
      .slice(0, 3);

    root.innerHTML = featured.map(a => `
      <article class="fa-card reveal">
        <a href="${PAGES}animal.html?animal=${encodeURIComponent(a.id)}" aria-label="View ${a.name}">
          <img src="${a.image || (IMG + 'placeholder-pet.jpg')}" alt="${a.name || 'Animal'}" loading="lazy" decoding="async">
        </a>
        <div class="fa-body">
          <div class="fa-name">${a.name || 'Animal'}</div>
          <div class="fa-shelter">${a.shelter?.name || ''}</div>
          <p class="fa-desc">${(a.bio || '').slice(0, 110)}${(a.bio || '').length > 110 ? '…' : ''}</p>
          <div class="fa-cta">
            <a class="btn btn-ghost btn-sm" href="${PAGES}shelters.html#${encodeURIComponent(a.shelter?.id || '')}">View shelter</a>
            <a class="btn btn-primary btn-sm" href="${PAGES}donate.html?animal=${encodeURIComponent(a.id)}&shelter=${encodeURIComponent(a.shelter?.id || '')}">Donate</a>
          </div>
        </div>
      </article>
    `).join('');
  };

  // ----------------------------------------------------
  // 2) ANIMALS PAGE (filters + cards)
  //    expects animals.html with containers:
  //    #animals-grid (All) and #urgent-animals-grid (Urgent)
  //    Works even if only #animals-grid exists; #hash preselects.
  // ----------------------------------------------------
  FAP.renderAnimalsPage = function () {
    const rootAll   = document.getElementById('animals-grid');
    const rootUrg   = document.getElementById('urgent-animals-grid');
    if (!rootAll && !rootUrg) return;

    const listAll   = animalsAll();
    const listUrg   = listAll.filter(a => a.urgent);

    const card = (a) => `
      <article class="card ${a.urgent ? 'border-2 border-red-400' : ''}">
        <a href="animal.html?animal=${encodeURIComponent(a.id)}" class="block">
          <img src="${a.image || (IMG + 'placeholder-pet.jpg')}" alt="${a.name}" class="w-full h-56 object-cover">
        </a>
        <div class="p-4">
          <h3 class="font-bold text-lg">${a.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${a.shelter?.name || ''}</p>
          <p class="text-gray-700">${a.bio || ''}</p>
          <div class="mt-3 flex gap-2 flex-wrap">
            <a href="animal.html?animal=${encodeURIComponent(a.id)}" class="btn-ghost">View details</a>
            <a href="donate.html?animal=${encodeURIComponent(a.id)}&shelter=${encodeURIComponent(a.shelter?.id || '')}" class="btn-primary">Donate</a>
            <button class="px-3 py-1.5 border rounded" data-subscribe-animal="${a.id}" data-shelter="${a.shelter?.id || ''}">Get updates</button>
          </div>
        </div>
      </article>
    `;

    if (rootAll) rootAll.innerHTML = listAll.map(card).join('');
    if (rootUrg) rootUrg.innerHTML = listUrg.map(card).join('');

    // Optional: hash preselect (if your page uses tabs/pills)
    if (location.hash === '#urgent' && rootUrg) {
      // If you have a tab system, trigger the urgent tab here.
      // Otherwise, do nothing—content is already in the urgent container.
    }
  };

  // ----------------------------------------------------
  // 3) ANIMAL DETAILS PAGE (progress + updates)
  //    target container: #animal-details (on animal.html)
  // ----------------------------------------------------
  FAP.renderAnimalDetails = function () {
    const mount = document.getElementById('animal-details');
    if (!mount) return;

    const q  = new URLSearchParams(location.search);
    const id = q.get('animal');
    const a  = animalsAll().find(x => String(x.id) === String(id));
    if (!a) { mount.innerHTML = '<p>We couldn’t find that animal.</p>'; return; }

    const goal   = Number(a.goal || 0);
    const raised = Number(a.raised || 0);
    const pct    = goal ? Math.min(100, Math.round((raised / goal) * 100)) : (a.progress || 0);

    const updates = Array.isArray(a.updates) ? a.updates : [];

    mount.innerHTML = `
      <article class="animal-detail">
        <div class="ad-media">
          <img src="${a.image || (IMG + 'placeholder-pet.jpg')}" alt="${a.name}" loading="lazy" decoding="async">
        </div>
        <div class="ad-body">
          <h1 class="ad-title">${a.name}</h1>
          <div class="ad-shelter">From: <a href="${PAGES}shelters.html#${encodeURIComponent(a.shelter?.id || '')}">${a.shelter?.name || ''}</a></div>
          <p class="ad-desc">${a.bio || ''}</p>
          ${goal ? `
            <div class="u-progress"><span class="u-fill" style="width:${pct}%"></span></div>
            <div class="u-meta"><span>${pct}% funded · ${raised.toLocaleString('en-CA',{style:'currency',currency:'CAD'})} of ${goal.toLocaleString('en-CA',{style:'currency',currency:'CAD'})}</span></div>
          ` : ''}

          <div class="ad-cta">
            <a class="btn btn-primary" href="${PAGES}donate.html?animal=${encodeURIComponent(a.id)}&shelter=${encodeURIComponent(a.shelter?.id || '')}">Donate to ${a.name}</a>
            <a class="btn btn-ghost" href="${PAGES}shelters.html#${encodeURIComponent(a.shelter?.id || '')}">View shelter</a>
          </div>
        </div>
      </article>

      <section class="ad-updates">
        <h2>Updates</h2>
        ${updates.length ? updates.map(u => `
          <article class="ad-update">
            <time datetime="${u.date}">${u.date}</time>
            <h3>${u.title || ''}</h3>
            <p>${u.body || ''}</p>
            ${u.image ? `<img src="${u.image}" alt="${u.title || 'Update image'}" loading="lazy">` : ''}
          </article>
        `).join('') : '<p>No updates yet. We’ll post progress here.</p>'}
      </section>
    `;
  };

  // ----------------------------------------------------


  // ----------------------------------------------------
  // DOM Ready
  // ----------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    FAP.renderFeaturedAnimals();
    FAP.renderAnimalsPage();
    FAP.renderAnimalDetails();
  });

})(window.FAP = window.FAP || {});

// ===== Partners — Endless marquee (no arrows, 3 visible) =====
(function(FAP){
  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const IMG    = prefix + 'static/fund-a-paw/img/';

  FAP.initEndlessPartners = function(){
    const track = document.getElementById('partnersTrack');
    if (!track || track.dataset.ready) return;
    track.dataset.ready = '1';

    // Use FAP.partners if present; otherwise fall back to shelters as partners
    const partners = (FAP.partners && FAP.partners.length ? FAP.partners :
      (FAP.shelters || []).map(s => ({ name:s.name, image:s.image, url:'#' })));

    const card = p => `
      <li class="partner-card">
        <a href="${p.url || '#'}" ${p.url ? 'target="_blank" rel="noopener"' : ''}>
          <img src="${p.image || (IMG + 'placeholder-shelter.jpg')}" alt="${p.name || 'Partner'}" loading="lazy" decoding="async">
          <span class="name">${p.name || 'Partner'}</span>
        </a>
      </li>`;

    const html = (partners.length ? partners : new Array(6).fill({})).map(card).join('');
    track.innerHTML = html + html;       // duplicate for seamless loop
    track.classList.add('is-marquee');

    // Tune scroll speed to width for a smooth infinite effect
    const first = track.querySelector('.partner-card');
    if (first) {
      const gap  = parseFloat(getComputedStyle(track).gap || '24');
      const w    = first.getBoundingClientRect().width + gap;
      const count = partners.length || 6;
      const half = w * count;         // distance animated (-50%)
      const pxPerSec = 28;
      track.style.setProperty('--p-duration', `${Math.max(18, Math.round(half / pxPerSec))}s`);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof FAP.initEndlessPartners === 'function') FAP.initEndlessPartners();
  });
})(window.FAP = window.FAP || {});

// ===== helpers (top of app.js is fine) =====
const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
const prefix = inTemplates ? '../../' : './';
const PAGES  = prefix + 'templates/fund-a-paw/';
const IMG    = prefix + 'static/fund-a-paw/img/';

const shelters = () => Array.isArray(window.FAP?.shelters) ? window.FAP.shelters : [];
const animalsAll = () => shelters().flatMap(s =>
  (s.animals || []).map(a => ({ ...a, shelter: { id: s.id, name: s.name } }))
);

// ===== Featured animals (always 3) =====
window.FAP.renderFeaturedAnimals = function(){
  const root = document.getElementById('fa-grid');
  if (!root) return;

  const all   = animalsAll();
  const urg   = all.filter(a => a.urgent);
  const pool  = urg.length >= 3 ? urg : all;

  // choose 3 — prefer urgent, then fill from others; ensure no duplicates
  const picked = [];
  for (const a of pool) {
    if (!picked.some(p => p.id === a.id)) picked.push(a);
    if (picked.length === 3) break;
  }
  if (picked.length < 3) {
    for (const a of all) {
      if (!picked.some(p => p.id === a.id)) picked.push(a);
      if (picked.length === 3) break;
    }
  }

  // graceful placeholders if still nothing
  const cards = (picked.length ? picked : [
    { id:'ph1', name:'Friend in Care', image: IMG+'placeholder-pet.jpg', bio:'Your gift provides food, meds and safe housing.', shelter:{id:'', name:'Local partner shelter'} },
    { id:'ph2', name:'New Arrival',    image: IMG+'placeholder-pet.jpg', bio:'Help with intake checks and urgent supplies.',    shelter:{id:'', name:'Local partner shelter'} },
    { id:'ph3', name:'Healing Pup',    image: IMG+'placeholder-pet.jpg', bio:'Support recovery and foster placement.',         shelter:{id:'', name:'Local partner shelter'} },
  ]);

  root.innerHTML = cards.map(a => `
    <article class="fa-card">
      <a href="${PAGES}animal.html?animal=${encodeURIComponent(a.id)}" aria-label="View ${a.name}">
        <img src="${a.image || (IMG+'placeholder-pet.jpg')}" alt="${a.name || 'Animal'}" loading="lazy" decoding="async">
      </a>
      <div class="fa-body">
        <div class="fa-name">${a.name || 'Animal'}</div>
        <div class="fa-shelter">${a.shelter?.name || ''}</div>
        <p class="fa-desc">${(a.bio || '').slice(0,120)}${(a.bio||'').length>120?'…':''}</p>
        <div class="fa-cta">
          <a class="btn btn-ghost btn-sm" href="${PAGES}shelters.html#${encodeURIComponent(a.shelter?.id || '')}">View shelter</a>
          <a class="btn btn-primary btn-sm" href="${PAGES}donate.html?animal=${encodeURIComponent(a.id)}&shelter=${encodeURIComponent(a.shelter?.id || '')}">Donate</a>
        </div>
      </div>
    </article>
  `).join('');
};

// ===== News & Events (use defaults if none supplied) =====
window.FAP.renderNews = function(){
  const root = document.getElementById('news-list');
  if (!root) return;

  const defaults = [
    {
      title: 'Fund-a-Paw Alberta pilot is live',
      date:  '2025-09-01',
      body:  'We now connect donors directly with shelters’ current needs across Alberta. Real needs, transparent impact.'
    },
    {
      title: 'First partners onboarded',
      date:  '2025-09-05',
      body:  'AARF, EHS and community rescues have started posting needs. Expect more shelters over the next few weeks.'
    },
    {
      title: 'Updates & receipts in your inbox',
      date:  '2025-09-10',
      body:  'Donate in two clicks (card/Apple/Google Pay). You’ll get progress updates and a receipt for every gift.'
    }
  ];

  const news = (Array.isArray(window.FAP.news) && window.FAP.news.length) ? window.FAP.news : defaults;

  root.innerHTML = news.slice(0,3).map(n => `
    <article class="news-card">
      <time datetime="${n.date}">${n.date}</time>
      <h3>${n.title}</h3>
      <p>${n.body}</p>
    </article>
  `).join('');
};

// ===== DOM ready: call both =====
document.addEventListener('DOMContentLoaded', () => {
  window.FAP.renderFeaturedAnimals?.();
  window.FAP.renderNews?.();
});



// ===== Reveal on scroll (IntersectionObserver) =====
window.FAP.initReveal = function(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        // For ".stagger" containers, mark the container instead
        if (e.target.classList.contains('stagger')) {
          e.target.classList.add('is-visible');
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });

  // Observe both atomic reveals and stagger containers
  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));
  // Expose refresh when you inject dynamic content
  window.FAP._revealObserver = io;
};

window.FAP.refreshReveal = function(){
  const io = window.FAP._revealObserver;
  if (!io) return;
  document.querySelectorAll('.reveal:not(.is-visible), .stagger:not(.is-visible)')
    .forEach(el => io.observe(el));
};

// ===== Featured animals: enable mobile snap carousel + dots =====
window.FAP.initFeaturedCarousel = function(){
  const grid = document.getElementById('fa-grid');
  if (!grid) return;

  const isMobile = window.matchMedia('(max-width: 960px)').matches;
  grid.classList.toggle('snap-carousel', isMobile);
  grid.querySelectorAll('.fa-card').forEach(el => el.classList.toggle('snap-slide', isMobile));

  // dots
  let dots = document.getElementById('fa-dots');
  if (isMobile) {
    if (!dots) {
      dots = document.createElement('div');
      dots.id = 'fa-dots';
      dots.className = 'snap-dots';
      grid.after(dots);
    }
    dots.innerHTML = Array.from(grid.children).map((_,i)=>`<button aria-label="Go to item ${i+1}"></button>`).join('');
    const btns = dots.querySelectorAll('button');

    const update = () => {
      const slides = Array.from(grid.children);
      let idx = 0, min = Infinity;
      const left = grid.getBoundingClientRect().left;
      slides.forEach((s,i) => {
        const diff = Math.abs(s.getBoundingClientRect().left - left);
        if (diff < min) { min = diff; idx = i; }
      });
      btns.forEach((b,i)=> b.classList.toggle('active', i===idx));
    };

    grid.addEventListener('scroll', () => requestAnimationFrame(update), { passive:true });
    update();
  } else if (dots) {
    dots.remove();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ...your existing calls (urgent, featured, partners, etc.)

  // Reveal & sliders
  window.FAP.initReveal();
  window.FAP.initFeaturedCarousel();

  // If you re-render cards later, refresh:
  window.FAP.refreshReveal?.();
});

// ---------- Simple parallax for hero ----------
const heroImg = document.querySelector('.hero__img');
if (heroImg){
  window.addEventListener('scroll', () => {
    heroImg.style.setProperty('--scroll', String(window.scrollY));
  }, { passive: true });
}

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('is-in'));
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Urgent needs (shelter + animals) ---------- */
(function initUrgent(){
  const wrap = document.querySelector('#urgent-cards');
  const tabs = document.querySelectorAll('.segmented__btn');
  const FAP = window.FAP || {};
  if (!wrap) return;

  // from data.js (already present)
  const shelterNeeds = Array.isArray(FAP.shelterNeeds) ? FAP.shelterNeeds : [];
  const urgentAnimals =
    (FAP.shelters || [])
      .flatMap(s => (s.animals || []).filter(a => a.urgent)
        .map(a => ({ ...a, shelterName: s.name })));

  const placeholder = './static/fund-a-paw/img/placeholders/need-1.jpg';

  const card = (n) => `
    <article class="card reveal">
      <img src="${n.image || placeholder}" alt="${n.title || n.name || 'Urgent need'}" loading="lazy">
      <div class="card__body">
        <div class="eyebrow">${n.shelterName ? 'SHELTER' : 'NEED'}</div>
        <h3 class="h4" style="margin:.25rem 0 .5rem">
          ${n.title || n.name || 'Urgent need'}
        </h3>
        <p style="margin:.25rem 0 .75rem">${n.summary || n.description || n.bio || ''}</p>
        <a class="btn btn-primary btn-block"
           href="./templates/fund-a-paw/donate.html?need=${encodeURIComponent(n.id || '')}">
           ${n.name ? `Help ${n.name}` : 'Help with this need'}
        </a>
      </div>
    </article>`;

  function render(kind){
    const list = kind === 'animal' ? urgentAnimals : shelterNeeds;
    wrap.innerHTML = list.length ? list.map(card).join('') :
      `<p style="opacity:.7">Nothing critical right now — please check back soon.</p>`;
    wrap.querySelectorAll('.reveal').forEach((el,i)=>{ el.style.transitionDelay = `${i*70}ms`; io.observe(el); });
  }

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    render(btn.dataset.filter);
  }));

  render('shelter'); // initial view
})();




// animals list page
document.addEventListener('DOMContentLoaded', () => {
  renderAnimalsGrid(); // safe on all pages; does nothing if #animals-grid is absent

  // Make animal, shelter, and need cards clickable where those grids exist
  makeCardClickable('#animals-grid', '.animal-card', 'a[href*="animals.html?animal="]');
  makeCardClickable('#shelters-grid', '.shelter-card', 'a[href*="shelters.html?shelter="]');
  makeCardClickable('#urgent-needs-grid', '.need-card', 'a[href*="donate.html?need="]');

  // Remove any legacy "Get updates" buttons that might still be in markup
  document.querySelectorAll('.card__actions a, .btn')
    .forEach(a => {
      if (a.textContent.trim().toLowerCase() === 'get updates') a.remove();
    });
});

function getQuery(key) {
  return new URLSearchParams(location.search).get(key);
}

function renderAnimalDetail() {
  const id = getQuery('animal');
  if (!id) return;
  const a = allAnimals().find(x => String(x.id) === String(id));
  if (!a) return;

  const hero = resolve(a.image || (a.images && a.images[0]) || '') || animalPlaceholder;

  const root = document.querySelector('#animal-detail') || document.querySelector('main');
  if (!root) return;

  root.innerHTML = `
    <section class="detail-hero" style="--bg:url('${hero}')">
      <h1 class="detail-hero__title">${a.name}</h1>
    </section>

    <section class="container detail-content">
      <article>
        <div class="eyebrow">From: <a href="${toShelterDetail(a.shelterId)}">${a.shelterName}</a></div>
        <p class="lead">${a.description || a.summary || ''}</p>

        <h3 class="mt-24">Updates</h3>
        <div class="updates">
          ${(a.updates || []).map(u => `
            <div class="update">
              <div class="update__date">${u.date || ''}</div>
              <div class="update__title">${u.title || ''}</div>
              <p class="update__body">${u.body || ''}</p>
            </div>
          `).join('') || '<p>No updates yet.</p>'}
        </div>
      </article>

      <aside class="detail-cta">
        <div class="card">
          <div class="card__body">
            <h4>Support ${a.name}</h4>
            <p>Your gift goes straight to <strong>${a.shelterName}</strong> for this animal.</p>
            <a class="btn btn-primary btn-lg" href="${toDonateForAnimal(a.id)}">Donate to ${a.name}</a>
            <a class="btn btn-outline mt-8" href="${toShelterDetail(a.shelterId)}">View shelter</a>
          </div>
        </div>
      </aside>
    </section>`;
}



/* ---------- shelter card ---------- */

const shelterCard = (s) => `
<article class="card shelter-card">
  <a class="card__media" href="${toShelterDetail(s.id)}">
    <img src="${resolve(s.image) || `${ROOT}static/fund-a-paw/img/placeholders/shelter-1.jpg`}" alt="${s.name}" loading="lazy">
  </a>
  <div class="card__body">
    <h3 class="h5"><a href="${toShelterDetail(s.id)}">${s.name}</a></h3>
    <p>${s.description || ''}</p>
    <div class="card__actions">
      <a class="btn btn-outline" href="${toShelterDetail(s.id)}">View details</a>
    </div>
  </div>
</article>`;

const needPlaceholder = `${ROOT}static/fund-a-paw/img/placeholders/need-1.jpg`;
const needCard = (n) => `
<article class="card need-card">
  <a class="card__media" href="${toNeedDetail(n.id)}">
    <img src="${resolve(n.image) || needPlaceholder}" alt="${n.title || 'Shelter need'}" loading="lazy">
  </a>
  <div class="card__body">
    <div class="eyebrow">NEED</div>
    <h3 class="h5"><a href="${toNeedDetail(n.id)}">${n.title}</a></h3>
    <p>${n.summary || n.description || ''}</p>
    <div class="card__actions">
      <a class="btn btn-primary btn-block" href="${toNeedDetail(n.id)}">Help with this need</a>
    </div>
  </div>
</article>`;


/* --- CLEAN Animals renderer (drop-in) --- */

// flatten animals with shelter info
const allAnimals = () =>
  (window.FAP?.shelters || []).flatMap(s =>
    (s.animals || []).map(a => ({ ...a, shelterId: s.id, shelterName: s.name }))
  );

// ----------------------------------------------------
// 2) ANIMALS PAGE — v2 (single grid, no tabs, no “Get updates”)
//    Expects animals.html to have:  <div id="animals-grid"></div>
// ----------------------------------------------------
FAP.renderAnimalsPage = function () {
  const mount = document.getElementById('animals-grid');
  if (!mount) return;

  // Resolve asset path from both /docs and /docs/templates/fund-a-paw/
  const resolveAsset = (p) => {
    if (!p) return IMG + 'placeholders/animal-1.jpg';
    if (/^https?:|^data:|^\/\//.test(p)) return p;
    return prefix + p.replace(/^\.?\/*/, ''); // prefix is defined at the top of app.js
  };

  const toAnimal = (id) =>
    `${PAGES}animal.html?animal=${encodeURIComponent(id)}`;
  const toDonate = (id, sid) =>
    `${PAGES}donate.html?animal=${encodeURIComponent(id)}&shelter=${encodeURIComponent(sid || '')}`;

  // Flatten animals with shelter context (helper already exists above)
  const items = animalsAll();

  const card = (a) => `
    <article class="card animal-card" data-id="${a.id}">
      <a class="card__media" href="${toAnimal(a.id)}" aria-label="View ${a.name}">
        <img src="${resolveAsset(a.image || (a.images && a.images[0]))}"
             alt="${a.name}" loading="lazy"
             onerror="this.src='${IMG}placeholders/animal-1.jpg'">
      </a>
      <div class="card__body">
        <h3 class="h5"><a href="${toAnimal(a.id)}">${a.name}</a></h3>
        <div class="eyebrow">${a.shelter?.name || ''}</div>
        ${a.bio ? `<p>${a.bio}</p>` : ''}
        <div class="card__actions">
          <a class="btn btn-outline" href="${toAnimal(a.id)}">View details</a>
          <a class="btn btn-primary" href="${toDonate(a.id, a.shelter?.id)}">Donate</a>
        </div>
      </div>
    </article>
  `;

  // Render
  mount.innerHTML = items.map(card).join('');

  // Make the whole card clickable (but let real links keep working)
  mount.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.animal-card');
    if (!cardEl || e.target.closest('a')) return;
    location.href = toAnimal(cardEl.dataset.id);
  });

  // Hard-remove any stray legacy “Get updates” buttons
  mount.querySelectorAll('a, button').forEach((el) => {
    if (el.textContent.trim().toLowerCase() === 'get updates') el.remove();
  });
};


FAP.showShelterDetails = (id) => {
  const mount = document.getElementById('shelter-details');
  if (!mount) return;

  const s = (FAP.shelters || []).find(x => String(x.id) === String(id));
  if (!s) { mount.innerHTML = `<p>Shelter not found.</p>`; return; }

  const logo = faResolveAsset(
    s.image || s.logo,
    IMG + 'placeholders/shelter-1.jpg'
  );

  const animals = (s.animals || []);
  const aCard = (a) => `
    <article class="card animal-card" data-id="${a.id}">
      <a class="card__media" href="${faToAnimal(a.id)}" aria-label="View ${a.name}">
        <img src="${faResolveAsset(a.image || (a.images && a.images[0]), IMG + 'placeholders/animal-1.jpg')}"
             alt="${a.name}" loading="lazy"
             onerror="this.src='${IMG}placeholders/animal-1.jpg'">
      </a>
      <div class="card__body">
        <h3 class="h5"><a href="${faToAnimal(a.id)}">${a.name}</a></h3>
        ${a.bio ? `<p>${a.bio}</p>` : ''}
        <div class="card__actions">
          <a class="btn btn-outline" href="${faToAnimal(a.id)}">View details</a>
          <a class="btn btn-primary" href="${faToDonate(a.id, s.id)}">Donate</a>
        </div>
      </div>
    </article>`;

  mount.innerHTML = `
    <section class="shelter-head">
      <div class="shelter-head__media">
        <img src="${logo}" alt="${s.name}" loading="lazy"
             onerror="this.src='${IMG}placeholders/shelter-1.jpg'">
      </div>
      <div class="shelter-head__body">
        <h1>${s.name}</h1>
        ${s.description ? `<p class="lead">${s.description}</p>` : ''}
        ${(s.contact || s.email || s.phone) ? `
          <ul class="shelter-contact">
            ${s.contact ? `<li><strong>Contact:</strong> ${s.contact}</li>` : ''}
            ${s.email   ? `<li><strong>Email:</strong> <a href="mailto:${s.email}">${s.email}</a></li>` : ''}
            ${s.phone   ? `<li><strong>Phone:</strong> ${s.phone}</li>` : ''}
          </ul>` : ''
        }
      </div>
    </section>

    <h2 class="mt-8 mb-4">Animals from ${s.name}</h2>
    <div id="shelter-animals-grid" class="grid">${animals.map(aCard).join('')}</div>
  `;

  // make animal cards clickable (except on real links)
  const animalsGrid = document.getElementById('shelter-animals-grid');
  if (animalsGrid) {
    animalsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.animal-card');
      if (!card || e.target.closest('a')) return;
      location.href = faToAnimal(card.dataset.id);
    });
  }
};
