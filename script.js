/* ========================================================
   Small Brain Studio — script.js
   ======================================================== */

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Load saved theme preference
const savedTheme = localStorage.getItem('sbs-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('sbs-theme', next);

  // Trigger spin animation
  themeToggle.classList.remove('spinning');
  void themeToggle.offsetWidth; // force reflow
  themeToggle.classList.add('spinning');
  setTimeout(() => themeToggle.classList.remove('spinning'), 520);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNavLink();
  updateScrollProgress();
});

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

// ===== ANIMATE ON SCROLL (Directional) =====
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

// ===== PARTICLES (Enhanced) =====
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 55;

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 2.5 + 0.8;
  const hue = Math.random() > 0.7 ? '270' : '199';
  p.style.cssText = `
    left:${Math.random() * 100}%;
    top:${Math.random() * 100}%;
    width:${size}px;
    height:${size}px;
    background:hsl(${hue},90%,75%);
    animation-duration:${Math.random() * 12 + 7}s;
    animation-delay:${Math.random() * 10}s;
    opacity:${Math.random() * 0.55 + 0.08};
  `;
  particlesContainer.appendChild(p);
}
for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

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

// ===== EMAILJS SETUP =====
const EMAILJS_PUBLIC_KEY  = 'tnqWUAbOJiXDatDyn';
const EMAILJS_SERVICE_ID  = 'service_5tzz0fh';
const EMAILJS_TEMPLATE_ID = 'template_v6taca8';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

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

// ===== CURSOR GLOW (rAF Smooth) =====
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position:fixed;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(56,189,248,0.05),rgba(129,140,248,0.025),transparent 70%);
  pointer-events:none;z-index:9998;transform:translate(-50%,-50%);will-change:left,top;
`;
document.body.appendChild(cursorGlow);

let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;
document.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });
(function animateCursor() {
  glowX += (cursorX - glowX) * 0.1;
  glowY += (cursorY - glowY) * 0.1;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
})();

// ===== MAGNETIC BUTTON =====
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.22;
    const y = (e.clientY - r.top  - r.height / 2) * 0.22;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ===== CARD 3D TILT =====
document.querySelectorAll('.service-card, .work-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / r.width;
    const y = (e.clientY - r.top  - r.height / 2) / r.height;
    card.style.transform = `translateY(-8px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== FORM FOCUS GLOW =====
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
  el.addEventListener('focus', () => { el.parentElement.style.position = 'relative'; });
});
