/* ============================================
   PORTFOLIO - SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  if (loader) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1900);
    });
  }

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
  if (typeEl) {
    const phrases = ['Fullstack Developer', 'Laravel Expert', 'Flutter Developer', 'PHP Enthusiast', 'Open Source Lover'];
    let phraseIndex = 0, charIndex = 0, deleting = false;
    function typeLoop() {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        typeEl.textContent = phrase.slice(0, ++charIndex);
        if (charIndex === phrase.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
      } else {
        typeEl.textContent = phrase.slice(0, --charIndex);
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
      }
      setTimeout(typeLoop, deleting ? 60 : 100);
    }
    typeLoop();
  }

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

  /* ── Back to Top ── */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function toggleBackTop() {
    if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
  }

  /* ── Snake Game ── */
  const canvas = document.getElementById('snakeCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const box = 20;
    let snake, dir, food, score, bestScore, gameLoop, running, paused;

    function initSnake() {
      snake = [{ x: 7, y: 7 }];
      dir = { x: 1, y: 0 };
      score = 0;
      paused = false;
      running = false;
      document.getElementById('snakeScore').textContent = 0;
      placeFood();
      drawSnake();
    }

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * (canvas.width / box)),
        y: Math.floor(Math.random() * (canvas.height / box))
      };
    }

    function drawSnake() {
      ctx.fillStyle = '#0f1525';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // grid
      ctx.strokeStyle = 'rgba(37,99,235,0.05)';
      for (let i = 0; i < canvas.width / box; i++) {
        ctx.beginPath(); ctx.moveTo(i * box, 0); ctx.lineTo(i * box, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * box); ctx.lineTo(canvas.width, i * box); ctx.stroke();
      }

      // food
      ctx.fillStyle = '#f05340';
      ctx.beginPath();
      ctx.arc(food.x * box + box/2, food.y * box + box/2, box/2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // snake
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#3b82f6' : '#2563eb';
        ctx.beginPath();
        ctx.roundRect(s.x * box + 1, s.y * box + 1, box - 2, box - 2, 4);
        ctx.fill();
      });

      if (!running) {
        ctx.fillStyle = 'rgba(15,21,37,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 16px Syne, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press Start!', canvas.width/2, canvas.height/2);
      }
    }

    function stepSnake() {
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const cols = canvas.width / box;
      const rows = canvas.height / box;

      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(gameLoop);
        running = false;
        ctx.fillStyle = 'rgba(15,21,37,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 18px Syne, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 10);
        ctx.fillStyle = '#8892a4';
        ctx.font = '13px Space Mono, monospace';
        ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 15);
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snakeScore').textContent = score;
        bestScore = Math.max(bestScore || 0, score);
        document.getElementById('snakeBest').textContent = bestScore;
        placeFood();
      } else {
        snake.pop();
      }
      drawSnake();
    }

    document.getElementById('snakeStart').addEventListener('click', () => {
      clearInterval(gameLoop);
      initSnake();
      running = true;
      gameLoop = setInterval(stepSnake, 130);
    });

    document.getElementById('snakePause').addEventListener('click', () => {
      if (!running) return;
      if (paused) { gameLoop = setInterval(stepSnake, 130); paused = false; }
      else { clearInterval(gameLoop); paused = true; }
    });

    document.addEventListener('keydown', (e) => {
      if (!running) return;
      if (e.key === 'ArrowUp' && dir.y === 0) dir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && dir.y === 0) dir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && dir.x === 0) dir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && dir.x === 0) dir = { x: 1, y: 0 };
    });

    // swipe support
    let touchStartX, touchStartY;
    canvas.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', e => {
      if (!running) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && dir.x === 0) dir = { x: 1, y: 0 };
        if (dx < -20 && dir.x === 0) dir = { x: -1, y: 0 };
      } else {
        if (dy > 20 && dir.y === 0) dir = { x: 0, y: 1 };
        if (dy < -20 && dir.y === 0) dir = { x: 0, y: -1 };
      }
      e.preventDefault();
    }, { passive: false });

    initSnake();
  }

  /* ── Memory Card Game ── */
  const memoryGrid = document.getElementById('memoryGrid');
  if (memoryGrid) {
    const icons = [
      { icon: 'fa-brands fa-laravel', color: '#f05340' },
      { icon: 'fa-brands fa-php', color: '#8892be' },
      { icon: 'fa-brands fa-react', color: '#61dafb' },
      { icon: 'fa-brands fa-vuejs', color: '#42b883' },
      { icon: 'fa-brands fa-node-js', color: '#68a063' },
      { icon: 'fa-brands fa-github', color: '#f0f4ff' },
    ];

    let flipped = [], matched = 0, moves = 0, lockBoard = false;

    function shuffle(arr) { return [...arr, ...arr].sort(() => Math.random() - 0.5); }

    function initMemory() {
      flipped = []; matched = 0; moves = 0; lockBoard = false;
      document.getElementById('memoryMoves').textContent = 0;
      document.getElementById('memoryPairs').textContent = 0;
      memoryGrid.innerHTML = '';

      shuffle(icons).forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = item.icon;
        card.innerHTML = `
          <div class="memory-card-inner">
            <div class="memory-card-front"><i class="fa-solid fa-question"></i></div>
            <div class="memory-card-back"><i class="${item.icon}" style="color:${item.color}"></i></div>
          </div>`;
        card.addEventListener('click', () => flipCard(card));
        memoryGrid.appendChild(card);
      });
    }

    function flipCard(card) {
      if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      flipped.push(card);
      if (flipped.length === 2) {
        lockBoard = true;
        moves++;
        document.getElementById('memoryMoves').textContent = moves;
        if (flipped[0].dataset.icon === flipped[1].dataset.icon) {
          flipped.forEach(c => c.classList.add('matched'));
          matched++;
          document.getElementById('memoryPairs').textContent = matched;
          flipped = []; lockBoard = false;
          if (matched === icons.length) {
            setTimeout(() => alert('🎉 Selesai! ' + moves + ' moves'), 300);
          }
        } else {
          setTimeout(() => {
            flipped.forEach(c => c.classList.remove('flipped'));
            flipped = []; lockBoard = false;
          }, 900);
        }
      }
    }

    document.getElementById('memoryStart').addEventListener('click', initMemory);
    initMemory();
  }
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
