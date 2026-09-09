(function () {
  'use strict';
  var control = document.querySelector('[data-billing-control]');
  var toggle = document.getElementById('annual-billing');
  if (control && toggle) {
    control.hidden = false;
    var renderBilling = function () {
      document.querySelector('[data-price-amount]').textContent = toggle.checked ? '$4,999' : '$449';
      document.querySelector('[data-price-unit]').textContent = toggle.checked ? '/yr upfront' : '/mo';
      document.querySelector('[data-price-note]').textContent = toggle.checked ? 'Annual offer + 2 months free. 14 months of service in total.' : 'Billed monthly. No setup fee.';
      document.querySelector('[data-plan-terms]').textContent = toggle.checked ? 'No setup fee · Pay upfront for 12 months and receive 2 additional months free.' : 'Month-to-month · No long-term contract · Cancel any time.';
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
