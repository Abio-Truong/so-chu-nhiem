(function () {
  const { db } = window;
  const { requireAuth, getCurrentWeek, getCurrentNamHoc, onRoleChange } = window.auth;
  const { initNav } = window.nav;
  const { t, onLangChange, applyTranslations } = window.i18n;

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

let currentWeek = 1;
let currentNamHoc = '2026-2027';

async function init() {
  const auth = await requireAuth();
  if (!auth) return;

  await initNav('overview');

  currentWeek = getCurrentWeek();
  currentNamHoc = getCurrentNamHoc();

  renderAll();

  // Listeners
  onRoleChange(() => {
    updateRoleUI();
  });

  onLangChange(() => {
    renderAll();
  });

  document.getElementById('save-announcement-btn')?.addEventListener('click', saveAnnouncement);
}

function renderAll() {
  renderClassHeader();
  renderStats();
  renderGroupRankings();
  renderTopStudents();
  renderAnnouncement();
  updateRoleUI();
  applyTranslations();
}

function renderClassHeader() {
  const className = db.getSetting('ten_lop', '6/3');
  const namHoc = db.getSetting('nam_hoc', '2026-2027');
  const gvcn = db.getSetting('gvcn', 'Cô Nguyễn Thị Mai');

  const titleEl = document.getElementById('overview-class-title');
  const metaEl  = document.getElementById('overview-meta');
  if (titleEl) titleEl.textContent = `${t('classLabel')} ${className}`;
  if (metaEl)  metaEl.textContent  = `${t('schoolYearLabel')}: ${namHoc} · ${t('homeroomTeacherLabel')}: ${gvcn}`;
}

function renderStats() {
  const students = db.getStudents();
  document.getElementById('stat-total').textContent = students.length;
  document.getElementById('stat-week').textContent = `${t('navEmulation')} ${currentWeek}`;

  // Leading group
  const scores = db.getScores(currentWeek, currentNamHoc);
  const groupScores = [1, 2, 3, 4].map(g => {
    const gStudents = students.filter(s => s.to_so === g);
    const sum = gStudents.reduce((acc, s) => {
      const sc = scores.find(x => x.student_id === s.id);
      return acc + (sc?.diem_cuoi_tuan ?? 81);
    }, 0);
    return { group: g, total: sum };
  }).sort((a, b) => b.total - a.total);

  const topGroup = groupScores[0];
  document.getElementById('stat-top-group').textContent = topGroup ? `${t('ovGroupRankTitle')} ${topGroup.group}` : '—';

  // Today entries count
  const entries = db.getScoreEntries(currentWeek, currentNamHoc);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = entries.filter(e => (e.created_at || '').slice(0, 10) === todayStr).length;
  document.getElementById('stat-today').textContent = `${todayCount}`;
}

function renderGroupRankings() {
  const tbody = document.getElementById('group-ranking-body');
  if (!tbody) return;

  const students = db.getStudents();
  const scores = db.getScores(currentWeek, currentNamHoc);

  const medals = ['🥇', '🥈', '🥉', '4️⃣'];
  const groupTotals = [1, 2, 3, 4].map(g => {
    const gStudents = students.filter(s => s.to_so === g);
    const total = gStudents.reduce((acc, s) => {
      const sc = scores.find(x => x.student_id === s.id);
      return acc + (sc?.diem_cuoi_tuan ?? 81);
    }, 0);
    return { group: g, total, count: gStudents.length };
  }).sort((a, b) => b.total - a.total);

  tbody.innerHTML = groupTotals.map((item, idx) => `
    <tr>
      <td class="col-rank">${medals[idx] || (idx + 1)}</td>
      <td class="col-name"><strong>${t('ovGroupRankTitle')} ${item.group}</strong> (${item.count} HS)</td>
      <td class="col-score"><strong>${item.total}</strong></td>
    </tr>
  `).join('');
}

function renderTopStudents() {
  const listEl = document.getElementById('top-student-list');
  if (!listEl) return;

  const students = db.getStudents();
  const scores = db.getScores(currentWeek, currentNamHoc);

  const combined = students.map(st => {
    const sc = scores.find(x => x.student_id === st.id);
    const score = sc?.diem_cuoi_tuan ?? 81;
    const tier = db.getTierInfo(score);
    return { ...st, score, tier };
  }).sort((a, b) => b.score - a.score);

  const top5 = combined.slice(0, 5);

  listEl.innerHTML = top5.map((s, idx) => `
    <li class="top-student-item">
      <span class="rank-badge rank-${idx + 1}">${idx + 1}</span>
      <span class="student-name">${s.ho_ten}</span>
      <span class="student-meta">${s.ma_hs} · Tổ ${s.to_so}</span>
      <span class="student-score">${s.score}</span>
    </li>
  `).join('');
}

function renderAnnouncement() {
  const text = db.getSetting('announcement', '');
  const textarea = document.getElementById('announcement-text');
  if (textarea) textarea.value = text;
}

function updateRoleUI() {
  const isT = document.body.classList.contains('role-teacher');
  const textarea = document.getElementById('announcement-text');
  if (textarea) {
    textarea.disabled = !isT;
    textarea.style.backgroundColor = isT ? '#fff' : '#f8fafc';
  }
}

function saveAnnouncement() {
  const textarea = document.getElementById('announcement-text');
  if (!textarea) return;
  const val = textarea.value.trim();
  db.saveSetting('announcement', val);
  showToast(t('ovAnnouncementSaved'), 'success');
}

init();
})();
