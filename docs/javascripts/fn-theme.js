/* ═══════════════════════════════════════════════════════════════
   FIVENORTH CUSTOM BEHAVIOR
   - Theme toggle (Light ⇄ Dark) — default = dark
   - Mobile hamburger menu
   - Active tab highlight based on URL
   - Hero grid animation (Home page only)

   Designed to survive MkDocs Material's `navigation.instant`, which
   swaps the <body> content on each navigation. We achieve this by
   binding a SINGLE click listener to `document` (which is never
   replaced) and dispatching via `closest()`.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const FN_THEME_KEY = 'fn-theme';
  const SCHEME_LIGHT = 'default';
  const SCHEME_DARK  = 'slate';

  /* ═════════════════ Theme ═════════════════ */

  function getStoredTheme() {
    try {
      const v = localStorage.getItem(FN_THEME_KEY);
      return (v === 'light' || v === 'dark' || v === 'system') ? v : null;
    } catch (_) { return null; }
  }

  /* Follow OS preference for first-time visitors. */
  function computeTheme() {
    return getStoredTheme() || 'system';
  }

  /* Resolve system preference to actual light/dark */
  function resolveTheme(theme) {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return theme;
  }

  function applyTheme(theme) {
    const resolved = resolveTheme(theme);
    const scheme   = resolved === 'light' ? SCHEME_LIGHT : SCHEME_DARK;
    document.documentElement.setAttribute('data-md-color-scheme', scheme);
    if (document.body) {
      document.body.setAttribute('data-md-color-scheme', scheme);
    }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(FN_THEME_KEY, theme); } catch (_) {}
  }

  /* Apply theme as early as possible to prevent FOUC. */
  applyTheme(computeTheme());

  /* Re-apply when OS theme changes (only takes effect when user chose 'system') */
  try {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if (computeTheme() === 'system') {
        applyTheme('system');
        updatePillActive();
      }
    });
  } catch (_) {}

  /* ═════════════════ Mobile menu helpers ═════════════════ */

  function closeMobileMenu() {
    const drawer = document.querySelector('[data-fn-mobile-nav]');
    const btn    = document.querySelector('[data-fn-hamburger]');
    const line   = btn && btn.querySelector('.fn-hamburger-line');
    if (drawer) drawer.classList.remove('fn-mobile-nav-open');
    if (line)   line.classList.remove('fn-hamburger-open');
    if (btn)    btn.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu(btn) {
    const drawer = document.querySelector('[data-fn-mobile-nav]');
    const line   = btn.querySelector('.fn-hamburger-line');
    if (!drawer || !line) return;
    const open = drawer.classList.toggle('fn-mobile-nav-open');
    line.classList.toggle('fn-hamburger-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  /* ═════════════════ Mobile search overlay ═════════════════
     .fn-search-wrap is now a direct sibling of .fn-header__sticky at
     body level — no backdrop-filter ancestor — so position:fixed is
     always viewport-relative. We just toggle body.fn-mobile-search-active
     and CSS turns .fn-search-wrap into a full-screen overlay. */

  var _mobileSearchOpen = false;
  var _searchFocusRetry = null;

  /* Material emits `<input id="__search" data-md-toggle="search">` at body
     level. Its search module is wired to that exact element via
     `watchToggle(getElement("#__search"))`, so toggling it is how we tell
     Material the search UI is active. */
  function setMdSearchToggle(on) {
    var t = document.getElementById('__search');
    if (!t || t.checked === on) return;
    t.checked = on;
    t.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* The real query field has NO id — it's tagged
     `data-md-component="search-query"`. Earlier code used
     `getElementById('__search')` which returned the hidden CHECKBOX, so
     focus/value/input events went to the wrong element on mobile. */
  function getSearchInput() {
    return document.querySelector('.md-search__input')
        || document.querySelector('[data-md-component="search-query"]');
  }

  function closeMobileSearch() {
    if (!_mobileSearchOpen) return;
    _mobileSearchOpen = false;
    if (_searchFocusRetry) { clearInterval(_searchFocusRetry); _searchFocusRetry = null; }
    document.body.classList.remove('fn-mobile-search-active');
    document.querySelectorAll('[data-fn-search-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      b.classList.remove('is-active');
    });
    setMdSearchToggle(false);
    var q = getSearchInput();
    if (q) {
      q.value = '';
      q.blur();
      q.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function resetMobileSearchState() {
    _mobileSearchOpen = false;
    document.body.classList.remove('fn-mobile-search-active');
    setMdSearchToggle(false);
    document.querySelectorAll('[data-fn-search-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      b.classList.remove('is-active');
    });
  }

  function openMobileSearch() {
    if (_mobileSearchOpen) return;
    _mobileSearchOpen = true;
    document.body.classList.add('fn-mobile-search-active');
    document.querySelectorAll('[data-fn-search-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'true');
      b.classList.add('is-active');
    });

    /* Tell Material's search JS that search is active → enables result routing */
    setMdSearchToggle(true);

    /* Focus the real text input — wait for CSS display change to take effect */
    var q = getSearchInput();
    if (q) {
      requestAnimationFrame(function () {
        q.focus();
        var tries = 0;
        if (_searchFocusRetry) { clearInterval(_searchFocusRetry); }
        _searchFocusRetry = setInterval(function () {
          if (document.activeElement === q || ++tries > 8) {
            clearInterval(_searchFocusRetry);
            _searchFocusRetry = null;
          } else {
            q.focus();
          }
        }, 50);
        /* Dispatch input event so Material processes any pre-existing value
           and activates its result pipeline on mobile. */
        q.dispatchEvent(new Event('input', { bubbles: true }));
      });
      if (!q.dataset.fnMobileSearchEsc) {
        q.dataset.fnMobileSearchEsc = '1';
        q.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') closeMobileSearch();
        });
      }

      /* Material's own × (type=reset) clears input but not our overlay.
         Intercept the form reset and close our mobile search too. */
      var form = q.closest('form');
      if (form && !form._fnResetBound) {
        form._fnResetBound = true;
        form.addEventListener('reset', function () {
          if (_mobileSearchOpen) {
            /* Let the native reset clear input first, then close overlay */
            setTimeout(closeMobileSearch, 0);
          }
        });
      }
    }

    /* Inject a search icon inside the form (once), positioned absolute on the left */
    var wrap = document.querySelector('[data-fn-search-wrap]');
    if (wrap && !wrap.querySelector('.fn-mobile-search-icon')) {
      var searchIcon = document.createElement('span');
      searchIcon.className = 'fn-mobile-search-icon';
      searchIcon.setAttribute('aria-hidden', 'true');
      searchIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
      var form = wrap.querySelector('.md-search__form');
      if (form) form.insertBefore(searchIcon, form.firstChild);
    }

    /* Inject a close button into the search wrap on mobile (once) */
    if (wrap && !wrap.querySelector('.fn-mobile-search-close')) {
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'fn-mobile-search-close';
      closeBtn.setAttribute('aria-label', 'Close search');
      closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
      wrap.appendChild(closeBtn);
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileSearch();
      });
    }
  }

  function bindSearchToggleButtons() {
    document.querySelectorAll('[data-fn-search-toggle]').forEach(function (btn) {
      if (btn.dataset.fnSearchBound === '1') return;
      btn.dataset.fnSearchBound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (_mobileSearchOpen) {
          closeMobileSearch();
        } else {
          closeMobileMenu();
          openMobileSearch();
        }
      });
    });
  }

  /* ═════════════════ Active tab highlight ═════════════════ */

  function isActiveTab(href) {
    if (!href) return false;
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return false;
      const path   = window.location.pathname.replace(/\/index\.html$/, '/');
      const target = url.pathname.replace(/\/index\.html$/, '/');
      if (target === '/' || target === '') return path === '/' || path === '';
      return path === target || path.startsWith(target);
    } catch (_) { return false; }
  }

  function updateActiveTabs() {
    document.querySelectorAll('[data-fn-tab]').forEach(function (el) {
      const href = el.getAttribute('href');
      if (isActiveTab(href)) el.classList.add('is-active');
      else el.classList.remove('is-active');
    });
  }

  /* ═════════════════ Hero grid animation ═════════════════ */

  const GRID_CELLS = [
    { col: 2, row: 6, color: '#D3D8F3', order: 7, drop: 0  },
    { col: 4, row: 6, color: 'white',              drop: 1  },
    { col: 6, row: 6, color: '#E4DCF9', order: 8, drop: 2  },
    { col: 1, row: 5, color: 'white',              drop: 3  },
    { col: 3, row: 5, color: 'white',              drop: 4  },
    { col: 5, row: 5, color: '#D5F4FE', order: 6, drop: 5  },
    { col: 4, row: 4, color: '#CAEEC8', order: 4, drop: 6  },
    { col: 6, row: 4, color: '#D3D8F3', order: 5, drop: 7  },
    { col: 3, row: 3, color: '#F2FF96', order: 3, drop: 8  },
    { col: 5, row: 3, color: 'white',              drop: 9  },
    { col: 7, row: 3, color: 'white',              drop: 10 },
    { col: 4, row: 2, color: '#E4DCF9', order: 1, drop: 11 },
    { col: 6, row: 2, color: '#D5F4FE', order: 2, drop: 12 },
    { col: 5, row: 1, color: 'white',              drop: 13 },
    { col: 7, row: 1, color: '#CAEEC8', order: 0, drop: 14 },
  ];

  const PHASE_DURATION = { drop: 3000, blink: 10000, fadeout: 1000, pause: 600 };
  const NEXT_PHASE     = { drop: 'blink', blink: 'fadeout', fadeout: 'pause', pause: 'drop' };

  let heroTimer = null;

  function buildHeroGrid(container) {
    container.innerHTML = '';
    GRID_CELLS.forEach(function (cell) {
      const el = document.createElement('div');
      const isColored = cell.order != null;
      el.className = 'fn-grid-cell' + (isColored ? ' fn-grid-cell-active' : '');
      el.style.gridColumn = String(cell.col);
      el.style.gridRow    = String(cell.row);
      el.style.setProperty('--cell-color',
        isColored ? cell.color : 'var(--fn-surface-raised)');
      el.style.setProperty('--drop-i', String(cell.drop));
      if (isColored) el.style.setProperty('--cell-i', String(cell.order));
      container.appendChild(el);
    });
  }

  function runHero(container) {
    buildHeroGrid(container);
    let phase = 'drop';
    container.className = 'fn-hero-grid fn-phase-' + phase;
    (function step() {
      heroTimer = setTimeout(function () {
        phase = NEXT_PHASE[phase];
        container.className = 'fn-hero-grid fn-phase-' + phase;
        if (phase === 'drop') buildHeroGrid(container);
        step();
      }, PHASE_DURATION[phase]);
    })();
  }

  function initHero() {
    if (heroTimer) { clearTimeout(heroTimer); heroTimer = null; }
    const container = document.querySelector('[data-fn-hero-grid]');
    const containerMobile = document.querySelector('[data-fn-hero-grid-mobile]');
    if (!container && !containerMobile) return;
    /* Run a single shared phase loop; both grids mirror each other */
    let phase = 'drop';
    function buildBoth() {
      if (container)       buildHeroGrid(container);
      if (containerMobile) buildHeroGrid(containerMobile);
    }
    buildBoth();
    if (container)       container.className       = 'fn-hero-grid fn-phase-' + phase;
    if (containerMobile) containerMobile.className = 'fn-hero-grid fn-phase-' + phase;
    (function step() {
      heroTimer = setTimeout(function () {
        phase = NEXT_PHASE[phase];
        if (container)       container.className       = 'fn-hero-grid fn-phase-' + phase;
        if (containerMobile) containerMobile.className = 'fn-hero-grid fn-phase-' + phase;
        if (phase === 'drop') buildBoth();
        step();
      }, PHASE_DURATION[phase]);
    })();
  }

  /* ═════════════════ Sticky-bar "stuck" detection ═════════════
     The action bar (tabs + search) uses `position: sticky; top: 0`.
     To show a subtle divider ONLY when it's actually pinned to the
     viewport edge, we watch a 1px sentinel placed just above it.
     When the sentinel scrolls out of view → bar is stuck. */

  let stickyObserver = null;

  function initStickyBar() {
    if (stickyObserver) { stickyObserver.disconnect(); stickyObserver = null; }

    const bar = document.querySelector('[data-fn-sticky-bar]');
    if (!bar) return;

    // Ensure a sentinel right above the bar, inside .fn-header.
    let sentinel = document.querySelector('[data-fn-sticky-sentinel]');
    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.setAttribute('data-fn-sticky-sentinel', '');
      sentinel.style.cssText = 'height:1px;width:100%;pointer-events:none;';
      bar.parentNode.insertBefore(sentinel, bar);
    }

    stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // When sentinel is NOT intersecting (scrolled out), bar is stuck.
        if (!entry.isIntersecting) bar.classList.add('is-stuck');
        else bar.classList.remove('is-stuck');
      });
    }, { threshold: 0, rootMargin: '0px' });

    stickyObserver.observe(sentinel);
  }

  /* ═════════════════ Theme pill binding ═════════════════
     Each button in .fn-theme-pill carries data-fn-theme-opt="system|light|dark".
     Clicking it saves + applies that theme and updates the active highlight. */

  function updatePillActive() {
    const current = computeTheme();
    document.querySelectorAll('[data-fn-theme-opt]').forEach(function (btn) {
      const opt = btn.getAttribute('data-fn-theme-opt');
      btn.classList.toggle('is-active', opt === current);
    });
  }

  function bindThemeButtons() {
    document.querySelectorAll('[data-fn-theme-opt]').forEach(function (btn) {
      if (btn.dataset.fnThemeBound === '1') return;
      btn.dataset.fnThemeBound = '1';
      btn.addEventListener('click', function () {
        const theme = btn.getAttribute('data-fn-theme-opt');
        applyTheme(theme);
        saveTheme(theme);
        updatePillActive();
      });
    });
  }

  function bindHamburgerButtons() {
    document.querySelectorAll('[data-fn-hamburger]').forEach(function (btn) {
      if (btn.dataset.fnHamBound === '1') return;
      btn.dataset.fnHamBound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu(btn);
      });
    });
  }

  /* ═════════════════ Desktop search shortcut (⌘K / Ctrl+K) ═════════════════ */

  var _searchShortcutBound = false;

  function initDesktopSearchShortcut() {
    /* Inject ⌘K badge into the search form (once) */
    var form = document.querySelector('.fn-search-wrap .md-search__form');
    if (form && !form.querySelector('.fn-search-kbd')) {
      var kbd = document.createElement('span');
      kbd.className = 'fn-search-kbd';
      kbd.setAttribute('aria-hidden', 'true');
      var isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform || '');
      kbd.innerHTML = isMac
        ? '<kbd>⌘</kbd><kbd>K</kbd>'
        : '<kbd>Ctrl</kbd><kbd>K</kbd>';
      form.appendChild(kbd);
    }

    if (_searchShortcutBound) return;
    _searchShortcutBound = true;

    document.addEventListener('keydown', function (e) {
      /* Only on desktop (search wrap is visible) */
      if (window.innerWidth <= 767) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        var q = getSearchInput();
        if (q) {
          q.focus();
          q.select();
        }
      }
      /* Escape blurs the input */
      if (e.key === 'Escape') {
        var q = getSearchInput();
        if (q && document.activeElement === q) q.blur();
      }
    });
  }

  /* ═════════════════ Per-page init ═════════════════ */

  function initPage() {
    applyTheme(computeTheme());   // reinforce after body swap
    closeMobileMenu();            // reset drawer state on nav
    resetMobileSearchState();     // hard-reset after instant-nav body swap
    updateActiveTabs();
    updatePillActive();           // sync pill highlight
    bindThemeButtons();
    bindHamburgerButtons();
    bindSearchToggleButtons();
    initHero();
    initStickyBar();
    initDesktopSearchShortcut();
  }

  /* ═════════════════ Global (one-time) wiring ═════════════════
     These listeners attach to `document`, which is never swapped
     by Material's instant navigation. Survives all DOM replacements. */

  document.addEventListener('click', function (e) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // Search toggle (open/close mobile search bar)
    const sTgl = target.closest('[data-fn-search-toggle]');
    if (sTgl) {
      e.preventDefault();
      e.stopPropagation();
      if (_mobileSearchOpen) {
        closeMobileSearch();
      } else {
        closeMobileMenu();
        openMobileSearch();
      }
      return;
    }

    // Hamburger
    const ham = target.closest('[data-fn-hamburger]');
    if (ham) {
      e.preventDefault();
      closeMobileSearch();   // close search if open
      toggleMobileMenu(ham);
      return;
    }

    // Mobile nav link → close drawer
    const mLink = target.closest('[data-fn-mobile-nav] a');
    if (mLink) {
      closeMobileMenu();
    }

  }, { capture: false });

  /* ═════════════════ Bootstrap ═════════════════ */

  /* Attach buttons immediately if any already exist (script may load after
     parser has seen the header). No-op if not yet in DOM. */
  bindThemeButtons();
  bindHamburgerButtons();
  bindSearchToggleButtons();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage, { once: true });
  } else {
    initPage();
  }

  /* Also re-bind whenever the header subtree is mutated (Material instant
     navigation replaces body content; this catches it regardless of whether
     document$ is available). */
  const mo = new MutationObserver(function () {
    bindThemeButtons();
    bindHamburgerButtons();
    bindSearchToggleButtons();
  });
  if (document.body) {
    mo.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      mo.observe(document.body, { childList: true, subtree: true });
    }, { once: true });
  }

  /* Re-run per-page init after each instant-nav DOM swap.
     Material exposes `document$` (RxJS-like observable) on the global
     scope. We try a few access paths for robustness across versions. */
  function hookDocument$() {
    try {
      /* Material exposes `window.document$` after bootstrap. */
      const obs = window.document$ || null;
      if (obs && typeof obs.subscribe === 'function') {
        obs.subscribe(initPage);
        return true;
      }
    } catch (_) {}
    return false;
  }

  if (!hookDocument$()) {
    const iv = setInterval(function () {
      if (hookDocument$()) clearInterval(iv);
    }, 200);
    setTimeout(function () { clearInterval(iv); }, 10000);
  }

  /* Final safety net: if document$ is never exposed for some reason,
     watch the URL. Material's instant nav does pushState, so popstate +
     a MutationObserver on <main> will catch the swap. */
  let lastPath = location.pathname;
  const urlCheck = function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      initPage();
    }
  };
  window.addEventListener('popstate', urlCheck);
  // Patch pushState/replaceState so we can detect programmatic nav.
  ['pushState', 'replaceState'].forEach(function (k) {
    const orig = history[k];
    history[k] = function () {
      const r = orig.apply(this, arguments);
      setTimeout(urlCheck, 0);
      return r;
    };
  });
})();
