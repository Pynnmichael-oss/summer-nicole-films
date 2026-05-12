/* ============================================================
   Summer Nicole Films — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Fade-in via IntersectionObserver
     ---------------------------------------------------------- */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in, .stagger-children').forEach((el) => {
    fadeObserver.observe(el);
  });

  /* ----------------------------------------------------------
     Nav: transparent → solid on scroll (hero pages only)
     ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const isHeroPage = document.querySelector('.hero') !== null;

    function updateNav() {
      if (!isHeroPage) {
        nav.classList.remove('nav--transparent');
        nav.classList.add('nav--solid');
        return;
      }
      if (window.scrollY > 60) {
        nav.classList.remove('nav--transparent');
        nav.classList.add('nav--solid');
      } else {
        nav.classList.remove('nav--solid');
        nav.classList.add('nav--transparent');
      }
    }

    if (isHeroPage) {
      nav.classList.add('nav--transparent');
    } else {
      nav.classList.add('nav--solid');
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ----------------------------------------------------------
     Mobile hamburger + overlay nav
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay   = document.querySelector('.nav__overlay');
  const overlayClose = document.querySelector('.nav__overlay-close');

  function openOverlay() {
    if (!overlay) return;
    overlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', openOverlay);
  overlayClose && overlayClose.addEventListener('click', closeOverlay);

  overlay && overlay.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeOverlay);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });

  /* ----------------------------------------------------------
     Active nav link
     ---------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__overlay a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     FAQ Accordion
     ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ----------------------------------------------------------
     Portfolio filter (portfolio.html)
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.pg-item').forEach((item) => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Smooth scroll for anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
