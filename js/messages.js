/* ============================================
   MESSAGES.JS — Firebase Realtime + Flying Messages
   ============================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, push, onChildAdded, query, limitToLast } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAQX93WF4g7yo_MYrJpDfVyy-SNuIS_o2s",
  authDomain: "portofolio-5d2b1.firebaseapp.com",
  databaseURL: "https://portofolio-5d2b1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portofolio-5d2b1",
  storageBucket: "portofolio-5d2b1.firebasestorage.app",
  messagingSenderId: "184994235606",
  appId: "1:184994235606:web:79547a75597db9631f7577"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

const flyZone = document.getElementById('flyZone');

// ── Variasi warna gradient ──
const GRADIENTS = [
  'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(59,130,246,0.8))',
  'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(167,139,250,0.8))',
  'linear-gradient(135deg, rgba(236,72,153,0.9), rgba(244,114,182,0.8))',
  'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(52,211,153,0.8))',
  'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(251,191,36,0.8))',
  'linear-gradient(135deg, rgba(239,68,68,0.9),  rgba(248,113,113,0.8))',
  'linear-gradient(135deg, rgba(14,165,233,0.9), rgba(56,189,248,0.8))',
  'linear-gradient(135deg, rgba(168,85,247,0.9), rgba(192,132,252,0.8))',
  'linear-gradient(135deg, rgba(234,179,8,0.9),  rgba(253,224,71,0.8))',
  'linear-gradient(135deg, rgba(20,184,166,0.9), rgba(45,212,191,0.8))',
];

// ── Variasi icon/emoji ──
const ICONS = [
  '💬','✨','🚀','❤️','👋','🔥','💡','🌟','😊','👍',
  '🎉','💎','🌈','⚡','🎯','🏆','💫','🌸','🎸','🤩',
];

// ── Ukuran variasi ──
const SIZES = ['small', 'medium', 'large'];

// ── Pool pesan untuk di-loop terus ──
let messagePool = [];
let loopRunning = false;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Buat satu bubble ──
function createBubble(name, message) {
  if (!flyZone) return;

  const bubble   = document.createElement('div');
  const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const icon     = ICONS[Math.floor(Math.random() * ICONS.length)];
  const size     = SIZES[Math.floor(Math.random() * SIZES.length)];
  const lane     = Math.floor(Math.random() * 10); // 10 jalur vertikal
  const topPct   = 8 + lane * 8.5; // 8% ~ 93%
  const dur      = 12 + Math.random() * 16; // 12–28 detik
  const delay    = Math.random() * 3;

  bubble.className = `msg-bubble msg-bubble-${size}`;
  bubble.style.top        = `${topPct}%`;
  bubble.style.background = gradient;
  bubble.style.animationDuration = `${dur}s`;
  bubble.style.animationDelay    = `${delay}s`;

  bubble.innerHTML = `
    <span class="msg-icon">${icon}</span>
    <div class="msg-content">
      <span class="msg-name">${escapeHtml(name)}</span>
      <span class="msg-text">${escapeHtml(message)}</span>
    </div>
  `;

  flyZone.appendChild(bubble);

  // Hapus setelah animasi selesai
  const totalMs = (dur + delay + 1) * 1000;
  setTimeout(() => bubble.remove(), totalMs);
}

// ── Loop terus spawn bubble dari pool ──
function spawnLoop() {
  if (messagePool.length === 0) return;

  const data = messagePool[Math.floor(Math.random() * messagePool.length)];
  createBubble(data.name, data.message);

  // Spawn berikutnya dengan interval random 1.5–4 detik
  const nextDelay = 1500 + Math.random() * 2500;
  setTimeout(spawnLoop, nextDelay);
}

function startLoop() {
  if (loopRunning || messagePool.length === 0) return;
  loopRunning = true;
  spawnLoop();
}

// ── Load messages dari Firebase ──
let isInitialLoad = true;
const initialMessages = [];

const msgsRef = query(ref(db, 'messages'), limitToLast(50));
onChildAdded(msgsRef, (snap) => {
  const data = snap.val();
  if (!data?.name || !data?.message) return;

  addToWall(data.name, data.message, data.timestamp);

  if (isInitialLoad) {
    initialMessages.push(data);
  } else {
    // Pesan baru — langsung spawn & tambah ke pool
    messagePool.push(data);
    createBubble(data.name, data.message);
  }
});

// Setelah semua data awal masuk
setTimeout(() => {
  isInitialLoad = false;
  if (initialMessages.length > 0) {
    messagePool = [...initialMessages];
    startLoop();
  }
}, 1200);

// ── Message wall ──
function addToWall(name, message, timestamp) {
  const wall = document.getElementById('msgWall');
  if (!wall) return;

  const item = document.createElement('div');
  item.className = 'msg-wall-item';

  const time = timestamp ? new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : '';

  item.innerHTML = `
    <div class="msg-wall-header">
      <span class="msg-wall-name">${escapeHtml(name)}</span>
      <span class="msg-wall-time">${time}</span>
    </div>
    <p class="msg-wall-text">${escapeHtml(message)}</p>
  `;

  wall.insertBefore(item, wall.firstChild);
  while (wall.children.length > 20) wall.removeChild(wall.lastChild);
}

// ── Submit ──
const msgSubmitBtn = document.getElementById('msgSubmitBtn');
if (msgSubmitBtn) {
  msgSubmitBtn.addEventListener('click', async () => {
    const nameEl = document.getElementById('msgName');
    const textEl = document.getElementById('msgText');

    const name    = nameEl.value.trim();
    const message = textEl.value.trim();

    if (!name) { nameEl.focus(); nameEl.style.borderColor = '#ef4444'; return; }
    if (!message) { textEl.focus(); textEl.style.borderColor = '#ef4444'; return; }

    nameEl.style.borderColor = '';
    textEl.style.borderColor = '';

    msgSubmitBtn.disabled = true;
    msgSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...';

    try {
      await push(ref(db, 'messages'), {
        name:      name.slice(0, 30),
        message:   message.slice(0, 120),
        timestamp: Date.now(),
      });

      nameEl.value = '';
      textEl.value = '';
      document.getElementById('charCount').textContent = '0';
      msgSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Terkirim! ✨';

      setTimeout(() => {
        msgSubmitBtn.disabled = false;
        msgSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan';
      }, 2500);
    } catch (err) {
      msgSubmitBtn.disabled = false;
      msgSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan';
      console.error('Firebase error:', err);
    }
  });
}
