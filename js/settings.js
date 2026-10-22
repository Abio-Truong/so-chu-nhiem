(function () {
  const { db } = window;
  const { requireAuth, getRole, onRoleChange } = window.auth;
  const { initNav } = window.nav;
  const { t, getLang, onLangChange, applyTranslations } = window.i18n;

function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const tEl = document.createElement('div');
  tEl.className = `toast toast-${type}`;
  tEl.textContent = msg;
  c.appendChild(tEl);
  setTimeout(() => tEl.remove(), 3500);
}

async function init() {
  const auth = await requireAuth();
  if (!auth) return;

  await initNav('settings');

  loadSettings();
  setupClassInfoSave();
  setupPrivacyToggle();
  setupResetDefault();
  updateRoleAccess();

  onRoleChange(() => {
    updateRoleAccess();
  });

  onLangChange(() => {
    applyTranslations();
    updateLangDisplay();
  });

  updateLangDisplay();
}

function loadSettings() {
  const settings = db.getSettings();

  const tenLop = document.getElementById('setting-ten-lop');
  const namHoc = document.getElementById('setting-nam-hoc');
  const gvcn   = document.getElementById('setting-gvcn');
  const toggle = document.getElementById('toggle-privacy');

  if (tenLop) tenLop.value = settings.ten_lop || '6/3';
  if (namHoc) namHoc.value = settings.nam_hoc || '2026-2027';
  if (gvcn)   gvcn.value   = settings.gvcn || 'Cô Nguyễn Thị Mai';
  if (toggle) toggle.checked = settings.che_do_rieng_tu === 'true';
}

function setupClassInfoSave() {
  document.getElementById('btn-save-class')?.addEventListener('click', () => {
    const tenLop = document.getElementById('setting-ten-lop')?.value.trim();
    const namHoc = document.getElementById('setting-nam-hoc')?.value.trim();
    const gvcn   = document.getElementById('setting-gvcn')?.value.trim();

    if (!tenLop || !namHoc) {
      showToast('Vui lòng điền tên lớp và niên khóa.', 'error');
      return;
    }

    db.saveSettings({
      ten_lop: tenLop,
      nam_hoc: namHoc,
      gvcn: gvcn,
    });

    showToast(t('setClassSaved'), 'success');

    // Update class name on navbar
    const navClassName = document.getElementById('nav-class-name');
    if (navClassName) navClassName.textContent = `${t('classLabel')} ${tenLop}`;
  });
}

function setupPrivacyToggle() {
  document.getElementById('toggle-privacy')?.addEventListener('change', e => {
    const val = e.target.checked ? 'true' : 'false';
    db.saveSetting('che_do_rieng_tu', val);
    showToast(e.target.checked ? t('setPrivacyOn') : t('setPrivacyOff'), 'success');
  });
}

function setupResetDefault() {
  document.getElementById('btn-reset-default')?.addEventListener('click', () => {
    if (!confirm(t('setResetConfirm'))) return;

    db.resetDefaultData();
    loadSettings();
    showToast(t('setResetSuccess'), 'success');

    // Update navbar class name
    const navClassName = document.getElementById('nav-class-name');
    if (navClassName) navClassName.textContent = `${t('classLabel')} 6/3`;
  });
}

function updateRoleAccess() {
  const isTeacherRole = getRole() === 'teacher';
  const notice = document.getElementById('student-notice');
  const teacherCards = document.querySelectorAll('.teacher-content');

  if (isTeacherRole) {
    notice?.classList.add('hidden');
    teacherCards.forEach(c => c.style.display = '');
  } else {
    notice?.classList.remove('hidden');
    teacherCards.forEach(c => c.style.display = 'none');
  }
}

function updateLangDisplay() {
  const display = document.getElementById('current-lang-display');
  if (display) {
    display.textContent = getLang() === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)';
  }
}

init();
})();
