/*
 * Accessibility menu: display size, high contrast, highlighted links, readable font, text spacing.
 * Our own code – no third party, no cookies. The choice is kept in this browser (localStorage)
 * as a site preference. Loaded in <head> so saved settings apply before the page is painted;
 * the button and panel are added once the page has loaded.
 */
(function () {
  'use strict';

  var KEY = 're-a11y';
  var ZOOMS = [100, 115, 130, 150, 175, 200];
  var TOGGLES = [
    { key: 'contrast', label: 'ניגודיות גבוהה' },
    { key: 'links', label: 'הדגשת קישורים' },
    { key: 'font', label: 'גופן קריא' },
    { key: 'spacing', label: 'ריווח טקסט' }
  ];
  var root = document.documentElement;

  function load() {
    try { return JSON.parse(window.localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(s) {
    try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked: applies to this page only */ }
  }
  function apply(s) {
    TOGGLES.forEach(function (t) { root.classList.toggle('a11y-' + t.key, !!s[t.key]); });
    var zoom = ZOOMS.indexOf(s.zoom) > -1 ? s.zoom : 100;
    if (zoom === 100) root.style.removeProperty('--a11y-zoom');
    else root.style.setProperty('--a11y-zoom', zoom / 100);
  }

  var settings = load();
  apply(settings);

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function build() {
    var wrap = el('aside', { 'class': 'a11y', 'aria-label': 'נגישות' });

    var toggle = el('button', { type: 'button', 'class': 'a11y-toggle', 'aria-expanded': 'false', 'aria-controls': 'a11y-panel' });
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="6.4" r="1.7"/><path d="M6.5 9.4 12 10.6l5.5-1.2M12 10.6v4.2m0 0-2.6 5m2.6-5 2.6 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only">תפריט נגישות</span>';

    var panel = el('section', { id: 'a11y-panel', 'class': 'a11y-panel', 'aria-labelledby': 'a11y-title', hidden: '' });
    var head = el('div', { 'class': 'a11y-panel__head' });
    head.appendChild(el('h2', { id: 'a11y-title', 'class': 'a11y-panel__title' }, 'תפריט נגישות'));
    var close = el('button', { type: 'button', 'class': 'a11y-panel__close' });
    close.innerHTML = '<span aria-hidden="true">✕</span><span class="sr-only">סגירת תפריט הנגישות</span>';
    head.appendChild(close);
    panel.appendChild(head);

    // Display size
    var size = el('div', { 'class': 'a11y-size', role: 'group', 'aria-labelledby': 'a11y-size-label' });
    var sizeLabel = el('p', { id: 'a11y-size-label', 'class': 'a11y-size__label' });
    sizeLabel.appendChild(document.createTextNode('גודל תצוגה: '));
    var sizeValue = el('span', { dir: 'ltr' });
    sizeLabel.appendChild(sizeValue);
    var smaller = el('button', { type: 'button', 'class': 'a11y-btn' }, 'הקטנה');
    var bigger = el('button', { type: 'button', 'class': 'a11y-btn' }, 'הגדלה');
    size.appendChild(sizeLabel);
    size.appendChild(bigger);
    size.appendChild(smaller);
    panel.appendChild(size);

    // On/off options
    var list = el('div', { 'class': 'a11y-options' });
    var toggleButtons = TOGGLES.map(function (t) {
      var b = el('button', { type: 'button', 'class': 'a11y-btn a11y-btn--toggle', 'aria-pressed': 'false' }, t.label);
      b.addEventListener('click', function () {
        settings[t.key] = !settings[t.key];
        update(t.label + (settings[t.key] ? ' הופעל' : ' בוטל'));
      });
      list.appendChild(b);
      return b;
    });
    panel.appendChild(list);

    var reset = el('button', { type: 'button', 'class': 'a11y-btn a11y-btn--reset' }, 'איפוס הגדרות');
    panel.appendChild(reset);
    var statement = el('a', { href: '/accessibility', 'class': 'a11y-panel__link' }, 'הצהרת נגישות');
    panel.appendChild(statement);
    var status = el('p', { 'class': 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });
    panel.appendChild(status);

    // toggle first so Tab moves from it into the open panel; placed right after the skip
    // links so keyboard users reach it early on every page
    wrap.appendChild(toggle);
    wrap.appendChild(panel);
    var skips = document.querySelectorAll('.skip-link');
    var after = skips.length ? skips[skips.length - 1] : null;
    document.body.insertBefore(wrap, after ? after.nextSibling : document.body.firstChild);

    function zoomStep(dir) {
      var i = ZOOMS.indexOf(settings.zoom || 100) + dir;
      if (i < 0 || i >= ZOOMS.length) return;
      settings.zoom = ZOOMS[i];
      update('גודל תצוגה ' + settings.zoom + '%');
    }
    smaller.addEventListener('click', function () { zoomStep(-1); });
    bigger.addEventListener('click', function () { zoomStep(1); });
    reset.addEventListener('click', function () { settings = {}; update('ההגדרות אופסו'); });

    function render() {
      var zoom = settings.zoom || 100;
      sizeValue.textContent = zoom + '%';
      smaller.disabled = zoom === ZOOMS[0];
      bigger.disabled = zoom === ZOOMS[ZOOMS.length - 1];
      TOGGLES.forEach(function (t, i) { toggleButtons[i].setAttribute('aria-pressed', settings[t.key] ? 'true' : 'false'); });
    }
    function update(message) {
      apply(settings);
      save(settings);
      render();
      status.textContent = '';
      setTimeout(function () { status.textContent = message; }, 50);
    }

    function open() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      render();
      bigger.disabled ? smaller.focus() : bigger.focus();
    }
    function shut(returnFocus) {
      if (panel.hidden) return;
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }
    toggle.addEventListener('click', function () { panel.hidden ? open() : shut(true); });
    close.addEventListener('click', function () { shut(true); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); shut(true); }
    });
    // close when focus or a click moves outside the menu (it is not a modal dialog)
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) shut(false); });
    document.addEventListener('focusin', function (e) { if (!wrap.contains(e.target)) shut(false); });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
