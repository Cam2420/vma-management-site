/* ==========================================================================
   VMA Management LLC — main.js
   Five small jobs. Nothing here is required for the page to work:
   the copy, the bubble, the FAQ, and the layout all stand without it.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
     2. HEADER COMPACTION (desktop only — see styles.css)
     Adds .is-compact once the visitor has scrolled a little, removes it
     back at the top. On mobile the two-row header stays put so the
     full-width call button never disappears.
     --------------------------------------------------------------------- */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var compactQuery = window.matchMedia('(min-width: 860px)');
    var onCompactScroll = function () {
      hdr.classList.toggle('is-compact', compactQuery.matches && window.scrollY > 80);
    };
    window.addEventListener('scroll', onCompactScroll, { passive: true });
    if (compactQuery.addEventListener) compactQuery.addEventListener('change', onCompactScroll);
    onCompactScroll();
  }

  /* ---------------------------------------------------------------------
     3. THE SIGNATURE SEQUENCE — missed call, typing, reply, timestamp
     The only scripted motion on this site, and it runs once, on desktop
     widths with motion allowed (that gate lives in styles.css, so the
     bubble is always simply visible on mobile, with reduced motion, or
     without JS). JS only says when: arm the device, watch for it to
     scroll into view, then land the reply after the typing beat.
     --------------------------------------------------------------------- */
  var device = document.getElementById('phoneDemo');
  if (device) {
    device.classList.add('js-anim');

    var revealed = false;
    var reveal = function () {
      if (revealed) return;
      revealed = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      // The typing beat, then the reply lands. ~1.3s total.
      setTimeout(function () { device.classList.add('is-in'); }, 850);
    };
    var onScroll = function () {
      var box = device.getBoundingClientRect();
      var h = window.innerHeight || document.documentElement.clientHeight;
      // in view once the device has come up past the bottom 10% of the screen
      if (box.top < h * 0.9 && box.bottom > 0) reveal();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Two frames so the armed start state is painted before .is-in lands,
    // otherwise the browser skips the transition and the bubble just appears.
    requestAnimationFrame(function () { requestAnimationFrame(onScroll); });

    // Last resort. If anything above is prevented from running, the bubble
    // must never be left invisible — it is the most important thing on the page.
    setTimeout(function () { device.classList.add('is-in'); }, 4000);
  }

  /* ---------------------------------------------------------------------
     4. FAQ SMOOTH OPEN/CLOSE
     Progressive enhancement over native <details>: animates the answer
     height instead of snapping. With reduced motion, or if anything here
     fails, the element falls back to its native instant behavior.
     --------------------------------------------------------------------- */
  if (!reduceMotion) {
    Array.prototype.forEach.call(document.querySelectorAll('.faq details'), function (det) {
      var summary = det.querySelector('summary');
      var panel = det.querySelector('.faq__a');
      if (!summary || !panel) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (det.dataset.animating) return;

        var startH = panel.offsetHeight;
        var D = 260;

        if (det.open) {
          // closing: animate current height to 0, then actually close
          det.dataset.animating = '1';
          var closeAnim = panel.animate(
            [{ height: startH + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
            { duration: D, easing: 'cubic-bezier(.22,.61,.21,1)' }
          );
          closeAnim.onfinish = function () {
            det.removeAttribute('open');
            delete det.dataset.animating;
          };
        } else {
          // opening: open first to measure, then animate 0 to full
          det.setAttribute('open', '');
          var endH = panel.offsetHeight;
          det.dataset.animating = '1';
          var openAnim = panel.animate(
            [{ height: '0px', opacity: 0 }, { height: endH + 'px', opacity: 1 }],
            { duration: D, easing: 'cubic-bezier(.22,.61,.21,1)' }
          );
          openAnim.onfinish = function () { delete det.dataset.animating; };
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     5. COPYRIGHT YEAR
     --------------------------------------------------------------------- */
  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = year;
  });
})();
