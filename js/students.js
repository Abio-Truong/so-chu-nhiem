(function () {
  const { db } = window;
  const { requireAuth, getCurrentWeek, getCurrentNamHoc, onRoleChange } = window.auth;
  const { initNav } = window.nav;
  const { t, onLangChange, applyTranslations, translateTier } = window.i18n;

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
let allStudents = [];
let scoreMap    = {};
let filterGroup = 'all';
let searchQuery = '';

// ── Init ──────────────────────────────────────────────────────
async function init() {
  const auth = await requireAuth();
  if (!auth) return;

  await initNav('students');

  loadData();
  setupEventListeners();

  onRoleChange(() => {
    renderTable();
  });

  onLangChange(() => {
    renderTable();
    applyTranslations();
  });
}

function loadData() {
  allStudents = db.getStudents();
  const week = getCurrentWeek();
  const namHoc = getCurrentNamHoc();
  const scores = db.getScores(week, namHoc);

  scoreMap = {};
  scores.forEach(s => { scoreMap[s.student_id] = s.diem_cuoi_tuan; });

  renderTable();
}

function renderTable() {
  const wrapper = document.getElementById('students-table-wrapper');
  const tbody   = document.getElementById('students-tbody');
  const empty   = document.getElementById('students-empty');

  if (!allStudents.length) {
    if (wrapper) wrapper.hidden = true;
    if (empty)   empty.hidden   = false;
    return;
  }

  if (wrapper) wrapper.hidden = false;
  if (empty)   empty.hidden   = true;

  // Filter by group
  let baseList = allStudents;
  if (filterGroup !== 'all') {
    baseList = baseList.filter(s => String(s.to_so) === filterGroup);
  }

  // Search feature (1): DO NOT shorten list, MOVE matched to top!
  let displayList = [];
  const q = searchQuery.toLowerCase().trim();

  if (q) {
    const matched = [];
    const unmatched = [];

    baseList.forEach(s => {
      const matchName = (s.ho_ten || '').toLowerCase().includes(q);
      const matchMa   = (s.ma_hs || '').toLowerCase().includes(q);
      const matchTo   = String(s.to_so || '').includes(q) || `tổ ${s.to_so}`.toLowerCase().includes(q) || `group ${s.to_so}`.toLowerCase().includes(q);

      if (matchName || matchMa || matchTo) {
        matched.push({ ...s, isMatched: true });
      } else {
        unmatched.push({ ...s, isMatched: false });
      }
    });

    displayList = [...matched, ...unmatched];
  } else {
    displayList = baseList.map(s => ({ ...s, isMatched: false }));
  }

  const genderBadge = g => g === 'Nữ'
    ? `<span class="badge badge-nu">${t('stGenderNu')}</span>`
    : `<span class="badge badge-nam">${t('stGenderNam')}</span>`;

  tbody.innerHTML = displayList.map(s => {
    const score = scoreMap[s.id] ?? 81;
    const tier = db.getTierInfo(score);
    const rowClass = s.isMatched ? 'row-highlighted' : '';

    return `
      <tr class="${rowClass}">
        <td><strong>${s.ma_hs}</strong></td>
        <td>${s.ho_ten}</td>
        <td>${genderBadge(s.gioi_tinh)}</td>
        <td><span class="group-chip">${t('ovGroupRankTitle')} ${s.to_so}</span></td>
        <td><strong>${score}</strong></td>
        <td><span class="badge-tier ${tier.badgeClass}">${translateTier(tier.name)}</span></td>
        <td class="teacher-only action-btns">
          <button class="btn btn-sm btn-secondary" onclick="openEdit('${s.id}')">${t('stEditBtn')}</button>
          <button class="btn btn-sm btn-danger"    onclick="deleteStudent('${s.id}', '${s.ho_ten}')">${t('stDeleteBtn')}</button>
        </td>
      </tr>
    `;
  }).join('');
}

function setupEventListeners() {
  // Search input
  document.getElementById('search-input')?.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderTable();
  });

  // Group filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterGroup = btn.dataset.group;
      renderTable();
    });
  });

  // Add student
  document.getElementById('btn-add-student')?.addEventListener('click', () => openModal());

  // Import file
  const fileInput = document.getElementById('file-import-excel');
  document.getElementById('btn-import-excel')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', handleImportFile);

  // Export Excel
  document.getElementById('btn-export-excel')?.addEventListener('click', exportExcel);

  // Modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
  document.getElementById('student-form')?.addEventListener('submit', handleFormSubmit);
}

// ── Import File (SheetJS) ─────────────────────────────────────
async function handleImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      showToast('File không có dữ liệu.', 'error');
      return;
    }

    const studentsToInsert = [];
    rows.forEach(r => {
      const maHs     = String(r['Mã HS'] || r['ma_hs'] || r['Mã'] || r['MaHS'] || r['ID'] || '').trim();
      const hoTen    = String(r['Họ tên'] || r['ho_ten'] || r['Họ và tên'] || r['Ten'] || r['Name'] || '').trim();
      const gioiTinh = (r['Giới tính'] || r['gioi_tinh'] || r['Gender'] || 'Nam').includes('Nữ') || (r['Gender'] || '').toLowerCase() === 'female' ? 'Nữ' : 'Nam';
      const toSo     = Number(r['Tổ'] || r['to_so'] || r['To'] || r['Group'] || 1);
      const ngaySinh = r['Ngày sinh'] || r['ngay_sinh'] || r['DOB'] || '';
      const ghiChu   = r['Ghi chú'] || r['ghi_chu'] || r['Notes'] || '';

      if (maHs && hoTen) {
        studentsToInsert.push({
          ma_hs: maHs,
          ho_ten: hoTen,
          gioi_tinh: gioiTinh,
          to_so: Math.max(1, Math.min(4, toSo)),
          ngay_sinh: ngaySinh,
          ghi_chu: ghiChu,
        });
      }
    });

    if (!studentsToInsert.length) {
      showToast('Không tìm thấy học sinh hợp lệ (cần cột "Mã HS" và "Họ tên").', 'error');
      return;
    }

    const count = db.importStudents(studentsToInsert);
    showToast(t('stMsgImportSuccess', { count }), 'success');
    loadData();
  } catch (err) {
    showToast('Lỗi đọc file: ' + err.message, 'error');
  } finally {
    e.target.value = '';
  }
}

// ── Modal Form ────────────────────────────────────────────────
function openModal(student = null) {
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = student ? t('stModalEditTitle') : t('stModalAddTitle');

  document.getElementById('form-student-id').value  = student?.id || '';
  document.getElementById('form-ma-hs').value       = student?.ma_hs || '';
  document.getElementById('form-ho-ten').value      = student?.ho_ten || '';
  document.getElementById('form-gioi-tinh').value   = student?.gioi_tinh || 'Nam';
  document.getElementById('form-to-so').value       = student?.to_so || '1';
  document.getElementById('form-ngay-sinh').value   = student?.ngay_sinh || '';
  document.getElementById('form-ghi-chu').value     = student?.ghi_chu || '';
  document.getElementById('form-error').classList.add('hidden');

  document.getElementById('form-ma-hs').disabled = !!student;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

window.openEdit = id => {
  const s = allStudents.find(x => x.id === id);
  if (s) openModal(s);
};

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id       = document.getElementById('form-student-id').value;
  const maHs     = document.getElementById('form-ma-hs').value.trim();
  const hoTen    = document.getElementById('form-ho-ten').value.trim();
  const gioiTinh = document.getElementById('form-gioi-tinh').value;
  const toSo     = Number(document.getElementById('form-to-so').value);
  const ngaySinh = document.getElementById('form-ngay-sinh').value || '';
  const ghiChu   = document.getElementById('form-ghi-chu').value.trim() || '';
  const errEl    = document.getElementById('form-error');

  if (!maHs || !hoTen) {
    errEl.textContent = 'Vui lòng điền đầy đủ Mã HS và Họ tên.';
    errEl.classList.remove('hidden');
    return;
  }

  db.saveStudent({
    id: id || `hs-${maHs}`,
    ma_hs: maHs,
    ho_ten: hoTen,
    gioi_tinh: gioiTinh,
    to_so: toSo,
    ngay_sinh: ngaySinh,
    ghi_chu: ghiChu,
  });

  showToast(t('stMsgSaved'), 'success');
  closeModal();
  loadData();
}

window.deleteStudent = (id, name) => {
  if (!confirm(t('stMsgConfirmDelete', { name }))) return;
  db.deleteStudent(id);
  showToast(t('stMsgDeleted'), 'success');
  loadData();
};

// ── Export Excel ──────────────────────────────────────────────
function exportExcel() {
  const rows = allStudents.map((s, i) => {
    const score = scoreMap[s.id] ?? 81;
    const tier = db.getTierInfo(score);
    return {
      'STT':          i + 1,
      'Mã HS':        s.ma_hs,
      'Họ tên':       s.ho_ten,
      'Giới tính':    s.gioi_tinh === 'Nữ' ? t('stGenderNu') : t('stGenderNam'),
      'Tổ':           s.to_so,
      'Điểm thi đua': score,
      'Mức':          translateTier(tier.name),
      'Ngày sinh':    s.ngay_sinh || '',
      'Ghi chú':      s.ghi_chu || '',
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách học sinh');
  XLSX.writeFile(wb, 'danh-sach-hoc-sinh.xlsx');
}

init();
})();
