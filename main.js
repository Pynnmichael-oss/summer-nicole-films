/* ============================================================
   Summer Nicole Films — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Enhancement 4: Loading Screen — Cinematic Curtain
     Injects all HTML via JS. Skipped after first visit
     (sessionStorage key 'snf_loaded').
     ---------------------------------------------------------- */
  (function initLoader() {
    if (sessionStorage.getItem('snf_loaded')) return;

    // Build loader DOM
    const loader   = document.createElement('div');
    loader.id      = 'loader';
    loader.setAttribute('aria-hidden', 'true');

    const panelL   = document.createElement('div');
    panelL.id      = 'loader-left';

    const panelR   = document.createElement('div');
    panelR.id      = 'loader-right';

    const content  = document.createElement('div');
    content.id     = 'loader-content';

    const logo     = document.createElement('div');
    logo.id        = 'loader-logo';
    logo.textContent = 'Summer Nicole Films';

    const line     = document.createElement('div');
    line.id        = 'loader-line';

    const tagline  = document.createElement('div');
    tagline.id     = 'loader-tagline';
    tagline.textContent = 'for the lovers of nostalgia';

    content.appendChild(logo);
    content.appendChild(line);
    content.appendChild(tagline);
    loader.appendChild(panelL);
    loader.appendChild(panelR);
    loader.appendChild(content);
    document.body.insertBefore(loader, document.body.firstChild);

    // Page veil: sits behind loader (z-index 9999), above page content.
    // Fades out as curtain opens to give the page a clean reveal.
    const veil = document.createElement('div');
    veil.id    = 'page-veil';
    document.body.insertBefore(veil, document.body.firstChild);

    // ── Animation sequence ─────────────────────────────────
    // 200ms  — logo fades + slides up into place  (0.6s)
    setTimeout(() => {
      logo.style.opacity   = '1';
      logo.style.transform = 'translateY(0)';
    }, 200);

    // 700ms  — line grows to 180px                (0.6s)
    setTimeout(() => {
      line.style.width = '180px';
    }, 700);

    // 1100ms — tagline fades in                   (0.5s)
    setTimeout(() => {
      tagline.style.opacity = '1';
    }, 1100);

    // 1800ms — all content fades out together     (0.4s)
    setTimeout(() => {
      logo.style.opacity    = '0';
      line.style.opacity    = '0';
      tagline.style.opacity = '0';
    }, 1800);

    // 2000ms — curtain panels slide apart          (0.8s cubic)
    setTimeout(() => {
      panelL.style.transform = 'translateX(-100%)';
      panelR.style.transform = 'translateX(100%)';
    }, 2000);

    // 2200ms — veil fades, page content appears   (0.6s)
    setTimeout(() => {
      veil.style.opacity = '0';
    }, 2200);

    // 2800ms — clean up DOM, mark session
    setTimeout(() => {
      loader.remove();
      veil.remove();
      sessionStorage.setItem('snf_loaded', '1');
    }, 2800);
  })();

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
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
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
      if (window.scrollY > 80) {
        nav.classList.remove('nav--transparent');
        nav.classList.add('nav--solid');
      } else {
        nav.classList.remove('nav--solid');
        nav.classList.add('nav--transparent');
      }
    }

    nav.classList.add(isHeroPage ? 'nav--transparent' : 'nav--solid');
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ----------------------------------------------------------
     Mobile hamburger + overlay nav
     ---------------------------------------------------------- */
  const hamburger    = document.querySelector('.nav__hamburger');
  const overlay      = document.querySelector('.nav__overlay');
  const overlayClose = document.querySelector('.nav__overlay-close');

  function openOverlay() {
    if (!overlay) return;
    overlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger    && hamburger.addEventListener('click', openOverlay);
  overlayClose && overlayClose.addEventListener('click', closeOverlay);
  overlay && overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeOverlay));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlay(); });

  /* ----------------------------------------------------------
     Active nav link
     ---------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__overlay a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     Effect 3: Hero Parallax (homepage only)
     ---------------------------------------------------------- */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Enhancement 2: Hero Text Split Animation (homepage only)
     ---------------------------------------------------------- */
  const heroHeadline = document.querySelector('.hero__headline');
  if (heroHeadline) {
    let firstText = null;
    heroHeadline.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        firstText = node;
      }
    });

    const heroEm = heroHeadline.querySelector('em');

    if (firstText) {
      const spanLeft = document.createElement('span');
      spanLeft.className = 'hero__split-left';
      spanLeft.textContent = firstText.textContent;
      heroHeadline.replaceChild(spanLeft, firstText);
    }

    heroHeadline.childNodes.forEach((node) => {
      if (node.tagName === 'BR') node.style.display = 'none';
    });

    if (heroEm) heroEm.classList.add('hero__split-right');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroHeadline.querySelectorAll('.hero__split-left, .hero__split-right').forEach((el) => {
          el.classList.add('hero__split-active');
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Effect 2: Horizontal scroll — drag to scroll
     ---------------------------------------------------------- */
  const hTrack = document.getElementById('hScrollTrack');
  if (hTrack) {
    let isDown = false;
    let startX, scrollLeft;

    hTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      hTrack.classList.add('dragging');
      startX     = e.pageX - hTrack.offsetLeft;
      scrollLeft = hTrack.scrollLeft;
    });
    hTrack.addEventListener('mouseleave', () => { isDown = false; hTrack.classList.remove('dragging'); });
    hTrack.addEventListener('mouseup',    () => { isDown = false; hTrack.classList.remove('dragging'); });
    hTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      hTrack.scrollLeft = scrollLeft - (e.pageX - hTrack.offsetLeft - startX) * 1.5;
    });
  }

  /* ----------------------------------------------------------
     Enhancement 3: Stats Counter
     ---------------------------------------------------------- */
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function animateCount(el) {
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1800;
      const start    = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(easeOutQuart(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-count').forEach(animateCount);
          entry.target._statsObserver && entry.target._statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 }).observe(statsSection);
  }

  /* ----------------------------------------------------------
     FAQ Accordion
     ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').classList.remove('open');
      });
      if (!isOpen) { item.classList.add('open'); answer.classList.add('open'); }
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
          const show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
          if (show) requestAnimationFrame(() => { item.style.opacity = '1'; });
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
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ----------------------------------------------------------
     Enhancement 1: Cursor Trail (desktop / pointer:fine only)
     ---------------------------------------------------------- */
  if (!window.matchMedia('(pointer: coarse)').matches) {
    const cursor = document.createElement('div');
    cursor.id    = 'cursor-trail';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let lerpX  = 0, lerpY  = 0;

    // rAF loop — always running, lerps position each frame
    (function loop() {
      lerpX += (mouseX - lerpX) * 0.1;
      lerpY += (mouseY - lerpY) * 0.1;
      cursor.style.left = lerpX + 'px';
      cursor.style.top  = lerpY + 'px';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '0.7';
    });

    // Fade on window leave
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Grow on interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, img')) cursor.classList.add('cursor-grow');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, img')) cursor.classList.remove('cursor-grow');
    });
  }

})();
