// docs/static/fund-a-paw/js/footer.js
(function () {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  const inTemplates = /\/templates\/fund-a-paw\//.test(location.pathname);
  const prefix = inTemplates ? '../../' : './';
  const PAGES = prefix + 'templates/fund-a-paw/';

  mount.innerHTML = `
  <div class="footer">
    <div class="footer__inner">
      <div class="footer__left">
        <div class="footer__brand">© ${new Date().getFullYear()} Fund-a-Paw.</div>
        <div class="footer__trust">Payments processed by <strong>Stripe</strong> · PCI DSS Level 1</div>
        <nav class="footer__links">
          <a href="${PAGES}privacy.html">Privacy</a>
          <a href="${PAGES}about.html#refunds">Refund policy</a>
          <a href="${PAGES}contact.html">Contact</a>
        </nav>
        <div class="socials" aria-label="Social media">
          <a href="#" aria-label="YouTube"  class="social"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M23 7s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C17.6 4 12 4 12 4h0s-5.6 0-8.2.1c-.4 0-1.3.1-2 .9C1.2 5.6 1 7 1 7S.8 8.7.8 10.4v1.2C.8 13.3 1 15 1 15s.2 1.4.8 2c.7.8 1.7.8 2.1.9C6.6 18 12 18 12 18s5.6 0 8.2-.1c.4 0 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.7.2-3.4v-1.2C23.2 8.7 23 7 23 7zM9.8 14.6V7.9l6.2 3.4-6.2 3.3z"/></svg></a>
          <a href="#" aria-label="LinkedIn" class="social"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.1c.7-1.3 2.5-2.7 5.1-2.7 5.5 0 6.5 3.6 6.5 8.3V24h-5v-7.3c0-1.7 0-3.9-2.4-3.9-2.4 0-2.8 1.9-2.8 3.8V24H8z"/></svg></a>
          <a href="#" aria-label="Instagram" class="social"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.2a2.8 2.8 0 110 5.6 2.8 2.8 0 010-5.6zM17.8 6.2a1 1 0 100 2 1 1 0 000-2z"/></svg></a>
          <a href="#" aria-label="Facebook" class="social"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 10-11.6 9.9v-7h-2.3V12h2.3V9.7c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z"/></svg></a>
          <a href="#" aria-label="X" class="social"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.9 2H22l-7 8 8 12h-6.2L11.7 16 7 22H2l7.6-8.7L2.5 2h6.3l4.2 5.9z"/></svg></a>
          <a href="#" aria-label="TikTok" class="social"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 8.1a7 7 0 01-4.2-1.4v6.8a6.6 6.6 0 11-5.6-6.5v3.1a3.4 3.4 0 100 6.7 3.4 3.4 0 003.4-3.4V2h2.2a7 7 0 004.2 6.1z"/></svg></a>
        </div>
      </div>

      <form id="newsletter-form" class="footer__news" autocomplete="on">
        <label for="news-email">Get progress updates</label>
        <div class="footer__input">
          <input id="news-email" name="email" type="email" placeholder="you@email.com" required />
          <button class="btn btn-primary" type="submit">Subscribe</button>
        </div>
        <p id="newsletter-msg" class="text-green-700 text-sm hidden">Thanks! You’re on the list.</p>
      </form>
    </div>
  </div>
`;

})();
