/* ============================================
   AI ASSISTANT WIDGET
   Works offline with a built-in knowledge base.
   To use a real LLM, set AGENT_ENDPOINT to your own proxy
   (never put an API key in this file). The endpoint receives
   POST {message, history} and must return JSON {reply}.
   ============================================ */
(function () {
  const AGENT_ENDPOINT = '';

  const WA = 'https://wa.me/6285224750924';
  const MAIL = 'mailto:mirhanmaulana15@gmail.com';

  const SUGGESTIONS = ['Siapa Mirhan?', 'Skill utama?', 'Layanan apa saja?', 'Pengalaman kerja', 'Cara menghubungi'];

  const KB = [
    { k: ['halo', 'hai', 'hi', 'hello', 'selamat', 'pagi', 'siang', 'sore', 'malam', 'hey'],
      a: 'Halo! Saya asisten AI portofolio Mirhan. Tanyakan soal skill, layanan, proyek, pengalaman, atau cara menghubungi Mirhan.' },
    { k: ['siapa', 'about', 'tentang', 'profil', 'kenalan', 'who', 'dirimu', 'mirhan'],
      a: 'Mirhan Maulana adalah Fullstack Developer di Jakarta. Ia membangun sistem digital dari nol sampai siap dipakai: website, dashboard admin, REST API, dan aplikasi web custom dengan struktur rapi dan scalable. Ia lulusan D3 Manajemen Informatika Politeknik LP3I Bandung dan saat ini Staff Programmer di PT. BGR Logistik Indonesia.' },
    { k: ['skill', 'keahlian', 'teknologi', 'stack', 'bahasa pemrograman', 'kuasai', 'tech', 'bisa apa', 'navicat', 'html', 'css', 'microsoft', 'office', 'hard skill', 'kemampuan'],
      a: 'Skill utama Mirhan:\n• Backend: PHP, Laravel, CodeIgniter, Node.js, Golang\n• Frontend: Vue.js, React, Angular, TypeScript, Bootstrap\n• Database: PostgreSQL dan MySQL\nYang paling kuat: PHP (92%), Laravel (90%), dan Bootstrap (95%).\nMenurut CV: HTML, CSS, PHP, Laravel, CodeIgniter, Node.js, React, Vue, MySQL, Navicat, dan Microsoft Office.' },
    { k: ['laravel'], a: 'Laravel adalah salah satu keahlian utama Mirhan (sekitar 90%): MVC, Eloquent ORM, REST API, middleware, dan queue. Ia juga memakai Laravel di pekerjaannya sekarang.' },
    { k: ['php'], a: 'PHP adalah skill terkuat Mirhan (sekitar 92%): PHP 8.x, OOP, Composer, dan standar PSR.' },
    { k: ['react', 'vue', 'angular', 'frontend', 'front-end'], a: 'Di frontend Mirhan memakai Vue.js (Vue 3, Composition API, Pinia), React (Hooks, Redux, Next.js), dan Angular, ditambah TypeScript dan Bootstrap untuk UI responsif.' },
    { k: ['node', 'express', 'golang', 'go ', 'backend', 'back-end'], a: 'Untuk backend selain PHP, Mirhan memakai Node.js (Express, REST API), Golang (Gin, microservices), dan CodeIgniter 4.' },
    { k: ['database', 'postgres', 'postgresql', 'mysql', 'sql'], a: 'Mirhan berpengalaman dengan PostgreSQL (optimasi query, indexing, stored procedure) dan MySQL (normalisasi, migrasi), termasuk desain ERD dan skema.' },
    { k: ['layanan', 'service', 'jasa', 'offer', 'tawarkan', 'bikin', 'buat website', 'buatkan'],
      a: 'Layanan yang ditawarkan:\n• Web Development (landing page, company profile, web app)\n• Sistem Development (inventaris, absensi/HR, POS)\n• REST API Development (JWT, Swagger)\n• Admin Dashboard (role & permission, export Excel/PDF)\n• UI Integration (Figma ke kode)\n• Database Design' },
    { k: ['proyek', 'project', 'portfolio', 'portofolio', 'karya', 'hasil kerja'],
      a: 'Beberapa proyek di portofolio:\n• Website Corporate Laravel (CMS custom, SEO-friendly)\n• Admin Dashboard (chart, role & permission, export laporan)\n• Sistem CRUD Inventaris (REST API, JWT, Swagger)\n• Blog Management System\n• Dynamic Menu Laravel (RBAC)\nLihat bagian Portfolio di halaman ini.' },
    { k: ['pengalaman', 'experience', 'kerja', 'karir', 'karier', 'career', 'perusahaan', 'bgr', 'jabatan', 'tugas', 'tanggung jawab', 'jobdesk', 'bekerja'],
      a: 'Pengalaman kerja Mirhan:\n• Juni 2025–sekarang: Staff Programmer, PT. BGR Logistik Indonesia. Mengembangkan dan memelihara sistem internal web & mobile, membuat fitur baru untuk operasional logistik dan integrasi data antar divisi, debugging, optimasi performa, dan implementasi API (React, Laravel, PostgreSQL).\n• 2024–2025: Staff Administrasi, PT. Perusahaan Perdagangan Indonesia (faktur, P2B, pengarsipan)\n• 2022: Magang admin, Diskominfo Kab. Garut\n• 2022–sekarang: Freelance Developer (Laravel, CodeIgniter, PHP, Vue.js)' },
    { k: ['pendidikan', 'kuliah', 'kampus', 'universitas', 'politeknik', 'lp3i', 'lulusan', 'lulus', 'education', 'gelar', 'jurusan', 'prodi', 'studi', 'wisuda', 'akademik', 'kelulusan'],
      a: 'Pendidikan Mirhan:\n• 2022–2025: Politeknik LP3I Bandung, Manajemen Informatika Komputer (D3, A.Md.Kom)\n• 2019–2022: SMKT Hidayatul Faizien, Teknik Komputer dan Jaringan (TKJ)\nMenurut CV, seluruh proses akademik dan administrasinya sudah selesai dan ia tinggal menunggu wisuda.' },
    { k: ['smk', 'sma', 'sekolah', 'tkj', 'hidayatul', 'faizien', 'teknik komputer'],
      a: 'Mirhan bersekolah di SMKT Hidayatul Faizien, jurusan Teknik Komputer dan Jaringan (TKJ), tahun 2019–2022. Setelah itu ia kuliah D3 Manajemen Informatika di Politeknik LP3I Bandung (2022–2025).' },
    { k: ['organisasi', 'himami', 'icon', 'paskibra', 'bem', 'himpunan', 'mahasiswa', 'aktif'],
      a: 'Pengalaman organisasi Mirhan:\n• BEM (Badan Eksekutif Mahasiswa), 2022–2024 (Menteri Pendidikan dan Olahraga periode 2023/2024)\n• HIMAMI (Himpunan Mahasiswa Manajemen Informatika), 2022–2024\n• ICON (Incredible Computer Nation), 2022–2024\n• Paskibra, 2017–2018' },
    { k: ['panitia', 'kepanitiaan', 'ldkm', 'pose', 'dies natalis', 'diesnatalis', 'event', 'acara', 'ketua pelaksana', 'esport', 'e-sport'],
      a: 'Pengalaman kepanitiaan Mirhan:\n• Ketua Pelaksana LDKM Politeknik LP3I Bandung, 2024\n• POSE Nasional 2023 (Pekan Olahraga, Seni & E-sport), Divisi Logistik\n• POSE Nasional 2024, Divisi Acara (dan Koordinator Lomba)\n• Dies Natalis LP3I, Koordinator e-sport' },
    { k: ['softskill', 'soft skill', 'sifat', 'karakter', 'leadership', 'kepemimpinan', 'komunikasi', 'adaptabilitas', 'kerja tim', 'teamwork'],
      a: 'Soft skill Mirhan: Leadership, Komunikasi, Adaptabilitas, dan Kerja Tim. Ia juga aktif di organisasi dan kepanitiaan kampus.' },
    { k: ['lahir', 'ttl', 'umur', 'usia', 'tanggal lahir', 'kelahiran', 'asal', 'kampung'],
      a: 'Menurut CV, Mirhan lahir di Garut pada 15 Desember 2003.' },
    { k: ['alamat', 'cicadas', 'bandung'],
      a: 'Alamat pada CV Mirhan: Bandung, Cicadas. Saat ini ia bekerja di Jakarta (PT. BGR Logistik Indonesia).' },
    { k: ['hire', 'rekrut', 'available', 'tersedia', 'freelance', 'lowongan', 'kerja sama', 'kerjasama', 'proyek baru'],
      a: 'Mirhan tersedia untuk freelance dan peluang kerja. Ceritakan kebutuhan proyekmu lewat WhatsApp atau form kontak di halaman ini.',
      links: [['Chat WhatsApp', WA]] },
    { k: ['harga', 'biaya', 'tarif', 'rate', 'budget', 'price', 'berapa'],
      a: 'Biaya tergantung ruang lingkup dan fitur proyek. Silakan ceritakan kebutuhanmu ke Mirhan untuk mendapatkan estimasi.',
      links: [['Chat WhatsApp', WA]] },
    { k: ['kontak', 'contact', 'hubungi', 'whatsapp', 'wa', 'email', 'telepon', 'nomor', 'reach', 'hp', 'sosmed', 'instagram', 'facebook'],
      a: 'Cara menghubungi Mirhan:\n• WhatsApp/telepon: 085224750924\n• Email: mirhanmaulana15@gmail.com (email kampus: mirhanmaulana.r22mi@plb.ac.id)\n• GitHub: @Mirhan15\n• LinkedIn, Instagram, dan Facebook: Mirhan Maulana\nAtau isi form di bagian Contact.',
      links: [['WhatsApp', WA], ['Email', MAIL], ['GitHub', 'https://github.com/Mirhan15']] },
    { k: ['sertifikat', 'sertifikasi', 'certificate', 'certification', 'bnsp', 'penghargaan', 'piagam'],
      a: 'Mirhan punya 21 sertifikat, di antaranya Sertifikat Kompetensi BNSP Junior Office Operator (2025), Uji Kompetensi Keahlian SMK, beberapa Training Soft Skill dan seminar, serta penghargaan dari kegiatan organisasi (BEM, LDKM, POSE Nasional). Lihat semuanya di bagian Sertifikat.',
      links: [['Lihat Sertifikat', '#certificates']] },
    { k: ['cv', 'resume', 'unduh', 'download'],
      a: 'Kamu bisa mengunduh CV Mirhan lewat tombol Download CV di bagian atas halaman. Asisten ini juga memakai isi CV tersebut untuk menjawab.',
      links: [['Download CV', 'assets/CV_MIRHAN_MAULANA.pdf']] },
    { k: ['github', 'repo', 'source code', 'kode'],
      a: 'Kode Mirhan ada di GitHub: @Mirhan15.', links: [['Buka GitHub', 'https://github.com/Mirhan15']] },
    { k: ['linkedin'], a: 'Profil LinkedIn Mirhan:', links: [['Buka LinkedIn', 'https://linkedin.com/in/mirhan-maulana']] },
    { k: ['lokasi', 'domisili', 'tinggal', 'location', 'where', 'dimana', 'di mana', 'kota'],
      a: 'Mirhan berdomisili di Jakarta dan bekerja di PT. BGR Logistik Indonesia; alamat pada CV-nya Bandung, Cicadas. Ia bisa bekerja remote. Bahasa: Indonesia dan Inggris.' },
    { k: ['terima kasih', 'makasih', 'thanks', 'thank', 'thx'], a: 'Sama-sama! Kalau ada yang lain, tanya saja.' }
  ];

  const FALLBACK = 'Maaf, saya belum punya jawaban untuk itu. Saya bisa bantu soal skill, layanan, proyek, pengalaman, atau kontak Mirhan. Untuk pertanyaan lain, langsung hubungi Mirhan ya.';

  const GENERIC = new Set(['pengalaman', 'experience', 'kerja', 'skill', 'contact', 'kontak', 'mirhan', 'about', 'tentang', 'siapa', 'mahasiswa', 'aktif', 'acara', 'event', 'asal', 'kota', 'bandung']);
  const STOP = new Set(['yang', 'dengan', 'untuk', 'dari', 'apa', 'siapa', 'bagaimana', 'kenapa', 'kapan', 'dimana', 'adalah', 'apakah', 'bisa', 'nya', 'dia', 'saya', 'kamu', 'anda', 'tolong', 'mau', 'tahu', 'coba']);

  function normalize(s) { return ' ' + s.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }

  function localReply(text) {
    const q = normalize(text);
    let best = null, bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const kw of item.k) {
        const needle = kw.endsWith(' ') ? ' ' + kw : (kw.length <= 3 ? ' ' + kw + ' ' : kw);
        if (q.includes(needle)) score += GENERIC.has(kw) ? 1 : kw.length;
      }
      if (score > bestScore) { best = item; bestScore = score; }
    }
    if (!best) {
      const words = q.split(' ').filter(w => w.length > 3 && !STOP.has(w));
      let bestOverlap = 0;
      for (const item of KB) {
        const hay = normalize(item.a);
        const overlap = words.filter(w => hay.includes(' ' + w)).length;
        if (overlap > bestOverlap) { best = item; bestOverlap = overlap; }
      }
    }
    return best ? { text: best.a, links: best.links || [] } : { text: FALLBACK, links: [['Chat WhatsApp', WA]] };
  }

  async function getReply(text, history) {
    if (AGENT_ENDPOINT) {
      try {
        const res = await fetch(AGENT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: history.slice(-10) })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.reply === 'string' && data.reply) return { text: data.reply, links: [] };
        }
      } catch (e) { /* fall through to local answers */ }
    }
    return localReply(text);
  }

  // ── UI ──
  const root = document.createElement('div');
  root.className = 'ai-agent';
  root.innerHTML =
    '<button class="ai-fab" type="button" aria-label="Buka asisten AI" aria-expanded="false">' +
      '<i class="fa-solid fa-wand-magic-sparkles ai-fab-open"></i><i class="fa-solid fa-xmark ai-fab-close"></i>' +
    '</button>' +
    '<section class="ai-panel" role="dialog" aria-label="Asisten AI Mirhan" hidden>' +
      '<header class="ai-head">' +
        '<div class="ai-avatar"><i class="fa-solid fa-robot"></i></div>' +
        '<div class="ai-head-text"><strong>Mirhan AI</strong><span><i class="ai-online"></i>Asisten portofolio</span></div>' +
        '<button class="ai-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>' +
      '</header>' +
      '<div class="ai-messages" aria-live="polite"></div>' +
      '<div class="ai-chips"></div>' +
      '<form class="ai-form" autocomplete="off">' +
        '<input class="ai-input" type="text" maxlength="200" placeholder="Tanya sesuatu..." aria-label="Pesan" />' +
        '<button class="ai-send" type="submit" aria-label="Kirim"><i class="fa-solid fa-paper-plane"></i></button>' +
      '</form>' +
    '</section>';
  document.body.appendChild(root);

  const fab = root.querySelector('.ai-fab');
  const panel = root.querySelector('.ai-panel');
  const list = root.querySelector('.ai-messages');
  const chips = root.querySelector('.ai-chips');
  const form = root.querySelector('.ai-form');
  const input = root.querySelector('.ai-input');
  const history = [];
  let busy = false;

  function addMessage(role, text, links) {
    const row = document.createElement('div');
    row.className = 'ai-msg ai-' + role;
    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    bubble.textContent = text;
    if (links && links.length) {
      const wrap = document.createElement('div');
      wrap.className = 'ai-links';
      links.forEach(([label, href]) => {
        const a = document.createElement('a');
        a.href = href; a.textContent = label; a.target = '_blank'; a.rel = 'noopener noreferrer';
        wrap.appendChild(a);
      });
      bubble.appendChild(wrap);
    }
    row.appendChild(bubble);
    list.appendChild(row);
    list.scrollTop = list.scrollHeight;
    return row;
  }

  function typing() {
    const row = document.createElement('div');
    row.className = 'ai-msg ai-bot';
    row.innerHTML = '<div class="ai-bubble ai-typing"><i></i><i></i><i></i></div>';
    list.appendChild(row);
    list.scrollTop = list.scrollHeight;
    return row;
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    chips.hidden = true;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    const t = typing();
    const [reply] = await Promise.all([getReply(text, history), new Promise(r => setTimeout(r, 600))]);
    t.remove();
    addMessage('bot', reply.text, reply.links);
    history.push({ role: 'assistant', content: reply.text });
    busy = false;
    input.focus();
  }

  SUGGESTIONS.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ai-chip'; b.textContent = s;
    b.addEventListener('click', () => send(s));
    chips.appendChild(b);
  });

  function setOpen(open) {
    panel.hidden = !open;
    root.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!list.children.length) addMessage('bot', 'Halo! Saya asisten AI Mirhan. Mau tahu tentang skill, layanan, proyek, atau cara menghubungi Mirhan?');
      setTimeout(() => input.focus(), 50);
    }
  }

  fab.addEventListener('click', () => setOpen(panel.hidden));
  root.querySelector('.ai-close').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
  form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; send(v); });
})();
