/**
 * ReviewNest premium embed — v2
 *
 * Zero dependencies, vanilla JS, renders inside Shadow DOM so host page CSS
 * (WooCommerce themes etc.) can neither break nor be broken by the widget.
 *
 * Embed formats supported:
 *
 *   New (preferred):
 *     <div id="reviewnest-widget" data-location-id="UUID"
 *          data-mode="carousel|grid|badge" data-theme="light|dark|auto"></div>
 *     <script src="https://.../widget.js" async></script>
 *
 *   Legacy (existing client installs — keeps working unchanged):
 *     <script src="https://.../widget.js" data-location="UUID" async></script>
 *
 * Optional attributes (on the div, or on the legacy script tag):
 *   data-mode      carousel | grid | badge   (overrides dashboard layout setting)
 *   data-theme     light | dark | auto       (default: light / dashboard colours)
 *   data-headline  Custom trust-summary headline
 *   data-cta-text  + data-cta-url            Optional CTA button below the widget
 *   data-demo      Render sample reviews without fetching (demos/testing)
 *
 * Theming (CSS variables — set via attributes or host-page CSS on the div):
 *   data-primary  --rn-primary   accent / buttons / active dot
 *   data-bg       --rn-bg        widget background (default transparent)
 *   data-card     --rn-card      card background
 *   data-text     --rn-text      text colour
 *   data-muted    --rn-muted     secondary text colour
 *   data-star     --rn-star      star colour
 *   data-border   --rn-border    border colour
 *   data-radius   --rn-radius    corner radius (e.g. "12px" or "12")
 *   data-shadow   --rn-shadow-strength   0 = flat … 2 = dramatic (default 1)
 *
 * NOTE: the stylesheet below is mirrored in src/components/widget/theme.ts
 * (React version). Keep the two in sync when editing.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Bootstrap context                                                   */
  /* ------------------------------------------------------------------ */

  var thisScript = document.currentScript ||
    (function () {
      var s = document.querySelectorAll('script[src*="widget.js"]');
      return s.length ? s[s.length - 1] : null;
    })();

  var scriptSrc = (thisScript && thisScript.src) || '';
  var baseUrl = scriptSrc ? scriptSrc.replace(/\/widget\.js.*$/, '') : '';

  /* ------------------------------------------------------------------ */
  /* Stylesheet (scoped to the shadow root)                              */
  /* ------------------------------------------------------------------ */

  var CSS = '' +
':host{display:block;box-sizing:border-box;' +
'font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;' +
'--rn-primary:#0f172a;--rn-primary-contrast:#ffffff;' +
'--rn-bg:transparent;--rn-card:#ffffff;--rn-text:#0f172a;--rn-muted:#64748b;' +
'--rn-star:#f5a623;--rn-border:#e8ecf1;--rn-radius:16px;--rn-shadow-strength:1;' +
'--rn-shadow:0 1px 2px rgba(15,23,42,calc(.04*var(--rn-shadow-strength))),0 14px 36px -14px rgba(15,23,42,calc(.16*var(--rn-shadow-strength)));' +
'--rn-shadow-hover:0 2px 4px rgba(15,23,42,calc(.05*var(--rn-shadow-strength))),0 22px 48px -14px rgba(15,23,42,calc(.26*var(--rn-shadow-strength)))}' +

':host([data-rn-theme="dark"]){--rn-bg:transparent;--rn-card:#171f2f;--rn-text:#f1f5f9;--rn-muted:#94a3b8;' +
'--rn-border:rgba(148,163,184,.16);--rn-star:#fbbf24;' +
'--rn-shadow:0 1px 2px rgba(0,0,0,calc(.25*var(--rn-shadow-strength))),0 14px 36px -14px rgba(0,0,0,calc(.5*var(--rn-shadow-strength)));' +
'--rn-shadow-hover:0 2px 4px rgba(0,0,0,calc(.3*var(--rn-shadow-strength))),0 22px 48px -14px rgba(0,0,0,calc(.65*var(--rn-shadow-strength)))}' +
'@media (prefers-color-scheme:dark){' +
':host([data-rn-theme="auto"]){--rn-bg:transparent;--rn-card:#171f2f;--rn-text:#f1f5f9;--rn-muted:#94a3b8;' +
'--rn-border:rgba(148,163,184,.16);--rn-star:#fbbf24;' +
'--rn-shadow:0 1px 2px rgba(0,0,0,calc(.25*var(--rn-shadow-strength))),0 14px 36px -14px rgba(0,0,0,calc(.5*var(--rn-shadow-strength)));' +
'--rn-shadow-hover:0 2px 4px rgba(0,0,0,calc(.3*var(--rn-shadow-strength))),0 22px 48px -14px rgba(0,0,0,calc(.65*var(--rn-shadow-strength)))}}' +

'*,*::before,*::after{box-sizing:inherit;margin:0;padding:0}' +
'button{font:inherit;background:none;border:none;cursor:pointer;color:inherit}' +
'a{color:inherit}img{display:block;max-width:100%}' +
'.rn-sr{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap}' +

'.rn-wrap{background:var(--rn-bg);border-radius:calc(var(--rn-radius) + 8px);color:var(--rn-text);' +
'line-height:1.5;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}' +

/* ----- trust summary ----- */
'.rn-summary{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:10px 16px 24px}' +
'.rn-headline{font-size:27px;font-weight:750;letter-spacing:-.02em;line-height:1.15;color:var(--rn-text)}' +
'.rn--sm .rn-headline{font-size:21px}' +
'.rn-summary-row{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:8px 16px}' +
'.rn-avg{font-size:40px;font-weight:800;letter-spacing:-.03em;line-height:1}' +
'.rn--sm .rn-avg{font-size:32px}' +
'.rn-stars-frac{position:relative;display:inline-flex}' +
'.rn-stars-fill{position:absolute;top:0;left:0;overflow:hidden;display:inline-flex}' +
'.rn-stars{display:inline-flex;gap:2px;color:var(--rn-star)}' +
'.rn-stars svg{width:22px;height:22px;flex:none}' +
'.rn--sm .rn-summary-row .rn-stars svg{width:19px;height:19px}' +
'.rn-count{display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--rn-muted);font-weight:500}' +
'.rn-count .rn-g{width:18px;height:18px;flex:none}' +

/* ----- cards ----- */
'.rn-card{background:var(--rn-card);border:1px solid var(--rn-border);border-radius:var(--rn-radius);' +
'box-shadow:var(--rn-shadow);padding:22px;display:flex;flex-direction:column;gap:13px;' +
'transition:box-shadow .25s ease,transform .25s ease}' +
'.rn-card:hover{transform:translateY(-3px);box-shadow:var(--rn-shadow-hover)}' +
'.rn--sm .rn-card{padding:18px}' +
'.rn-card-head{display:flex;align-items:center;gap:12px}' +
'.rn-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:none}' +
'.rn-avatar-fb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;' +
'font-weight:700;font-size:16px;background:var(--rn-border);color:var(--rn-text);' +
'background:color-mix(in srgb,var(--rn-primary) 10%,transparent);' +
'color:color-mix(in srgb,var(--rn-primary) 55%,var(--rn-text))}' +
'.rn-who{flex:1;min-width:0}' +
'.rn-name{font-weight:650;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.rn-date{font-size:12.5px;color:var(--rn-muted);margin-top:1px}' +
'.rn-card .rn-stars svg{width:16px;height:16px}' +
'.rn-text{font-size:14.5px;line-height:1.65;color:var(--rn-text);opacity:.92;' +
'display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}' +
'.rn-text.rn-open{display:block;overflow:visible}' +
'.rn-readmore{align-self:flex-start;font-size:13px;font-weight:600;color:var(--rn-primary);margin-top:-5px;border-radius:4px}' +
'.rn-readmore:hover{text-decoration:underline}' +
'.rn-verified{margin-top:auto;display:flex;align-items:center;gap:7px;font-size:12px;color:var(--rn-muted);padding-top:2px}' +
'.rn-verified .rn-g{width:13px;height:13px;flex:none}' +

/* ----- carousel ----- */
'.rn-viewport{overflow:hidden;padding:24px 8px;margin:0 -8px;outline:none;border-radius:8px}' +
'.rn-viewport:focus-visible{box-shadow:0 0 0 2px var(--rn-primary)}' +
'.rn-track{display:flex;gap:14px;transition:transform .55s cubic-bezier(.22,.61,.36,1);will-change:transform}' +
'.rn--md .rn-track{gap:18px}.rn--lg .rn-track{gap:22px}' +
'.rn-track.rn-drag{transition:none}' +
'.rn-slide{flex:none;width:100%;display:flex}' +
'.rn--md .rn-slide{width:calc((100% - 18px)/2)}' +
'.rn--lg .rn-slide{width:calc((100% - 44px)/3)}' +
'.rn-slide .rn-card{width:100%}' +

'.rn-nav{display:flex;align-items:center;justify-content:center;gap:16px;padding-top:4px}' +
'.rn-arrow{width:44px;height:44px;border-radius:50%;border:1px solid var(--rn-border);background:var(--rn-card);' +
'box-shadow:var(--rn-shadow);display:flex;align-items:center;justify-content:center;color:var(--rn-text);' +
'transition:transform .2s ease,box-shadow .2s ease,color .2s ease,opacity .2s ease;flex:none}' +
'.rn-arrow svg{width:20px;height:20px}' +
'.rn-arrow:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--rn-shadow-hover);color:var(--rn-primary)}' +
'.rn-arrow:disabled{opacity:.32;cursor:default}' +
'.rn-arrow:focus-visible{outline:2px solid var(--rn-primary);outline-offset:2px}' +
'.rn-dots{display:flex;gap:2px}' +
'.rn-dot{width:22px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:99px}' +
'.rn-dot span{width:8px;height:8px;border-radius:99px;background:var(--rn-muted);opacity:.35;transition:all .3s ease}' +
'.rn-dot.rn-on span{opacity:1;width:22px;background:var(--rn-primary)}' +
'.rn-dot:focus-visible{outline:2px solid var(--rn-primary);outline-offset:1px}' +

/* ----- review wall (grid/masonry) ----- */
'.rn-wall{column-count:1;column-gap:14px;padding:4px 0}' +
'.rn--md .rn-wall{column-count:2;column-gap:18px}' +
'.rn--lg .rn-wall{column-count:3;column-gap:22px}' +
'.rn-wall .rn-card{break-inside:avoid;margin-bottom:14px}' +
'.rn--md .rn-wall .rn-card{margin-bottom:18px}' +
'.rn--lg .rn-wall .rn-card{margin-bottom:22px}' +

/* ----- trust badge ----- */
'.rn-badge-host{position:relative;display:inline-block}' +
'.rn-badge{display:inline-flex;align-items:center;gap:10px;background:var(--rn-card);border:1px solid var(--rn-border);' +
'border-radius:999px;padding:9px 18px 9px 13px;box-shadow:var(--rn-shadow);color:var(--rn-text);' +
'transition:transform .2s ease,box-shadow .2s ease}' +
'.rn-badge:hover{transform:translateY(-1px);box-shadow:var(--rn-shadow-hover)}' +
'.rn-badge:focus-visible{outline:2px solid var(--rn-primary);outline-offset:2px}' +
'.rn-badge .rn-g{width:20px;height:20px;flex:none}' +
'.rn-badge-score{font-weight:750;font-size:15px}' +
'.rn-badge .rn-stars svg{width:14px;height:14px}' +
'.rn-badge-n{font-size:13px;color:var(--rn-muted);font-weight:500}' +
'.rn-overlay{position:fixed;inset:0;background:rgba(2,8,23,.45);z-index:2147483000;opacity:0;transition:opacity .25s ease}' +
'.rn-overlay.rn-in{opacity:1}' +
'.rn-panel{position:absolute;z-index:2147483001;width:min(400px,92vw);max-height:min(480px,72vh);overflow-y:auto;' +
'background:var(--rn-card);border:1px solid var(--rn-border);border-radius:var(--rn-radius);' +
'box-shadow:var(--rn-shadow-hover);padding:18px;display:flex;flex-direction:column;gap:14px;overscroll-behavior:contain}' +
'.rn-panel-down{top:calc(100% + 12px);left:0}' +
'.rn-panel-up{bottom:calc(100% + 12px);left:0}' +
'.rn-panel .rn-card{box-shadow:none}' +
'.rn-panel .rn-card:hover{transform:none}' +
'.rn-panel-sheet{position:fixed;left:0;right:0;bottom:0;top:auto;width:100%;max-height:78vh;' +
'border-radius:calc(var(--rn-radius) + 4px) calc(var(--rn-radius) + 4px) 0 0;padding-bottom:max(18px,env(safe-area-inset-bottom))}' +
'.rn-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px}' +
'.rn-panel-title{font-weight:700;font-size:15px}' +
'.rn-close{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--rn-muted)}' +
'.rn-close:hover{color:var(--rn-text)}' +

/* ----- CTA + footer ----- */
'.rn-cta-row{display:flex;justify-content:center;padding-top:16px}' +
'.rn-cta{display:inline-flex;align-items:center;gap:8px;background:var(--rn-primary);color:var(--rn-primary-contrast);' +
'font-weight:600;font-size:14.5px;padding:12px 26px;border-radius:999px;box-shadow:var(--rn-shadow);' +
'text-decoration:none;transition:transform .2s ease,box-shadow .2s ease,opacity .2s ease}' +
'.rn-cta:hover{transform:translateY(-2px);box-shadow:var(--rn-shadow-hover);opacity:.94}' +
'.rn-cta:focus-visible{outline:2px solid var(--rn-primary);outline-offset:3px}' +
'.rn-footer{display:flex;justify-content:center;align-items:center;gap:5px;padding-top:14px;' +
'font-size:11.5px;color:var(--rn-muted);opacity:.85}' +
'.rn-footer a{font-weight:600;text-decoration:none}' +
'.rn-footer a:hover{text-decoration:underline}' +

/* ----- states ----- */
'.rn-note{text-align:center;padding:30px 16px;color:var(--rn-muted);font-size:14px}' +
'.rn-skel-row{display:flex;gap:18px;padding:24px 8px;overflow:hidden}' +
'.rn-skel-card{flex:1;min-width:0;border:1px solid var(--rn-border);border-radius:var(--rn-radius);padding:22px;' +
'display:flex;flex-direction:column;gap:12px;background:var(--rn-card)}' +
'.rn-skel{border-radius:6px;background:linear-gradient(90deg,rgba(148,163,184,.14) 25%,rgba(148,163,184,.28) 50%,rgba(148,163,184,.14) 75%);' +
'background-size:200% 100%;animation:rn-shimmer 1.4s linear infinite}' +
'@keyframes rn-shimmer{to{background-position:-200% 0}}' +

'@media (prefers-reduced-motion:reduce){' +
'.rn-track,.rn-card,.rn-arrow,.rn-cta,.rn-badge,.rn-dot span,.rn-overlay{transition:none!important}' +
'.rn-card:hover,.rn-cta:hover,.rn-arrow:hover:not(:disabled),.rn-badge:hover{transform:none}' +
'.rn-skel{animation:none}}';

  /* ------------------------------------------------------------------ */
  /* Tiny DOM helpers (textContent everywhere — no HTML injection)       */
  /* ------------------------------------------------------------------ */

  function el(tag, cls, children) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return n;
  }

  // Static, trusted SVG strings only.
  function svg(markup) {
    var t = document.createElement('template');
    t.innerHTML = markup.trim();
    return t.content.firstChild;
  }

  var STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

  function starSvg(off) {
    return svg('<svg viewBox="0 0 20 20" fill="' + (off ? 'rgba(148,163,184,.45)' : 'currentColor') + '" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>');
  }

  function googleG() {
    return svg('<svg class="rn-g" viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>');
  }

  function chevron(left) {
    return svg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (left ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6') + '"/></svg>');
  }

  function closeIcon() {
    return svg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>');
  }

  function starsRow(rating) {
    var row = el('span', 'rn-stars');
    for (var i = 1; i <= 5; i++) row.appendChild(starSvg(i > rating));
    return row;
  }

  // Fractional stars, e.g. 4.6 → 92% filled overlay.
  function fractionalStars(avg) {
    var wrap = el('span', 'rn-stars-frac');
    var base = el('span', 'rn-stars');
    var fillRow = el('span', 'rn-stars');
    for (var i = 0; i < 5; i++) {
      base.appendChild(starSvg(true));
      fillRow.appendChild(starSvg(false));
    }
    var fill = el('span', 'rn-stars-fill', fillRow);
    fill.style.width = Math.max(0, Math.min(100, (avg / 5) * 100)) + '%';
    wrap.appendChild(base);
    wrap.appendChild(fill);
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', avg + ' out of 5 stars');
    return wrap;
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return ''; }
  }

  var COLOR_RE = /^(#[0-9a-fA-F]{3,8}|[a-zA-Z]+|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%a-z]+\))$/;
  function safeColor(v) { return v && COLOR_RE.test(String(v).trim()) ? String(v).trim() : null; }

  /* ------------------------------------------------------------------ */
  /* Demo data (data-demo mode: sales demos + local testing)             */
  /* ------------------------------------------------------------------ */

  function daysAgo(n) { return new Date(Date.now() - n * 864e5).toISOString(); }

  var DEMO = {
    location: { id: 'demo', name: 'Your Business' },
    stats: { total: 127, average: 4.9 },
    settings: {
      layout: 'carousel', accent_color: '#0f172a', background_color: 'transparent',
      text_color: '', number_of_reviews: 7, min_star_rating: 4,
      show_agency_branding: true, agency_name: 'ReviewNest', agency_url: 'https://reviewnest.com',
    },
    reviews: [
      { reviewer_name: 'Thandi N.', reviewer_photo_url: null, star_rating: 5, review_date: daysAgo(2), review_text: 'Absolutely world-class service from start to finish. The team went above and beyond to make sure every detail was perfect. I have already recommended them to three friends.' },
      { reviewer_name: 'Pieter van der Merwe', reviewer_photo_url: null, star_rating: 5, review_date: daysAgo(6), review_text: 'Outstanding experience. Professional, punctual and the quality of the work speaks for itself. This is how customer service should be done — every business could learn something from these folks. From the first phone call to the final handover everything was communicated clearly, deadlines were met, and the pricing was exactly as quoted with no surprises. Genuinely impressed and will absolutely be using them again.' },
      { reviewer_name: 'Ayesha K.', reviewer_photo_url: null, star_rating: 5, review_date: daysAgo(11), review_text: 'Five stars is not enough. Warm, friendly and incredibly skilled. The whole process was effortless.' },
      { reviewer_name: 'James T.', reviewer_photo_url: null, star_rating: 4, review_date: daysAgo(19), review_text: 'Really great overall. A couple of small things could be smoother, but the core service is excellent and I will definitely be back.' },
      { reviewer_name: 'Lindiwe M.', reviewer_photo_url: null, star_rating: 5, review_date: daysAgo(27), review_text: 'Exceeded every expectation. Fast, reliable and the results speak for themselves. 10/10 would recommend.' },
      { reviewer_name: 'Sarah M.', reviewer_photo_url: null, star_rating: 5, review_date: daysAgo(34), review_text: 'The attention to detail is remarkable. You can tell they genuinely care about their customers.' },
      { reviewer_name: 'Riaan B.', reviewer_photo_url: null, star_rating: 5, review_date: daysAgo(41), review_text: 'Brilliant from beginning to end. Clear communication, fair pricing and a superb final result.' },
    ],
  };

  /* ------------------------------------------------------------------ */
  /* Review card                                                         */
  /* ------------------------------------------------------------------ */

  function reviewCard(review, state, index) {
    var card = el('article', 'rn-card');
    card.setAttribute('aria-label', 'Review by ' + (review.reviewer_name || 'Anonymous'));

    var head = el('div', 'rn-card-head');
    if (review.reviewer_photo_url) {
      var img = el('img', 'rn-avatar');
      img.src = review.reviewer_photo_url;
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.onerror = function () {
        var fb = el('div', 'rn-avatar-fb', (review.reviewer_name || '?').charAt(0).toUpperCase());
        if (img.parentNode) img.parentNode.replaceChild(fb, img);
      };
      head.appendChild(img);
    } else {
      head.appendChild(el('div', 'rn-avatar-fb', (review.reviewer_name || '?').charAt(0).toUpperCase()));
    }
    head.appendChild(el('div', 'rn-who', [
      el('div', 'rn-name', review.reviewer_name || 'Anonymous'),
      el('div', 'rn-date', formatDate(review.review_date)),
    ]));
    card.appendChild(head);
    card.appendChild(starsRow(review.star_rating));

    if (review.review_text) {
      var txt = el('p', 'rn-text', review.review_text);
      card.appendChild(txt);
      if (state.expanded[index]) txt.classList.add('rn-open');

      // "Read more" appears only when the text actually overflows its clamp.
      requestAnimationFrame(function () {
        var overflows = txt.scrollHeight > txt.clientHeight + 2;
        if (!overflows && !state.expanded[index]) return;
        var btn = el('button', 'rn-readmore', state.expanded[index] ? 'Show less' : 'Read more');
        btn.setAttribute('aria-expanded', state.expanded[index] ? 'true' : 'false');
        btn.addEventListener('click', function () {
          state.expanded[index] = !state.expanded[index];
          txt.classList.toggle('rn-open', !!state.expanded[index]);
          btn.textContent = state.expanded[index] ? 'Show less' : 'Read more';
          btn.setAttribute('aria-expanded', state.expanded[index] ? 'true' : 'false');
        });
        card.insertBefore(btn, txt.nextSibling);
      });
    }

    card.appendChild(el('div', 'rn-verified', [googleG(), 'Verified Google Review']));
    return card;
  }

  /* ------------------------------------------------------------------ */
  /* Trust summary                                                       */
  /* ------------------------------------------------------------------ */

  function computeStats(reviews) {
    var n = (reviews || []).length;
    if (!n) return { total: 0, average: 0 };
    var sum = reviews.reduce(function (s, r) { return s + (r.star_rating || 0); }, 0);
    return { total: n, average: Math.round((sum / n) * 10) / 10 };
  }

  function trustSummary(data, cfg) {
    var stats = data.stats && data.stats.total ? data.stats : computeStats(data.reviews);
    var headline = cfg.headline || 'What our customers say';

    return el('div', 'rn-summary', [
      el('h2', 'rn-headline', headline),
      el('div', 'rn-summary-row', [
        el('span', 'rn-avg', stats.average.toFixed(1)),
        fractionalStars(stats.average),
      ]),
      el('div', 'rn-count', [
        googleG(),
        'Based on ' + stats.total + ' Google review' + (stats.total === 1 ? '' : 's'),
      ]),
    ]);
  }

  /* ------------------------------------------------------------------ */
  /* Shared: container-width responsive classes                          */
  /* ------------------------------------------------------------------ */

  function observeSize(wrap, onChange) {
    function apply() {
      var w = wrap.clientWidth;
      wrap.classList.toggle('rn--sm', w < 640);
      wrap.classList.toggle('rn--md', w >= 640 && w < 940);
      wrap.classList.toggle('rn--lg', w >= 940);
      if (onChange) onChange(w);
    }
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(apply).observe(wrap);
    } else {
      window.addEventListener('resize', apply);
    }
    apply();
  }

  /* ------------------------------------------------------------------ */
  /* Luxury Trust Carousel                                               */
  /* ------------------------------------------------------------------ */

  function buildCarousel(reviews, state, wrap) {
    var region = el('div');
    region.setAttribute('role', 'region');
    region.setAttribute('aria-roledescription', 'carousel');
    region.setAttribute('aria-label', 'Customer reviews');

    var viewport = el('div', 'rn-viewport');
    viewport.tabIndex = 0;
    var track = el('div', 'rn-track');
    viewport.appendChild(track);
    region.appendChild(viewport);

    var prev = el('button', 'rn-arrow', chevron(true));
    prev.setAttribute('aria-label', 'Previous reviews');
    var next = el('button', 'rn-arrow', chevron(false));
    next.setAttribute('aria-label', 'Next reviews');
    var dots = el('div', 'rn-dots');
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Review pages');
    var nav = el('div', 'rn-nav', [prev, dots, next]);
    region.appendChild(nav);

    var live = el('div', 'rn-sr');
    live.setAttribute('aria-live', 'polite');
    region.appendChild(live);

    var page = 0;
    var perView = 1;
    var dragging = false;

    function perViewFor(w) { return w >= 940 ? 3 : w >= 640 ? 2 : 1; }
    function pageCount() { return Math.max(1, Math.ceil(reviews.length / perView)); }

    function gapPx() {
      var s = getComputedStyle(track);
      var g = parseFloat(s.columnGap || s.gap);
      return isNaN(g) ? 18 : g;
    }

    function translateFor(p) {
      var slide = track.firstChild;
      if (!slide) return 0;
      var step = slide.getBoundingClientRect().width + gapPx();
      var max = Math.max(0, track.scrollWidth - track.clientWidth);
      return Math.min(p * perView * step, max);
    }

    function buildDots() {
      dots.textContent = '';
      var n = pageCount();
      for (var i = 0; i < n; i++) {
        (function (i) {
          var d = el('button', 'rn-dot', el('span'));
          d.setAttribute('role', 'tab');
          d.setAttribute('aria-label', 'Go to review page ' + (i + 1));
          d.addEventListener('click', function () { page = i; update(); });
          dots.appendChild(d);
        })(i);
      }
    }

    function buildSlides() {
      track.textContent = '';
      reviews.forEach(function (r, i) {
        var slide = el('div', 'rn-slide', reviewCard(r, state, i));
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', 'Review ' + (i + 1) + ' of ' + reviews.length);
        track.appendChild(slide);
      });
      buildDots();
    }

    function update(instant) {
      var n = pageCount();
      page = Math.max(0, Math.min(page, n - 1));
      if (instant) track.classList.add('rn-drag');
      track.style.transform = 'translateX(' + (-translateFor(page)) + 'px)';
      if (instant) requestAnimationFrame(function () { track.classList.remove('rn-drag'); });
      prev.disabled = page === 0;
      next.disabled = page >= n - 1;
      nav.style.display = reviews.length > perView ? '' : 'none';
      Array.prototype.forEach.call(dots.children, function (d, i) {
        d.classList.toggle('rn-on', i === page);
        d.setAttribute('aria-selected', i === page ? 'true' : 'false');
      });
      var from = page * perView + 1;
      var to = Math.min(reviews.length, from + perView - 1);
      live.textContent = 'Showing reviews ' + from + ' to ' + to + ' of ' + reviews.length;
    }

    prev.addEventListener('click', function () { page--; update(); });
    next.addEventListener('click', function () { page++; update(); });
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); page--; update(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); page++; update(); }
    });

    // ---- swipe: live drag that follows the finger, rubber-bands at edges ----
    var startX = 0, startY = 0, startT = 0, baseTx = 0, horizontal = null;
    viewport.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startT = Date.now();
      baseTx = translateFor(page);
      horizontal = null;
      dragging = true;
    }, { passive: true });

    viewport.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;
      if (horizontal === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        horizontal = Math.abs(dx) > Math.abs(dy);
      }
      if (!horizontal) return;
      e.preventDefault(); // horizontal intent confirmed — stop page scroll
      var t = baseTx - dx;
      var max = Math.max(0, track.scrollWidth - track.clientWidth);
      if (t < 0) t = t / 3;                    // rubber-band left edge
      if (t > max) t = max + (t - max) / 3;    // rubber-band right edge
      track.classList.add('rn-drag');
      track.style.transform = 'translateX(' + (-t) + 'px)';
    }, { passive: false });

    viewport.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('rn-drag');
      if (!horizontal) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dt = Date.now() - startT;
      var slide = track.firstChild;
      var threshold = slide ? slide.getBoundingClientRect().width * 0.25 : 60;
      var flick = Math.abs(dx) > 30 && dt < 280;
      if (dx < -threshold || (flick && dx < 0)) page++;
      else if (dx > threshold || (flick && dx > 0)) page--;
      update();
    });

    buildSlides();

    // Container-width responsive (safe inside narrow WooCommerce columns).
    observeSize(wrap, function (w) {
      var pv = perViewFor(w);
      if (pv !== perView) {
        var firstVisible = page * perView;
        perView = pv;
        buildDots();
        page = Math.floor(firstVisible / perView);
      }
      update(true);
    });

    return region;
  }

  /* ------------------------------------------------------------------ */
  /* Review wall (masonry grid)                                          */
  /* ------------------------------------------------------------------ */

  function buildWall(reviews, state, wrap) {
    var wall = el('div', 'rn-wall');
    reviews.forEach(function (r, i) { wall.appendChild(reviewCard(r, state, i)); });
    observeSize(wrap);
    return wall;
  }

  /* ------------------------------------------------------------------ */
  /* Compact trust badge                                                 */
  /* ------------------------------------------------------------------ */

  function buildBadge(data, cfg, state, shadow, host) {
    var reviews = data.reviews || [];
    var stats = data.stats && data.stats.total ? data.stats : computeStats(reviews);

    var badgeHost = el('div', 'rn-badge-host');
    var badge = el('button', 'rn-badge', [
      googleG(),
      el('span', 'rn-badge-score', stats.average.toFixed(1)),
      starsRow(Math.round(stats.average)),
      el('span', 'rn-badge-n', '(' + stats.total + ')'),
    ]);
    badge.setAttribute('aria-haspopup', 'dialog');
    badge.setAttribute('aria-expanded', 'false');
    badge.setAttribute('aria-label',
      'Rated ' + stats.average.toFixed(1) + ' out of 5 from ' + stats.total + ' Google reviews. Open reviews.');
    badgeHost.appendChild(badge);

    var open = false, overlay = null, panel = null;

    function closePanel() {
      if (!open) return;
      open = false;
      badge.setAttribute('aria-expanded', 'false');
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      panel = null; overlay = null;
      document.removeEventListener('click', onDocClick, true);
      document.removeEventListener('keydown', onKey, true);
      badge.focus();
    }

    function onDocClick(e) {
      if (e.composedPath && e.composedPath().indexOf(badgeHost) !== -1) return;
      closePanel();
    }
    function onKey(e) { if (e.key === 'Escape') closePanel(); }

    function openPanel() {
      if (open) return;
      open = true;
      badge.setAttribute('aria-expanded', 'true');

      var isMobile = window.matchMedia('(max-width: 640px)').matches;
      panel = el('div', 'rn-panel');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Google reviews');
      panel.tabIndex = -1;

      var closeBtn = el('button', 'rn-close', closeIcon());
      closeBtn.setAttribute('aria-label', 'Close reviews');
      closeBtn.addEventListener('click', closePanel);
      panel.appendChild(el('div', 'rn-panel-head', [
        el('div', 'rn-panel-title',
          '★ ' + stats.average.toFixed(1) + ' · ' + stats.total + ' Google reviews'),
        closeBtn,
      ]));

      reviews.forEach(function (r, i) { panel.appendChild(reviewCard(r, state, i)); });
      if (!reviews.length) panel.appendChild(el('div', 'rn-note', 'No reviews yet.'));
      if (cfg.ctaText && cfg.ctaUrl) {
        var cta = el('a', 'rn-cta', cfg.ctaText);
        cta.href = cfg.ctaUrl;
        cta.target = '_blank';
        cta.rel = 'noopener';
        panel.appendChild(el('div', 'rn-cta-row', cta));
      }

      if (isMobile) {
        panel.classList.add('rn-panel-sheet');
        overlay = el('div', 'rn-overlay');
        overlay.addEventListener('click', closePanel);
        shadow.appendChild(overlay);
        requestAnimationFrame(function () { overlay.classList.add('rn-in'); });
        shadow.appendChild(panel);
      } else {
        // Open downward unless there is more room above the badge.
        var rect = host.getBoundingClientRect();
        var spaceBelow = window.innerHeight - rect.bottom;
        panel.classList.add(spaceBelow < 500 && rect.top > spaceBelow ? 'rn-panel-up' : 'rn-panel-down');
        badgeHost.appendChild(panel);
      }

      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKey, true);
      panel.focus({ preventScroll: true });
    }

    badge.addEventListener('click', function () { open ? closePanel() : openPanel(); });
    return badgeHost;
  }

  /* ------------------------------------------------------------------ */
  /* Loading skeleton                                                    */
  /* ------------------------------------------------------------------ */

  function skeleton() {
    var row = el('div', 'rn-skel-row');
    for (var i = 0; i < 3; i++) {
      var c = el('div', 'rn-skel-card');
      var head = el('div', 'rn-card-head');
      var av = el('div', 'rn-skel');
      av.style.cssText = 'width:44px;height:44px;border-radius:50%;flex:none';
      var lines = el('div', 'rn-who');
      var l1 = el('div', 'rn-skel'); l1.style.cssText = 'width:60%;height:13px;margin-bottom:7px';
      var l2 = el('div', 'rn-skel'); l2.style.cssText = 'width:40%;height:11px';
      lines.appendChild(l1); lines.appendChild(l2);
      head.appendChild(av); head.appendChild(lines);
      c.appendChild(head);
      for (var j = 0; j < 3; j++) {
        var t = el('div', 'rn-skel');
        t.style.cssText = 'width:' + (j === 2 ? 55 : 100 - j * 6) + '%;height:12px';
        c.appendChild(t);
      }
      row.appendChild(c);
    }
    return row;
  }

  /* ------------------------------------------------------------------ */
  /* Config + mount                                                      */
  /* ------------------------------------------------------------------ */

  function readConfig(source) {
    function attr(n) { return source.getAttribute(n); }
    return {
      locationId: attr('data-location-id') || attr('data-location'),
      mode: attr('data-mode'),
      theme: attr('data-theme'),
      headline: attr('data-headline'),
      ctaText: attr('data-cta-text'),
      ctaUrl: attr('data-cta-url'),
      demo: source.hasAttribute('data-demo'),
      vars: {
        '--rn-primary': safeColor(attr('data-primary')),
        '--rn-bg': safeColor(attr('data-bg')),
        '--rn-card': safeColor(attr('data-card')),
        '--rn-text': safeColor(attr('data-text')),
        '--rn-muted': safeColor(attr('data-muted')),
        '--rn-star': safeColor(attr('data-star')),
        '--rn-border': safeColor(attr('data-border')),
        '--rn-radius': (function (v) {
          if (!v) return null;
          v = String(v).trim();
          if (/^[\d.]+$/.test(v)) return v + 'px';
          return /^[\d.]+(px|rem|em|%)$/.test(v) ? v : null;
        })(attr('data-radius')),
        '--rn-shadow-strength': (function (v) {
          if (v == null || v === '') return null;
          var f = parseFloat(v);
          return isNaN(f) ? null : String(Math.max(0, Math.min(3, f)));
        })(attr('data-shadow')),
      },
    };
  }

  function mount(host, cfg) {
    if (host.getAttribute('data-rn-mounted')) return;
    host.setAttribute('data-rn-mounted', '1');

    if (cfg.theme === 'dark' || cfg.theme === 'auto') {
      host.setAttribute('data-rn-theme', cfg.theme);
    }
    Object.keys(cfg.vars).forEach(function (k) {
      if (cfg.vars[k]) host.style.setProperty(k, cfg.vars[k]);
    });

    var shadow = host.attachShadow({ mode: 'open' });
    var baseStyle = document.createElement('style');
    baseStyle.textContent = CSS;
    shadow.appendChild(baseStyle);
    var settingsStyle = document.createElement('style'); // dashboard colours land here
    shadow.appendChild(settingsStyle);

    var wrap = el('div', 'rn-wrap');
    shadow.appendChild(wrap);
    wrap.appendChild(skeleton());

    function render(data) {
      wrap.textContent = '';
      var settings = data.settings || {};
      var reviews = data.reviews || [];
      var state = { expanded: {} };

      // Dashboard colours become CSS-var defaults. They sit *below* the
      // dark/auto theme palette, host-page CSS on the div, and data-* attrs.
      var vars = [];
      var accent = safeColor(settings.accent_color);
      var bg = safeColor(settings.background_color);
      var text = safeColor(settings.text_color);
      if (accent) vars.push('--rn-primary:' + accent);
      if (bg && bg.toLowerCase() !== '#ffffff' && bg !== 'transparent') vars.push('--rn-bg:' + bg);
      if (text) vars.push('--rn-text:' + text);
      settingsStyle.textContent = vars.length ? ':host{' + vars.join(';') + '}' : '';

      var mode = cfg.mode || settings.layout || 'carousel';
      if (mode === 'list') mode = 'grid';
      if (['carousel', 'grid', 'badge'].indexOf(mode) === -1) mode = 'carousel';

      if (mode === 'badge') {
        wrap.appendChild(buildBadge(data, cfg, state, shadow, host));
        return; // badge is intentionally minimal — no summary/footer around it
      }

      wrap.appendChild(trustSummary(data, cfg));

      if (!reviews.length) {
        wrap.appendChild(el('div', 'rn-note', 'No reviews to display yet.'));
      } else if (mode === 'grid') {
        wrap.appendChild(buildWall(reviews, state, wrap));
      } else {
        wrap.appendChild(buildCarousel(reviews, state, wrap));
      }

      if (cfg.ctaText && cfg.ctaUrl) {
        var cta = el('a', 'rn-cta', cfg.ctaText);
        cta.href = cfg.ctaUrl;
        cta.target = '_blank';
        cta.rel = 'noopener';
        wrap.appendChild(el('div', 'rn-cta-row', cta));
      }

      if (settings.show_agency_branding && settings.agency_name) {
        var footer = el('div', 'rn-footer');
        footer.appendChild(document.createTextNode('Powered by '));
        if (settings.agency_url) {
          var a = el('a', null, settings.agency_name);
          a.href = settings.agency_url;
          a.target = '_blank';
          a.rel = 'noopener';
          footer.appendChild(a);
        } else {
          footer.appendChild(el('span', null, settings.agency_name));
        }
        wrap.appendChild(footer);
      }
    }

    if (cfg.demo) {
      render(DEMO);
      return;
    }

    if (!cfg.locationId) {
      wrap.textContent = '';
      wrap.appendChild(el('div', 'rn-note', 'ReviewNest: missing data-location-id.'));
      return;
    }

    fetch(baseUrl + '/api/widget/' + encodeURIComponent(cfg.locationId))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(render)
      .catch(function () {
        wrap.textContent = '';
        wrap.appendChild(el('div', 'rn-note', 'Reviews are temporarily unavailable.'));
      });
  }

  /* ------------------------------------------------------------------ */
  /* Scan the page and mount every embed                                 */
  /* ------------------------------------------------------------------ */

  function scan() {
    // New format: a div carrying data-location-id (demo embeds may use
    // data-location-id="demo" together with data-demo)
    var divs = document.querySelectorAll(
      'div[data-location-id]:not([data-rn-mounted]),div#reviewnest-widget:not([data-rn-mounted])'
    );
    Array.prototype.forEach.call(divs, function (div) {
      mount(div, readConfig(div));
    });

    // Legacy format: <script src=".../widget.js" data-location="..."> — a
    // container div is created right after the script tag, exactly as before.
    var legacy = document.querySelectorAll('script[data-location]:not([data-rn-mounted])');
    Array.prototype.forEach.call(legacy, function (script) {
      script.setAttribute('data-rn-mounted', '1');
      var container = document.createElement('div');
      script.parentNode.insertBefore(container, script.nextSibling);
      mount(container, readConfig(script));
    });
  }

  scan();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  }

  // Re-scan hook for SPAs / AJAX-injected content (e.g. Woo quick view).
  window.ReviewNest = window.ReviewNest || {};
  window.ReviewNest.scan = scan;
  window.ReviewNest.version = '2.0.0';
})();
