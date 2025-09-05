// /static/fund-a-paw/js/partners-demo.js
(function () {
  function initDemoCarousel() {
    const root = document.querySelector('#partners-demo .fapdemo__carousel');
    if (!root) return;

    const viewport = root.querySelector('.fapdemo__viewport');
    const track = root.querySelector('.fapdemo__track');
    const prevBtn = root.querySelector('.fapdemo__control--prev');
    const nextBtn = root.querySelector('.fapdemo__control--next');
    const slides = Array.from(track.children);

    function perView() {
      const first = slides[0];
      if (!first) return 1;
      const w = first.getBoundingClientRect().width || 1;
      const vp = viewport.clientWidth || 1;
      return Math.max(1, Math.round(vp / w)); // 3-up desktop, 2-up tablet, 1-up mobile (matches CSS)
    }

    let index = 0;
    const pages = () => Math.max(1, Math.ceil(slides.length / perView()));
    const clamp = (i) => {
      const p = pages();
      return (i + p) % p;
    };

    function update() {
      const p = perView();
      const itemW = viewport.clientWidth / p;
      const offset = -(index * itemW);
      track.style.transform = `translate3d(${offset}px,0,0)`;
    }

    function next() { index = clamp(index + 1); update(); }
    function prev() { index = clamp(index - 1); update(); }

    // Controls
    nextBtn?.addEventListener('click', () => { stop(); next(); start(); });
    prevBtn?.addEventListener('click', () => { stop(); prev(); start(); });

    // Auto-advance
    let timer = null;
    const interval = parseInt(root.dataset.autoplay || '5000', 10);
    function start() { stop(); timer = setInterval(next, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // Pause on hover/focus; resume on leave/blur
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', start);

    window.addEventListener('resize', update);
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); next(); start(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); stop(); prev(); start(); }
    });

    update();
    start();
  }

  // With "defer" the DOM is parsed already, but this is safe either way.
  document.addEventListener('DOMContentLoaded', initDemoCarousel);
})();
