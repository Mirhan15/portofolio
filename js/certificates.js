(function () {
  const INITIAL = 8;

  // cat: kompetensi | pelatihan | organisasi
  const CERTS = [
    { img: 'c14', file: 'Sertifikat Kompetensi Junior Office Operator .pdf', title: 'Junior Office Operator (Operation & System Tools)', issuer: 'BNSP · LSP Media Informatika', date: '22 Jan 2025', cat: 'kompetensi', portrait: true },
    { img: 'c15', file: 'Sertifikat Kompetensi Mirhan Maulana .pdf', title: 'Uji Kompetensi Keahlian Kejuruan SMK', issuer: 'Dinas Kominfo Kab. Garut', date: '22 Mar 2022', cat: 'kompetensi' },
    { img: 'c11', file: 'Mirhan_Tss_5.pdf', title: 'Training Soft Skill 5: Leadership & Creative Thinking', issuer: 'Politeknik LP3I', date: '11 Nov 2023', cat: 'pelatihan' },
    { img: 'c10', file: 'Mirhan_Tss_4.pdf', title: 'Training Soft Skill 4: Critical Thinking & Problem Solving', issuer: 'Politeknik LP3I', date: '20 Mei 2023', cat: 'pelatihan' },
    { img: 'c21', file: 'Mirhan_Tss_6.jpg', title: 'Training Soft Skill 6: Team Work Building', issuer: 'Politeknik LP3I', date: '', cat: 'pelatihan' },
    { img: 'c09', file: 'Mirhan_Tss_2.pdf', title: 'Training Soft Skill II: Intrapersonal & Interpersonal Communication', issuer: 'Politeknik LP3I', date: '17 Des 2022', cat: 'pelatihan' },
    { img: 'c08', file: 'Mirhan_Tss_1.pdf', title: 'Training Soft Skill 1: Quantum of Change', issuer: 'Politeknik LP3I', date: '15 Okt 2022', cat: 'pelatihan' },
    { img: 'c05', file: 'Mirhan Maulana-Worskop-Trello.pdf', title: 'Workshop Trello: Ormawa Cerdas Menuju Digitalisasi', issuer: 'Kemahasiswaan Politeknik LP3I', date: '27 Mar 2023', cat: 'pelatihan' },
    { img: 'c12', file: 'SERTIFIKAT SEMINAR WAJIB 11 JAN 2024 - MIRHAN MAULANA.pdf', title: 'Seminar: Menciptakan Entrepreneur yang Adaptif, Kolaboratif, dan Kompetitif di Era Digital', issuer: 'Politeknik LP3I', date: '11 Jan 2024', cat: 'pelatihan' },
    { img: 'c13', file: 'Seminar Wajib_Quarter life crisis (1).pdf', title: 'Seminar Quarter Life Crisis: Kenali Dirimu untuk Sukses di Masa Depanmu', issuer: 'Politeknik LP3I', date: '26 Nov 2022', cat: 'pelatihan' },
    { img: 'c02', file: 'MIRHAN MAULANA-SEMINAR HIMAMI.pdf', title: 'Seminar Prospek & Fundamental Vol II', issuer: 'HIMAMI Politeknik LP3I', date: '19 Nov 2022', cat: 'pelatihan' },
    { img: 'c18', file: 'Sertifikat Seminar Literasi Digital.pdf', title: 'Seminar Literasi Digital: Etika Produksi dan Distribusi Informasi', issuer: 'Kominfo', date: '27 Agu 2022', cat: 'pelatihan' },
    { img: 'c03', file: 'MIRHAN_BEM.pdf', title: 'Menteri Pendidikan dan Olahraga BEM 2023/2024', issuer: 'BEM Politeknik LP3I Bandung', date: '2023/2024', cat: 'organisasi' },
    { img: 'c04', file: 'MIRHAN_POSE_PANITIA.pdf', title: 'Koordinator Lomba POSE Nasional 2024', issuer: 'Politeknik LP3I Bandung', date: '2024', cat: 'organisasi' },
    { img: 'c20', file: 'Mirhan Maulana_PanitiaLDKM.png', title: 'Panitia Latihan Dasar Kepemimpinan Mahasiswa (LDKM) 2024', issuer: 'Politeknik LP3I', date: '1-4 Feb 2024', cat: 'organisasi' },
    { img: 'c19', file: 'MIRHAN MAULANA.png', title: 'Sukarelawan Politeknik LP3I Futsal Championship 2023', issuer: 'Politeknik LP3I', date: '2024', cat: 'organisasi' },
    { img: 'c06', file: 'MirhanMaulana_LDKM.pdf', title: 'Peserta Latihan Dasar Kepemimpinan Mahasiswa (LDKM) 2023', issuer: 'Politeknik LP3I', date: '26-29 Jan 2023', cat: 'organisasi' },
    { img: 'c07', file: 'MirhanMaulana_PKKMB.pdf', title: 'Peserta PKKMB 2022', issuer: 'Politeknik LP3I', date: '5-10 Sep 2022', cat: 'organisasi' },
    { img: 'c01', file: 'BADMINTON-PUTRA_MIRHAN.pdf', title: 'Lomba Badminton Ganda Putra POSE Nasional 2024', issuer: 'Politeknik LP3I Bandung', date: '2024', cat: 'organisasi' },
    { img: 'c17', file: 'Sertifikat Paskibra 2018.pdf', title: 'Paskibra Kecamatan Cihurip Angkatan 2018', issuer: 'PHBN Kecamatan Cihurip', date: '17 Agu 2018', cat: 'organisasi', portrait: true },
    { img: 'c16', file: 'Sertifikat Paskibra 2017.pdf', title: 'Paskibra Kecamatan Cihurip Angkatan 2017', issuer: 'PHBN Kecamatan Cihurip', date: '17 Agu 2017', cat: 'organisasi', portrait: true }
  ];

  const grid = document.getElementById('certGrid');
  if (!grid) return;
  const moreBtn = document.getElementById('certMore');
  const filters = document.querySelectorAll('.cert-filter');
  const countEl = document.getElementById('certCount');
  let cat = 'all';
  let expanded = false;

  function isPdf(f) { return /\.pdf$/i.test(f); }
  function fileUrl(c) { return 'sertifikat/' + encodeURIComponent(c.file); }
  function thumb(c) { return 'assets/certs/' + c.img + '.jpg'; }
  function visible() { return CERTS.filter(c => cat === 'all' || c.cat === cat); }

  function card(c, idx) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'cert-card';
    el.dataset.idx = idx;
    el.setAttribute('aria-label', 'Lihat sertifikat: ' + c.title);

    const media = document.createElement('div');
    media.className = 'cert-media' + (c.portrait ? ' portrait' : '');
    const img = document.createElement('img');
    img.src = thumb(c); img.alt = c.title; img.loading = 'lazy';
    media.appendChild(img);
    const badge = document.createElement('span');
    badge.className = 'cert-badge';
    badge.textContent = isPdf(c.file) ? 'PDF' : 'IMG';
    media.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'cert-body';
    const t = document.createElement('h3'); t.textContent = c.title;
    const meta = document.createElement('p');
    meta.textContent = c.issuer + (c.date ? ' · ' + c.date : '');
    body.append(t, meta);

    el.append(media, body);
    el.addEventListener('click', () => openBox(idx));
    return el;
  }

  function render() {
    const list = visible();
    grid.replaceChildren();
    const shown = expanded ? list : list.slice(0, INITIAL);
    shown.forEach(c => grid.appendChild(card(c, CERTS.indexOf(c))));
    const hidden = list.length - shown.length;
    moreBtn.hidden = list.length <= INITIAL;
    moreBtn.textContent = expanded ? 'Tampilkan lebih sedikit' : 'Tampilkan ' + hidden + ' lainnya';
    if (countEl) countEl.textContent = CERTS.length;
  }

  filters.forEach(b => b.addEventListener('click', () => {
    filters.forEach(x => x.classList.toggle('active', x === b));
    cat = b.dataset.cat; expanded = false; render();
  }));
  moreBtn.addEventListener('click', () => { expanded = !expanded; render(); });

  // ── Lightbox ──
  const box = document.createElement('div');
  box.className = 'cert-box';
  box.hidden = true;
  box.innerHTML =
    '<div class="cert-box-backdrop"></div>' +
    '<figure class="cert-box-inner" role="dialog" aria-modal="true" aria-label="Sertifikat">' +
      '<button class="cert-box-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>' +
      '<button class="cert-box-nav prev" type="button" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<button class="cert-box-nav next" type="button" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>' +
      '<div class="cert-box-img"><img alt="" /></div>' +
      '<figcaption><div><strong></strong><span></span></div><a target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka file asli</a></figcaption>' +
    '</figure>';
  document.body.appendChild(box);

  const bImg = box.querySelector('.cert-box-img img');
  const bTitle = box.querySelector('figcaption strong');
  const bMeta = box.querySelector('figcaption span');
  const bLink = box.querySelector('figcaption a');
  let current = 0;

  function show(i) {
    const list = visible();
    const c = CERTS[i];
    current = i;
    bImg.src = thumb(c); bImg.alt = c.title;
    bTitle.textContent = c.title;
    bMeta.textContent = c.issuer + (c.date ? ' · ' + c.date : '');
    bLink.href = fileUrl(c);
    const multi = list.length > 1;
    box.querySelector('.prev').hidden = !multi;
    box.querySelector('.next').hidden = !multi;
  }
  function step(d) {
    const list = visible();
    const pos = list.indexOf(CERTS[current]);
    show(CERTS.indexOf(list[(pos + d + list.length) % list.length]));
  }
  function openBox(i) { show(i); box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.cert-box-close').focus(); }
  function closeBox() { box.hidden = true; document.body.style.overflow = ''; }

  box.querySelector('.cert-box-backdrop').addEventListener('click', closeBox);
  box.querySelector('.cert-box-close').addEventListener('click', closeBox);
  box.querySelector('.prev').addEventListener('click', () => step(-1));
  box.querySelector('.next').addEventListener('click', () => step(1));
  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') closeBox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  render();
})();
