'use strict';
/* WEB MATES visual prototype: theme and nav affordance ONLY.
   No storage, analytics, network, curriculum or engine changes. */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const navLinks = [...document.querySelectorAll('.topbar nav a')];

  function applyTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark
      ? 'Modo oscuro activado. Cambiar a modo claro'
      : 'Modo claro activado. Cambiar a modo oscuro');
    toggle.querySelector('.theme-icon').textContent = dark ? '☼' : '☾';
    toggle.querySelector('.theme-label').textContent = dark ? 'Claro' : 'Oscuro';
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', dark ? '#08151b' : '#14312f'
    );
  }

  function updateNavigation() {
    const hash = location.hash || '#/';
    for (const link of navLinks) {
      const href = link.getAttribute('href');
      const active = href === '#/'
        ? !hash.startsWith('#/repaso') && !hash.startsWith('#/acerca')
        : hash === href || hash.startsWith(href + '/');
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }

  toggle.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  window.addEventListener('hashchange', updateNavigation);
  applyTheme(root.dataset.theme || 'dark');
  updateNavigation();
})();
