// =============================================================
// Sổ Chủ Nhiệm — Prototype Role & Authentication Manager
// Không cần server/Supabase, chuyển đổi vai trò tức thì trên Navbar
// =============================================================

(function (root) {
  const ROLE_STORAGE_KEY = 'sochunhiem_active_role';
  const STUDENT_STORAGE_KEY = 'sochunhiem_active_student_id';

  const roleListeners = [];

  function getRole() {
    try {
      return localStorage.getItem(ROLE_STORAGE_KEY) || 'teacher';
    } catch (_) {
      return 'teacher';
    }
  }

  function isTeacher() {
    return getRole() === 'teacher';
  }

  function getActiveStudentId() {
    try {
      const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
      if (saved) return saved;
    } catch (_) {}
    const students = root.db ? root.db.getStudents() : [];
    return students[0]?.id || 'hs-6301';
  }

  function setActiveStudentId(id) {
    try {
      localStorage.setItem(STUDENT_STORAGE_KEY, id);
    } catch (_) {}
    roleListeners.forEach(fn => fn({ role: getRole(), studentId: id }));
  }

  function setRole(newRole) {
    if (newRole !== 'teacher' && newRole !== 'student') return;
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch (_) {}

    if (document.body) {
      document.body.classList.remove('role-teacher', 'role-student');
      document.body.classList.add(`role-${newRole}`);
    }

    roleListeners.forEach(fn => fn({ role: newRole, studentId: getActiveStudentId() }));
  }

  function onRoleChange(fn) {
    if (typeof fn === 'function') roleListeners.push(fn);
  }

  function requireAuth() {
    const role = getRole();
    const studentId = getActiveStudentId();

    if (document.body) {
      document.body.classList.remove('role-teacher', 'role-student');
      document.body.classList.add(`role-${role}`);
    }

    return Promise.resolve({
      role,
      isTeacher: role === 'teacher',
      studentId,
    });
  }

  function getCurrentWeek() {
    const startStr = root.TERM_START_DATE || '2026-09-07';
    const start = new Date(startStr);
    const now = new Date();
    const diff = now - start;
    if (diff < 0) return 1;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  function getCurrentNamHoc() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  const auth = {
    getRole,
    isTeacher,
    getActiveStudentId,
    setActiveStudentId,
    setRole,
    onRoleChange,
    requireAuth,
    getCurrentWeek,
    getCurrentNamHoc
  };

  root.auth = auth;
})(typeof window !== 'undefined' ? window : this);
