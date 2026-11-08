(() => {
  const header = document.querySelector('.site-header');
  const trigger = document.getElementById('menuTrigger');
  const overlay = document.getElementById('fullscreenMenu');
  const close = document.getElementById('menuClose');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) close.focus(); else trigger.focus();
  };

  trigger.addEventListener('click', () => setMenu(!overlay.classList.contains('open')));
  close.addEventListener('click', () => setMenu(false));
  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) setMenu(false);
  });

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Keep the capability list focused: opening one closes the others.
  const capabilities = document.querySelectorAll('.capability');
  capabilities.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) capabilities.forEach(other => { if (other !== item) other.open = false; });
  }));
})();
