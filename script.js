/* ============================================================================
   PIZZA PINO — script.js  (Vanilla JS · no dependencies)
   ----------------------------------------------------------------------------
   المسؤوليات:
     1) محرّك اللغات (i18n): تبديل فوري دون إعادة تحميل + RTL/LTR + localStorage
     2) عرض المنيو من menu-data.js + البحث المتقدّم + نافذة تفاصيل الطبق
     3) شريط الأقسام اللاصق + مؤشر القسم النشط (scroll-spy)
     4) تأثيرات 3D: إمالة البطاقات، بارالاكس، ظهور عند التمرير، إضاءة تفاعلية
     5) عناصر عامة: preloader، شريط تقدّم، زر أعلى الصفحة، lightbox، toast
     6) احترام prefers-reduced-motion
   لا يستخدم أي مكتبات خارجية (Three.js غير مطلوب لتأثيرات الإمالة/البارالاكس).
   ============================================================================ */
(function () {
  "use strict";

  const PINO = window.PINO || {};
  const LANGUAGES = PINO.LANGUAGES || [];
  const UI = PINO.UI || {};
  const PRODUCTS = PINO.products || [];
  const CATEGORIES = PINO.categories || [];
  const t = PINO.t || ((l, k) => k);
  const tCat = PINO.tCat || ((l, c) => c);
  const langDir = PINO.langDir || (() => "ltr");

  const STORE_LANG = "pino.lang";
  const STORE_VIEW = "pino.view"; // "grid" | "list" (محفوظ للاستخدام المستقبلي)

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const state = {
    lang: "en",
    query: "",
    activeCat: "all",
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    byId: {}
  };

  /* ------------------------------------------------------------------------
     SVG icon set (inline, tiny)
     ------------------------------------------------------------------------ */
  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>',
    close:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    globe:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
    arrow:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    up:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    pin:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    phone:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4l2 5-2.5 1.5a12 12 0 006 6L15 14l5 2v4a1 1 0 01-1 1A16 16 0 013 5a1 1 0 011-1z"/></svg>',
    clock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
    mail:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    whats:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.7 15L2 22l5.2-1.3A10 10 0 1012 2zm0 2a8 8 0 11-4.2 14.8l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0112 4zm-3 4c-.2 0-.5.1-.7.3-.3.3-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 3.9 3.4 1.9.8 2.3.6 2.7.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3.2-.5s0-.3 0-.5L9.5 8.6C9.3 8.1 9.1 8.2 9 8.2z"/></svg>',
    star:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3z"/></svg>',
    leaf:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-7 5-12 14-13 0 9-5 14-12 14H5z"/><path d="M5 19c3-3 6-5 9-6"/></svg>',
    sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
    mouse:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="8" y="3" width="8" height="18" rx="4"/><path d="M12 7v3"/></svg>',
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    menu:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    plate:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/></svg>',
    // category glyphs (simple, neutral)
    pizza:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l9 17H3L12 3z"/><circle cx="10" cy="14" r="1.2"/><circle cx="14" cy="16" r="1.2"/><circle cx="13" cy="11" r="1.1"/></svg>',
    soup:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 11h16a8 8 0 01-8 8 8 8 0 01-8-8z"/><path d="M9 8c0-1.5 1-2 1-3M13 8c0-1.5 1-2 1-3"/></svg>',
    salad:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M4 12h16a8 8 0 01-16 0z"/><path d="M12 12c0-4 3-6 6-6-1 3-3 5-6 6zM12 12c0-4-3-6-6-6 1 3 3 5 6 6z"/></svg>',
    pasta:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 13h16a8 8 0 01-16 0z"/><path d="M7 13V7M10 13V6M13 13V7M16 13V6"/></svg>',
    main:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v8a2 2 0 004 0V3M8 11v10"/><path d="M16 3c-1.6 1-2.4 3-2.4 6 0 2 .8 3 2.4 3v9"/></svg>',
    fish:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 12c3-4 8-5 12-3l5-3-1 6 1 6-5-3c-4 2-9 1-12-3z"/><circle cx="8" cy="12" r="1"/></svg>',
    rice:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M4 13h16a8 8 0 01-16 0z"/><path d="M8 9l1-3M12 8V5M16 9l-1-3"/></svg>',
    breakfast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 10h11v4a5 5 0 01-5 5H10a5 5 0 01-5-5v-4z"/><path d="M16 11h2a2.5 2.5 0 010 5h-2M8 6V4M12 6V4"/></svg>',
    dessert:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M6 11h12l-1 8H7l-1-8z"/><path d="M8 11c0-2 1.8-3 4-3s4 1 4 3"/><path d="M12 8V5"/></svg>',
    drink:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10l-1.4 16H8.4L7 4z"/><path d="M8 9h8"/></svg>',
    icecream:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M8 10a4 4 0 118 0"/><path d="M8 10h8l-4 11-4-11z"/></svg>'
  };
  const catIcon = (id) => ICON[id] || ICON.plate;

  /* ========================================================================
     1 · i18n ENGINE
     ======================================================================== */
  function resolveInitialLang() {
    let saved = null;
    try { saved = localStorage.getItem(STORE_LANG); } catch (e) {}
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    const base = nav.split("-")[0];
    const hit = LANGUAGES.find(l => l.code === base);
    return hit ? hit.code : "en";
  }

  function applyLang(code, opts) {
    opts = opts || {};
    if (!LANGUAGES.some(l => l.code === code)) code = "en";
    state.lang = code;
    const dir = langDir(code);
    document.documentElement.lang = code;
    document.documentElement.dir = dir;
    document.body.dir = dir;

    // translate static nodes
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = t(code, key);
      if (val !== undefined && val !== null) el.textContent = val;
    });
    $$("[data-i18n-ph]").forEach(el => {
      const key = el.getAttribute("data-i18n-ph");
      const val = t(code, key);
      if (val) el.setAttribute("placeholder", val);
    });
    $$("[data-i18n-aria]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      const val = t(code, key);
      if (val) el.setAttribute("aria-label", val);
    });
    $$("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const val = t(code, key);
      if (val) el.setAttribute("title", val);
    });

    // language trigger label
    const meta = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
    const flagEl = $("#langFlag"), codeEl = $("#langCode");
    if (flagEl) flagEl.textContent = meta ? meta.flag : "";
    if (codeEl) codeEl.textContent = (meta ? meta.en : code);

    // mark active item in list
    $$(".lang-item").forEach(b => b.classList.toggle("active", b.dataset.code === code));

    try { localStorage.setItem(STORE_LANG, code); } catch (e) {}

    renderMenu();
    if (!opts.silent) {
      // re-render dynamic strings inside product modal if open
      const pm = $("#productModal");
      if (pm && pm.classList.contains("open") && pm.dataset.pid) openProduct(pm.dataset.pid, true);
    }
    document.dispatchEvent(new CustomEvent("pino:lang", { detail: { lang: code, dir } }));
  }

  /* ========================================================================
     2 · LANGUAGE SELECTOR
     ======================================================================== */
  function buildLangList() {
    const list = $("#langList");
    if (!list) return;
    list.innerHTML = LANGUAGES.map(l => `
      <button class="lang-item" type="button" data-code="${l.code}" data-search="${(l.native + " " + l.en + " " + l.code).toLowerCase()}">
        <span class="flag" aria-hidden="true">${l.flag}</span>
        <span class="native">${l.native}</span>
        <span class="en">${l.en}</span>
      </button>`).join("");

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-item");
      if (!btn) return;
      applyLang(btn.dataset.code);
      closeModal("#langModal");
      toast((LANGUAGES.find(l => l.code === btn.dataset.code) || {}).native || "");
    });
  }

  function filterLangList(q) {
    const list = $("#langList");
    if (!list) return;
    const term = (q || "").trim().toLowerCase();
    let visible = 0;
    $$(".lang-item", list).forEach(b => {
      const ok = !term || b.dataset.search.includes(term);
      b.style.display = ok ? "" : "none";
      if (ok) visible++;
    });
    let empty = $(".lang-empty", list);
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "lang-empty";
        empty.textContent = t(state.lang, "no_results");
        list.appendChild(empty);
      } else {
        empty.textContent = t(state.lang, "no_results");
      }
    } else if (empty) {
      empty.remove();
    }
  }

  /* ========================================================================
     3 · MODALS (generic)
     ======================================================================== */
  let lastFocus = null;
  function openModal(sel) {
    const m = $(sel);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add("open");
    document.body.style.overflow = "hidden";
    const f = m.querySelector("input, button, [tabindex]");
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeModal(sel) {
    const m = $(sel);
    if (!m) return;
    m.classList.remove("open");
    if (!$(".modal.open")) document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ========================================================================
     4 · MENU RENDERING + SEARCH
     ======================================================================== */
  function priceHTML(p) {
    const cur = (PINO.currency && PINO.currency.symbol) || "LE";
    if (p.price != null) {
      return `<span class="price-pill price-pill--single"><span class="val">${p.price}<span class="cur">${cur}</span></span></span>`;
    }
    if (Array.isArray(p.sizes) && p.sizes.length) {
      return p.sizes.map(s => {
        const v = (s.price == null)
          ? `<span class="val" data-i18n="price_on_request" title="—">—</span>`
          : `<span class="val">${s.price}<span class="cur">${cur}</span></span>`;
        return `<span class="price-pill"><span class="sz">${s.label}</span>${v}</span>`;
      }).join("");
    }
    return `<span class="price-pill"><span class="val">—</span></span>`;
  }

  function productName(p, lang) {
    const mi = (PINO.MENU_I18N && PINO.MENU_I18N[lang] && PINO.MENU_I18N[lang][p.id]) || null;
    if (mi && mi.en) return mi.en;
    if (lang === "ar" && p.ar) return p.ar;
    if (lang === "it" && mi && mi.en) return mi.en;
    return p.en;
  }
  function productSub(p, lang) {
    // secondary line: English shows Arabic, Arabic shows English, others show none
    if (lang === "ar") return p.en && p.en !== productName(p, lang) ? p.en : "";
    if (lang === "en") return p.ar || "";
    return "";
  }

  function searchIndex(p) {
    if (p._idx) return p._idx;
    const parts = [p.en, p.ar, p.id, p.cat];
    if (p.desc) { parts.push(p.desc.en || "", p.desc.ar || ""); }
    Object.keys(PINO.MENU_I18N || {}).forEach(l => {
      const e = PINO.MENU_I18N[l][p.id];
      if (e && e.en) parts.push(e.en);
    });
    p._idx = parts.join(" ").toLowerCase();
    return p._idx;
  }

  function renderMenu() {
    const host = $("#menuHost");
    if (!host) return;
    const lang = state.lang;
    const q = state.query.trim().toLowerCase();
    const catFilter = state.activeCat;

    let list = PRODUCTS.filter(p => catFilter === "all" || p.cat === catFilter);
    if (q) list = list.filter(p => searchIndex(p).includes(q));

    const countEl = $("#searchCount");
    if (countEl) {
      countEl.textContent = q ? `${list.length}` : "";
      countEl.classList.toggle("show", !!q);
    }

    if (!list.length) {
      host.innerHTML = `
        <div class="menu-empty">
          <div class="ico">${ICON.search}</div>
          <h3>${t(lang, "no_results")}</h3>
          <p>${t(lang, "no_results_hint")}</p>
        </div>`;
      return;
    }

    // group by category (preserve CATEGORIES order)
    const order = CATEGORIES.map(c => c.id);
    const groups = {};
    list.forEach(p => { (groups[p.cat] = groups[p.cat] || []).push(p); });

    host.innerHTML = order.filter(id => groups[id]).map(catId => {
      const cat = CATEGORIES.find(c => c.id === catId) || { id: catId, en: catId, ar: catId };
      const items = groups[catId];
      const note = cat.note ? `<div class="cat-note">${ICON.info}<span>${cat.note[lang] || cat.note.en}</span></div>` : "";
      return `
        <section class="cat-block" id="cat-${catId}" data-cat="${catId}">
          <div class="cat-block-head">
            <h3>${catIcon(catId)}<span>${tCat(lang, catId)}</span></h3>
            <span class="line"></span>
            <span class="count">${items.length}</span>
          </div>
          ${note}
          <div class="prod-grid">
            ${items.map(p => cardHTML(p, lang)).join("")}
          </div>
        </section>`;
    }).join("");

    bindCards();
    observeReveals();
  }

  function cardHTML(p, lang) {
    const name = productName(p, lang);
    const sub = productSub(p, lang);
    const hasImg = !!p.img;
    const media = hasImg
      ? `<img src="${p.img}" alt="${name}" loading="lazy" decoding="async" width="640" height="440">`
      : `<div class="ph">${catIcon(p.cat)}</div>`;
    const desc = p.desc ? `<p class="desc">${p.desc[lang] || p.desc.en}</p>` : "";
    const rev = p.needsReview ? `<span class="rev-tag">${t(lang, "review_badge")}</span>` : "";
    return `
      <article class="prod-card reveal" data-id="${p.id}">
        <div class="prod-media">
          ${media}
          <span class="cat-tag">${tCat(lang, p.cat)}</span>
          ${rev}
        </div>
        <div class="prod-body">
          <div class="prod-title-row"><h4>${name}</h4></div>
          ${sub ? `<div class="sub">${sub}</div>` : ""}
          ${desc}
          <div class="prod-prices">${priceHTML(p)}</div>
          <div class="prod-foot">
            <button class="prod-more" type="button" aria-label="${t(lang, "details")}: ${name}">${t(lang, "details")} ${ICON.arrow}</button>
          </div>
        </div>
      </article>`;
  }

  function bindCards() {
    $$(".prod-card").forEach(card => {
      const open = () => openProduct(card.dataset.id);
      card.addEventListener("click", open);
      attachTilt(card);
      attachSpotlight(card);
    });
  }

  function openProduct(id, silent) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const lang = state.lang;
    const name = productName(p, lang);
    const sub = productSub(p, lang);
    const modal = $("#productModal");
    const card = $("#pmCard");
    const cur = (PINO.currency && PINO.currency.symbol) || "LE";
    const hasImg = !!p.img;

    const priceRows = (() => {
      if (p.price != null) {
        return `<div class="pm-price-row"><span class="sz">${t(lang, "size_label")}</span><span class="val">${p.price} ${cur}</span></div>`;
      }
      if (Array.isArray(p.sizes) && p.sizes.length) {
        return p.sizes.map(s => `<div class="pm-price-row"><span class="sz">${s.label}</span><span class="val">${s.price == null ? "—" : s.price + " " + cur}</span></div>`).join("");
      }
      return `<div class="pm-price-row"><span class="sz">—</span><span class="val">—</span></div>`;
    })();

    const tags = [];
    tags.push(`<span class="chip">${tCat(lang, p.cat)}</span>`);
    if (p.needsReview) tags.push(`<span class="chip chip--review">${ICON.info}${t(lang, "review_badge")}</span>`);

    card.innerHTML = `
      <div class="pm-grid">
        <div class="pm-media">
          ${hasImg ? `<img src="${p.img}" alt="${name}">` : `<div class="ph">${catIcon(p.cat)}</div>`}
        </div>
        <div class="pm-body">
          <h3>${name}</h3>
          ${sub ? `<div class="sub">${sub}</div>` : ""}
          ${p.desc ? `<p class="desc">${p.desc[lang] || p.desc.en}</p>` : ""}
          <div class="pm-section-label">${t(lang, "size_label")}</div>
          <div class="pm-prices">${priceRows}</div>
          <div class="pm-tags">${tags.join("")}</div>
          ${p.needsReview ? `<div class="price-note">${ICON.info}<span>${t(lang, "review_note")}</span></div>` : ""}
        </div>
      </div>`;
    modal.dataset.pid = id;
    if (!silent) openModal("#productModal");
  }

  /* ========================================================================
     5 · CATEGORY NAV + SCROLL SPY
     ======================================================================== */
  function buildCatNav() {
    const nav = $("#catNav");
    if (!nav) return;
    const all = `<button class="cat-btn active" data-cat="all" type="button">${t(state.lang, "all_categories")}</button>`;
    nav.innerHTML = all + CATEGORIES.map(c =>
      `<button class="cat-btn" data-cat="${c.id}" type="button">${tCat(state.lang, c.id)}</button>`
    ).join("");

    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      setActiveCat(btn.dataset.cat);
    });
  }

  function refreshCatNavLabels() {
    const nav = $("#catNav");
    if (!nav) return;
    const allBtn = nav.querySelector('[data-cat="all"]');
    if (allBtn) allBtn.textContent = t(state.lang, "all_categories");
    $$(".cat-btn", nav).forEach(b => {
      if (b.dataset.cat !== "all") b.textContent = tCat(state.lang, b.dataset.cat);
    });
  }

  function setActiveCat(cat) {
    state.activeCat = cat;
    $$("#catNav .cat-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
    // scroll to section if it exists
    if (cat !== "all") {
      const el = document.getElementById("cat-" + cat);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - (74 + 120);
        window.scrollTo({ top: y, behavior: state.reduced ? "auto" : "smooth" });
        return;
      }
    }
    renderMenu();
  }

  function initScrollSpy() {
    const spy = () => {
      const blocks = $$(".cat-block");
      if (!blocks.length) return;
      const fromTop = window.scrollY + 220;
      let current = null;
      for (const b of blocks) {
        if (b.offsetTop <= fromTop) current = b.dataset.cat;
      }
      if (current) {
        $$("#catNav .cat-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.cat === current));
      }
    };
    window.addEventListener("scroll", throttle(spy, 140), { passive: true });
  }

  /* ========================================================================
     6 · 3D INTERACTIONS
     ======================================================================== */
  function attachTilt(el) {
    if (state.reduced) return;
    if (el._tiltBound) return;
    el._tiltBound = true;
    let raf = null, tx = 0, ty = 0;
    const max = 9;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ty = (px - 0.5) * 2 * max;
      tx = -(py - 0.5) * 2 * max;
      if (!raf) raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg) translateY(-4px)`;
        raf = null;
      });
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  }

  function attachSpotlight(el) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  }

  function initStageTilt() {
    const stage = $("#stage");
    const tilt = $("#tiltDish");
    if (!stage || !tilt || state.reduced) return;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - 0.5) * 26;
      const rx = -(py - 0.5) * 22;
      tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(10px)`;
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
  }

  function initHeroParallax() {
    if (state.reduced) return;
    const bg = $(".hero-bg");
    const floaters = $$(".floater");
    let ticking = false;
    const run = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        if (bg) bg.style.transform = `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)`;
        floaters.forEach((f, i) => {
          const depth = 0.06 + i * 0.05;
          f.style.transform = `translate3d(0, ${(y * depth).toFixed(1)}px, 0)`;
        });
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
  }

  /* ========================================================================
     7 · SCROLL REVEAL
     ======================================================================== */
  let revealObs = null;
  function observeReveals() {
    if (state.reduced) {
      $$(".reveal").forEach(el => el.classList.add("in"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(el => el.classList.add("in"));
      return;
    }
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    }
    $$(".reveal:not(.in)").forEach(el => revealObs.observe(el));
  }

  /* ========================================================================
     8 · LIGHTBOX + GALLERY
     ======================================================================== */
  function initGallery() {
    $$(".g-item").forEach(item => {
      const open = () => {
        const img = item.querySelector("img");
        if (!img) return;
        const lb = $("#lbImg");
        lb.src = img.src;
        lb.alt = img.alt || "";
        openModal("#lightbox");
      };
      item.addEventListener("click", open);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  /* ========================================================================
     9 · MISC UI
     ======================================================================== */
  function throttle(fn, ms) {
    let last = 0, timer = null;
    return function () {
      const now = Date.now();
      const args = arguments, ctx = this;
      if (now - last >= ms) { last = now; fn.apply(ctx, args); }
      else if (!timer) {
        timer = setTimeout(() => { timer = null; last = Date.now(); fn.apply(ctx, args); }, ms - (now - last));
      }
    };
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function initHeader() {
    const header = $("#header");
    const bar = $("#progressBar");
    const toTop = $("#toTop");
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 40);
      toTop.classList.toggle("show", y > 600);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", throttle(onScroll, 60), { passive: true });
    onScroll();

    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: state.reduced ? "auto" : "smooth" }));
  }

  function initNav() {
    const burger = $("#burger");
    const drawer = $("#mobileNav");
    burger.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("#mobileNav a").forEach(a => a.addEventListener("click", () => {
      drawer.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }));

    // smooth scroll for in-page anchors
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - (74 + 14);
        window.scrollTo({ top: y, behavior: state.reduced ? "auto" : "smooth" });
      });
    });

    // active nav link on scroll
    const sections = ["menu", "gallery", "about", "contact"].map(id => document.getElementById(id)).filter(Boolean);
    const spy = () => {
      const y = window.scrollY + 200;
      let cur = null;
      sections.forEach(s => { if (s.offsetTop <= y) cur = s.id; });
      $$(".nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
    };
    window.addEventListener("scroll", throttle(spy, 160), { passive: true });
  }

  function initSearch() {
    const input = $("#menuSearch");
    const clear = $("#searchClear");
    if (!input) return;
    input.addEventListener("input", throttle(() => {
      state.query = input.value;
      clear.classList.toggle("show", !!input.value);
      if (state.query && state.activeCat !== "all") {
        state.activeCat = "all";
        $$("#catNav .cat-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === "all"));
      }
      renderMenu();
    }, 180));
    clear.addEventListener("click", () => {
      input.value = ""; state.query = ""; clear.classList.remove("show");
      renderMenu(); input.focus();
    });
  }

  function initModals() {
    // close on backdrop / [data-close]
    $$(".modal").forEach(m => {
      m.addEventListener("click", (e) => {
        if (e.target === m || e.target.closest("[data-close]")) closeModal("#" + m.id);
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const open = $(".modal.open");
        if (open) closeModal("#" + open.id);
        const drawer = $("#mobileNav");
        if (drawer && drawer.classList.contains("open")) {
          drawer.classList.remove("open");
          $("#burger").setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      }
    });
    const lt = $("#langTrigger");
    if (lt) lt.addEventListener("click", () => { openModal("#langModal"); const s = $("#langSearch"); if (s) { s.value = ""; filterLangList(""); } });
    const ls = $("#langSearch");
    if (ls) ls.addEventListener("input", () => filterLangList(ls.value));
  }

  function initPreloader() {
    const pre = $("#preloader");
    const done = () => setTimeout(() => pre.classList.add("done"), 350);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done);
    // safety timeout
    setTimeout(() => pre.classList.add("done"), 4000);
  }

  function initReveals() {
    observeReveals();
    // static sections
    $$(".section .reveal").forEach(() => {});
  }

  /* ========================================================================
     10 · BOOT
     ======================================================================== */
  function boot() {
    buildLangList();
    buildCatNav();
    initSearch();
    initModals();
    initNav();
    initHeader();
    initGallery();
    initStageTilt();
    initHeroParallax();
    initPreloader();

    applyLang(resolveInitialLang(), { silent: true });
    refreshCatNavLabels();
    renderMenu();
    initScrollSpy();
    observeReveals();

    // update footer year
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    // re-render labels when language changes (cat nav + counts)
    document.addEventListener("pino:lang", (e) => {
      refreshCatNavLabels();
      const fl = $("#footerLang");
      if (fl) {
        const m = LANGUAGES.find(l => l.code === e.detail.lang);
        fl.textContent = m ? m.native : e.detail.lang;
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // expose a tiny API (useful for testing)
  window.PINO_APP = { setLang: applyLang, renderMenu, state };
})();
