/* ==========================================================================
   VMA Management LLC — main.js
   Responsive behavior, lazy booking embed, and interactive outcome demo.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     1. BOOKING CALENDAR EMBED
     Reads data-booking-src="" in index.html. If provided, replaces fallback
     card with an iframe. If empty, the sleek fallback card remains visible.
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
     2. INTERACTIVE OUTCOME DEMO
     Switches between Get Found, Get Chosen, and Get Booked examples.
     --------------------------------------------------------------------- */
  var demo = document.querySelector('[data-outcome-demo]');
  if (demo) {
    var tabs = demo.querySelectorAll('[data-outcome-tab]');
    var panels = demo.querySelectorAll('[data-outcome-panel]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    var outcomes = ['found', 'chosen', 'booked'];
    var currentOutcome = 'found';
    var timers = [];
    var autoCycleInterval = null;
    var userInteracting = false;

    var clearTimers = function () {
      timers.forEach(function (timer) { window.clearTimeout(timer); });
      timers = [];
    };

    var findPanel = function (name) {
      var match = null;
      Array.prototype.forEach.call(panels, function (panel) {
        if (panel.getAttribute('data-outcome-panel') === name) match = panel;
      });
      return match;
    };

    var revealSteps = function (panel, animate) {
      clearTimers();
      var steps = panel.querySelectorAll('[data-step]');

      Array.prototype.forEach.call(steps, function (step) {
        step.classList.remove('is-visible');
      });

      if (!animate || reducedMotion.matches) {
        Array.prototype.forEach.call(steps, function (step) {
          step.classList.add('is-visible');
        });
        return;
      }

      var delay = 80;
      Array.prototype.forEach.call(steps, function (step, index) {
        timers.push(window.setTimeout(function () {
          step.classList.add('is-visible');
        }, delay + (index * 170)));
      });
    };

    var activateOutcome = function (name, animate) {
      var activePanel = findPanel(name);
      if (!activePanel) return;

      currentOutcome = name;
      Array.prototype.forEach.call(tabs, function (tab) {
        var active = tab.getAttribute('data-outcome-tab') === name;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      Array.prototype.forEach.call(panels, function (panel) {
        var active = panel === activePanel;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });

      revealSteps(activePanel, animate);
    };

    // Auto-cycling logic
    var startAutoCycle = function () {
      if (autoCycleInterval || reducedMotion.matches || userInteracting) return;
      autoCycleInterval = window.setInterval(function () {
        var currentIndex = outcomes.indexOf(currentOutcome);
        var nextIndex = (currentIndex + 1) % outcomes.length;
        activateOutcome(outcomes[nextIndex], true);
      }, 6000);
    };

    var stopAutoCycle = function () {
      if (autoCycleInterval) {
        window.clearInterval(autoCycleInterval);
        autoCycleInterval = null;
      }
    };

    // Pause cycling on user hover/interaction
    demo.addEventListener('pointerenter', function () {
      userInteracting = true;
      stopAutoCycle();
    });
    demo.addEventListener('pointerleave', function () {
      userInteracting = false;
      startAutoCycle();
    });

    demo.classList.add('is-ready');
    activateOutcome(currentOutcome, false);

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        userInteracting = true;
        stopAutoCycle();
        activateOutcome(tab.getAttribute('data-outcome-tab'), true);
      });
    });

    // Animate only when the demo enters the viewport.
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          activateOutcome(currentOutcome, !reducedMotion.matches);
          startAutoCycle();
        } else {
          stopAutoCycle();
        }
      }, { threshold: 0.15 });
      observer.observe(demo);
    } else {
      activateOutcome(currentOutcome, false);
      startAutoCycle();
    }
  }

  /* ---------------------------------------------------------------------
     3. COPYRIGHT YEAR
     --------------------------------------------------------------------- */
  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = year;
  });
})();
