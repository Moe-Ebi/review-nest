/**
 * Widget stylesheet + palettes for the React (dashboard/preview) version.
 *
 * This is a hand-maintained mirror of the stylesheet in public/widget.js —
 * identical rules, but scoped under `.rn-scope` instead of Shadow DOM `:host`
 * (the dashboard renders without a shadow root). KEEP THE TWO IN SYNC.
 */

export const CSS_VARS = [
  '--rn-primary',
  '--rn-bg',
  '--rn-card',
  '--rn-text',
  '--rn-muted',
  '--rn-star',
  '--rn-border',
  '--rn-radius',
  '--rn-shadow-strength',
] as const

export const SCOPED_CSS = `
.rn-scope{display:block;box-sizing:border-box;font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--rn-primary:#0f172a;--rn-primary-contrast:#ffffff;--rn-bg:transparent;--rn-card:#ffffff;--rn-text:#0f172a;--rn-muted:#64748b;--rn-star:#f5a623;--rn-border:#e8ecf1;--rn-radius:16px;--rn-shadow-strength:1;--rn-shadow:0 1px 2px rgba(15,23,42,calc(.04*var(--rn-shadow-strength))),0 14px 36px -14px rgba(15,23,42,calc(.16*var(--rn-shadow-strength)));--rn-shadow-hover:0 2px 4px rgba(15,23,42,calc(.05*var(--rn-shadow-strength))),0 22px 48px -14px rgba(15,23,42,calc(.26*var(--rn-shadow-strength)))}
.rn-scope[data-rn-theme="dark"]{--rn-bg:transparent;--rn-card:#171f2f;--rn-text:#f1f5f9;--rn-muted:#94a3b8;--rn-border:rgba(148,163,184,.16);--rn-star:#fbbf24;--rn-shadow:0 1px 2px rgba(0,0,0,calc(.25*var(--rn-shadow-strength))),0 14px 36px -14px rgba(0,0,0,calc(.5*var(--rn-shadow-strength)));--rn-shadow-hover:0 2px 4px rgba(0,0,0,calc(.3*var(--rn-shadow-strength))),0 22px 48px -14px rgba(0,0,0,calc(.65*var(--rn-shadow-strength)))}
@media (prefers-color-scheme:dark){.rn-scope[data-rn-theme="auto"]{--rn-bg:transparent;--rn-card:#171f2f;--rn-text:#f1f5f9;--rn-muted:#94a3b8;--rn-border:rgba(148,163,184,.16);--rn-star:#fbbf24;--rn-shadow:0 1px 2px rgba(0,0,0,calc(.25*var(--rn-shadow-strength))),0 14px 36px -14px rgba(0,0,0,calc(.5*var(--rn-shadow-strength)));--rn-shadow-hover:0 2px 4px rgba(0,0,0,calc(.3*var(--rn-shadow-strength))),0 22px 48px -14px rgba(0,0,0,calc(.65*var(--rn-shadow-strength)))}}
.rn-scope *,.rn-scope *::before,.rn-scope *::after{box-sizing:border-box;margin:0;padding:0}
.rn-scope button{font:inherit;background:none;border:none;cursor:pointer;color:inherit}
.rn-scope a{color:inherit}.rn-scope img{display:block;max-width:100%}
.rn-scope .rn-sr{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap}
.rn-wrap{background:var(--rn-bg);border-radius:calc(var(--rn-radius) + 8px);color:var(--rn-text);line-height:1.5;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.rn-wrap.rn-has-bg{padding:22px 18px}
.rn-wrap.rn-has-bg.rn--sm{padding:16px 12px}
.rn-summary{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:10px 16px 24px}
.rn-headline{font-size:27px;font-weight:750;letter-spacing:-.02em;line-height:1.15;color:var(--rn-text)}
.rn--sm .rn-headline{font-size:21px}
.rn-summary-row{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:8px 16px}
.rn-avg{font-size:40px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rn--sm .rn-avg{font-size:32px}
.rn-stars-frac{position:relative;display:inline-flex}
.rn-stars-fill{position:absolute;top:0;left:0;overflow:hidden;display:inline-flex}
.rn-stars{display:inline-flex;gap:2px;color:var(--rn-star)}
.rn-stars svg{width:22px;height:22px;flex:none}
.rn--sm .rn-summary-row .rn-stars svg{width:19px;height:19px}
.rn-count{display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--rn-muted);font-weight:500}
.rn-count .rn-g{width:18px;height:18px;flex:none}
.rn-card{background:var(--rn-card);border:1px solid var(--rn-border);border-radius:var(--rn-radius);box-shadow:var(--rn-shadow);padding:22px;display:flex;flex-direction:column;gap:13px;transition:box-shadow .25s ease,transform .25s ease}
.rn-card:hover{transform:translateY(-3px);box-shadow:var(--rn-shadow-hover)}
.rn--sm .rn-card{padding:18px}
.rn-card-head{display:flex;align-items:center;gap:12px}
.rn-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:none}
.rn-avatar-fb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;background:var(--rn-border);color:var(--rn-text);background:color-mix(in srgb,var(--rn-primary) 10%,transparent);color:color-mix(in srgb,var(--rn-primary) 55%,var(--rn-text))}
.rn-who{flex:1;min-width:0}
.rn-name{font-weight:650;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rn-date{font-size:12.5px;color:var(--rn-muted);margin-top:1px}
.rn-card .rn-stars svg{width:16px;height:16px}
.rn-text{font-size:14.5px;line-height:1.65;color:var(--rn-text);opacity:.92;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.rn-text.rn-open{display:block;overflow:visible}
.rn-readmore{align-self:flex-start;font-size:13px;font-weight:600;color:var(--rn-primary);margin-top:-5px;border-radius:4px}
.rn-readmore:hover{text-decoration:underline}
.rn-verified{margin-top:auto;display:flex;align-items:center;gap:7px;font-size:12px;color:var(--rn-muted);padding-top:2px}
.rn-verified .rn-g{width:13px;height:13px;flex:none}
.rn-viewport{overflow:hidden;padding:24px 8px;margin:0 -8px;outline:none;border-radius:8px}
.rn-viewport:focus-visible{box-shadow:0 0 0 2px var(--rn-primary)}
.rn-track{display:flex;gap:14px;transition:transform .55s cubic-bezier(.22,.61,.36,1);will-change:transform}
.rn--md .rn-track{gap:18px}.rn--lg .rn-track{gap:22px}
.rn-track.rn-drag{transition:none}
.rn-slide{flex:none;width:100%;display:flex}
.rn--md .rn-slide{width:calc((100% - 18px)/2)}
.rn--lg .rn-slide{width:calc((100% - 44px)/3)}
.rn-slide .rn-card{width:100%}
.rn-nav{display:flex;align-items:center;justify-content:center;gap:16px;padding-top:4px}
.rn-arrow{width:44px;height:44px;border-radius:50%;border:1px solid var(--rn-border);background:var(--rn-card);box-shadow:var(--rn-shadow);display:flex;align-items:center;justify-content:center;color:var(--rn-text);transition:transform .2s ease,box-shadow .2s ease,color .2s ease,opacity .2s ease;flex:none}
.rn-arrow svg{width:20px;height:20px}
.rn-arrow:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--rn-shadow-hover);color:var(--rn-primary)}
.rn-arrow:disabled{opacity:.32;cursor:default}
.rn-arrow:focus-visible{outline:2px solid var(--rn-primary);outline-offset:2px}
.rn-dots{display:flex;gap:2px}
.rn-dot{width:22px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:99px}
.rn-dot span{width:8px;height:8px;border-radius:99px;background:var(--rn-muted);opacity:.35;transition:all .3s ease}
.rn-dot.rn-on span{opacity:1;width:22px;background:var(--rn-primary)}
.rn-dot:focus-visible{outline:2px solid var(--rn-primary);outline-offset:1px}
.rn-wall{column-count:1;column-gap:14px;padding:4px 0}
.rn--md .rn-wall{column-count:2;column-gap:18px}
.rn--lg .rn-wall{column-count:3;column-gap:22px}
.rn-wall .rn-card{break-inside:avoid;margin-bottom:14px}
.rn--md .rn-wall .rn-card{margin-bottom:18px}
.rn--lg .rn-wall .rn-card{margin-bottom:22px}
.rn-badge-host{position:relative;display:inline-block}
.rn-badge{display:inline-flex;align-items:center;gap:10px;background:var(--rn-card);border:1px solid var(--rn-border);border-radius:999px;padding:9px 18px 9px 13px;box-shadow:var(--rn-shadow);color:var(--rn-text);transition:transform .2s ease,box-shadow .2s ease}
.rn-badge:hover{transform:translateY(-1px);box-shadow:var(--rn-shadow-hover)}
.rn-badge:focus-visible{outline:2px solid var(--rn-primary);outline-offset:2px}
.rn-badge .rn-g{width:20px;height:20px;flex:none}
.rn-badge-score{font-weight:750;font-size:15px}
.rn-badge .rn-stars svg{width:14px;height:14px}
.rn-badge-n{font-size:13px;color:var(--rn-muted);font-weight:500}
.rn-overlay{position:fixed;inset:0;background:rgba(2,8,23,.45);z-index:2147483000;opacity:0;transition:opacity .25s ease}
.rn-overlay.rn-in{opacity:1}
.rn-panel{position:absolute;z-index:2147483001;width:min(400px,92vw);max-height:min(480px,72vh);overflow-y:auto;background:var(--rn-card);border:1px solid var(--rn-border);border-radius:var(--rn-radius);box-shadow:var(--rn-shadow-hover);padding:18px;display:flex;flex-direction:column;gap:14px;overscroll-behavior:contain}
.rn-panel-down{top:calc(100% + 12px);left:0}
.rn-panel-up{bottom:calc(100% + 12px);left:0}
.rn-panel .rn-card{box-shadow:none}
.rn-panel .rn-card:hover{transform:none}
.rn-panel-sheet{position:fixed;left:0;right:0;bottom:0;top:auto;width:100%;max-height:78vh;border-radius:calc(var(--rn-radius) + 4px) calc(var(--rn-radius) + 4px) 0 0;padding-bottom:max(18px,env(safe-area-inset-bottom))}
.rn-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.rn-panel-title{font-weight:700;font-size:15px}
.rn-close{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--rn-muted)}
.rn-close:hover{color:var(--rn-text)}
.rn-cta-row{display:flex;justify-content:center;padding-top:16px}
.rn-cta{display:inline-flex;align-items:center;gap:8px;background:var(--rn-primary);color:var(--rn-primary-contrast);font-weight:600;font-size:14.5px;padding:12px 26px;border-radius:999px;box-shadow:var(--rn-shadow);text-decoration:none;transition:transform .2s ease,box-shadow .2s ease,opacity .2s ease}
.rn-cta:hover{transform:translateY(-2px);box-shadow:var(--rn-shadow-hover);opacity:.94}
.rn-cta:focus-visible{outline:2px solid var(--rn-primary);outline-offset:3px}
.rn-footer{display:flex;justify-content:center;align-items:center;gap:5px;padding-top:14px;font-size:11.5px;color:var(--rn-muted);opacity:.85}
.rn-footer a{font-weight:600;text-decoration:none}
.rn-footer a:hover{text-decoration:underline}
.rn-note{text-align:center;padding:30px 16px;color:var(--rn-muted);font-size:14px}
@media (prefers-reduced-motion:reduce){.rn-track,.rn-card,.rn-arrow,.rn-cta,.rn-badge,.rn-dot span,.rn-overlay{transition:none!important}.rn-card:hover,.rn-cta:hover,.rn-arrow:hover:not(:disabled),.rn-badge:hover{transform:none}}
`
