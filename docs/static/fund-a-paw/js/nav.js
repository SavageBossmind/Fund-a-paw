/* nav.js — sticky, responsive header with working relative links */
(function () {
  'use strict';

  // Detect where we are (root vs /templates/)
  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const PAGES  = prefix + 'templates/fund-a-paw/';

  const PATHS = {
    home:           prefix + 'index.html',
    animalsAll:     PAGES + 'animals.html#all',
    animalsUrgent:  PAGES + 'animals.html#urgent',
    sheltersAll:    PAGES + 'shelters.html#all',
    sheltersUrgent: PAGES + 'shelters.html#urgent-shelter',
    urgentAnimals:  PAGES + 'animals.html#urgent',
    partners:       PAGES + 'partners.html',
    contact:        PAGES + 'contact.html',
    about:          PAGES + 'about.html',
    donate:         PAGES + 'donate.html',
  };

  // Create or reuse the header host
  const host =
    document.getElementById('site-nav') ||
    document.getElementById('fap-nav')  ||
    (() => {
      const h = document.createElement('header');
      h.id = 'site-nav';
      document.body.prepend(h);
      return h;
    })();

  host.className = 'site-header';

  host.innerHTML = `
  <div class="nav-wrap container">
    <a class="brand" href="${PATHS.home}" aria-label="Fund-a-Paw, home">
      <span>Fund-a-</span><strong>Paw</strong>
    </a>

    <button class="burger" id="nav-burger" aria-label="Open menu" aria-controls="nav-drawer" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <nav class="menu" aria-label="Primary">
      <ul class="menu__list">
        <li class="has-submenu">
          <a class="menu__link" href="${PATHS.animalsAll}">Animals</a>
          <div class="dropdown" role="menu">
            <a class="dropdown__item" href="${PATHS.animalsUrgent}" role="menuitem">Urgent animals</a>
            <a class="dropdown__item" href="${PATHS.animalsAll}" role="menuitem">All animals</a>
          </div>
        </li>

        <li class="has-submenu">
          <a class="menu__link" href="${PATHS.sheltersAll}">Shelters</a>
          <div class="dropdown" role="menu">
            <a class="dropdown__item" href="${PATHS.sheltersUrgent}" role="menuitem">Urgent shelter needs</a>
            <a class="dropdown__item" href="${PATHS.urgentAnimals}" role="menuitem">Urgent animal needs</a>
          </div>
        </li>

        <li><a class="menu__link" href="${PATHS.partners}">Our Partners</a></li>
        <li><a class="menu__link" href="${PATHS.contact}">Contact</a></li>
        <li><a class="menu__link" href="${PATHS.about}">About Us</a></li>
      </ul>
    </nav>

    <div class="menu-ctas">
      <a class="btn-ghost"  href="${PATHS.sheltersAll}">Find a Shelter</a>
      <a class="btn-danger" href="${PATHS.animalsUrgent}">Urgent Needs</a>
      <a class="btn-primary" href="${PATHS.donate}">Donate</a>
    </div>
  </div>

  <!-- Mobile drawer -->
  <nav class="drawer" id="nav-drawer" aria-label="Mobile">
    <a class="drawer__link" href="${PATHS.animalsAll}">Animals</a>
    <a class="drawer__link" href="${PATHS.animalsUrgent}">Urgent animals</a>

    <a class="drawer__link" href="${PATHS.sheltersAll}">Shelters</a>
    <a class="drawer__link" href="${PATHS.sheltersUrgent}">Urgent shelter needs</a>
    <a class="drawer__link" href="${PATHS.urgentAnimals}">Urgent animal needs</a>

    <a class="drawer__link" href="${PATHS.partners}">Our Partners</a>
    <a class="drawer__link" href="${PATHS.contact}">Contact</a>
    <a class="drawer__link" href="${PATHS.about}">About Us</a>
    <hr/>
    <a class="btn-primary block" href="${PATHS.donate}">Donate</a>
  </nav>
  `;

  // --- Mobile burger ---
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-drawer');
  const toggleDrawer = () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    document.body.classList.toggle('nav-open', !open);
  };
  burger.addEventListener('click', toggleDrawer);
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });

  // --- Sticky shadow on scroll ---
  const onScroll = () => {
    if (window.scrollY > 6) host.classList.add('is-stuck');
    else host.classList.remove('is-stuck');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Close any open dropdown when clicking outside (desktop) ---
  document.addEventListener('click', (e) => {
    const open = document.querySelector('.has-submenu.open');
    if (!open) return;
    if (!open.contains(e.target)) open.classList.remove('open');
  });

  // Keyboard access for dropdowns
  host.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.has-submenu.open');
    if (open) open.classList.remove('open');
  });

  // Open dropdown via focus (for keyboard users)
  host.addEventListener('focusin', (e) => {
    const li = e.target.closest('.has-submenu');
    if (li) li.classList.add('open');
  });
  host.addEventListener('focusout', (e) => {
    const li = e.target.closest('.has-submenu');
    if (li) setTimeout(() => li.classList.remove('open'), 0);
  });
})();


window.FAP = window.FAP || {};
FAP.partners = [
  { name:'Edmonton Humane Society', image:'./static/fund-a-paw/img/ehs.png', url:'https://www.edmontonhumanesociety.com/' },
  { name:'Second Chance Animal Rescue', image:'./static/fund-a-paw/img/scars.webp', url:'https://scarscare.ca/' },
  { name:'Calgary SPCA', image:'./static/fund-a-paw/img/calgary-spca.webp', url:'https://www.calgaryhumane.ca/' },
  { name:'Central Alberta Humane Society', image:'./static/fund-a-paw/img/cahs.jpg', url:'#' },
  { name:'AARF', image:'./static/fund-a-paw/img/aarf.webp', url:'#' }
];
