// nav.js — consistent header everywhere
(function () {
  const mount = document.getElementById('site-nav');
  if (!mount || mount.dataset.nav === 'off') return;

  const PATHS = {
    home: "index.html",
    shelters: "shelters.html",
    animals: "animals.html",
    partners: "partners.html",
    contact: "contact.html",
    about: "about.html",
    signup: "signup.html",
    login: "login.html",
  };

  const isLoggedIn = !!localStorage.getItem("fap_auth_token");

  mount.innerHTML = `
  <div class="fap-nav">
    <div class="fap-nav__inner">
      <a class="fap-brand" href="${PATHS.home}">Fund-a-Paw</a>

      <nav class="fap-menu" aria-label="Primary">
        <ul class="fap-menu__list">
          <li class="has-submenu">
            <a href="${PATHS.shelters}" class="fap-link">Shelters</a>
            <div class="submenu" role="menu">
              <a class="fap-dropdown__item" href="${PATHS.shelters}#urgent-shelter" role="menuitem">Urgent shelter needs</a>
              <a class="fap-dropdown__item" href="${PATHS.animals}#urgent" role="menuitem">Urgent animal needs</a>
            </div>
          </li>
          <li><a class="fap-link" href="${PATHS.partners}">Our Partners</a></li>
          <li><a class="fap-link" href="${PATHS.contact}">Contact</a></li>
          <li><a class="fap-link" href="${PATHS.about}">About Us</a></li>
        </ul>
      </nav>

      <div class="fap-auth">
        ${isLoggedIn
          ? `<button class="fap-btn fap-btn--primary" id="btn-logout" type="button">Log out</button>`
          : `<a class="fap-btn fap-btn--primary" id="link-signup" href="${PATHS.signup}">Sign up</a>`
        }
      </div>

      <button class="fap-burger" id="fap-burger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>

    <nav class="fap-mobile" id="fap-mobile" aria-label="Mobile">
      <details>
        <summary>Shelters</summary>
        <a href="${PATHS.shelters}#urgent-shelter">Urgent shelter needs</a>
        <a href="${PATHS.animals}#urgent">Urgent animal needs</a>
      </details>
      <a href="${PATHS.partners}">Our Partners</a>
      <a href="${PATHS.contact}">Contact</a>
      <a href="${PATHS.about}">About Us</a>
      ${isLoggedIn
        ? `<button class="fap-btn fap-btn--primary fap-btn--block" id="btn-logout-mobile" type="button">Log out</button>`
        : `<a class="fap-btn fap-btn--primary fap-btn--block" id="link-signup-mobile" href="${PATHS.signup}">Sign up</a>`
      }
    </nav>
  </div>`;

  // Mobile burger
  const burger = document.getElementById('fap-burger');
  const mobile = document.getElementById('fap-mobile');
  burger?.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // Auth toggle (placeholder)
  const doLogout = () => { localStorage.removeItem('fap_auth_token'); location.reload(); };
  document.getElementById('btn-logout')?.addEventListener('click', doLogout);
  document.getElementById('btn-logout-mobile')?.addEventListener('click', doLogout);
})();
