/* ============================================================
   Summer Nicole Films — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Enhancement 4: Loading Screen
     Runs first — before any other init — to control overlay.
     ---------------------------------------------------------- */
  (function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    if (sessionStorage.getItem('snf_loaded')) {
      loader.style.display = 'none';
      return;
    }

    const name = loader.querySelector('.loader__name');
    const line = loader.querySelector('.loader__line');

    // 0ms — name fades in
    requestAnimationFrame(() => {
      if (name) name.style.opacity = '1';
    });

    // 400ms — line grows to match name width
    setTimeout(() => {
      if (line && name) line.style.width = name.offsetWidth + 'px';
    }, 400);

    // 1400ms — loader fades out
    setTimeout(() => {
      loader.style.opacity = '0';
    }, 1400);

    // 1800ms — loader removed, session marked
    setTimeout(() => {
      loader.style.display = 'none';
      sessionStorage.setItem('snf_loaded', '1');
    }, 1800);
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
    // Wrap the first text node ("photo + films") in an animated span
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

    // Hide the <br> between the two lines (em becoming block makes it redundant)
    heroHeadline.childNodes.forEach((node) => {
      if (node.tagName === 'BR') node.style.display = 'none';
    });

    if (heroEm) heroEm.classList.add('hero__split-right');

    // Trigger on next frame so CSS transitions fire
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
      startX = e.pageX - hTrack.offsetLeft;
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
    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCount(el) {
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1800;
      const start    = performance.now();

      (function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOutQuart(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(start);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-count').forEach(animateCount);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
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
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     Enhancement 1: Cursor Trail (desktop only)
     ---------------------------------------------------------- */
  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    let mouseX = -100, mouseY = -100;
    let dotX   = -100, dotY   = -100;
    let scale  = 1,    targetScale = 1;
    let fadeTimer = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    (function animateDot() {
      dotX  = lerp(dotX,  mouseX, 0.12);
      dotY  = lerp(dotY,  mouseY, 0.12);
      scale = lerp(scale, targetScale, 0.15);

      dot.style.left      = dotX + 'px';
      dot.style.top       = dotY + 'px';
      dot.style.transform = `translate(-50%, -50%) scale(${scale})`;

      requestAnimationFrame(animateDot);
    })();

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = '0.6';

      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => { dot.style.opacity = '0'; }, 300);
    });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a') || e.target.tagName === 'IMG') {
        targetScale = 2.5;
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a') || e.target.tagName === 'IMG') {
        targetScale = 1;
      }
    });
  }

})();
