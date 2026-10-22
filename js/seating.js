(function () {
  const { db } = window;
  const { requireAuth, onRoleChange } = window.auth;
  const { initNav } = window.nav;
  const { t, onLangChange, applyTranslations } = window.i18n;

function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const tEl = document.createElement('div');
  tEl.className = `toast toast-${type}`;
  tEl.textContent = msg;
  c.appendChild(tEl);
  setTimeout(() => tEl.remove(), 3500);
}

// ── State ─────────────────────────────────────────────────────
let students   = [];
let seatMap    = {}; // { vi_tri: student_id }
let dragSource = null; // { viTri, studentId }

async function init() {
  const auth = await requireAuth();
  if (!auth) return;

  await initNav('seating');

  loadData();
  setupControls();

  onRoleChange(() => {
    renderClassroom();
  });

  onLangChange(() => {
    renderClassroom();
    applyTranslations();
  });
}

function loadData() {
  students = db.getStudents();
  seatMap  = db.getSeating();
  renderClassroom();
  updateGoiTenOptions();
}

function updateGoiTenOptions() {
  const select = document.getElementById('goi-ten-from');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = `
    <option value="all">${t('seGoiTenAll')}</option>
    <option value="1">${t('seLegendTo1')}</option>
    <option value="2">${t('seLegendTo2')}</option>
    <option value="3">${t('seLegendTo3')}</option>
    <option value="4">${t('seLegendTo4')}</option>
  `;
  select.value = currentVal || 'all';
}

function renderClassroom() {
  const grid = document.getElementById('seating-grid');
  if (!grid) return;

  const isTeacherRole = document.body.classList.contains('role-teacher');

  const studentMap = {};
  students.forEach(s => { studentMap[s.id] = s; });

  let html = '';

  // 4 Rows = 4 Groups
  for (let d = 1; d <= 4; d++) {
    html += `
      <div class="group-column" data-day="${d}">
        <div class="group-label to-${d}">${t('seDay')} ${d} (${t('ovGroupRankTitle')} ${d})</div>
    `;

    // 6 Double desks per row
    for (let b = 1; b <= 6; b++) {
      const leftKey  = `day${d}_ban${b}_trai`;
      const rightKey = `day${d}_ban${b}_phai`;

      const leftSid  = seatMap[leftKey]  ?? null;
      const rightSid = seatMap[rightKey] ?? null;

      const leftStudent  = leftSid  ? studentMap[leftSid]  : null;
      const rightStudent = rightSid ? studentMap[rightSid] : null;

      html += `
        <div class="desk">
          <div class="desk-label">${t('seBan')} ${b}</div>
          <div class="desk-seats">
            ${renderSeat(leftKey, leftStudent, d, isTeacherRole, t('seLeft'))}
            ${renderSeat(rightKey, rightStudent, d, isTeacherRole, t('seRight'))}
          </div>
        </div>
      `;
    }

    html += '</div>';
  }

  grid.innerHTML = html;
  if (isTeacherRole) {
    attachDragEvents();
  }
}

function renderSeat(viTri, student, dayNum, isTeacherRole, sideLabel) {
  if (student) {
    return `
      <div class="seat occupied to-${student.to_so || dayNum}"
           data-vi-tri="${viTri}"
           data-student-id="${student.id}"
           draggable="${isTeacherRole}"
           title="${student.ho_ten} (${student.ma_hs})">
        <div class="seat-name">${student.ho_ten}</div>
        <div class="seat-id">${student.ma_hs}</div>
      </div>
    `;
  }
  return `
    <div class="seat empty"
         data-vi-tri="${viTri}"
         data-student-id=""
         draggable="false">
      <span class="seat-empty-text">${sideLabel}</span>
    </div>
  `;
}

function attachDragEvents() {
  const seats = document.querySelectorAll('.seat');

  seats.forEach(seat => {
    seat.addEventListener('dragstart', handleDragStart);
    seat.addEventListener('dragover',  handleDragOver);
    seat.addEventListener('dragleave', handleDragLeave);
    seat.addEventListener('drop',       handleDrop);
    seat.addEventListener('dragend',   handleDragEnd);
  });
}

function handleDragStart(e) {
  const sid = e.currentTarget.dataset.studentId;
  if (!sid) { e.preventDefault(); return; }

  dragSource = {
    fromViTri: e.currentTarget.dataset.viTri,
    studentId: sid,
  };

  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.seat.drag-over').forEach(el => el.classList.remove('drag-over'));
  dragSource = null;
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!dragSource) return;

  const toViTri   = e.currentTarget.dataset.viTri;
  const toSid     = seatMap[toViTri] ?? null;
  const fromViTri = dragSource.fromViTri;
  const fromSid   = dragSource.studentId;

  if (fromViTri === toViTri) { dragSource = null; return; }

  // Swap seats
  seatMap[toViTri]   = fromSid;
  seatMap[fromViTri] = toSid;

  // Immediate visual update of student's to_so based on destination row
  const toMatch = toViTri.match(/^day(\d+)/);
  if (toMatch && fromSid) {
    const st = students.find(s => s.id === fromSid);
    if (st) st.to_so = parseInt(toMatch[1], 10);
  }
  const fromMatch = fromViTri.match(/^day(\d+)/);
  if (fromMatch && toSid) {
    const st = students.find(s => s.id === toSid);
    if (st) st.to_so = parseInt(fromMatch[1], 10);
  }

  dragSource = null;
  renderClassroom();
}

// ── Controls ──────────────────────────────────────────────────
function setupControls() {
  document.getElementById('btn-random')?.addEventListener('click', randomize);
  document.getElementById('btn-save-seating')?.addEventListener('click', saveSeating);
  document.getElementById('btn-goi-ten')?.addEventListener('click', goiTen);
}

function randomize() {
  if (!confirm('Xếp lại toàn bộ chỗ ngồi ngẫu nhiên?')) return;

  const seatKeys = Object.keys(seatMap);
  const shuffled = [...students].sort(() => Math.random() - 0.5);

  seatKeys.forEach(k => { seatMap[k] = null; });
  shuffled.forEach((s, idx) => {
    if (idx < seatKeys.length) {
      const k = seatKeys[idx];
      seatMap[k] = s.id;
      const match = k.match(/^day(\d+)/);
      if (match) s.to_so = parseInt(match[1], 10);
    }
  });

  renderClassroom();
  showToast('Đã xếp ngẫu nhiên. Nhấn "Lưu sơ đồ" để lưu lại.', 'info');
}

function saveSeating() {
  db.saveSeating(seatMap);
  students = db.getStudents(); // get updated to_so from db
  renderClassroom();
  showToast(t('seSaveSuccess'), 'success');
}

// ── Gọi tên (Random student picker) ───────────────────────────
function goiTen() {
  const select = document.getElementById('goi-ten-from');
  const groupVal = select ? select.value : 'all';

  let pool = students;
  if (groupVal !== 'all') {
    pool = students.filter(s => String(s.to_so) === groupVal);
  }

  const resultEl = document.getElementById('goi-ten-result');
  if (!pool.length) {
    if (resultEl) {
      resultEl.textContent = 'Không có học sinh nào trong nhóm này.';
      resultEl.classList.remove('hidden');
    }
    return;
  }

  if (resultEl) {
    resultEl.classList.remove('hidden');
    resultEl.textContent = t('seGoiTenCalling');
  }

  // Animation cycle
  let counter = 0;
  const interval = setInterval(() => {
    const rand = pool[Math.floor(Math.random() * pool.length)];
    if (resultEl) resultEl.textContent = `🎲 ${rand.ho_ten} (${rand.ma_hs})`;
    counter++;
    if (counter > 14) {
      clearInterval(interval);
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      if (resultEl) {
        resultEl.innerHTML = `🎉 <strong>${chosen.ho_ten}</strong> (Mã: <strong>${chosen.ma_hs}</strong> · Tổ <strong>${chosen.to_so}</strong>)`;
      }
    }
  }, 90);
}

init();
})();
