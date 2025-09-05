// docs/static/fund-a-paw/js/nav.js
(function () {
  const mount = document.getElementById('site-nav');
  if (!mount) return;

  // works both on index (docs/) and subpages (docs/templates/fund-a-paw/)
  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';

  const PAGES = prefix + 'templates/fund-a-paw/';
  const PATHS = {
    home:      prefix + 'index.html',
    shelters:  PAGES + 'shelters.html#all',
    urgentShelter: PAGES + 'shelters.html#urgent-shelter',
    urgentAnimals: PAGES + 'animals.html#urgent',
    partners:  PAGES + 'partners.html',
    contact:   PAGES + 'contact.html',
    about:     PAGES + 'about.html',
    donate:    PAGES + 'donate.html'
  };

  mount.innerHTML = `
  <div class="fap-nav fap-sticky">
    <div class="fap-nav__inner">
      <a class="fap-brand" href="${PATHS.home}">Fund-a-Paw</a>

      <nav class="fap-menu" aria-label="Primary">
        <ul class="fap-menu__list">
          <li class="has-submenu">
            <a href="${PATHS.shelters}" class="fap-link">Shelters</a>
            <div class="submenu" role="menu">
              <a class="fap-dropdown__item" href="${PATHS.urgentShelter}" role="menuitem">Urgent shelter needs</a>
              <a class="fap-dropdown__item" href="${PATHS.urgentAnimals}" role="menuitem">Urgent animal needs</a>
            </div>
          </li>
          <li><a class="fap-link" href="${PATHS.partners}">Our Partners</a></li>
          <li><a class="fap-link" href="${PATHS.contact}">Contact</a></li>
          <li><a class="fap-link" href="${PATHS.about}">About Us</a></li>
        </ul>
      </nav>

      <!-- CTA trio -->
      <div class="fap-ctas">
        <a class="btn btn-ghost"  href="${PATHS.shelters}">Find a Shelter</a>
        <a class="btn btn-urgent" href="${PATHS.urgentAnimals}">Urgent Needs</a>
        <a class="btn btn-primary" href="${PATHS.donate}">Donate</a>
      </div>

      <button class="fap-burger" id="fap-burger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>

    <nav class="fap-mobile" id="fap-mobile" aria-label="Mobile">
      <a class="fap-link" href="${PATHS.shelters}">Shelters</a>
      <a class="fap-link" href="${PATHS.urgentShelter}">Urgent shelter needs</a>
      <a class="fap-link" href="${PATHS.urgentAnimals}">Urgent animal needs</a>
      <a class="fap-link" href="${PATHS.partners}">Our Partners</a>
      <a class="fap-link" href="${PATHS.contact}">Contact</a>
      <a class="fap-link" href="${PATHS.about}">About Us</a>
      <div class="mt-3 grid gap-2">
        <a class="btn btn-ghost w-full"  href="${PATHS.shelters}">Find a Shelter</a>
        <a class="btn btn-urgent w-full" href="${PATHS.urgentAnimals}">Urgent Needs</a>
        <a class="btn btn-primary w-full" href="${PATHS.donate}">Donate</a>
      </div>
    </nav>
  </div>`;

  // mobile toggle
  const burger = document.getElementById('fap-burger');
  const mobile = document.getElementById('fap-mobile');
  burger?.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  const sticky = document.querySelector('.fap-sticky');
  const onScroll = () => sticky?.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Floating donate button (hidden on donate page)
const onDonateFab = () => {
  if (/donate\.html/i.test(location.pathname+location.hash)) return;
  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const href = (inTemplates ? '../../' : './') + 'templates/fund-a-paw/donate.html';
  if (!document.getElementById('donate-fab')) {
    const a = document.createElement('a');
    a.id = 'donate-fab';
    a.className = 'donate-fab';
    a.href = href;
    a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                   <span>Donate</span>`;
    document.body.appendChild(a);
  }
};
onDonateFab();
window.addEventListener('hashchange', onDonateFab);

// Fixed-nav: set body padding to nav height + add shadow on scroll
const nav = document.querySelector('.fap-sticky');
if (nav) {
  const setPad = () => {
    document.body.classList.add('has-fixed-nav');
    document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
  };
  setPad();
  window.addEventListener('resize', setPad);

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

})();

