/* Ahmed Omer · أحمد عمر — v9 · no dependencies */
(function () {
  "use strict";
  var doc = document.documentElement;
  var LANG = doc.lang === "en" ? "en" : "ar";
  var RTL = doc.dir === "rtl";
  var T = function (ar, en) { return LANG === "ar" ? ar : en; };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  doc.classList.add("js");

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- theme: follows the device until the visitor picks light or dark ---------- */
  var MODES = ["system", "light", "dark"];
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function shownTheme(mode) { return mode === "system" ? (darkMQ && darkMQ.matches ? "dark" : "light") : mode; }
  function applyTheme(mode, save) {
    if (MODES.indexOf(mode) === -1) mode = "system";
    doc.setAttribute("data-theme", mode);
    if (save) store.set("theme-choice", mode);
    $$(".theme-btn").forEach(function (b) {
      b.setAttribute("data-mode", mode);
      b.setAttribute("aria-label", T("المظهر: ", "Theme: ") + { system: T("حسب الجهاز", "system"), light: T("فاتح", "light"), dark: T("داكن", "dark") }[mode]);
    });
    $$("[data-theme-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === mode)); });
  }
  applyTheme(store.get("theme-choice") || "system", false);
  /* the header button always flips what you see: light to dark, dark to light */
  $$(".theme-btn").forEach(function (b) {
    b.addEventListener("click", function () { applyTheme(shownTheme(b.getAttribute("data-mode") || "system") === "dark" ? "light" : "dark", true); });
  });
  $$("[data-theme-set]").forEach(function (b) { b.addEventListener("click", function () { applyTheme(b.getAttribute("data-theme-set"), true); }); });

  /* ---------- menu ---------- */
  var menuBtn = $(".menu-btn"), nav = $("#nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open)); nav.classList.toggle("open", !open);
    });
  }

  /* ---------- language: remember choice, suggest once ---------- */
  $$("[data-lang-link]").forEach(function (a) {
    a.addEventListener("click", function () { store.set("lang", a.getAttribute("hreflang")); });
  });
  (function suggest() {
    var toast = $("#lang-toast");
    if (!toast || store.get("lang") || store.get("lang-dismissed")) return;
    var prefs = (navigator.languages || [navigator.language || ""]).map(function (l) { return (l || "").slice(0, 2).toLowerCase(); });
    var wantsOther = LANG === "ar" ? prefs[0] === "en" && prefs.indexOf("ar") === -1 : prefs[0] === "ar";
    if (!wantsOther) return;
    toast.hidden = false;
    $("button", toast).addEventListener("click", function () { toast.hidden = true; store.set("lang-dismissed", "1"); });
    $("a", toast).addEventListener("click", function () { store.set("lang", LANG === "ar" ? "en" : "ar"); });
  })();

  /* ---------- work index: list drives the preview ---------- */
  var rows = $$(".rows .row");
  if (rows.length) {
    var imgs = $$(".preview img"), label = $(".preview .pv-label");
    var setOn = function (i) {
      rows.forEach(function (r, j) { r.classList.toggle("on", i === j); });
      imgs.forEach(function (im, j) { im.classList.toggle("on", i === j); });
      if (label) label.textContent = rows[i].getAttribute("data-label");
    };
    rows.forEach(function (r, i) {
      r.addEventListener("pointerenter", function () { setOn(i); });
      r.addEventListener("focusin", function () { setOn(i); });
    });
    setOn(0);
  }

  /* ---------- filters + view switch ---------- */
  $$("[data-filter-for]").forEach(function (group) {
    var target = $(group.getAttribute("data-filter-for"));
    var items = $$("[data-cat]", target);
    var status = $(group.getAttribute("data-status"));
    var chips = $$(".chip", group);
    chips.forEach(function (chip) {
      var cat = chip.getAttribute("data-filter");
      var n = cat === "all" ? items.length : items.filter(function (i) { return i.getAttribute("data-cat") === cat; }).length;
      var c = $(".count", chip); if (c) c.textContent = n;
      chip.addEventListener("click", function () {
        chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === chip)); });
        var shown = 0;
        items.forEach(function (it) { var ok = cat === "all" || it.getAttribute("data-cat") === cat; it.hidden = !ok; if (ok) shown++; });
        if (status) status.textContent = T("يُعرض " + shown + " من " + items.length, "Showing " + shown + " of " + items.length);
      });
    });
  });
  $$(".view-switch").forEach(function (sw) {
    var grid = $(sw.getAttribute("data-for"));
    var saved = store.get("view");
    $$("button", sw).forEach(function (btn) {
      var v = btn.getAttribute("data-view");
      if (saved) btn.setAttribute("aria-pressed", String(saved === v));
      btn.addEventListener("click", function () {
        $$("button", sw).forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); });
        grid.classList.toggle("list", v === "list"); store.set("view", v);
      });
    });
    if (saved === "list") grid.classList.add("list");
  });

  /* ---------- testimonial: show the original wording ---------- */
  $$("[data-original]").forEach(function (btn) {
    var box = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open)); box.classList.toggle("show", !open);
      btn.textContent = open ? btn.getAttribute("data-show") : btn.getAttribute("data-hide");
    });
  });

  /* ---------- tabs (keyboard: arrows, Home, End) ---------- */
  $$("[role=tablist]").forEach(function (list) {
    var tabs = $$("[role=tab]", list);
    var select = function (t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var vertical = getComputedStyle(list).gridAutoFlow !== "column";
        var next = vertical ? "ArrowDown" : (RTL ? "ArrowLeft" : "ArrowRight");
        var prev = vertical ? "ArrowUp" : (RTL ? "ArrowRight" : "ArrowLeft");
        var j = null;
        if (e.key === next) j = (i + 1) % tabs.length;
        else if (e.key === prev) j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") j = 0; else if (e.key === "End") j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  });

  /* ---------- palette copy ---------- */
  $$(".swatch button").forEach(function (b) {
    b.addEventListener("click", function () {
      var code = $("code", b.parentElement), hex = b.getAttribute("data-hex"), old = code.textContent;
      var done = function () { code.textContent = T("تم النسخ", "Copied"); setTimeout(function () { code.textContent = old; }, 1300); };
      if (navigator.clipboard) navigator.clipboard.writeText(hex).then(done, function () {}); else done();
    });
  });

  /* ---------- shared: validation ---------- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  function check(input) {
    var msg = "";
    var v = (input.value || "").trim();
    if (input.required && !v) msg = input.getAttribute("data-empty");
    else if (input.type === "email" && v && !emailOk(v)) msg = T("اكتب بريدًا صحيحًا، مثل name@example.com", "Enter a valid email, like name@example.com");
    else if (input.minLength > 0 && v.length < input.minLength) msg = input.getAttribute("data-short");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    var err = document.getElementById(input.id + "-err"); if (err) err.textContent = msg || "";
    return !msg;
  }
  function send(form) {
    return fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r; });
  }

  /* ---------- brief builder ---------- */
  var builder = $("#brief");
  if (builder) {
    var steps = $$("fieldset", builder);
    var bars = $$(".progress span", builder);
    var count = $(".step-count", builder);
    var back = $(".back", builder), nextBtn = $(".next-btn", builder), submit = $(".submit-btn", builder);
    var status = $(".form-status", builder);
    var i = 0;
    var show = function (n, focus) {
      i = n;
      steps.forEach(function (s, k) { s.classList.toggle("cur", k === n); });
      bars.forEach(function (bar, k) { bar.className = k < n ? "done" : k === n ? "cur" : ""; });
      count.textContent = T("الخطوة " + (n + 1) + " من " + steps.length, "Step " + (n + 1) + " of " + steps.length);
      back.classList.toggle("show", n > 0);
      nextBtn.hidden = n === steps.length - 1; submit.hidden = n !== steps.length - 1;
      if (focus) { var lg = $("legend", steps[n]); lg.tabIndex = -1; lg.focus({ preventScroll: true }); builder.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
    };
    var validStep = function () {
      var s = steps[i], ok = true, first = null;
      var radios = $$("input[type=radio][required]", s);
      if (radios.length) {
        var name = radios[0].name, picked = $("input[name='" + name + "']:checked", s);
        var err = document.getElementById(name + "-err");
        if (!picked) { ok = false; err.textContent = radios[0].getAttribute("data-empty"); first = radios[0]; } else err.textContent = "";
      }
      $$("input:not([type=radio]),textarea", s).forEach(function (inp) { if (!check(inp)) { ok = false; first = first || inp; } });
      if (first) first.focus();
      return ok;
    };
    nextBtn.addEventListener("click", function () { if (validStep()) show(i + 1, true); });
    back.addEventListener("click", function () { show(i - 1, true); });
    builder.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && !nextBtn.hidden) { e.preventDefault(); nextBtn.click(); }
    });
    // live summary
    var sum = $("#summary");
    var update = function () {
      $$("[data-sum]", sum).forEach(function (dd) {
        var key = dd.getAttribute("data-sum");
        var el = $("[name='" + key + "']:checked", builder) || $("[name='" + key + "']:not([type=radio])", builder);
        var val = "";
        if (el) val = el.type === "radio" ? $("label[for='" + el.id + "'] b", builder).textContent : el.value.trim();
        if (key === "message" && val.length > 140) val = val.slice(0, 140) + "…";
        dd.textContent = val;
      });
    };
    builder.addEventListener("input", update); builder.addEventListener("change", function (e) {
      update();
      if (e.target.type === "radio") { var err = document.getElementById(e.target.name + "-err"); if (err) err.textContent = ""; }
    });
    // service shortcuts from the service cards
    $$("[data-pick]").forEach(function (a) {
      a.addEventListener("click", function () {
        var r = document.getElementById("svc-" + a.getAttribute("data-pick"));
        if (r) { r.checked = true; update(); show(0); }
      });
    });
    builder.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validStep()) return;
      submit.disabled = true; var label = submit.textContent; submit.textContent = T("جارٍ الإرسال…", "Sending…");
      status.textContent = "";
      send(builder).then(function () {
        var done = $("#brief-done");
        builder.hidden = true; done.hidden = false; done.focus();
      }).catch(function () {
        status.textContent = T("لم يصل الطلب. تحقّق من اتصالك ثم أرسل مرة أخرى.", "Your brief didn't send. Check your connection and try again.");
      }).finally(function () { submit.disabled = false; submit.textContent = label; });
    });
    try {
      var pre = new URLSearchParams(location.search).get("service");
      var pr = pre && document.getElementById("svc-" + pre);
      if (pr) pr.checked = true;
    } catch (err) {}
    show(0);
    update();
  }

  /* ---------- newsletter ---------- */
  $$("form[data-inline]").forEach(function (form) {
    var input = $("input[type=email]", form), status = $(".form-status", form), btn = $("button", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      if (!check(input)) { status.textContent = $("#" + input.id + "-err").textContent; input.focus(); return; }
      btn.disabled = true;
      send(form).then(function () {
        form.reset(); status.className = "form-status ok";
        status.textContent = T("تم اشتراكك. ستصلك المقالات الجديدة على بريدك.", "You're subscribed. New articles will arrive in your inbox.");
      }).catch(function () {
        status.textContent = T("لم يكتمل الاشتراك. تحقّق من اتصالك ثم حاول مرة أخرى.", "Subscription didn't go through. Check your connection and try again.");
      }).finally(function () { btn.disabled = false; });
    });
  });

  /* ---------- article: reading progress + toc ---------- */
  var bar = $(".readbar"), body = $(".article .body");
  if (bar && body) {
    var tick = function () {
      var r = body.getBoundingClientRect(), h = r.height - window.innerHeight * 0.6;
      var p = Math.min(1, Math.max(0, -r.top / (h > 0 ? h : 1)));
      bar.style.transform = "scaleX(" + p.toFixed(3) + ")";
    };
    window.addEventListener("scroll", tick, { passive: true }); window.addEventListener("resize", tick); tick();
  }
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (l) { var on = l.getAttribute("href") === "#" + en.target.id; l.classList.toggle("on", on); if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current"); });
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    tocLinks.forEach(function (l) { var s = document.getElementById(l.getAttribute("href").slice(1)); if (s) io.observe(s); });
  }

  /* =============================================================
     COMMAND PALETTE — Ctrl/⌘ K or /
     ============================================================= */
  var dataEl = $("#cmdk-data"), dlg = $("#cmdk");
  if (dataEl && dlg) {
    var ITEMS = JSON.parse(dataEl.textContent);
    var input = $("input", dlg), list = $(".cmdk-list", dlg), opener = null, sel = 0, view = [];
    var ICON = {
      page: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>',
      work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 3-2 6 4"/></svg>',
      post: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
      act: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 3L5 13h6l-1 8 8-10h-6z"/></svg>',
      ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>'
    };
    var GROUPS = { page: T("الصفحات", "Pages"), work: T("الأعمال ودراسات الحالة", "Work & case studies"), post: T("المقالات", "Articles"), act: T("إجراءات", "Actions"), ext: T("روابط", "Links") };
    var norm = function (s) {
      return (s || "").toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    };
    var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var highlight = function (text, q) {
      if (!q) return esc(text);
      var n = norm(text), k = n.indexOf(q);
      if (k < 0) return esc(text);
      return esc(text.slice(0, k)) + "<mark>" + esc(text.slice(k, k + q.length)) + "</mark>" + esc(text.slice(k + q.length));
    };
    var render = function () {
      var q = norm(input.value.trim());
      view = ITEMS.filter(function (it) {
        if (!q) return true;
        return q.split(/\s+/).every(function (w) { return norm(it.t + " " + (it.alt || "") + " " + (it.k || "")).indexOf(w) > -1; });
      });
      if (!view.length) {
        list.innerHTML = '<div class="cmdk-empty">' + T("لا نتائج لـ «" + esc(input.value) + "». جرّب «هوية» أو «UI» أو «تواصل».", "No results for “" + esc(input.value) + "”. Try “identity”, “UI” or “contact”.") + "</div>";
        input.setAttribute("aria-activedescendant", ""); return;
      }
      sel = Math.min(sel, view.length - 1);
      var html = "", last = null;
      view.forEach(function (it, i) {
        if (it.g !== last) { html += '<div class="cmdk-group" role="presentation">' + GROUPS[it.g] + "</div>"; last = it.g; }
        html += '<div class="cmdk-item" role="option" id="cmdk-' + i + '" data-i="' + i + '" aria-selected="' + (i === sel) + '"><span class="ic">' + ICON[it.g] + '</span><span class="t">' + highlight(it.t, q) + "</span>" + (it.s ? '<span class="s">' + esc(it.s) + "</span>" : "") + "</div>";
      });
      list.innerHTML = html;
      input.setAttribute("aria-activedescendant", "cmdk-" + sel);
    };
    var move = function (d) {
      if (!view.length) return;
      sel = (sel + d + view.length) % view.length;
      $$(".cmdk-item", list).forEach(function (el) { el.setAttribute("aria-selected", String(+el.getAttribute("data-i") === sel)); });
      input.setAttribute("aria-activedescendant", "cmdk-" + sel);
      var el = document.getElementById("cmdk-" + sel); if (el) el.scrollIntoView({ block: "nearest" });
    };
    var run = function (it) {
      if (!it) return;
      if (it.a === "theme") { applyTheme(it.v, true); close(); return; }
      if (it.a === "lang") store.set("lang", it.v);
      close();
      if (it.u) { if (/^https?:/.test(it.u)) window.open(it.u, "_blank", "noopener"); else location.href = it.u; }
    };
    var open = function () {
      opener = document.activeElement; dlg.classList.add("open"); document.body.style.overflow = "hidden";
      input.value = ""; sel = 0; render(); input.setAttribute("aria-expanded", "true"); input.focus();
    };
    var close = function () {
      dlg.classList.remove("open"); document.body.style.overflow = ""; input.setAttribute("aria-expanded", "false");
      if (opener && opener.focus) opener.focus();
    };
    $$("[data-cmdk]").forEach(function (b) { b.addEventListener("click", open); });
    document.addEventListener("keydown", function (e) {
      var typing = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || "")) || e.target.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); dlg.classList.contains("open") ? close() : open(); }
      else if (e.key === "/" && !typing && !dlg.classList.contains("open")) { e.preventDefault(); open(); }
    });
    input.addEventListener("input", function () { sel = 0; render(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); run(view[sel]); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") { e.preventDefault(); }
    });
    list.addEventListener("pointermove", function (e) { var el = e.target.closest(".cmdk-item"); if (el && +el.dataset.i !== sel) { sel = +el.dataset.i; move(0); } });
    list.addEventListener("click", function (e) { var el = e.target.closest(".cmdk-item"); if (el) run(view[+el.dataset.i]); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    $$(".kbd-mod").forEach(function (k) { k.textContent = isMac ? "⌘K" : "Ctrl K"; });
  }

  /* =============================================================
     v2.1: live screenshots, Lab demos
     ============================================================= */

  /* ---------- v8: self-hosted images fall back to the old hosted copy, then to a quiet placeholder ---------- */
  var PH = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#151822"/><g transform="translate(164 114) scale(2)"><path fill="#F5F2EB" opacity=".22" d="M9.5 25.5L16.2 10.5H19.4L24.2 21.5H20.8L17.8 14.3L14.5 22.1H18.4L17.2 25.5H9.5Z"/><circle cx="25.2" cy="12.2" r="3.2" fill="#FF4D1C" opacity=".6"/><rect fill="#F5F2EB" opacity=".22" x="22.8" y="22.5" width="4.8" height="3" rx="1.5"/></g></svg>');
  $$("img[data-fallback]").forEach(function (im) {
    var list = im.getAttribute("data-fallback").split("|"), k = 0;
    var fail = function () {
      if (k < list.length) { im.src = list[k++]; return; }
      im.removeEventListener("error", fail);
      im.src = PH; im.classList.add("is-placeholder");
    };
    im.addEventListener("error", fail);
    if (im.complete && !im.naturalWidth) fail();
  });
  /* optional images (screens you can add later): their figure stays hidden until the file exists */
  $$("img[data-optional]").forEach(function (im) {
    var fig = im.closest("figure") || im;
    var show = function () { if (im.naturalWidth) fig.hidden = false; };
    var hide = function () { fig.hidden = true; };
    im.addEventListener("load", show); im.addEventListener("error", hide);
    if (im.complete) { if (im.naturalWidth) show(); else hide(); }
  });

  /* ---------- website previews: your own screenshot first, then live captures ---------- */
  $$("img[data-remote]").forEach(function (im) {
    var list = im.getAttribute("data-remote").split("|"), k = -1, tries = 0;
    var wanted = +im.getAttribute("data-w") || 0;
    var screen = im.closest(".screen"), browser = im.closest(".browser");
    var giveUp = function () {
      im.removeEventListener("error", next);
      if (screen) screen.classList.add("loaded");
      if (browser && screen) {
        browser.classList.add("failed");
        if (!$(".shot-fallback", screen)) {
          var fb = document.createElement("div"), a = document.createElement("a");
          fb.className = "shot-fallback";
          fb.innerHTML = "<b>" + T("تعذّر تحميل المعاينة", "The preview didn’t load") + "</b><span>" + T("افتح الموقع نفسه في نافذة جديدة.", "Open the live site in a new tab instead.") + "</span>";
          a.href = screen.getAttribute("data-url") || ("https://" + (screen.getAttribute("data-domain") || ""));
          a.target = "_blank"; a.rel = "noopener"; a.textContent = T("افتح الموقع", "Open the live site");
          fb.appendChild(a); screen.appendChild(fb);
        }
      } else { im.src = PH; im.classList.add("is-placeholder"); }
    };
    var next = function () {
      k++;
      if (k >= list.length) { giveUp(); return; }
      tries = 0; im.setAttribute("data-mode", "remote"); im.src = list[k];
    };
    var done = function () {
      // live capture services send a small placeholder while they render
      if (im.getAttribute("data-mode") === "remote" && /mshots/.test(im.src) && wanted && im.naturalWidth < wanted * 0.6 && tries < 6) {
        tries++; var base = list[k]; setTimeout(function () { im.src = base + "&t=" + tries; }, 3000); return;
      }
      if (screen) screen.classList.add("loaded");
      if (browser && screen) browser.classList.toggle("can-scroll", screen.scrollHeight > screen.clientHeight + 40);
    };
    im.addEventListener("error", next);
    im.addEventListener("load", done);
    if (im.complete) { if (!im.naturalWidth) next(); else done(); }
  });

  /* ---------- scroll through a site inside its frame ---------- */
  $$(".screen.scroll").forEach(function (sc) {
    var browser = sc.closest(".browser"), hint = browser && $(".scroll-hint", browser);
    var raf = null, touched = false;
    var stop = function () { if (raf) { cancelAnimationFrame(raf); raf = null; } };
    var step = function () {
      if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1) { raf = null; return; }
      sc.scrollTop += 1.4; raf = requestAnimationFrame(step);
    };
    var hide = function () { if (hint) hint.classList.add("gone"); };
    if (fine && !reduce) {
      sc.addEventListener("pointerenter", function () { if (!touched && sc.scrollHeight > sc.clientHeight + 40) { hide(); raf = requestAnimationFrame(step); } });
      sc.addEventListener("pointerleave", function () { stop(); touched = false; });
    }
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) {
      sc.addEventListener(ev, function () { touched = true; stop(); hide(); }, { passive: true });
    });
    sc.addEventListener("scroll", function () { if (sc.scrollTop > 40) hide(); }, { passive: true });
  });

  /* =============================================================
     v7 "Noir Atelier · Swiss Engineering" Interactive Craft
     ============================================================= */

  /* ---------- 2. Floating glass header ---------- */

  var head = $(".site-head");
  var updateScrollUI = function () {
    var y = window.scrollY || 0;
    if (head) head.classList.toggle("is-scrolled", y > 18);
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });
  updateScrollUI();

  /* ---------- 4. Interactive Bilingual UI Lab (#bidi-lab) ---------- */
  var lab = $("#bidi-lab");
  if (lab) {
    var demoCard = $("#lab-card", lab);
    var labStage = $(".lab-stage", lab);
    var COPY = {
      en: {
        dir: "ltr", lang: "en",
        badge: "Available now", dist: "0.4 km · 2 min",
        title: "Al Maryah Island · Gate 04",
        sub: "Covered smart bay with instant ANPR entry and contactless checkout.",
        rateLbl: "Hourly rate", rateVal: "12 AED / hr",
        spotsLbl: "Open bays", spotsVal: "18 / 40",
        cta: "Reserve spot instantly",
        specDir: 'dir="ltr" · inset-inline-start',
        specType: 'font: 1.00× · tracking -0.02em',
        specTouch: '48px touch target · arrow →',
        mScale: "1.00× base", mFlow: "LTR →", mMirror: "Icons: 0°"
      },
      ar: {
        dir: "rtl", lang: "ar",
        badge: "متاح الآن", dist: "0.4 km · 2 min",
        title: "جزيرة الماريه · البوابة 04",
        sub: "موقف ذكي مغطى بدخول فوري عبر قراءة اللوحات ودفع لا تلامسي.",
        rateLbl: "التعرفة بالساعة", rateVal: "12 د.إ / ساعة",
        spotsLbl: "المواقف المتاحة", spotsVal: "18 / 40",
        cta: "احجز الموقف فورًا",
        specDir: 'dir="rtl" · inset-inline-start',
        specType: 'font: 1.06× optical · tracking 0',
        specTouch: '48px touch target · arrow ←',
        mScale: "1.06× بصري", mFlow: "RTL ←", mMirror: "الأيقونات: معكوسة"
      }
    };
    var setLabDir = function (code) {
      var d = COPY[code] || COPY.en;
      demoCard.setAttribute("dir", d.dir);
      demoCard.setAttribute("lang", d.lang);
      $("[data-d='badge']", demoCard).textContent = d.badge;
      $("[data-d='dist']", demoCard).textContent = d.dist;
      $("[data-d='title']", demoCard).textContent = d.title;
      $("[data-d='sub']", demoCard).textContent = d.sub;
      $("[data-d='rateLbl']", demoCard).textContent = d.rateLbl;
      $("[data-d='rateVal']", demoCard).textContent = d.rateVal;
      $("[data-d='spotsLbl']", demoCard).textContent = d.spotsLbl;
      $("[data-d='spotsVal']", demoCard).textContent = d.spotsVal;
      $("[data-d='cta']", demoCard).textContent = d.cta;
      $("[data-d='specDir']", demoCard).textContent = d.specDir;
      $("[data-d='specType']", demoCard).textContent = d.specType;
      $("[data-d='specTouch']", demoCard).textContent = d.specTouch;
      var mScale = $("[data-m='scale']", lab), mFlow = $("[data-m='flow']", lab), mMirror = $("[data-m='mirror']", lab);
      if (mScale) mScale.textContent = d.mScale;
      if (mFlow) mFlow.textContent = d.mFlow;
      if (mMirror) mMirror.textContent = d.mMirror;
      $$("[data-lab-dir]", lab).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-lab-dir") === code));
      });
    };
    $$("[data-lab-dir]", lab).forEach(function (b) {
      b.addEventListener("click", function () { setLabDir(b.getAttribute("data-lab-dir")); });
    });
    var xrayBtn = $("[data-lab-xray]", lab);
    if (xrayBtn && labStage) {
      xrayBtn.addEventListener("click", function () {
        var on = xrayBtn.getAttribute("aria-pressed") !== "true";
        xrayBtn.setAttribute("aria-pressed", String(on));
        labStage.classList.toggle("xray", on);
      });
    }
    setLabDir(LANG);
  }

  /* ---------- 5. Desktop / Tablet Viewport Switcher on Live Site Frames ---------- */
  $$(".stage").forEach(function (st) {
    var browser = $(".browser", st);
    if (!browser || st.closest(".grid.list")) return;
    if ($(".vp-switch", st)) return;
    var sw = document.createElement("div");
    sw.className = "vp-switch";
    sw.setAttribute("role", "group");
    sw.setAttribute("aria-label", T("عرض الإطار", "Preview viewport"));
    sw.innerHTML =
      '<button type="button" data-vp="desktop" aria-pressed="true">1440px</button>' +
      '<button type="button" data-vp="tablet" aria-pressed="false">768px</button>';
    st.insertBefore(sw, browser);
    $$("button", sw).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-vp");
        $$("button", sw).forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); });
        browser.classList.toggle("is-tablet", mode === "tablet");
      });
    });
  });

  /* ---------- 8. Click-to-copy color tokens ---------- */
  $$(".tokens > div").forEach(function (tile) {
    var code = $("code", tile);
    if (!code) return;
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("title", T("انقر لنسخ كود اللون", "Click to copy hex code"));
    var copyHex = function () {
      var hex = code.getAttribute("data-orig") || code.textContent.trim();
      code.setAttribute("data-orig", hex);
      var flash = function () {
        code.textContent = T("تم النسخ ✓", "Copied ✓");
        setTimeout(function () { code.textContent = hex; }, 1300);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(hex).then(flash, flash); else flash();
    };
    tile.addEventListener("click", copyHex);
    tile.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); copyHex(); } });
  });

  /* ---------- 9. Case study full-resolution Lightbox ---------- */
  var zoomImgs = $$(".shot-fig img, .cover img");
  if (zoomImgs.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", T("معاينة الصورة بحجم كامل", "Full-size image preview"));
    lb.innerHTML = '<button class="lightbox-close" type="button" aria-label="' + T("إغلاق", "Close") + '">✕</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    var lbImg = $("img", lb), lbCap = $("figcaption", lb), lbClose = $(".lightbox-close", lb), lbOpener = null;
    var closeLb = function () {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      if (lbOpener && lbOpener.focus) lbOpener.focus();
    };
    zoomImgs.forEach(function (img) {
      img.addEventListener("click", function () {
        lbOpener = document.activeElement;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || "";
        var fig = img.closest("figure");
        var cap = fig && $("figcaption", fig);
        lbCap.textContent = cap ? cap.textContent : (img.alt || "");
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
        lbClose.focus();
      });
    });
    lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) closeLb(); });
  }

  /* ---------- 10. Floating Back-to-Top + Mobile Esc ---------- */
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "to-top";
  topBtn.setAttribute("aria-label", T("العودة إلى الأعلى", "Back to top"));
  topBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(topBtn);
  var onScrollTop = function () { topBtn.classList.toggle("show", window.scrollY > 520); };
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  if (menuBtn && nav) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

})();
