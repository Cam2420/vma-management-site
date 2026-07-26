/* ==========================================================================
   VMA Management LLC — main.js
   Three small jobs. Nothing here is required for the page to work.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     1. BOOKING CALENDAR
     Reads the URL you pasted into data-booking-src="" in index.html and
     builds a lazy-loaded iframe from it. If it is empty, the "call us
     instead" panel already in the HTML stays put.
     --------------------------------------------------------------------- */
  var slot = document.querySelector('.book__embed');
  if (slot) {
    var src = (slot.getAttribute('data-booking-src') || '').trim();
    if (src) {
      var frame = document.createElement('iframe');
      frame.src = src;
      frame.loading = 'lazy';
      frame.title = slot.getAttribute('data-booking-title') || 'Booking calendar';
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      slot.textContent = '';
      slot.appendChild(frame);
    }
  }

  /* ---------------------------------------------------------------------
     2. REPLY BUBBLE FADE-IN
     The only animation on this site, and it runs once.
     JS only marks the bubble and reports when it scrolls into view. Whether
     the fade actually happens is decided in styles.css, which limits it to
     desktop widths and to visitors who have not asked for reduced motion.
     Keeping that test in CSS means it re-evaluates on resize or rotate,
     and the bubble is always visible if JavaScript never runs.
     --------------------------------------------------------------------- */
  var bubble = document.getElementById('replyBubble');
  if (bubble) {
    bubble.classList.add('js-anim');

    var reveal = function () {
      bubble.classList.add('is-in');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    var onScroll = function () {
      var box = bubble.getBoundingClientRect();
      var h = window.innerHeight || document.documentElement.clientHeight;
      // in view once the bubble has come up past the bottom 10% of the screen
      if (box.top < h * 0.9 && box.bottom > 0) reveal();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Two frames so the opacity:0 start state is painted before .is-in lands,
    // otherwise the browser skips the transition and the bubble just appears.
    requestAnimationFrame(function () { requestAnimationFrame(onScroll); });

    // Last resort. If anything above is prevented from running, the bubble
    // must never be left invisible — it is the most important thing on the page.
    setTimeout(reveal, 3000);
  }

  /* ---------------------------------------------------------------------
     3. COPYRIGHT YEAR
     --------------------------------------------------------------------- */
  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = year;
  });
})();
