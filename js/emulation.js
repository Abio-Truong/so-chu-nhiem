(function () {
  const { db, INITIAL_SCORE } = window;
  const { requireAuth, getCurrentWeek, getCurrentNamHoc, getRole, getActiveStudentId, onRoleChange } = window.auth;
  const { initNav } = window.nav;
  const { createStudentPicker, loadStudents } = window.studentPicker;
  const { t, onLangChange, applyTranslations, translateTier, translateCategory } = window.i18n;

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
let currentWeek      = 1;
let namHoc           = '2026-2027';
let allStudents      = [];
let selectedIds      = new Set(); // student IDs selected in common picker (*)
let mainPicker       = null;
let modalPicker      = null;
let tieuChiList      = [];

// ── Init ──────────────────────────────────────────────────────
async function init() {
  const auth = await requireAuth();
  if (!auth) return;

  currentWeek = getCurrentWeek();
  namHoc      = getCurrentNamHoc();

  await initNav('emulation');

  allStudents = db.getStudents();
  selectedIds = new Set(allStudents.map(s => s.id));

  // Common student search & select multiple (1)
  mainPicker = await createStudentPicker(
    document.getElementById('picker-container'),
    {
      multiSelect: true,
      defaultAll: true,
      onChange: selected => {
        selectedIds = new Set(selected.map(s => s.id));
        renderData();
      },
    }
  );

  setupWeekNav();
  setupAccordions();
  setupModals();

  loadCriteria();
  renderData();

  onRoleChange(() => {
    renderData();
  });

  onLangChange(() => {
    renderData();
    renderCriteriaList();
    applyTranslations();
  });
}

// ── Week Navigation ───────────────────────────────────────────
function setupWeekNav() {
  const display = document.getElementById('week-display');
  if (display) display.textContent = `${t('navEmulation')} ${currentWeek}`;

  document.getElementById('btn-prev-week')?.addEventListener('click', () => {
    if (currentWeek <= 1) return;
    currentWeek--;
    if (display) display.textContent = `${t('navEmulation')} ${currentWeek}`;
    renderData();
  });

  document.getElementById('btn-next-week')?.addEventListener('click', () => {
    currentWeek++;
    if (display) display.textContent = `${t('navEmulation')} ${currentWeek}`;
    renderData();
  });
}

// ── Render Data ───────────────────────────────────────────────
function renderData() {
  const isTeacher = getRole() === 'teacher';
  const activeStudentId = getActiveStudentId();
  const privacyOn = db.getSetting('che_do_rieng_tu', 'false') === 'true';

  const scores = db.getScores(currentWeek, namHoc);
  const scoreMap = {};
  scores.forEach(s => { scoreMap[s.student_id] = s; });

  let allEntries = db.getScoreEntries(currentWeek, namHoc);

  // If Student role and Privacy mode is ON, filter only active student's records
  if (!isTeacher && privacyOn) {
    allEntries = allEntries.filter(e => e.student_id === activeStudentId);
  }

  // Combine student data
  const studentData = allStudents.map(s => {
    const sc = scoreMap[s.id];
    const dDau = sc?.diem_dau_tuan ?? INITIAL_SCORE;
    const dCuoi = sc?.diem_cuoi_tuan ?? dDau;
    const tier = db.getTierInfo(dCuoi);
    return {
      ...s,
      dDau,
      dCuoi,
      tier,
      isSelected: selectedIds.has(s.id),
    };
  });

  renderGroupScores(studentData);
  renderRanking(studentData);
  renderHistory(allEntries);
}

// ── Group Scores ──────────────────────────────────────────────
function renderGroupScores(studentData) {
  const grid = document.getElementById('group-scores-grid');
  if (!grid) return;

  const medals = ['🥇', '🥈', '🥉', '4️⃣'];
  const groups = [1, 2, 3, 4].map(g => ({
    group: g,
    total: studentData.filter(s => s.to_so === g).reduce((a, s) => a + s.dCuoi, 0),
  })).sort((a, b) => b.total - a.total);

  const rankMap = {};
  groups.forEach((g, i) => { rankMap[g.group] = i; });

  grid.innerHTML = [1, 2, 3, 4].map(g => {
    const gd = groups.find(x => x.group === g);
    const rank = rankMap[g];
    return `
      <div class="group-score-card to-${g}">
        <div class="group-score-name">${t('ovGroupRankTitle')} ${g}</div>
        <div class="group-score-value">${gd?.total ?? 0}</div>
        <div class="group-score-rank">${medals[rank] ?? ''}</div>
      </div>
    `;
  }).join('');
}

// ── Ranking with Tie Handling & Highlight (*) ─────────────────
function renderRanking(studentData) {
  const list = document.getElementById('ranking-list');
  if (!list) return;

  const hasSpecificSelection = selectedIds.size > 0 && selectedIds.size < allStudents.length;

  // Sort: selected moved to top if subset selected, else score descending
  const sorted = [...studentData].sort((a, b) => {
    if (hasSpecificSelection) {
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;
    }
    return b.dCuoi - a.dCuoi;
  });

  // Calculate ranks: same score = same rank
  let currentRank = 1;
  let prevScore = null;

  list.innerHTML = sorted.map((s, i) => {
    if (prevScore !== null && s.dCuoi < prevScore) {
      currentRank = i + 1;
    }
    prevScore = s.dCuoi;

    const isHighlighted = s.isSelected && hasSpecificSelection;

    return `
      <div class="ranking-item ${isHighlighted ? 'highlighted' : ''}">
        <div class="rank-num">${currentRank}</div>
        <div class="rank-info">
          <div class="rank-name">
            ${isHighlighted ? '⭐ ' : ''}<strong>${s.ho_ten}</strong>
          </div>
          <div class="rank-meta">${s.ma_hs} · Tổ ${s.to_so} · <span class="badge-tier ${s.tier.badgeClass}">${translateTier(s.tier.name)}</span></div>
        </div>
        <div class="rank-score" style="color:var(--primary)">${s.dCuoi}</div>
      </div>
    `;
  }).join('');
}

// ── History List (Filtered by (*) selected students) ──────────
function renderHistory(allEntries) {
  const list = document.getElementById('history-list');
  if (!list) return;

  const isTeacher = getRole() === 'teacher';

  let visibleEntries = allEntries;
  if (selectedIds.size < allStudents.length) {
    visibleEntries = allEntries.filter(e => selectedIds.has(e.student_id));
  }

  const studentMap = {};
  allStudents.forEach(s => { studentMap[s.id] = s; });

  if (!visibleEntries.length) {
    list.innerHTML = `<p class="text-muted text-center" style="padding:16px 0">${t('emNoHistory')}</p>`;
    return;
  }

  list.innerHTML = visibleEntries.map(e => {
    const s = studentMap[e.student_id];
    const positive = e.so_diem >= 0;
    const date = e.created_at ? new Date(e.created_at).toLocaleDateString() : '';
    const nhomName = e.tieu_chi?.nhom ? translateCategory(e.tieu_chi.nhom) : '';
    const nhomTag = nhomName ? `[${nhomName}] ` : '';

    return `
      <div class="history-entry">
        <span class="score-badge ${positive ? 'positive' : 'negative'}">
          ${positive ? '+' : ''}${e.so_diem}
        </span>
        <div class="history-info">
          <div class="history-student"><strong>${s?.ho_ten ?? 'Học sinh'}</strong> (${s?.ma_hs ?? ''} · Tổ ${s?.to_so ?? ''})</div>
          <div class="history-reason">${nhomTag}${e.tieu_chi?.ten ?? ''} ${e.ly_do ? '— ' + e.ly_do : ''}</div>
          <div class="history-time text-muted text-xs">${date}</div>
        </div>
        ${isTeacher ? `
          <div class="action-btns">
            <button class="btn btn-sm btn-danger" onclick="deleteScoreEntry('${e.id}')" title="Xoá bản ghi này">🗑️</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

window.deleteScoreEntry = (id) => {
  if (!confirm(t('emDeleteScoreConfirm'))) return;
  db.deleteScoreEntry(id);
  showToast('Đã xoá bản ghi điểm.', 'success');
  renderData();
};

// ── Accordions ────────────────────────────────────────────────
function setupAccordions() {
  setupAccordionToggle('ranking-header', 'ranking-body', 'ranking-toggle');
  setupAccordionToggle('history-header', 'history-body', 'history-toggle');
}

function setupAccordionToggle(headerId, bodyId, toggleId) {
  document.getElementById(headerId)?.addEventListener('click', () => {
    const body   = document.getElementById(bodyId);
    const toggle = document.getElementById(toggleId);
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? '' : 'none';
    if (toggle) toggle.textContent = isHidden ? '▼' : '▶';
  });
}

// ── Modals & Actions ──────────────────────────────────────────
function setupModals() {
  document.getElementById('btn-add-score')?.addEventListener('click', openScoreModal);
  document.getElementById('modal-close')?.addEventListener('click', () => closeModal('modal-overlay'));
  document.getElementById('btn-modal-cancel')?.addEventListener('click', () => closeModal('modal-overlay'));
  document.getElementById('btn-modal-save')?.addEventListener('click', saveScoreEntry);

  document.getElementById('form-nhom-tieu-chi')?.addEventListener('change', e => {
    updateTieuChiDropdown(e.target.value);
  });

  document.getElementById('form-tieu-chi')?.addEventListener('change', e => {
    const tc = tieuChiList.find(x => x.id === e.target.value);
    if (tc) {
      document.getElementById('form-diem').value = tc.diem_mac_dinh;
    }
  });

  document.getElementById('btn-add-criteria')?.addEventListener('click', openCriteriaModal);
  document.getElementById('modal-criteria-close')?.addEventListener('click', () => closeModal('modal-criteria-overlay'));
  document.getElementById('btn-criteria-cancel')?.addEventListener('click', () => closeModal('modal-criteria-overlay'));
  document.getElementById('btn-criteria-save')?.addEventListener('click', saveCriteria);
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

async function openScoreModal() {
  document.getElementById('form-nhom-tieu-chi').value = '';
  updateTieuChiDropdown('');
  document.getElementById('form-diem').value = '1';
  document.getElementById('form-ly-do').value = '';
  document.getElementById('modal-error').classList.add('hidden');

  if (!modalPicker) {
    modalPicker = await createStudentPicker(
      document.getElementById('modal-picker-container'),
      {
        multiSelect: true,
        defaultAll: false,
        placeholder: 'Chọn học sinh ghi nhận điểm...',
      }
    );
  }

  // Pre-select students currently selected in main picker
  modalPicker.setSelected([...selectedIds]);

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function updateTieuChiDropdown(selectedNhom) {
  const sel = document.getElementById('form-tieu-chi');
  let filtered = tieuChiList;
  if (selectedNhom) {
    filtered = tieuChiList.filter(tc => tc.nhom === selectedNhom);
  }

  sel.innerHTML = `<option value="">${t('emCriteriaSelectDefault')}</option>` +
    filtered.map(tc => `<option value="${tc.id}">[${translateCategory(tc.nhom)}] ${tc.ten} (${tc.diem_mac_dinh > 0 ? '+' : ''}${tc.diem_mac_dinh})</option>`).join('');
}

function saveScoreEntry() {
  const diem      = parseInt(document.getElementById('form-diem').value, 10);
  const lyDo      = document.getElementById('form-ly-do').value.trim();
  const tieuChiId = document.getElementById('form-tieu-chi').value || null;
  const targetStudents = modalPicker?.getSelected() ?? [];
  const errEl     = document.getElementById('modal-error');

  if (!targetStudents.length) {
    errEl.textContent = 'Vui lòng chọn ít nhất một học sinh.';
    errEl.classList.remove('hidden'); return;
  }
  if (isNaN(diem) || diem < -5 || diem > 5) {
    errEl.textContent = 'Điểm phải trong khoảng từ –5 đến +5.';
    errEl.classList.remove('hidden'); return;
  }

  targetStudents.forEach(s => {
    db.addScoreEntry({
      studentId: s.id,
      week: currentWeek,
      namHoc: namHoc,
      points: diem,
      reason: lyDo,
      criteriaId: tieuChiId,
    });
  });

  showToast(t('emScoreRecorded', { count: targetStudents.length }), 'success');
  closeModal('modal-overlay');
  renderData();
}

// ── Criteria Management ───────────────────────────────────────
function loadCriteria() {
  tieuChiList = db.getCriteria();
  renderCriteriaList();
}

function renderCriteriaList() {
  const listEl = document.getElementById('criteria-list');
  if (!listEl) return;

  const isTeacher = getRole() === 'teacher';

  const grouped = {};
  tieuChiList.forEach(tc => {
    const g = tc.nhom || 'Khác';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(tc);
  });

  listEl.innerHTML = Object.entries(grouped).map(([nhom, items]) => `
    <div style="margin-bottom:12px">
      <div style="font-weight:600;font-size:13px;color:var(--primary);margin-bottom:6px">📁 ${translateCategory(nhom)}</div>
      ${items.map(tc => `
        <div class="criteria-item">
          <span class="criteria-name">${tc.ten}</span>
          <span class="criteria-diem ${tc.diem_mac_dinh >= 0 ? 'text-success' : 'text-danger'}">
            ${tc.diem_mac_dinh > 0 ? '+' : ''}${tc.diem_mac_dinh}
          </span>
          ${isTeacher ? `
            <button class="btn btn-sm btn-danger" onclick="deleteCriteria('${tc.id}')" title="Xoá tiêu chí">🗑️</button>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function openCriteriaModal() {
  document.getElementById('criteria-form-ten').value = '';
  document.getElementById('criteria-form-diem').value = '1';
  document.getElementById('criteria-error').classList.add('hidden');
  document.getElementById('modal-criteria-overlay').classList.remove('hidden');
}

function saveCriteria() {
  const nhom  = document.getElementById('criteria-form-nhom').value;
  const ten   = document.getElementById('criteria-form-ten').value.trim();
  const diem  = parseInt(document.getElementById('criteria-form-diem').value, 10);
  const errEl = document.getElementById('criteria-error');

  if (!ten) {
    errEl.textContent = 'Vui lòng nhập tên tiêu chí.';
    errEl.classList.remove('hidden'); return;
  }
  if (isNaN(diem) || diem < -5 || diem > 5) {
    errEl.textContent = 'Điểm mặc định phải trong khoảng từ –5 đến +5.';
    errEl.classList.remove('hidden'); return;
  }

  db.saveCriteria({
    nhom,
    ten,
    diem_mac_dinh: diem,
    loai: diem >= 0 ? 'cong' : 'tru',
  });

  showToast(t('emCriteriaSaved'), 'success');
  closeModal('modal-criteria-overlay');
  loadCriteria();
}

window.deleteCriteria = (id) => {
  if (!confirm('Xoá tiêu chí này khỏi danh sách?')) return;
  db.deleteCriteria(id);
  showToast(t('emCriteriaDeleted'), 'success');
  loadCriteria();
};

init();
})();
