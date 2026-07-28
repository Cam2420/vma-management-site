/* ==========================================================================
   VMA Management LLC — main.js
   Responsive behavior, lazy booking embed, and interactive phone demo.
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
     2. INTERACTIVE PHONE DEMO & MICRO-INTERACTIONS
     Features typing indicator sequence, scenario switching, and auto-cycling.
     --------------------------------------------------------------------- */
  var demo = document.querySelector('[data-phone-demo]');
  if (demo) {
    var tabs = demo.querySelectorAll('[data-scenario-tab]');
    var panels = demo.querySelectorAll('[data-scenario-panel]');
    var depthStage = demo.querySelector('[data-depth-stage]');
    var typing = demo.querySelector('[data-typing]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    var scenarios = ['missed', 'form', 'review'];
    var currentScenario = 'missed';
    var timers = [];
    var autoCycleInterval = null;
    var userInteracting = false;
    var observer = null;

    var clearTimers = function () {
      timers.forEach(function (timer) { window.clearTimeout(timer); });
      timers = [];
    };

    var findPanel = function (name) {
      var match = null;
      Array.prototype.forEach.call(panels, function (panel) {
        if (panel.getAttribute('data-scenario-panel') === name) match = panel;
      });
      return match;
    };

    var revealSteps = function (panel, animate) {
      clearTimers();
      var steps = panel.querySelectorAll('[data-step]');

      if (typing) typing.hidden = true;

      Array.prototype.forEach.call(steps, function (step) {
        step.classList.remove('is-visible');
      });

      if (!animate || reducedMotion.matches) {
        Array.prototype.forEach.call(steps, function (step) {
          step.classList.add('is-visible');
        });
        return;
      }

      var delay = 100;
      Array.prototype.forEach.call(steps, function (step, index) {
        if (index === 1 && typing) {
          // Show typing indicator before revealing sent response bubble
          timers.push(window.setTimeout(function () {
            typing.hidden = false;
          }, delay));

          delay += 550;

          timers.push(window.setTimeout(function () {
            typing.hidden = true;
            step.classList.add('is-visible');
          }, delay));

          delay += 450;
        } else {
          timers.push(window.setTimeout(function () {
            step.classList.add('is-visible');
          }, delay));
          delay += (index === 0 ? 250 : 450);
        }
      });
    };

    var activateScenario = function (name, animate) {
      var activePanel = findPanel(name);
      if (!activePanel) return;

      currentScenario = name;
      Array.prototype.forEach.call(tabs, function (tab) {
        var active = tab.getAttribute('data-scenario-tab') === name;
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
        var currentIndex = scenarios.indexOf(currentScenario);
        var nextIndex = (currentIndex + 1) % scenarios.length;
        activateScenario(scenarios[nextIndex], true);
      }, 4500);
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

    demo.classList.add('demo-ready');
    activateScenario(currentScenario, false);

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        userInteracting = true;
        stopAutoCycle();
        if (depthStage) depthStage.classList.add('is-depth-visible');
        activateScenario(tab.getAttribute('data-scenario-tab'), true);
      });
    });

    // Intersection observer for entrance animation & auto-cycle start
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (depthStage) depthStage.classList.add('is-depth-visible');
          activateScenario(currentScenario, !reducedMotion.matches);
          startAutoCycle();
        } else {
          stopAutoCycle();
        }
      }, { threshold: 0.15 });
      observer.observe(demo);
    } else {
      if (depthStage) depthStage.classList.add('is-depth-visible');
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
