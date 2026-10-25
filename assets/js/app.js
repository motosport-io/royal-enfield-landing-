(function () {
  'use strict';

  var CONFIG = window.RE_CONFIG || {};
  var MODELS = (window.RE_MODELS || []).filter(function (m) { return m && m.trims && m.trims.length; });
  var STANDARD_TRIM_LABEL = 'גרסה רגילה';

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

  function current() {
    var model = MODELS[state.model];
    var trim = model.trims[state.trim] || model.trims[0];
    var color = trim.colors && trim.colors.length ? trim.colors[state.color] || trim.colors[0] : null;
    return { model: model, trim: trim, color: color };
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
    var wrap = el('span', 'color-btn__swatch');
    (color.swatch && color.swatch.length ? color.swatch : ['#ccc']).slice(0, 2).forEach(function (hex) {
      var dot = el('i');
      dot.style.background = hex;
      wrap.appendChild(dot);
    });
    return wrap;
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
        btn.appendChild(el('span', 'model-btn__ph', model.name.replace(/\D/g, '')));
      }
      btn.appendChild(el('span', 'model-btn__name', model.name));
      btn.addEventListener('click', function () { selectModel(i, true); });
      li.appendChild(btn);
      list.appendChild(li);

      var opt = el('option', null, model.name);
      opt.value = i;
      select.appendChild(opt);

      var dot = el('button', 'pager__dot');
      dot.type = 'button';
      dot.setAttribute('aria-label', model.name);
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

  // ---- Rendering --------------------------------------------------------------
  function render() {
    var c = current();
    var model = c.model, trim = c.trim, color = c.color;

    $('stage-model').textContent = model.name;

    var price = $('stage-price');
    price.textContent = '';
    price.appendChild(document.createTextNode('מחיר: '));
    price.appendChild(el('strong', null, formatPrice(trim.price)));
    price.appendChild(document.createTextNode(' '));
    price.appendChild(el('small', null, '(לפני הוצאות רישוי)'));

    var video = $('stage-video');
    video.hidden = !model.video;
    if (model.video) video.href = model.video;

    // Trims: shown only when the model has more than one
    var trimList = $('trim-list');
    trimList.textContent = '';
    $('trims').hidden = model.trims.length < 2;
    trimList.setAttribute('role', 'radiogroup');
    trimList.setAttribute('aria-label', 'רמת גימור');
    model.trims.forEach(function (t, i) {
      var b = el('button', 'trim-btn');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === state.trim ? 'true' : 'false');
      b.appendChild(document.createTextNode(trimLabel(t)));
      b.appendChild(el('span', 'trim-btn__price', formatPrice(t.price)));
      b.addEventListener('click', function () { state.trim = i; state.color = 0; render(); });
      trimList.appendChild(b);
    });

    // Colors: only those of the selected trim
    var colorList = $('color-list');
    colorList.textContent = '';
    var colors = trim.colors || [];
    $('colors').hidden = !colors.length;
    colorList.setAttribute('role', 'radiogroup');
    colorList.setAttribute('aria-label', 'צבע');
    colors.forEach(function (col, i) {
      var li = el('li');
      var b = el('button', 'color-btn');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === state.color ? 'true' : 'false');
      b.appendChild(swatch(col));
      b.appendChild(el('span', 'color-btn__name', col.name));
      b.addEventListener('click', function () { state.color = i; render(); });
      li.appendChild(b);
      colorList.appendChild(li);
    });

    // Bike image for the exact trim + color; placeholder until real images are added
    var img = $('stage-img');
    var src = (color && color.image) || (!colors.length ? modelThumb(model) : '');
    if (src) {
      if (img.getAttribute('src') !== src) img.src = src;
      img.alt = [model.name, trim.name, color && color.name].filter(Boolean).join(' – ');
      img.hidden = false;
      $('stage-placeholder').hidden = true;
    } else {
      img.hidden = true;
      img.removeAttribute('src');
      $('placeholder-name').textContent = model.name;
      $('stage-placeholder').hidden = false;
    }

    var phrases = $('phrases');
    phrases.textContent = '';
    (model.phrases || []).slice(0, 3).forEach(function (p) { phrases.appendChild(el('li', null, p)); });

    document.querySelectorAll('.model-btn').forEach(function (b, i) {
      b.setAttribute('aria-current', i === state.model ? 'true' : 'false');
    });
    document.querySelectorAll('.pager__dot').forEach(function (d, i) {
      d.setAttribute('aria-current', i === state.model ? 'true' : 'false');
    });
    $('f-model').value = state.model;

    $('lead-choice').textContent = 'הבחירה שלך: ' + [model.name, trim.name, color && color.name].filter(Boolean).join(' · ');

    var grade = model.pollutionGrade != null ? model.pollutionGrade : CONFIG.pollutionGrade;
    $('pollution-grade').textContent = grade != null ? grade : '';
    $('pollution-grade').parentNode.hidden = grade == null;

    updateFloatingWhatsApp();
  }

  function selectModel(i, scrollIntoView) {
    if (i === state.model && $('stage-model').textContent) return;
    state.model = i;
    state.trim = 0;
    state.color = 0;
    render();
    if (history.replaceState) history.replaceState(null, '', '#' + MODELS[i].id);
    if (scrollIntoView) {
      var btn = document.querySelector('.model-btn[data-index="' + i + '"]');
      if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  // ---- WhatsApp ---------------------------------------------------------------
  function waUrl(text) {
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
  }

  function updateFloatingWhatsApp() {
    var c = current();
    var text = 'שלום, אשמח לקבל פרטים על Royal Enfield ' + c.model.name;
    document.querySelectorAll('.js-wa-float').forEach(function (a) { a.href = waUrl(text); });
  }

  function track(event, extra) {
    var c = current();
    var payload = {
      event: event,
      campaign: 'royal-enfield-landing',
      model: c.model.name,
      trim: c.trim.name || STANDARD_TRIM_LABEL,
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
    var error = $('form-error');
    var nameInput = $('f-name');
    var phoneInput = $('f-phone');
    var emailInput = $('f-email');
    var terms = $('f-terms');

    function fail(input, message) {
      error.textContent = message;
      if (input.type !== 'checkbox') input.setAttribute('aria-invalid', 'true');
      input.focus();
    }

    [nameInput, phoneInput, emailInput].forEach(function (input) {
      input.addEventListener('input', function () { input.removeAttribute('aria-invalid'); error.textContent = ''; });
    });
    terms.addEventListener('change', function () { error.textContent = ''; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      error.textContent = '';
      $('form-done').hidden = true;

      var name = nameInput.value.trim();
      var phone = normalizePhone(phoneInput.value);
      var email = emailInput.value.trim();

      if (name.length < 2) return fail(nameInput, 'נא למלא שם מלא');
      if (!phone) return fail(phoneInput, 'נא למלא מספר טלפון תקין');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(emailInput, 'כתובת הדוא"ל אינה תקינה');
      if (!terms.checked) return fail(terms, 'יש לאשר את תנאי השימוש ומדיניות הפרטיות');

      var c = current();
      var lines = [
        'שלום, אשמח לתאם רכיבת מבחן / לקבל פרטים על Royal Enfield',
        'שם: ' + name,
        'טלפון: ' + phone
      ];
      if (email) lines.push('דוא"ל: ' + email);
      lines.push('דגם: ' + c.model.name);
      lines.push('רמת גימור: ' + (c.trim.name || STANDARD_TRIM_LABEL));
      if (c.color) lines.push('צבע: ' + c.color.name);
      lines.push('מחיר: ' + formatPrice(c.trim.price));
      lines.push('אישור דיוור שיווקי: ' + ($('f-marketing').checked ? 'כן' : 'לא'));

      var url = waUrl(lines.join('\n'));
      track('whatsapp_lead', { marketing_consent: $('f-marketing').checked });

      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
      $('form-done').hidden = false;
    });
  }

  // ---- Config-driven links ----------------------------------------------------
  function linkOrText(id, href) {
    var node = $(id);
    if (!node || !href) return;
    var a = el('a', null, node.textContent);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    node.replaceWith(a);
  }

  function applyConfig() {
    if (CONFIG.testRidePhone) {
      document.querySelectorAll('.js-phone').forEach(function (a) {
        a.textContent = CONFIG.testRidePhone;
        a.href = 'tel:' + CONFIG.testRidePhone.replace(/\D/g, '');
      });
    }
    if (CONFIG.importerUrl) $('importer-link').href = CONFIG.importerUrl;
    if (CONFIG.importerLabel) $('importer-link').textContent = CONFIG.importerLabel;
    linkOrText('terms-link', CONFIG.termsUrl);
    linkOrText('accessibility-link', CONFIG.accessibilityUrl);
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
    }, { threshold: 0 }).observe($('lead'));
  }

  // ---- Init -------------------------------------------------------------------
  if (!MODELS.length) return;
  buildModelList();
  applyConfig();
  setupForm();
  setupStickyCta();

  var fromHash = location.hash.slice(1);
  var start = 0;
  MODELS.forEach(function (m, i) { if (m.id === fromHash) start = i; });
  state.model = start;
  render();
  if (start) {
    var btn = document.querySelector('.model-btn[data-index="' + start + '"]');
    if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
})();
