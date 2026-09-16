(function () {
  'use strict';
  var control = document.querySelector('[data-billing-control]');
  var toggle = document.getElementById('annual-billing');
  var checkout = document.querySelector('[data-plan-checkout]');
  var monthlyCheckoutUrl = checkout ? checkout.getAttribute('href') : '';
  if (control && toggle) {
    control.hidden = false;
    var renderBilling = function () {
      document.querySelector('[data-price-amount]').textContent = toggle.checked ? '$4,490' : '$449';
      document.querySelector('[data-price-unit]').textContent = toggle.checked ? '/yr upfront' : '/mo';
      document.querySelector('[data-price-note]').textContent = toggle.checked ? 'Get 2 months free. Pay for 10 months, receive 12. $4,490 charged today and every 12 months until cancelled.' : '$449 charged today, then monthly until cancelled. No setup fee.';
      document.querySelector('[data-plan-terms]').textContent = toggle.checked ? 'No setup fee. Cancel before renewal. Service continues through your paid year; no partial-year refund for a change of mind.' : 'Cancel before renewal. Service continues through your paid month; no partial-month refund for a change of mind.';
      if (checkout) {
        checkout.href = toggle.checked ? checkout.getAttribute('data-annual-checkout') : monthlyCheckoutUrl;
        checkout.textContent = toggle.checked ? 'Start My Annual Plan' : 'Start My Monthly Plan';
      }
    };
    toggle.addEventListener('change', renderBilling);
    renderBilling();
  }
  var tabs = document.querySelector('[data-service-tabs]');
  if (tabs) {
    var buttons = tabs.querySelectorAll('[data-service-select]');
    var panels = document.querySelectorAll('[data-service-panel]');
    var selectPanel = function (id) {
      buttons.forEach(function (button) {
        var selected = button.getAttribute('data-service-select') === id;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      panels.forEach(function (panel) { panel.hidden = panel.id !== id; });
    };
    buttons.forEach(function (button) {
      button.addEventListener('click', function () { selectPanel(button.getAttribute('data-service-select')); });
    });
    tabs.hidden = false;
    document.querySelector('.service-guide').classList.add('has-tabs');
    selectPanel('core-services');
  }
}());
