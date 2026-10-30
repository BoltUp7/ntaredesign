/* ===================================================
   NITSCH THEATRE ARTS — JAVASCRIPT
   Navbar scroll, mobile menu, animations, forms
   =================================================== */

// ─── NAVBAR SCROLL ──────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ─── MOBILE NAV TOGGLE ───────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// ─── SCROLL ANIMATIONS (Intersection Observer) ───────
const fadeEls = document.querySelectorAll(
  '.about-grid, .show-card, .program-card, .testimonial-card, ' +
  '.gallery-item, .impact-item, .donate-card, .contact-form, ' +
  '.contact-item, .hero-stats, .section-header'
);

fadeEls.forEach(el => el.classList.add('fade-in-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in-up')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(l => l.style.color = '');
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.style.color = 'var(--gold)';
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

// ─── SMOOTH SCROLL (fallback for older browsers) ─────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── VIDEO OVERLAY ───────────────────────────────────
const videoOverlay = document.getElementById('video-overlay');
const playBtn      = document.getElementById('play-btn');
const videoEmbed   = document.getElementById('nta-youtube-embed');

if (videoOverlay && playBtn) {
  const showVideo = () => {
    videoOverlay.classList.add('hidden');
    // Swap to a real channel or latest video URL
    videoEmbed.src = 'https://www.youtube.com/embed?listType=user_uploads&list=NitschTheatreArts&autoplay=1';
  };
  playBtn.addEventListener('click', showVideo);
  playBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') showVideo();
  });
}

// ─── DONATE AMOUNT SELECTION ─────────────────────────
const donateAmountBtns = document.querySelectorAll('.donate-amount');
const customAmountInput = document.getElementById('custom-amount');

donateAmountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    donateAmountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    customAmountInput.value = '';
  });
});

customAmountInput.addEventListener('input', () => {
  donateAmountBtns.forEach(b => b.classList.remove('active'));
});

// Update PayPal donate button with selected amount
const donatePaypalBtn = document.getElementById('donate-paypal-btn');
if (donatePaypalBtn) {
  donatePaypalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const activeBtn = document.querySelector('.donate-amount.active');
    const amount = customAmountInput.value || (activeBtn ? activeBtn.dataset.amount : '25');
    // In a real implementation, this would integrate with PayPal's hosted button
    const url = `https://www.paypal.com/donate/?hosted_button_id=XYCDYZ67VH6JA&amount=${amount}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

// ─── CONTACT FORM ─────────────────────────────────────
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('contact-submit-btn');
  const successMsg = document.getElementById('form-success');

  // Simple validation
  const name    = form.querySelector('#contact-name').value.trim();
  const email   = form.querySelector('#contact-email-input').value.trim();
  const message = form.querySelector('#contact-message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  // Simulate sending (in production, connect to a form service like Netlify Forms or Formspree)
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    successMsg.style.display = 'block';
    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
  }, 1200);
}

// ─── FOOTER YEAR ──────────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ─── PARALLAX HERO ───────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ─── CURSOR SPOTLIGHT (subtle theatre effect) ─────────
const spotlight = document.createElement('div');
spotlight.style.cssText = `
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(157,78,221,0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.1s linear, top 0.1s linear;
  will-change: left, top;
`;
document.body.appendChild(spotlight);

document.addEventListener('mousemove', (e) => {
  spotlight.style.left = e.clientX + 'px';
  spotlight.style.top  = e.clientY + 'px';
}, { passive: true });
