(function () {
  'use strict';
  var menu = document.querySelector('.menu-toggle');
  var nav = document.querySelector('#site-nav');
  if (menu && nav) {
    menu.hidden = false;
    nav.dataset.collapsed = 'true';
    menu.addEventListener('click', function () {
      var expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      nav.dataset.collapsed = String(!expanded);
    });
    nav.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); nav.dataset.collapsed = 'true'; menu.focus(); }
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); nav.dataset.collapsed = 'true'; }
    });
  }
  var profileButton = document.querySelector('[data-google-demo]');
  if (profileButton) profileButton.addEventListener('click', function () {
    var result = document.getElementById('google-conversation');
    var open = profileButton.getAttribute('aria-expanded') !== 'true';
    result.hidden = !open;
    profileButton.setAttribute('aria-expanded', String(open));
    document.getElementById('google-demo-hint').textContent = open ? '2. WhatsApp opens. The customer sends the first message.' : '1. Tap this example contact option to see the next step.';
  });
  var adButton = document.querySelector('[data-ad-demo]');
  if (adButton) adButton.addEventListener('click', function () {
    var chat = document.getElementById('ad-conversation');
    chat.focus({preventScroll:true});
    chat.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    var status = document.getElementById('ad-demo-status');
    if (status) status.textContent = 'Example opened: the customer starts the conversation and shares their job details.';
  });
  document.querySelectorAll('[data-gbp-tabs]').forEach(function (tablist) {
    var tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (item) {
        var active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(tabs[next], true);
      });
    });
  });
  // Manual trade browsing: native touch scrolling plus keyboard and button controls.
  document.querySelectorAll('[data-trade-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.trades__track');
    var cards = Array.from(track.children);
    var previous = carousel.querySelector('[data-trade-prev]');
    var next = carousel.querySelector('[data-trade-next]');
    var position = carousel.querySelector('[data-trade-position]');
    var first = 0;
    var scrollTimer;
    function count() {
      return Math.max(1, parseInt(getComputedStyle(carousel).getPropertyValue('--trades-per-view'), 10) || 1);
    }
    function stride() {
      return cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    }
    function update() {
      first = Math.min(cards.length - count(), Math.max(0, Math.round(track.scrollLeft / stride())));
      position.textContent = (first + 1) + '–' + Math.min(first + count(), cards.length) + ' of ' + cards.length;
      previous.disabled = first === 0;
      next.disabled = first + count() >= cards.length;
    }
    function go(index, immediate) {
      var destination = Math.max(0, Math.min(index, cards.length - count()));
      track.scrollTo({left: destination * stride(), behavior: immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
    previous.addEventListener('click', function () { go(Math.round(track.scrollLeft / stride()) - count()); });
    next.addEventListener('click', function () { go(Math.round(track.scrollLeft / stride()) + count()); });
    track.addEventListener('keydown', function (event) {
      var current = Math.round(track.scrollLeft / stride());
      if (event.key === 'ArrowRight') go(current + count());
      else if (event.key === 'ArrowLeft') go(current - count());
      else if (event.key === 'Home') go(0);
      else if (event.key === 'End') go(cards.length - count());
      else return;
      event.preventDefault();
    });
    track.addEventListener('scroll', function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(update, 120);
    }, {passive: true});
    function resize() { go(first, true); update(); }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
    else window.addEventListener('resize', resize);
    carousel.querySelector('[data-trade-controls]').hidden = false;
    update();
  });
  // Retain existing production integrations. Local reviews never load customer-facing widgets.
  if ((location.hostname === 'vmamgmt.com' || location.hostname === 'www.vmamgmt.com') && !/^\/audit(?:\/|$)/.test(location.pathname)) {
    var widgetIds = /\/(privacy|terms)(\.html)?\/?$/.test(location.pathname) ? ['6a690a9689b8c5f4e82eeac5'] : ['6a7c7bea93aa928cd27f8793','6a690a9689b8c5f4e82eeac5'];
    widgetIds.forEach(function (id) {
      var script = document.createElement('script');
      script.src = 'https://widgets.leadconnectorhq.com/loader.js';
      script.dataset.resourcesUrl = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';
      script.dataset.widgetId = id;
      if (id === '6a7c7bea93aa928cd27f8793') script.dataset.source = 'WEB_USER';
      document.body.appendChild(script);
    });
  } else if (['localhost','127.0.0.1','::1'].indexOf(location.hostname) !== -1) {
    var notice = document.createElement('div');
    notice.className = 'preview-indicator';
    notice.textContent = 'Website preview · Not published · Example interactions stay on this page';
    document.body.insertBefore(notice, document.querySelector('.hdr'));
  }
})();
