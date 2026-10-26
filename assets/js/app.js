(function () {
  'use strict';

  var CONFIG = window.RE_CONFIG || {};
  var MODELS = (window.RE_MODELS || []).filter(function (m) { return m && m.trims && m.trims.length; });
  var STANDARD_TRIM_LABEL = 'גרסה רגילה';
  var BASE_TITLE = 'Royal Enfield ישראל';
  var CONSENT_KEY = 're-cookie-consent';

  var state = { model: 0, trim: 0, color: 0 };

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function formatPrice(n) { return Number(n).toLocaleString('he-IL') + ' ₪'; }
  function trimLabel(t) { return t.name || STANDARD_TRIM_LABEL; }
  // English names are marked lang="en" so screen readers switch pronunciation
  function en(text, cls) {
    var s = el('span', cls, text);
    s.lang = 'en';
    s.dir = 'ltr';
    return s;
  }

  function current() {
    var model = MODELS[state.model];
    var trim = model.trims[state.trim] || model.trims[0];
    var color = trim.colors && trim.colors.length ? trim.colors[state.color] || trim.colors[0] : null;
    return { model: model, trim: trim, color: color };
  }

  // A color stays selected after a trim change only if the new trim offers the same color;
  // otherwise the first color of the new trim is selected, so the picture, the checked
  // radio and the WhatsApp message always show the same, available color.
  function colorIndexFor(trim, previous) {
    var colors = trim.colors || [];
    if (!previous) return 0;
    for (var i = 0; i < colors.length; i++) if (colors[i].name === previous.name) return i;
    return 0;
  }

  function selectionText(c) {
    var parts = [c.model.name];
    if (c.model.trims.length > 1 || c.trim.name) parts.push(trimLabel(c.trim));
    if (c.color) parts.push(c.color.name);
    return parts.join(', ');
  }

  function modelThumb(model) {
    if (model.thumb) return model.thumb;
    for (var i = 0; i < model.trims.length; i++) {
      var colors = model.trims[i].colors || [];
      for (var j = 0; j < colors.length; j++) if (colors[j].image) return colors[j].image;
    }
    return '';
  }

  function swatch(color) {
    var wrap = el('span', 'color-opt__swatch');
    wrap.setAttribute('aria-hidden', 'true');
    (color.swatch && color.swatch.length ? color.swatch : ['#ccc']).slice(0, 2).forEach(function (hex) {
      var dot = el('i');
      dot.style.background = hex;
      wrap.appendChild(dot);
    });
    return wrap;
  }

  function announce(text) {
    var a = $('announcer');
    a.textContent = '';
    // a short delay makes screen readers treat repeated text as a new announcement
    setTimeout(function () { a.textContent = text; }, 50);
  }

  // ---- Static parts built once -------------------------------------------------
  function buildModelList() {
    var list = $('model-list');
    var select = $('f-model');
    MODELS.forEach(function (model, i) {
      var li = el('li', 'models__item');
      var btn = el('button', 'model-btn');
      btn.type = 'button';
      btn.dataset.index = i;
      var thumb = modelThumb(model);
      if (thumb) {
        var img = el('img');
        img.src = thumb;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        btn.appendChild(img);
      } else {
        var ph = el('span', 'model-btn__ph', model.name.replace(/\D/g, ''));
        ph.setAttribute('aria-hidden', 'true');
        btn.appendChild(ph);
      }
      btn.appendChild(en(model.name, 'model-btn__name'));
      btn.addEventListener('click', function () { selectModel(i, true); });
      li.appendChild(btn);
      list.appendChild(li);

      var opt = el('option', null, model.name);
      opt.value = i;
      opt.lang = 'en';
      select.appendChild(opt);

      // Dots repeat the model list for mouse/touch users; keyboard and screen-reader users
      // get the same function from the model list, so the dots stay out of the Tab order.
      var dot = el('button', 'pager__dot');
      dot.type = 'button';
      dot.tabIndex = -1;
      dot.setAttribute('aria-hidden', 'true');
      dot.setAttribute('aria-label', 'הצגת דגם ' + model.name);
      dot.addEventListener('click', function () { selectModel(i, true); });
      $('pager-dots').appendChild(dot);
    });

    select.addEventListener('change', function () { selectModel(Number(select.value), false); });
    $('pager-prev').addEventListener('click', function () { step(-1); });
    $('pager-next').addEventListener('click', function () { step(1); });
  }

  function step(dir) {
    selectModel((state.model + dir + MODELS.length) % MODELS.length, true);
  }

  // ---- Rendering ----------------------------------------------------------------
  // Model → rebuilds the trim radios. Trim → rebuilds the color radios. Neither
  // rebuilds the group that holds keyboard focus, so focus is never lost.
  function renderModel() {
    var model = MODELS[state.model];

    $('stage-model').textContent = model.name;
    $('placeholder-name').textContent = model.name;
    document.title = model.name + ' | ' + BASE_TITLE;

    var video = $('stage-video');
    video.hidden = !model.video;
    if (model.video) {
      video.href = model.video;
      $('stage-video-sr').textContent = ' של ' + model.name + ' (נפתח בחלון חדש)';
    }

    var trimList = $('trim-list');
    trimList.textContent = '';
    $('trims').hidden = model.trims.length < 2;
    model.trims.forEach(function (t, i) {
      var label = el('label', 'trim-opt');
      var input = el('input');
      input.type = 'radio';
      input.name = 'trim';
      input.value = i;
      input.checked = i === state.trim;
      input.addEventListener('change', function () {
        var before = current().color;
        state.trim = i;
        state.color = colorIndexFor(t, before);
        renderTrim();
        var c = current();
        var msg = 'רמת גימור ' + trimLabel(t) + ', מחיר ' + formatPrice(t.price);
        if (c.color) msg += ', צבע ' + c.color.name + (before && before.name === c.color.name ? '' : ' (הצבע הוחלף לצבע זמין ברמת גימור זו)');
        announce(msg);
      });
      var box = el('span', 'trim-opt__box');
      box.appendChild(t.name ? en(t.name) : el('span', null, STANDARD_TRIM_LABEL));
      box.appendChild(el('span', 'trim-opt__price', formatPrice(t.price)));
      label.appendChild(input);
      label.appendChild(box);
      trimList.appendChild(label);
    });

    var phrases = $('phrases');
    phrases.textContent = '';
    (model.phrases || []).slice(0, 3).forEach(function (p) { phrases.appendChild(el('li', null, p)); });

    document.querySelectorAll('.model-btn').forEach(function (b, i) {
      b.setAttribute('aria-pressed', i === state.model ? 'true' : 'false');
    });
    document.querySelectorAll('.pager__dot').forEach(function (d, i) {
      d.setAttribute('aria-pressed', i === state.model ? 'true' : 'false');
    });
    $('f-model').value = state.model;

    renderTrim();
  }

  function renderTrim() {
    var trim = current().trim;

    var price = $('stage-price');
    price.textContent = '';
    price.appendChild(document.createTextNode('מחיר: '));
    price.appendChild(el('strong', null, formatPrice(trim.price)));
    price.appendChild(document.createTextNode(' '));
    price.appendChild(el('small', null, '(לפני הוצאות רישוי)'));

    var colorList = $('color-list');
    colorList.textContent = '';
    var colors = trim.colors || [];
    $('colors').hidden = !colors.length;
    colors.forEach(function (col, i) {
      var label = el('label', 'color-opt');
      var input = el('input');
      input.type = 'radio';
      input.name = 'color';
      input.value = i;
      input.checked = i === state.color;
      input.addEventListener('change', function () {
        state.color = i;
        renderColor();
        announce('צבע ' + col.name);
      });
      label.appendChild(input);
      label.appendChild(swatch(col));
      label.appendChild(el('span', 'color-opt__name', col.name));
      colorList.appendChild(label);
    });

    renderColor();
  }

  function renderColor() {
    var c = current();
    var colors = c.trim.colors || [];

    // Bike image for the exact trim + color; placeholder until real images are added
    var img = $('stage-img');
    if (!img) {
      img = el('img');
      img.id = 'stage-img';
      img.decoding = 'async';
      $('stage-bike').insertBefore(img, $('stage-placeholder'));
    }
    // a trim without colors may carry its own `image`; never borrow another trim's color photo
    var src = c.color ? c.color.image : (!colors.length ? c.trim.image : '');
    if (src) {
      if (img.getAttribute('src') !== src) img.src = src;
      img.alt = 'אופנוע ' + selectionText(c);
      img.hidden = false;
      $('stage-placeholder').hidden = true;
    } else {
      img.hidden = true;
      img.removeAttribute('src');
      $('stage-placeholder').hidden = false;
    }

    $('lead-choice').textContent = 'הבחירה שלך: ' + selectionText(c);
    updateFloatingWhatsApp();
  }

  function selectModel(i, fromList) {
    if (i === state.model) return;
    state.model = i;
    state.trim = 0;
    state.color = 0;
    renderModel();
    var c = current();
    announce('נבחר דגם ' + selectionText(c) + ', מחיר ' + formatPrice(c.trim.price));
    if (history.replaceState) history.replaceState(null, '', '#' + MODELS[i].id);
    if (fromList) revealModelButton(i);
  }

  // Scrolls only the model list (not the page). Unlike scrollIntoView it does not move the
  // browser's Tab starting point, so a deep link (#meteor-350) still starts at the skip links.
  function revealModelButton(i) {
    var btn = document.querySelector('.model-btn[data-index="' + i + '"]');
    if (!btn) return;
    [btn.closest('.models__list'), btn.closest('.models')].forEach(function (box) {
      if (!box) return;
      var b = box.getBoundingClientRect();
      var r = btn.getBoundingClientRect();
      if (box.scrollWidth > box.clientWidth) {
        if (r.left < b.left) box.scrollLeft -= b.left - r.left;
        else if (r.right > b.right) box.scrollLeft += r.right - b.right;
      }
      if (box.scrollHeight > box.clientHeight) {
        if (r.top < b.top) box.scrollTop -= b.top - r.top;
        else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom;
      }
    });
  }

  // ---- WhatsApp -----------------------------------------------------------------
  function waUrl(text) {
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
  }

  function updateFloatingWhatsApp() {
    var text = 'שלום, אשמח לקבל פרטים על Royal Enfield ' + current().model.name;
    document.querySelectorAll('.js-wa-float').forEach(function (a) { a.href = waUrl(text); });
  }

  function track(event, extra) {
    var c = current();
    var payload = {
      event: event,
      campaign: 'royal-enfield-landing',
      model: c.model.name,
      trim: trimLabel(c.trim),
      color: c.color ? c.color.name : ''
    };
    for (var k in extra) payload[k] = extra[k];
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  // Israeli phone: mobile 05X-XXXXXXX, landline/VoIP 0X-XXXXXXX / 07X-XXXXXXX, optional +972 prefix
  function normalizePhone(raw) {
    var digits = String(raw).replace(/[^\d+]/g, '');
    if (digits.indexOf('+972') === 0) digits = '0' + digits.slice(4);
    else if (digits.indexOf('972') === 0 && digits.length >= 11) digits = '0' + digits.slice(3);
    digits = digits.replace(/\D/g, '');
    return /^0(5\d{8}|7\d{8}|[2-489]\d{7})$/.test(digits) ? digits : '';
  }

  function setupForm() {
    var form = $('lead-form');
    var summary = $('error-summary');
    var fields = {
      name: $('f-name'),
      phone: $('f-phone'),
      email: $('f-email'),
      privacy: $('f-privacy')
    };

    function setError(input, message) {
      var err = $(input.id + '-error');
      err.textContent = message || '';
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    function validate() {
      var errors = [];
      var name = fields.name.value.trim();
      var email = fields.email.value.trim();
      if (name.length < 2) errors.push([fields.name, 'נא למלא שם מלא (לפחות 2 תווים).']);
      if (!fields.phone.value.trim()) errors.push([fields.phone, 'נא למלא מספר טלפון.']);
      else if (!normalizePhone(fields.phone.value)) errors.push([fields.phone, 'מספר הטלפון אינו תקין. יש להקליד 9 או 10 ספרות, לדוגמה 050-1234567.']);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push([fields.email, 'כתובת הדוא"ל אינה תקינה. לדוגמה: name@example.com. אפשר גם להשאיר את השדה ריק.']);
      if (!fields.privacy.checked) errors.push([fields.privacy, 'יש לאשר שקראת את מדיניות הפרטיות כדי לשלוח את הפנייה.']);
      return errors;
    }

    Object.keys(fields).forEach(function (key) {
      var input = fields[key];
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', function () {
        if (input.getAttribute('aria-invalid') === 'true') setError(input, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      $('form-done').textContent = '';
      Object.keys(fields).forEach(function (k) { setError(fields[k], ''); });

      var errors = validate();
      var list = $('error-list');
      list.textContent = '';
      if (errors.length) {
        errors.forEach(function (pair) {
          setError(pair[0], pair[1]);
          var li = el('li');
          var a = el('a', null, pair[1]);
          a.href = '#' + pair[0].id;
          a.addEventListener('click', function (ev) { ev.preventDefault(); pair[0].focus(); });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      var c = current();
      var email = fields.email.value.trim();
      var lines = [
        'שלום, אשמח לתאם רכיבת מבחן / לקבל פרטים על Royal Enfield',
        'שם: ' + fields.name.value.trim(),
        'טלפון: ' + normalizePhone(fields.phone.value)
      ];
      if (email) lines.push('דוא"ל: ' + email);
      lines.push('דגם: ' + c.model.name);
      // trim only when the model has trims to choose from, or a named single trim
      if (c.model.trims.length > 1 || c.trim.name) lines.push('רמת גימור: ' + trimLabel(c.trim));
      if (c.color) lines.push('צבע: ' + c.color.name);
      lines.push('אישור דיוור שיווקי: ' + ($('f-marketing').checked ? 'כן' : 'לא'));

      var url = waUrl(lines.join('\n'));
      track('whatsapp_lead', { marketing_consent: $('f-marketing').checked });

      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
      // The site only prepares the message; nothing has been sent yet
      $('form-done').textContent = 'נפתחה הודעת WhatsApp מוכנה עם הפרטים שלך. הפנייה עדיין לא נשלחה – כדי לשלוח אותה יש ללחוץ "שליחה" ב-WhatsApp.';
    });
  }

  // ---- Cookie consent + Google Tag Manager ------------------------------------
  // Choice is kept in localStorage as { value: 'granted' | 'denied', date, version }.
  // Bump CONSENT_VERSION when the cookie policy changes to ask everyone again.
  var CONSENT_VERSION = 1;
  function readConsent() {
    try {
      var raw = JSON.parse(window.localStorage.getItem(CONSENT_KEY));
      return raw && raw.version === CONSENT_VERSION ? raw.value : null;
    } catch (e) { return null; }
  }
  function saveConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: value, date: new Date().toISOString(), version: CONSENT_VERSION }));
    } catch (e) { /* storage blocked: ask again next visit */ }
  }

  // Google Consent Mode: everything non-essential is denied until the visitor accepts
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  var DENIED = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  var GRANTED = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' };
  gtag('consent', 'default', DENIED);

  // Measurement/marketing cookies set by Google Analytics, Google Ads and Meta Pixel
  function deleteTrackingCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl_|_fbp|_fbc|_uet|_clck|_clsk)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var gtmLoaded = false;
  function loadGtm() {
    var id = CONFIG.gtmId;
    if (!id || gtmLoaded) return;
    gtmLoaded = true;
    gtag('consent', 'update', GRANTED);
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  function setupCookies() {
    var banner = $('cookie-banner');
    var consent = readConsent();
    if (consent === 'granted') loadGtm();
    else {
      deleteTrackingCookies();
      if (consent !== 'denied') banner.hidden = false;
    }

    function close(value, message) {
      saveConsent(value);
      banner.hidden = true;
      if (value === 'granted') loadGtm();
      else {
        deleteTrackingCookies();
        if (gtmLoaded) {
          // Scripts that already ran cannot be unloaded: tell them consent was withdrawn,
          // then reload so the page continues without them
          gtag('consent', 'update', DENIED);
          window.location.reload();
          return;
        }
      }
      announce(message);
      // return focus to where the user opened the settings from, or to the page start
      var back = $('cookie-settings').dataset.opened ? $('cookie-settings') : $('stage-title');
      if (back === $('stage-title')) back.setAttribute('tabindex', '-1');
      back.focus();
      delete $('cookie-settings').dataset.opened;
    }
    $('cookie-accept').addEventListener('click', function () { close('granted', 'העוגיות שאינן הכרחיות אושרו.'); });
    $('cookie-decline').addEventListener('click', function () { close('denied', 'העוגיות שאינן הכרחיות נדחו.'); });
    function openSettings() {
      $('cookie-settings').dataset.opened = '1';
      banner.hidden = false;
      $('cookie-accept').focus();
    }
    $('cookie-settings').addEventListener('click', openSettings);
    // "הגדרות עוגיות" on the legal pages links here as /#cookies
    if (location.hash === '#cookies') openSettings();
    window.addEventListener('hashchange', function () { if (location.hash === '#cookies') openSettings(); });
  }

  // ---- Config-driven links --------------------------------------------------------
  function applyConfig() {
    if (CONFIG.testRidePhone) {
      document.querySelectorAll('.js-phone').forEach(function (a) {
        a.textContent = CONFIG.testRidePhone;
        a.href = 'tel:' + CONFIG.testRidePhone.replace(/\D/g, '');
        if (a.hasAttribute('aria-label')) a.setAttribute('aria-label', 'חיוג לתיאום רכיבת מבחן ' + CONFIG.testRidePhone);
      });
    }
    var importer = $('importer-link');
    if (CONFIG.importerUrl) importer.href = CONFIG.importerUrl;
    if (CONFIG.importerLabel) importer.firstChild.nodeValue = CONFIG.importerLabel;
    document.querySelectorAll('.js-wa-float').forEach(function (a) {
      a.addEventListener('click', function (e) { if (e.isTrusted) track('whatsapp_click', { cta_location: 'float' }); });
    });
  }

  // ---- Mobile sticky CTA: visible while the form is off-screen -----------------
  function setupStickyCta() {
    var sticky = $('sticky-cta');
    var link = sticky.querySelector('a');
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      var show = !entries[0].isIntersecting;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      link.tabIndex = show ? 0 : -1;
      document.documentElement.classList.toggle('has-sticky', show);
    }, { threshold: 0 }).observe($('lead'));
  }

  // ---- Keep the focused element clear of the fixed bars (sticky CTA, WhatsApp button)
  function setupFocusClearance() {
    var fixed = [$('sticky-cta'), document.querySelector('.wa-float')];
    document.addEventListener('focusin', function (e) {
      var target = e.target;
      if (!target.getBoundingClientRect || fixed.some(function (f) { return f && f.contains(target); })) return;
      // wait a frame so the browser's own scroll-into-view and the sticky bar update land first
      requestAnimationFrame(function () {
        var r = target.getBoundingClientRect();
        var shift = 0;
        fixed.forEach(function (f) {
          if (!f || getComputedStyle(f).display === 'none') return;
          var b = f.getBoundingClientRect();
          if (b.top >= window.innerHeight) return; // bar is off-screen
          var overlapsX = r.left < b.right && r.right > b.left;
          var overlapsY = r.top < b.bottom && r.bottom > b.top;
          if (overlapsX && overlapsY) shift = Math.max(shift, r.bottom - b.top + 12);
        });
        if (shift) window.scrollBy(0, shift);
      });
    });
  }

  // ---- Init -------------------------------------------------------------------------
  if (!MODELS.length) return;
  buildModelList();
  applyConfig();
  setupForm();
  setupCookies();
  setupStickyCta();
  setupFocusClearance();

  var fromHash = location.hash.slice(1);
  MODELS.forEach(function (m, i) { if (m.id === fromHash) state.model = i; });
  renderModel();
  if (state.model) revealModelButton(state.model);
})();
