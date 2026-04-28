/* ========================================================
   Small Brain Studio — script.js (Performance Optimized)
   ======================================================== */

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('sbs-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('sbs-theme', next);

  themeToggle.classList.remove('spinning');
  void themeToggle.offsetWidth;
  themeToggle.classList.add('spinning');
  setTimeout(() => themeToggle.classList.remove('spinning'), 520);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
      updateActiveNavLink();
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
  const sections = ['home', 'about', 'services', 'work', 'contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) current = id;
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
document.body.prepend(progressBar);

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
}

// ===== ANIMATE ON SCROLL =====
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach((el, i) => {
  el.dataset.delay = (i % 5) * 90;
  animateObserver.observe(el);
});

// ===== STAGGERED CARDS =====
function staggerCards(selector) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * 70}ms`;
  });
}
staggerCards('.service-card');
staggerCards('.work-card');

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== PARTICLES (Optimized — Canvas-based, no DOM spam) =====
const particlesCanvas = document.createElement('canvas');
particlesCanvas.id = 'particlesCanvas';
particlesCanvas.style.cssText = `
  position:fixed;top:0;left:0;width:100%;height:100%;
  pointer-events:none;z-index:0;opacity:0.7;
`;
document.body.prepend(particlesCanvas);

// Remove the old #particles div if it exists
const oldParticles = document.getElementById('particles');
if (oldParticles) oldParticles.remove();

const ctx = particlesCanvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
particlesCanvas.width = W;
particlesCanvas.height = H;

const PARTICLE_COUNT = 28; // reduced from 55
const particles = [];

function initParticle(p) {
  p.x = Math.random() * W;
  p.y = Math.random() * H;
  p.size = Math.random() * 1.8 + 0.5;
  p.speed = Math.random() * 0.4 + 0.15;
  p.opacity = Math.random() * 0.45 + 0.08;
  p.hue = Math.random() > 0.7 ? 270 : 199;
  return p;
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(initParticle({}));
}

// Pause canvas when page is hidden
let canvasRunning = true;
document.addEventListener('visibilitychange', () => {
  canvasRunning = !document.hidden;
  if (canvasRunning) drawParticles();
});

function drawParticles() {
  if (!canvasRunning) return;
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.opacity})`;
    ctx.fill();
    p.y += p.speed;
    if (p.y > H + 5) {
      p.y = -5;
      p.x = Math.random() * W;
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Resize handling — debounced
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    W = window.innerWidth;
    H = window.innerHeight;
    particlesCanvas.width = W;
    particlesCanvas.height = H;
  }, 200);
}, { passive: true });

// ===== WORK FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach((card, i) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) {
        card.classList.remove('hidden');
        card.style.transitionDelay = `${i * 60}ms`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});

// ===== EMAILJS — Lazy Load (only when contact section enters viewport) =====
const EMAILJS_PUBLIC_KEY  = 'tnqWUAbOJiXDatDyn';
const EMAILJS_SERVICE_ID  = 'service_5tzz0fh';
const EMAILJS_TEMPLATE_ID = 'template_v6taca8';

let emailjsLoaded = false;

function loadEmailJS() {
  if (emailjsLoaded) return;
  emailjsLoaded = true;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  };
  document.head.appendChild(script);
}

const contactSection = document.getElementById('contact');
if (contactSection) {
  const emailjsLoader = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadEmailJS();
      emailjsLoader.disconnect();
    }
  }, { rootMargin: '300px' }); // preload 300px before visible
  emailjsLoader.observe(contactSection);
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn     = document.getElementById('submitBtn');
  const btnText = btn.querySelector('.btn-text');

  btnText.textContent = 'Sending...';
  btn.disabled = true;
  formSuccess.classList.remove('show');
  formError.classList.remove('show');

  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
    .then(() => {
      formSuccess.classList.add('show');
      contactForm.reset();
      btnText.textContent = 'Message Sent!';
      setTimeout(() => {
        formSuccess.classList.remove('show');
        btnText.textContent = 'Send Message';
        btn.disabled = false;
      }, 6000);
    })
    .catch((err) => {
      console.error('EmailJS Error:', err);
      formError.classList.add('show');
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => formError.classList.remove('show'), 6000);
    });
});

// ===== FOOTER YEAR =====
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ===== CURSOR GLOW — Fixed: uses transform instead of left/top =====
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position:fixed;width:400px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(56,189,248,0.06),rgba(129,140,248,0.03),transparent 70%);
  pointer-events:none;z-index:9998;
  top:0;left:0;
  transform:translate(-50%,-50%);
  will-change:transform;
`;
document.body.appendChild(cursorGlow);

let cursorX = -500, cursorY = -500, glowX = -500, glowY = -500;
let glowAnimId = null;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (!glowAnimId) glowAnimId = requestAnimationFrame(animateCursor);
}, { passive: true });

function animateCursor() {
  glowX += (cursorX - glowX) * 0.1;
  glowY += (cursorY - glowY) * 0.1;
  // Use transform (GPU-composited) instead of left/top (layout thrashing)
  cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
  const dx = Math.abs(cursorX - glowX);
  const dy = Math.abs(cursorY - glowY);
  if (dx > 0.1 || dy > 0.1) {
    glowAnimId = requestAnimationFrame(animateCursor);
  } else {
    glowAnimId = null; // Stop when settled — save CPU
  }
}

// ===== MAGNETIC BUTTON =====
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.22;
    const y = (e.clientY - r.top  - r.height / 2) * 0.22;
    btn.style.transform = `translate(${x}px,${y}px)`;
  }, { passive: true });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ===== CARD 3D TILT — Only on non-touch devices =====
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.service-card, .work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) / r.width;
      const y = (e.clientY - r.top  - r.height / 2) / r.height;
      card.style.transform = `translateY(-8px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ===== FORM FOCUS GLOW =====
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
  el.addEventListener('focus', () => { el.parentElement.style.position = 'relative'; });
});
