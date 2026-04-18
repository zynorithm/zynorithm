/* ============================================================
   ZYNORITHM — script.js v2.0
   ============================================================ */

// ── EmailJS Config (replace with your credentials) ──────────
const EMAILJS_SERVICE_ID  = 'service_4lvtykt';
const EMAILJS_TEMPLATE_ID = 'template_izu0i8d';
const EMAILJS_PUBLIC_KEY  = 'fzJDxukOv_abrYmo4';

// ── DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS ready');
  }

  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounterAnimation();
  initContactForm();
  initHeroParallax();
  initProjectImages();
  initServiceCardHover();
  initScrollAnimations();
});


/* ─────────────────────────────────────────────────────────────
   2. NAVBAR — transparent → glass on scroll
───────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href');
      if (href === `#${current}` || href === `index.html#${current}`) {
        link.style.color = '#c084fc';
      }
    });
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   4. MOBILE MENU
───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   5. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const showIfVisible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
      return true;
    }
    return false;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const index    = siblings.indexOf(entry.target);
          const delay    = Math.min(index * 80, 300);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px 0px 0px' }
  );

  revealEls.forEach(el => {
    if (!showIfVisible(el)) {
      observer.observe(el);
    }
  });

  // Nuclear fallback
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 1500);
}


/* ─────────────────────────────────────────────────────────────
   6. COUNTER ANIMATION
───────────────────────────────────────────────────────────── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800;
  const start    = performance.now();
  const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(ease(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}


/* ─────────────────────────────────────────────────────────────
   7. HERO PARALLAX
───────────────────────────────────────────────────────────── */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const orbs = hero.querySelectorAll('.hero-orb');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    orbs.forEach((orb, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      orb.style.transform = `translateY(${scrollY * dir * 0.12}px)`;
    });
  }, { passive: true });

  hero.addEventListener('mousemove', (e) => {
    const rect    = hero.getBoundingClientRect();
    const offsetX = (e.clientX - rect.width / 2) / rect.width;
    const offsetY = (e.clientY - rect.height / 2) / rect.height;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 8;
      orb.style.transform = `translate(${offsetX * depth}px, ${offsetY * depth}px)`;
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   8. CONTACT FORM — EmailJS fully wired
   Template variables used (set these in your EmailJS template):
     {{from_name}}   — sender's name
     {{from_email}}  — sender's email (also set as Reply-To)
     {{service}}     — selected service
     {{budget}}      — selected budget
     {{message}}     — project description
     {{to_name}}     — recipient name (auto: "Zynorithm Team")
   ─────────────────────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');
  const btnIcon   = document.getElementById('btnIcon');
  const btnLoader = document.getElementById('btnLoader');
  const successEl = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ── Collect values ─────────────────────────────────────────
    const name    = document.getElementById('name')?.value.trim()    || '';
    const email   = document.getElementById('email')?.value.trim()   || '';
    const mobile  = document.getElementById('mobile')?.value.trim()  || '';
    const service = document.getElementById('service')?.value        || '';
    const budget  = document.getElementById('budget')?.value         || '';
    const message = document.getElementById('message')?.value.trim() || '';

    // ── Validate ───────────────────────────────────────────────
    if (!name) { highlightField('name',    'Please enter your name');    return; }
    if (!email) { highlightField('email',   'Please enter your email');   return; }
    if (!isValidEmail(email)) { highlightField('email', 'Please enter a valid email'); return; }
    if (!mobile) { highlightField('mobile', 'Please enter your mobile number'); return; }
    if (!isValidMobile(mobile)) { highlightField('mobile', 'Please enter a valid mobile number'); return; }
    if (!message) { highlightField('message', 'Please describe your project'); return; }

    // ── Loading state ──────────────────────────────────────────
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    if (btnText)   btnText.textContent  = 'Sending…';
    if (btnIcon)   btnIcon.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'block';

    // ── EmailJS send ───────────────────────────────────────────
    const templateParams = {
      to_name:    'Zynorithm Team',
      from_name:  name,
      from_email: email,
      from_phone: mobile,
      service:    service  || 'Not specified',
      budget:     budget   || 'Not specified',
      message:    message,
      reply_to:   email,
    };

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      console.log('✅ EmailJS success:', result.status, result.text);
      showSuccess(form, successEl);

    } catch (err) {
      console.error('❌ EmailJS error:', err);
      showFormError(form, err);

    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      if (btnText)   btnText.textContent   = 'Send Message';
      if (btnIcon)   btnIcon.style.display  = '';
      if (btnLoader) btnLoader.style.display = 'none';
    }
  });
}

/* Show inline error banner instead of alert */
function showFormError(form, err) {
  // Remove any existing error
  const existing = form.querySelector('.form-error-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = 'form-error-banner';
  banner.innerHTML = `
    <i class="ri-error-warning-line"></i>
    <span>Something went wrong. Please email us directly at
      <a href="mailto:hello@zynorithm.com">hello@zynorithm.com</a>
    </span>`;
  form.insertBefore(banner, form.querySelector('.btn-submit'));

  // Auto-remove after 8 seconds
  setTimeout(() => banner.remove(), 8000);
}

/* Highlight a specific invalid field */
function highlightField(fieldId, msg) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.classList.add('field-error');
  el.focus();

  // Remove error on next input
  el.addEventListener('input', () => el.classList.remove('field-error'), { once: true });

  // Shake the field
  shakeForm(el);
}

function showSuccess(form, successEl) {
  if (!successEl) return;
  form.style.display = 'none';
  successEl.classList.add('visible');
  const icon = successEl.querySelector('.success-icon i');
  if (icon) icon.style.animation = 'fadeUp 0.5s ease both';
}

function resetForm() {
  const form      = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (!form || !successEl) return;
  form.reset();
  form.style.display = '';
  successEl.classList.remove('visible');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile) {
  // Accepts phone numbers with 10-15 digits, with optional +, spaces, dashes, parentheses
  return /^[+]?[\s]?[(]?[0-9]{1,4}[)]?[-\s]?[(]?[0-9]{1,4}[)]?[-\s]?[(]?[0-9]{1,9}[)]?$/.test(mobile.replace(/\s/g, ''));
}

function shakeForm(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => {
    el.style.animation = '';
  }, { once: true });
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ─────────────────────────────────────────────────────────────
   9. SMOOTH ANCHOR SCROLL
───────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ─────────────────────────────────────────────────────────────
   10. SERVICE CARD — stagger on hover siblings
───────────────────────────────────────────────────────────── */
(function () {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.04}s`;
  });
})();


/* ─────────────────────────────────────────────────────────────
   11. PROJECT CARDS — tilt on mousemove
───────────────────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width;
    const y     = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 8;
    const tiltY = (0.5 - x) * 8;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});


/* ─────────────────────────────────────────────────────────────
   12. PROJECT IMAGES — hide fallback when real img loads
───────────────────────────────────────────────────────────── */
function initProjectImages() {
  // Handles both .project-img-real (legacy) and .pf-card__img (new portfolio cards)
  document.querySelectorAll('.project-img-real, .pf-card__img').forEach(img => {
    const fallback = img.nextElementSibling;
    if (!fallback) return;
    const onLoad  = () => { fallback.style.display = 'none'; };
    const onError = () => { img.style.display = 'none'; fallback.style.display = 'flex'; };
    if (img.complete && img.naturalWidth > 0) { onLoad(); }
    else if (img.complete) { onError(); }
    else {
      img.addEventListener('load',  onLoad,  { once: true });
      img.addEventListener('error', onError, { once: true });
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   13. SERVICE CARD HOVER — icon ripple
───────────────────────────────────────────────────────────── */
function initServiceCardHover() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      const iconWrap = this.querySelector('.service-icon-wrap');
      if (iconWrap) {
        iconWrap.style.boxShadow = '0 0 24px rgba(138,43,226,0.45)';
      }
    });
    card.addEventListener('mouseleave', function() {
      const iconWrap = this.querySelector('.service-icon-wrap');
      if (iconWrap) {
        iconWrap.style.boxShadow = '';
      }
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   14. SCROLL ANIMATIONS — parallax & stagger effects
───────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  // Parallax effect for background orbs
  const parallaxElements = document.querySelectorAll('.hero-orb, .projects-bg-orb, .about::before, .services::before, .contact::before');
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(el => {
      const scrollPos = window.scrollY;
      const speed = 0.5;
      if (el.style) {
        el.style.transform = `translateY(${scrollPos * speed}px)`;
      }
    });
  }, { passive: true });

  // Staggered scale reveal for service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.setProperty('--reveal-delay', `${index * 100}ms`);
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) translateY(0)';
    });
  });

  // Floating animation for project cards
  const projectCards = document.querySelectorAll('.pf-card');
  projectCards.forEach((card, index) => {
    card.style.setProperty('--float-offset', `${index * 4}px`);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          card.style.animation = `floatUp 3s ease-in-out infinite`;
          card.style.animationDelay = `${index * 0.2}s`;
        }
      });
    }, { threshold: 0.1 });
    observer.observe(card);
  });
}


/* ─────────────────────────────────────────────────────────────
   15. FOOTER — current year
───────────────────────────────────────────────────────────── */
(function () {
  const yearEls = document.querySelectorAll('.footer-bottom p');
  if (!yearEls.length) return;
  const year = new Date().getFullYear();
  yearEls[0].innerHTML = yearEls[0].innerHTML.replace('2026', year);
})();


/* ─────────────────────────────────────────────────────────────
   16. FILTER TABS & PROJECT CARDS
───────────────────────────────────────────────────────────── */
(function() {
  const filterBtns = document.querySelectorAll('.pf-filter-btn');
  const allCards   = document.querySelectorAll('#allProjectsGrid .pf-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visible = 0;
      allCards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.setProperty('--stagger', visible);
          card.classList.remove('fade-in');
          void card.offsetWidth;
          card.classList.add('fade-in');
          visible++;
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-in');
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   17. PROJECT IMAGES — Fallback on error
───────────────────────────────────────────────────────────── */
(function() {
  document.querySelectorAll('.pf-card__img').forEach(img => {
    const fallback = img.nextElementSibling;
    if (img.complete && img.naturalWidth > 0) {
      if (fallback) fallback.style.display = 'none';
    } else {
      img.addEventListener('load', () => { if (fallback) fallback.style.display = 'none'; });
      img.addEventListener('error', () => {
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
      });
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   18. PAGE TRANSITIONS
───────────────────────────────────────────────────────────── */
(function() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.animation = 'none';
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      requestAnimationFrame(() => {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-10px)';
      });
      setTimeout(() => { window.location.href = href; }, 310);
    });
  });
})();
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "LocalBusiness",
 "name": "Zynorithm",
 "url": "https://zynorithm.vercel.app",
 "logo": "https://zynorithm.vercel.app/logo-z.png",
 "contactPoint": {
   "@type": "ContactPoint",
   "telephone": "+919042700663",
   "contactType": "customer service"
 },
 "address": {
   "@type": "PostalAddress",
   "addressLocality": "Erode",
   "addressRegion": "Tamil Nadu",
   "addressCountry": "India"
 },
 "sameAs": [
   "https://www.linkedin.com/company/zynorithm/"
 ]
}
</script>