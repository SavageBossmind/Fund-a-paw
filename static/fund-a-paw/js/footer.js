
(function(){
  const el = document.getElementById('site-footer');
  if(!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="bg-gray-900 text-white">
      <div class="container mx-auto px-4 py-10 text-center">
        <p class="text-sm">&copy; ${year} Fund‑a‑Paw. All rights reserved.</p>
        <div class="mt-3 space-x-3 text-gray-300">
          <a href="#" class="hover:text-white">Instagram</a>
          <span>|</span>
          <a href="#" class="hover:text-white">Twitter</a>
          <span>|</span>
          <a href="#" class="hover:text-white">LinkedIn</a>
        </div>
      </div>
    </div>`;
})();