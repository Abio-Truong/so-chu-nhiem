(function () {
  const { db, auth } = window;

  const className = db ? db.getSetting('ten_lop', '6/3') : '6/3';
  const subEl = document.getElementById('login-class-name');
  if (subEl) subEl.textContent = `Lớp ${className} — Prototype`;

  const form = document.getElementById('login-form');
  const errEl = document.getElementById('error-msg');
  const btnLogin = document.getElementById('btn-login');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username')?.value.trim();

    if (!username) {
      if (errEl) {
        errEl.textContent = 'Vui lòng nhập tên đăng nhập.';
        errEl.classList.remove('hidden');
      }
      return;
    }

    if (username.includes('@') || username.toLowerCase() === 'teacher' || username.toLowerCase() === 'giaovien') {
      auth.setRole('teacher');
    } else {
      auth.setRole('student');
      const students = db.getStudents();
      const match = students.find(s => s.ma_hs === username || s.id === username);
      if (match) {
        auth.setActiveStudentId(match.id);
      }
    }

    window.location.href = 'overview.html';
  });
})();
