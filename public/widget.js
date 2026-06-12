(function () {
  'use strict';

  // Find every script tag that has data-location set
  var scripts = document.querySelectorAll('script[data-location]');
  if (!scripts.length) return;

  // Derive the base API URL from this script's src
  var scriptSrc = (document.currentScript && document.currentScript.src) || '';
  var baseUrl = scriptSrc ? scriptSrc.replace(/\/widget\.js.*$/, '') : '';

  var CSS = `
    :host { display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
    .rn-wrap { padding: 16px; border-radius: 12px; }
    .rn-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
    .rn-list { display: flex; flex-direction: column; gap: 14px; }
    .rn-card { border-radius: 10px; border: 1px solid; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .rn-card-head { display: flex; align-items: flex-start; gap: 10px; }
    .rn-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .rn-avatar-init { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex-shrink: 0; }
    .rn-meta { flex: 1; min-width: 0; }
    .rn-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rn-date { font-size: 11px; opacity: 0.5; margin-top: 1px; }
    .rn-stars { display: flex; gap: 2px; margin-top: 3px; }
    .rn-star { width: 14px; height: 14px; }
    .rn-text { font-size: 13px; opacity: 0.8; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
    .rn-carousel-inner { position: relative; }
    .rn-carousel-nav { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 12px; }
    .rn-carousel-btn { width: 32px; height: 32px; border-radius: 50%; border: 2px solid; background: transparent; cursor: pointer; font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center; transition: opacity .15s; }
    .rn-carousel-btn:hover { opacity: 0.7; }
    .rn-carousel-count { font-size: 12px; opacity: 0.5; }
    .rn-badge-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; cursor: pointer; border: none; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,.15); transition: opacity .15s; }
    .rn-badge-btn:hover { opacity: 0.85; }
    .rn-badge-popup { position: absolute; bottom: calc(100% + 8px); left: 0; width: 320px; max-height: 400px; overflow-y: auto; border-radius: 12px; border: 1px solid; padding: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,.2); z-index: 9999; }
    .rn-badge-wrap { position: relative; display: inline-block; }
    .rn-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid; display: flex; align-items: center; font-size: 11px; opacity: 0.45; gap: 4px; }
    .rn-footer a { color: inherit; }
    .rn-footer-right { margin-left: auto; }
    .rn-empty { text-align: center; padding: 24px; font-size: 13px; opacity: 0.4; }
    @media (max-width: 480px) { .rn-grid { grid-template-columns: 1fr; } .rn-badge-popup { width: 280px; } }
  `;

  function starSVG(filled, color) {
    var fill = filled ? color : '#d1d5db';
    return '<svg class="rn-star" viewBox="0 0 20 20" fill="' + fill + '" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }

  function starsHTML(rating, color) {
    var html = '<div class="rn-stars">';
    for (var i = 1; i <= 5; i++) html += starSVG(i <= rating, color);
    return html + '</div>';
  }

  function avatarHTML(name, photoUrl, accentColor) {
    if (photoUrl) {
      return '<img class="rn-avatar" src="' + photoUrl + '" alt="' + name + '" />';
    }
    var init = (name || '?').charAt(0).toUpperCase();
    var bg = accentColor + '22';
    return '<div class="rn-avatar-init" style="background:' + bg + ';color:' + accentColor + '">' + init + '</div>';
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return ''; }
  }

  function cardHTML(review, settings) {
    var borderColor = settings.accent_color + '44';
    return '<div class="rn-card" style="background:' + settings.background_color + ';border-color:' + borderColor + ';color:' + settings.text_color + '">' +
      '<div class="rn-card-head">' +
        avatarHTML(review.reviewer_name, review.reviewer_photo_url, settings.accent_color) +
        '<div class="rn-meta">' +
          '<div class="rn-name">' + (review.reviewer_name || 'Anonymous') + '</div>' +
          starsHTML(review.star_rating, settings.accent_color) +
          '<div class="rn-date">' + formatDate(review.review_date) + '</div>' +
        '</div>' +
      '</div>' +
      (review.review_text ? '<div class="rn-text">' + review.review_text.replace(/</g, '&lt;') + '</div>' : '') +
    '</div>';
  }

  function footerHTML(settings) {
    if (!settings.show_agency_branding) return '';
    var borderColor = settings.text_color + '22';
    return '<div class="rn-footer" style="border-color:' + borderColor + ';color:' + settings.text_color + '">' +
      'Powered by <a href="' + settings.agency_url + '" target="_blank" rel="noopener" style="color:' + settings.accent_color + '">' + settings.agency_name + '</a>' +
      '<span class="rn-footer-right">Reviews from Google</span>' +
    '</div>';
  }

  function renderGrid(reviews, settings) {
    if (!reviews.length) return '<div class="rn-empty">No reviews to display.</div>';
    return '<div class="rn-grid">' + reviews.map(function (r) { return cardHTML(r, settings); }).join('') + '</div>';
  }

  function renderList(reviews, settings) {
    if (!reviews.length) return '<div class="rn-empty">No reviews to display.</div>';
    return '<div class="rn-list">' + reviews.map(function (r) { return cardHTML(r, settings); }).join('') + '</div>';
  }

  function renderCarousel(reviews, settings, shadow) {
    if (!reviews.length) return '<div class="rn-empty">No reviews to display.</div>';
    var idx = 0;
    var innerId = 'rn-ci-' + Math.random().toString(36).slice(2);
    var countId = 'rn-cc-' + Math.random().toString(36).slice(2);

    function update() {
      var inner = shadow.getElementById(innerId);
      var count = shadow.getElementById(countId);
      if (inner) inner.innerHTML = cardHTML(reviews[idx], settings);
      if (count) count.textContent = (idx + 1) + ' / ' + reviews.length;
    }

    setTimeout(function () {
      var prev = shadow.getElementById(innerId + '-prev');
      var next = shadow.getElementById(innerId + '-next');
      if (prev) prev.addEventListener('click', function () { idx = (idx - 1 + reviews.length) % reviews.length; update(); });
      if (next) next.addEventListener('click', function () { idx = (idx + 1) % reviews.length; update(); });
    }, 0);

    return '<div class="rn-carousel-inner">' +
      '<div id="' + innerId + '">' + cardHTML(reviews[0], settings) + '</div>' +
      '<div class="rn-carousel-nav">' +
        '<button id="' + innerId + '-prev" class="rn-carousel-btn" style="border-color:' + settings.accent_color + ';color:' + settings.accent_color + '">&#8249;</button>' +
        '<span id="' + countId + '" class="rn-carousel-count" style="color:' + settings.text_color + '">1 / ' + reviews.length + '</span>' +
        '<button id="' + innerId + '-next" class="rn-carousel-btn" style="border-color:' + settings.accent_color + ';color:' + settings.accent_color + '">&#8250;</button>' +
      '</div>' +
    '</div>';
  }

  function renderBadge(reviews, settings, shadow) {
    var avg = reviews.length
      ? (reviews.reduce(function (s, r) { return s + r.star_rating; }, 0) / reviews.length).toFixed(1)
      : '5.0';
    var popupId = 'rn-bp-' + Math.random().toString(36).slice(2);
    var btnId = 'rn-bb-' + Math.random().toString(36).slice(2);
    var open = false;

    setTimeout(function () {
      var btn = shadow.getElementById(btnId);
      var popup = shadow.getElementById(popupId);
      if (btn && popup) {
        btn.addEventListener('click', function () {
          open = !open;
          popup.style.display = open ? 'flex' : 'none';
        });
      }
    }, 0);

    var borderColor = settings.accent_color + '44';
    var cardsHTML = reviews.map(function (r) { return cardHTML(r, settings); }).join('');

    return '<div class="rn-badge-wrap">' +
      '<button id="' + btnId + '" class="rn-badge-btn" style="background:' + settings.accent_color + ';color:#fff">&#9733; ' + avg + ' &nbsp;&middot;&nbsp; Google Reviews</button>' +
      '<div id="' + popupId + '" class="rn-badge-popup" style="display:none;background:' + settings.background_color + ';border-color:' + borderColor + '">' +
        cardsHTML +
      '</div>' +
    '</div>';
  }

  function mount(locationId, container) {
    var shadow = container.attachShadow({ mode: 'open' });
    var style = document.createElement('style');
    style.textContent = CSS;
    shadow.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'rn-wrap';
    shadow.appendChild(wrap);

    fetch(baseUrl + '/api/widget/' + locationId)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var s = data.settings;
        var reviews = data.reviews || [];
        var inner = '';

        wrap.style.background = s.background_color;

        if (s.layout === 'list') inner = renderList(reviews, s);
        else if (s.layout === 'carousel') inner = renderCarousel(reviews, s, shadow);
        else if (s.layout === 'badge') inner = renderBadge(reviews, s, shadow);
        else inner = renderGrid(reviews, s);

        wrap.innerHTML = inner + footerHTML(s);

        // Re-attach carousel/badge event listeners (innerHTML wipes them)
        if (s.layout === 'carousel') renderCarousel(reviews, s, shadow);
        if (s.layout === 'badge') renderBadge(reviews, s, shadow);
      })
      .catch(function () {
        wrap.innerHTML = '<div class="rn-empty">Could not load reviews.</div>';
      });
  }

  // Bootstrap each widget on the page
  scripts.forEach(function (script) {
    var locationId = script.getAttribute('data-location');
    if (!locationId) return;

    var container = document.createElement('div');
    script.parentNode.insertBefore(container, script.nextSibling);
    mount(locationId, container);
  });
})();
