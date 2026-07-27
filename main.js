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
     2. INTERACTIVE PHONE DEMO
     The messages live in index.html so they remain easy to edit. JavaScript
     only switches scenarios and reveals each step in sequence. Without JS,
     the complete missed-call example remains visible.
     --------------------------------------------------------------------- */
  var demo = document.querySelector('[data-phone-demo]');
  if (demo) {
    var tabs = demo.querySelectorAll('[data-scenario-tab]');
    var panels = demo.querySelectorAll('[data-scenario-panel]');
    var depthStage = demo.querySelector('[data-depth-stage]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var timers = [];
    var currentScenario = 'missed';
    var observer = null;
    var depthFrame = null;
    var depthBounds = null;
    var pendingTiltX = 1;
    var pendingTiltY = -3;
    var pendingLift = -2;

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

      Array.prototype.forEach.call(steps, function (step) {
        step.classList.remove('is-visible');
      });

      if (!animate || reducedMotion.matches) {
        Array.prototype.forEach.call(steps, function (step) {
          step.classList.add('is-visible');
        });
        return;
      }

      Array.prototype.forEach.call(steps, function (step, index) {
        timers.push(window.setTimeout(function () {
          step.classList.add('is-visible');
        }, 120 + (index * 480)));
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

    var writeDepth = function () {
      depthFrame = null;
      if (!depthStage) return;
      depthStage.style.setProperty('--tilt-x', pendingTiltX.toFixed(2) + 'deg');
      depthStage.style.setProperty('--tilt-y', pendingTiltY.toFixed(2) + 'deg');
      depthStage.style.setProperty('--depth-lift', pendingLift.toFixed(2) + 'px');
    };

    var queueDepth = function (tiltX, tiltY, lift) {
      pendingTiltX = tiltX;
      pendingTiltY = tiltY;
      pendingLift = lift;
      if (!depthFrame) depthFrame = window.requestAnimationFrame(writeDepth);
    };

    var resetDepth = function () {
      if (!depthStage) return;
      depthStage.classList.remove('is-interacting');
      depthBounds = null;
      queueDepth(1, -3, -2);
    };

    if (depthStage) {
      depthStage.classList.add('depth-enabled');
      queueDepth(1, -3, -2);

      if (finePointer.matches && !reducedMotion.matches) {
        depthStage.addEventListener('pointerenter', function () {
          depthBounds = depthStage.getBoundingClientRect();
          depthStage.classList.add('is-interacting');
        });
        depthStage.addEventListener('pointermove', function (event) {
          if (!depthBounds) depthBounds = depthStage.getBoundingClientRect();
          depthStage.classList.add('is-interacting');
          var horizontal = ((event.clientX - depthBounds.left) / depthBounds.width) - 0.5;
          var vertical = ((event.clientY - depthBounds.top) / depthBounds.height) - 0.5;
          var tiltX = Math.max(-4, Math.min(4, vertical * -8));
          var tiltY = Math.max(-4, Math.min(4, horizontal * 8));
          queueDepth(tiltX, tiltY, -4);
        });
        depthStage.addEventListener('pointerleave', resetDepth);
        depthStage.addEventListener('pointercancel', resetDepth);
      }
    }

    demo.classList.add('demo-ready');
    activateScenario(currentScenario, false);

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        if (observer) observer.disconnect();
        if (depthStage) depthStage.classList.add('is-depth-visible');
        activateScenario(tab.getAttribute('data-scenario-tab'), true);
      });
    });

    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      Array.prototype.forEach.call(
        findPanel(currentScenario).querySelectorAll('[data-step]'),
        function (step) { step.classList.remove('is-visible'); }
      );
      observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        if (depthStage) depthStage.classList.add('is-depth-visible');
        activateScenario(currentScenario, true);
      }, { threshold: 0.08 });
      observer.observe(depthStage || demo);
    } else if (depthStage) {
      depthStage.classList.add('is-depth-visible');
    }

    var showCurrentWithoutMotion = function () {
      if (depthStage) depthStage.classList.add('is-depth-visible');
      resetDepth();
      activateScenario(currentScenario, false);
    };
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener('change', showCurrentWithoutMotion);
    } else if (reducedMotion.addListener) {
      reducedMotion.addListener(showCurrentWithoutMotion);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) showCurrentWithoutMotion();
    });
  }

  /* ---------------------------------------------------------------------
     3. COPYRIGHT YEAR
     --------------------------------------------------------------------- */
  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = year;
  });
})();
