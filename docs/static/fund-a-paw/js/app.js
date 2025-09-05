// app.js — shared behavior/renderers for all pages
window.FAP = window.FAP || {};

// Tiny helpers
FAP.$  = (sel, root=document) => root.querySelector(sel);
FAP.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
FAP.qs = (k) => new URLSearchParams(location.search).get(k);

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
  const grid = document.getElementById('shelter-grid');
  const urgent = document.getElementById('urgent-shelter-grid');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = {
    all: document.getElementById('tab-all'),
    'urgent-shelter': document.getElementById('tab-urgent-shelter'),
  };

  // Render All Shelters
  if (grid) {
    grid.innerHTML = (FAP.shelters || []).map(s => `
      <article id="${s.id}" class="card">
        <img src="${s.image}" alt="${s.name}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h3 class="font-bold text-lg">${s.name}</h3>
          <p class="text-sm text-gray-600">${s.bio || ""}</p>
          <a href="shelters.html#${s.id}" class="inline-block mt-3 underline font-semibold">View animals →</a>
        </div>
      </article>
    `).join('');
  }

  // Render Urgent Shelter Needs
  if (urgent) {
    urgent.innerHTML = (FAP.shelterNeeds || []).map(n => {
      const s = (FAP.shelters || []).find(x => x.id === n.shelterId);
      return `
      <article class="card border-2 border-orange-400">
        <img src="${n.image}" alt="${n.title}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h3 class="font-bold">${n.title}</h3>
          <p class="text-sm text-gray-600 mb-2">For: ${s?.name || "Shelter"}</p>
          <p class="text-gray-700">${n.description}</p>
          <a href="donate.html?shelter=${n.shelterId}" class="btn-primary mt-3 inline-block">Help with this need</a>
        </div>
      </article>`;
    }).join('');
  }

  // Tabs
  function activateTab(key) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
    Object.entries(panels).forEach(([k, el]) => el?.classList.toggle('hidden', k !== key));
    // Hide details when switching tabs
    document.getElementById('shelter-details')?.classList.add('hidden');
  }
  tabs.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    const key = t.dataset.tab;
    activateTab(key);
    if (history.pushState) history.pushState(null, "", `#${key}`);
  }));

  // Hash router
  function handleHash() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!h || h === "all") { activateTab('all'); return; }
    if (h === "urgent-shelter") { activateTab('urgent-shelter'); return; }
    const s = (FAP.shelters || []).find(x => x.id === h);
    if (s) {
      // Show shelter details and animals
      document.getElementById('shelter-details')?.classList.remove('hidden');
      document.getElementById('tab-all')?.classList.add('hidden');
      document.getElementById('tab-urgent-shelter')?.classList.add('hidden');
      FAP.showShelterDetails(h);
      return;
    }
    activateTab('all');
  }
  window.addEventListener('hashchange', handleHash);

  // Initial state
  handleHash();
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

// Home: Impact strip numbers (live from data with safe fallbacks)
(function () {
  const mount = document.getElementById('impact-strip');
  if (!mount) return;

  const sheltersCount = (window.FAP?.shelters || []).length || 53;

  // animals helped: prefer an explicit 'helped' flag; otherwise use total as a stand-in
  const animalsHelped =
    (window.FAP?.animals || []).filter(a => a.helped === true).length ||
    (window.FAP?.animals || []).length || 1842;

  // raised: try summing raised/funded fields if present; otherwise fallback
  const raised = (() => {
    let sum = 0;
    try {
      (window.FAP?.animals || []).forEach(a => sum += Number(a.raised ?? a.funded ?? 0));
      (window.FAP?.shelterNeeds || []).forEach(n => sum += Number(n.raised ?? n.funded ?? 0));
    } catch (e) {}
    return sum || 210000; // $210k fallback
  })();

  const money = n => {
    if (n >= 1_000_000) return `$${Math.round(n/1_000_000)}M`;
    if (n >= 1_000)     return `$${Math.round(n/1_000)}k`;
    return `$${n}`;
  };

  const fmt = n => n.toLocaleString();

  mount.innerHTML = `
    <div class="impact__grid" role="group" aria-label="Impact numbers">
      <div class="impact__item">
        <div class="impact__num" aria-label="${fmt(sheltersCount)} shelters">${fmt(sheltersCount)}</div>
        <div class="impact__label">Shelters</div>
      </div>
      <div class="impact__item">
        <div class="impact__num" aria-label="${fmt(animalsHelped)} animals helped">${fmt(animalsHelped)}</div>
        <div class="impact__label">Animals helped</div>
      </div>
      <div class="impact__item">
        <div class="impact__num" aria-label="${money(raised)} raised">${money(raised)}</div>
        <div class="impact__label">Raised</div>
      </div>
    </div>
  `;
})();
