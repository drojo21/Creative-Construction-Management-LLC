/* ===== MOBILE NAV ===== */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  // Inject mobile nav overlay
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <button class="mobile-nav-close" aria-label="Close menu">&times;</button>
    <a href="#deliverables">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact Us</a>
  `;
  document.body.appendChild(mobileNav);

  function openMenu() { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileNav.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', openMenu);
  mobileNav.querySelector('.mobile-nav-close').addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

/* ===== SCROLL-TRIGGERED CARD ANIMATIONS ===== */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll('.card, .stat, .contact-card');
  cards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.animation = 'none';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
    observer.observe(card);
  });
})();

/* ===== STICKY HEADER SHADOW ===== */
(function () {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 8) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    }
  }, { passive: true });
})();

/* ===== SMOOTH ANCHOR OFFSET (accounts for sticky header) ===== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 76; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
