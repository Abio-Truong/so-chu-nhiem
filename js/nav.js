// =============================================================
// Sổ Chủ Nhiệm — Navigation Bar with Role & Language Switchers
// =============================================================

(function (root) {
  function initNav(activeTab) {
    let nav = document.getElementById('navbar');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'navbar';
      document.body.prepend(nav);
    }
    nav.className = 'navbar';

    const db = root.db;
    const auth = root.auth;
    const i18n = root.i18n;
    const t = i18n ? i18n.t : (k => k);

    function renderNavContent() {
      const role = auth ? auth.getRole() : 'teacher';
      const currentStudentId = auth ? auth.getActiveStudentId() : '';
      const students = db ? db.getStudents() : [];
      const className = db ? db.getSetting('ten_lop', '6/3') : '6/3';
      const lang = i18n ? i18n.getLang() : 'vi';

      nav.innerHTML = `
        <div class="navbar-brand">
          <a href="overview.html" style="display:flex;align-items:center;gap:6px;text-decoration:none;color:inherit">
            <span class="navbar-logo">📒</span>
            <span class="brand-title">${t('appTitle')}</span>
            <span id="nav-class-name" class="navbar-class-name">${t('classLabel')} ${className}</span>
          </a>
        </div>

        <div class="navbar-links" id="navbar-links">
          <a href="overview.html"  class="navbar-link ${activeTab === 'overview'  ? 'active' : ''}">${t('navOverview')}</a>
          <a href="students.html"  class="navbar-link ${activeTab === 'students'  ? 'active' : ''}">${t('navStudents')}</a>
          <a href="seating.html"   class="navbar-link ${activeTab === 'seating'   ? 'active' : ''}">${t('navSeating')}</a>
          <a href="emulation.html" class="navbar-link ${activeTab === 'emulation' ? 'active' : ''}">${t('navEmulation')}</a>
          <a href="settings.html"  class="navbar-link ${activeTab === 'settings'  ? 'active' : ''}">${t('navSettings')}</a>
        </div>

        <div class="navbar-controls">
          <!-- Language Switcher -->
          <button class="btn btn-sm btn-outline lang-btn" id="btn-toggle-lang" title="Đổi ngôn ngữ / Switch language">
            ${lang === 'vi' ? '🌐 EN' : '🌐 VI'}
          </button>

          <!-- Role Switcher -->
          <div class="role-switcher">
            <div class="role-pill-group">
              <button class="role-btn ${role === 'teacher' ? 'active' : ''}" id="btn-role-teacher">
                ${t('roleTeacher')}
              </button>
              <button class="role-btn ${role === 'student' ? 'active' : ''}" id="btn-role-student">
                ${t('roleStudent')}
              </button>
            </div>

            <!-- Student identity picker dropdown (visible when role is student) -->
            <div class="student-select-wrap ${role === 'student' ? '' : 'hidden'}" id="nav-student-picker-wrap">
              <select id="nav-student-select" class="nav-student-dropdown" title="${t('viewingAs')}">
                ${students.map(s => `
                  <option value="${s.id}" ${s.id === currentStudentId ? 'selected' : ''}>
                    ${s.ma_hs} - ${s.ho_ten} (Tổ ${s.to_so})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      `;

      // Setup event listeners
      document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
        if (i18n) i18n.toggleLang();
        renderNavContent();
        if (i18n) i18n.applyTranslations();
      });

      document.getElementById('btn-role-teacher')?.addEventListener('click', () => {
        if (auth) auth.setRole('teacher');
        renderNavContent();
      });

      document.getElementById('btn-role-student')?.addEventListener('click', () => {
        if (auth) auth.setRole('student');
        renderNavContent();
      });

      document.getElementById('nav-student-select')?.addEventListener('change', e => {
        if (auth) auth.setActiveStudentId(e.target.value);
      });
    }

    renderNavContent();
    if (i18n) i18n.applyTranslations();

    if (i18n && typeof i18n.onLangChange === 'function') {
      i18n.onLangChange(() => {
        renderNavContent();
        i18n.applyTranslations();
      });
    }

    return Promise.resolve();
  }

  root.nav = {
    initNav
  };
})(typeof window !== 'undefined' ? window : this);
