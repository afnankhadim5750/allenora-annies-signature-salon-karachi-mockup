/* Allenora Annie's Signature Salon — mobile menu, tabs, lightbox, scroll-spy, reveal */
(function () {
  'use strict';

  /* ---------- Mobile menu (instant toggle, no transitions) ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) setMenu(false);
    });
  }

  /* ---------- Service tabs ---------- */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var panels = {};
  tabBtns.forEach(function (btn) {
    panels[btn.dataset.tab] = document.getElementById('tab-' + btn.dataset.tab);
  });
  function activateTab(name, focusBtn) {
    tabBtns.forEach(function (btn) {
      var active = btn.dataset.tab === name;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      var panel = panels[btn.dataset.tab];
      if (panel) panel.hidden = !active;
    });
    if (focusBtn) {
      var btn = tabBtns.filter(function (b) { return b.dataset.tab === name; })[0];
      if (btn) btn.focus();
    }
  }
  tabBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { activateTab(btn.dataset.tab); });
    btn.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabBtns[(i + 1) % tabBtns.length];
      if (e.key === 'ArrowLeft') next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
      if (next) { e.preventDefault(); activateTab(next.dataset.tab, true); }
    });
  });
  /* Bento tiles that deep-link to a tab */
  document.querySelectorAll('[data-tab-link]').forEach(function (tile) {
    tile.addEventListener('click', function () { activateTab(tile.dataset.tabLink); });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lastFocus = null;
  function openLightbox(item) {
    lastFocus = document.activeElement;
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.dataset.alt || '';
    lightboxCaption.textContent = item.dataset.alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
  });
  if (lightbox) {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- Scroll-spy for the desktop nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

})();
