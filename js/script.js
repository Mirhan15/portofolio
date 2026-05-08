/* ============================================
   PORTFOLIO - SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
  document.body.style.overflow = 'hidden';

  /* ── Dark / Light Mode ── */
  const html = document.documentElement;
  const darkToggle = document.getElementById('darkToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);

  darkToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon(next);
  });

  function updateToggleIcon(theme) {
    const thumb = darkToggle.querySelector('.dark-toggle-thumb');
    thumb.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }

  /* ── Navbar Scroll ── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveNav();
    toggleBackTop();
  });

  /* ── Active nav link ── */
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  /* ── Typed Effect ── */
  const typeEl = document.getElementById('typedText');
  const phrases = ['Fullstack Developer', 'Laravel Expert', 'Flutter Developer', 'PHP Enthusiast', 'Open Source Lover'];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      typeEl.textContent = phrase.slice(0, ++charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typeEl.textContent = phrase.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 60 : 100);
  }
  typeLoop();

  /* ── Reveal on Scroll ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Skill Bars ── */
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      document.querySelectorAll('.skill-bar').forEach(bar => {
        const level = bar.dataset.level;
        setTimeout(() => { bar.style.width = level + '%'; }, 200);
      });
    }
  }, { threshold: 0.3 });

  if (skillsSection) skillObserver.observe(skillsSection);

  /* ── Counter Animation ── */
  const heroSection = document.getElementById('hero');
  let countersRun = false;

  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersRun) {
      countersRun = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const inc = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current = Math.min(current + inc, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 35);
      });
    }
  }, { threshold: 0.5 });

  if (heroSection) counterObserver.observe(heroSection);

  /* ── Project Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.opacity = '0';
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ── Smooth Nav Close on Mobile ── */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navCollapse)?.hide();
      }
    });
  });

  /* ── Back to Top ── */
  const backTop = document.getElementById('backTop');

  function toggleBackTop() {
    backTop.classList.toggle('show', window.scrollY > 400);
  }

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Contact Form ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Mengirim...';
      btn.disabled = true;
    });
  }

  /* ── Code window animation ── */
  const codeLines = document.querySelectorAll('.code-line');
  codeLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    setTimeout(() => {
      line.style.transition = 'all 0.3s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 2100 + i * 100);
  });

});
