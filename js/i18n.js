// =============================================================
// Sổ Chủ Nhiệm — Bộ Từ Điển Song Ngữ (VI 🇻🇳 / EN 🇬🇧)
// =============================================================

(function (root) {
  const translations = {
    vi: {
      // ── Navigation & Brand ──
      appTitle: 'Sổ Chủ Nhiệm',
      navOverview: 'Tổng quan',
      navStudents: 'Học sinh',
      navSeating: 'Sơ đồ chỗ ngồi',
      navEmulation: 'Thi đua',
      navSettings: 'Cài đặt',
      roleTeacher: '👨‍🏫 Giáo viên',
      roleStudent: '🎓 Học sinh',
      viewingAs: 'Xem với tư cách',
      langToggle: '🌐 EN',
      classLabel: 'Lớp',
      schoolYearLabel: 'Niên khóa',
      homeroomTeacherLabel: 'GVCN',

      // ── Overview Page ──
      ovTotalStudents: 'Tổng học sinh',
      ovCurrentWeek: 'Tuần hiện tại',
      ovTopGroup: 'Tổ dẫn đầu',
      ovTodayEmulation: 'Thi đua hôm nay',
      ovGroupRankings: 'Bảng xếp hạng các Tổ',
      ovGroupRankTitle: 'Tổ',
      ovScoreAverage: 'Điểm tổng',
      ovTopStudents: 'Top 5 Học sinh tuần này',
      ovTeacherAnnouncement: 'Nhận xét & Thông báo của Giáo viên',
      ovAnnouncementPlaceholder: 'Nhập thông báo gửi đến phụ huynh hoặc cả lớp...',
      ovSaveAnnouncement: 'Lưu thông báo',
      ovAnnouncementSaved: 'Đã lưu thông báo thành công!',

      // ── Students Page ──
      stPageTitle: 'Học sinh & Hồ sơ',
      stAddStudent: '+ Thêm học sinh',
      stImportFile: '📁 Nhập từ file',
      stExportExcel: '📥 Xuất Excel',
      stSearchPlaceholder: 'Tìm theo Họ tên, Mã HS, Tổ (chuyển lên đầu danh sách)...',
      stFilterGroup: 'Lọc theo Tổ:',
      stAllGroups: 'Tất cả',
      stColMaHs: 'Mã HS',
      stColHoTen: 'Họ tên',
      stColGioiTinh: 'Giới tính',
      stColTo: 'Tổ',
      stColDiem: 'Thi đua',
      stColMuc: 'Mức',
      stColAction: 'Sửa',
      stGenderNam: 'Nam',
      stGenderNu: 'Nữ',
      stEditBtn: '✏️ Sửa',
      stDeleteBtn: '🗑️ Xoá',
      stEmptyList: 'Không có học sinh nào.',
      stModalAddTitle: 'Thêm học sinh mới',
      stModalEditTitle: 'Sửa thông tin học sinh',
      stFormMaHs: 'Mã HS *',
      stFormHoTen: 'Họ và tên *',
      stFormGioiTinh: 'Giới tính',
      stFormTo: 'Tổ',
      stFormNgaySinh: 'Ngày sinh',
      stFormGhiChu: 'Ghi chú',
      stBtnCancel: 'Huỷ',
      stBtnSave: 'Lưu',
      stMsgSaved: 'Đã lưu thông tin học sinh!',
      stMsgDeleted: 'Đã xoá học sinh.',
      stMsgConfirmDelete: 'Xoá học sinh "{name}"? Hành động này không thể hoàn tác.',
      stMsgImportSuccess: 'Đã nhập thành công {count} học sinh từ file!',

      // ── Seating Page ──
      sePageTitle: 'Sơ đồ chỗ ngồi',
      seRandomize: '🎲 Xếp ngẫu nhiên',
      seSave: '💾 Lưu sơ đồ',
      seBlackboard: '🖊️ Bảng đen',
      seTeacherDesk: '📋 Bàn Giáo Viên',
      seDay: 'Dãy',
      seBan: 'Bàn',
      seLeft: 'Trái',
      seRight: 'Phải',
      seEmptySeat: '(Trống)',
      seLegendTo1: 'Tổ 1',
      seLegendTo2: 'Tổ 2',
      seLegendTo3: 'Tổ 3',
      seLegendTo4: 'Tổ 4',
      seLegendEmpty: 'Trống',
      seGoiTenTitle: '🎤 Gọi tên ngẫu nhiên',
      seGoiTenFrom: 'Chọn từ:',
      seGoiTenAll: 'Cả lớp',
      seGoiTenBtn: '🎲 Gọi tên!',
      seGoiTenCalling: 'Đang quay tên...',
      seGoiTenResult: 'Chúc mừng: {name} (Mã: {maHs} - Tổ {toSo})!',
      seSaveSuccess: 'Đã lưu sơ đồ chỗ ngồi và cập nhật Tổ mới cho học sinh!',

      // ── Emulation Page ──
      emPageTitle: 'Thi đua & Xếp hạng',
      emWeekPrev: 'Tuần trước',
      emWeekNext: 'Tuần sau',
      emFilterStudent: 'Lọc học sinh:',
      emAddScore: '+ Ghi nhận điểm',
      emPersonalRanking: '📊 Xếp hạng cá nhân (*)',
      emHistoryTitle: '📋 Lịch sử ghi nhận điểm (*)',
      emCriteriaTitle: '⚙️ Cài đặt tiêu chí con',
      emBtnAddCriteria: '+ Thêm tiêu chí',
      emModalScoreTitle: 'Ghi nhận điểm thi đua',
      emFormCategory: 'Nhóm tiêu chí',
      emAllCategories: '-- Tất cả các nhóm --',
      emFormCriteria: 'Tiêu chí',
      emCriteriaSelectDefault: '-- Chọn tiêu chí hoặc nhập số điểm trực tiếp --',
      emFormPoints: 'Điểm (–5 đến +5)',
      emFormReason: 'Lý do / Ghi chú',
      emSaveScoreBtn: 'Lưu điểm',
      emScoreRecorded: 'Đã ghi nhận điểm cho {count} học sinh thành công!',
      emNoHistory: 'Không có bản ghi điểm nào cho tuần này.',
      emModalCriteriaTitle: 'Thêm tiêu chí thi đua mới',
      emCriteriaCategoryLabel: 'Nhóm tiêu chí (1 trong 6 nhóm cố định) *',
      emCriteriaNameLabel: 'Tên tiêu chí *',
      emCriteriaPointsLabel: 'Điểm mặc định (từ -5 đến +5) *',
      emCriteriaSaved: 'Đã thêm tiêu chí mới.',
      emCriteriaDeleted: 'Đã xoá tiêu chí.',
      emDeleteScoreConfirm: 'Xoá bản ghi điểm này? Điểm tổng tuần sẽ được tính toán lại.',

      // ── 6 Fixed Criteria Groups ──
      cat1: '1. Giờ giấc - chuyên cần',
      cat2: '2. Nội quy - trật tự',
      cat3: '3. Vệ sinh',
      cat4: '4. Tác phong - trang phục',
      cat5: '5. Trách nhiệm - ứng xử',
      cat6: '6. Học tập',

      // ── Rank Tiers ──
      tierDiamond: 'Kim cương',
      tierGold: 'Vàng',
      tierSilver: 'Bạc',
      tierBronze: 'Đồng',
      tierIron: 'Sắt',

      // ── Settings Page ──
      setPageTitle: 'Cài đặt hệ thống',
      setClassInfo: '📚 Thông tin lớp & Giáo viên chủ nhiệm',
      setClassName: 'Tên lớp *',
      setSchoolYear: 'Niên khóa *',
      setTeacherName: 'Giáo viên chủ nhiệm (GVCN) *',
      setBtnSaveClass: '💾 Lưu thông tin lớp',
      setClassSaved: 'Đã lưu thông tin lớp và GVCN thành công.',
      setEmulationHeader: '🏆 Cài đặt thi đua',
      setPrivacyTitle: 'Chế độ riêng tư',
      setPrivacyDesc: 'Bật: học sinh chỉ xem được lịch sử điểm của mình; Tắt: công khai toàn bộ',
      setPrivacyOn: 'Chế độ riêng tư: Bật.',
      setPrivacyOff: 'Chế độ riêng tư: Tắt.',
      setSecurityTitle: '🔐 Khôi phục & Dữ liệu',
      setResetTitle: 'Khôi phục dữ liệu mẫu gốc (Reset Default)',
      setResetDesc: 'Đưa toàn bộ danh sách 24 học sinh, điểm thi đua và sơ đồ chỗ ngồi về trạng thái mẫu ban đầu.',
      setBtnReset: '🔄 Khôi phục dữ liệu gốc',
      setResetConfirm: 'Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu gốc ban đầu không? Mọi thay đổi sẽ bị làm mới.',
      setResetSuccess: 'Đã khôi phục dữ liệu gốc thành công!',
      setSysInfoTitle: 'ℹ️ Thông tin hệ thống',
      setVersion: 'Phiên bản',
      setMode: 'Chế độ hoạt động',
      setModeValue: 'Standalone Prototype (Dữ liệu nhúng sẵn)',
      setStudentNotice: '🔒 Chỉ giáo viên mới có quyền thay đổi các cài đặt trên trang này.',

      // ── Student Picker Component (1) ──
      pickerPlaceholder: 'Tìm (Họ tên, Mã HS, Tổ)...',
      pickerSelectAll: 'Chọn tất cả',
      pickerDeselectAll: 'Bỏ chọn hết',
      pickerNoResult: 'Không tìm thấy học sinh phù hợp',
    },

    en: {
      // ── Navigation & Brand ──
      appTitle: 'Homeroom Log',
      navOverview: 'Overview',
      navStudents: 'Students',
      navSeating: 'Seating Chart',
      navEmulation: 'Emulation',
      navSettings: 'Settings',
      roleTeacher: '👨‍🏫 Teacher',
      roleStudent: '🎓 Student',
      viewingAs: 'Viewing as',
      langToggle: '🌐 VI',
      classLabel: 'Class',
      schoolYearLabel: 'School Year',
      homeroomTeacherLabel: 'Teacher',

      // ── Overview Page ──
      ovTotalStudents: 'Total Students',
      ovCurrentWeek: 'Current Week',
      ovTopGroup: 'Leading Group',
      ovTodayEmulation: 'Today\'s Emulation',
      ovGroupRankings: 'Group Rankings',
      ovGroupRankTitle: 'Group',
      ovScoreAverage: 'Total Score',
      ovTopStudents: 'Top 5 Students This Week',
      ovTeacherAnnouncement: 'Teacher\'s Remarks & Announcements',
      ovAnnouncementPlaceholder: 'Enter announcement for parents or students...',
      ovSaveAnnouncement: 'Save Announcement',
      ovAnnouncementSaved: 'Announcement saved successfully!',

      // ── Students Page ──
      stPageTitle: 'Students & Records',
      stAddStudent: '+ Add Student',
      stImportFile: '📁 Import File',
      stExportExcel: '📥 Export Excel',
      stSearchPlaceholder: 'Search Name, Student ID, Group (moves to top)...',
      stFilterGroup: 'Filter by Group:',
      stAllGroups: 'All',
      stColMaHs: 'ID',
      stColHoTen: 'Full Name',
      stColGioiTinh: 'Gender',
      stColTo: 'Group',
      stColDiem: 'Score',
      stColMuc: 'Tier',
      stColAction: 'Edit',
      stGenderNam: 'Male',
      stGenderNu: 'Female',
      stEditBtn: '✏️ Edit',
      stDeleteBtn: '🗑️ Delete',
      stEmptyList: 'No students found.',
      stModalAddTitle: 'Add New Student',
      stModalEditTitle: 'Edit Student Details',
      stFormMaHs: 'Student ID *',
      stFormHoTen: 'Full Name *',
      stFormGioiTinh: 'Gender',
      stFormTo: 'Group',
      stFormNgaySinh: 'Date of Birth',
      stFormGhiChu: 'Notes',
      stBtnCancel: 'Cancel',
      stBtnSave: 'Save',
      stMsgSaved: 'Student information saved!',
      stMsgDeleted: 'Student deleted.',
      stMsgConfirmDelete: 'Delete student "{name}"? This action cannot be undone.',
      stMsgImportSuccess: 'Successfully imported {count} students from file!',

      // ── Seating Page ──
      sePageTitle: 'Classroom Seating Chart',
      seRandomize: '🎲 Randomize',
      seSave: '💾 Save Layout',
      seBlackboard: '🖊️ Blackboard',
      seTeacherDesk: '📋 Teacher\'s Desk',
      seDay: 'Row',
      seBan: 'Desk',
      seLeft: 'Left',
      seRight: 'Right',
      seEmptySeat: '(Empty)',
      seLegendTo1: 'Group 1',
      seLegendTo2: 'Group 2',
      seLegendTo3: 'Group 3',
      seLegendTo4: 'Group 4',
      seLegendEmpty: 'Empty',
      seGoiTenTitle: '🎤 Random Student Picker',
      seGoiTenFrom: 'Pick from:',
      seGoiTenAll: 'Entire Class',
      seGoiTenBtn: '🎲 Pick Name!',
      seGoiTenCalling: 'Spinning names...',
      seGoiTenResult: 'Selected: {name} (ID: {maHs} - Group {toSo})!',
      seSaveSuccess: 'Seating layout saved and student groups updated!',

      // ── Emulation Page ──
      emPageTitle: 'Emulation & Rankings',
      emWeekPrev: 'Previous Week',
      emWeekNext: 'Next Week',
      emFilterStudent: 'Filter students:',
      emAddScore: '+ Record Points',
      emPersonalRanking: '📊 Individual Rankings (*)',
      emHistoryTitle: '📋 Points History (*)',
      emCriteriaTitle: '⚙️ Criteria Settings',
      emBtnAddCriteria: '+ Add Criteria',
      emModalScoreTitle: 'Record Emulation Points',
      emFormCategory: 'Criteria Category',
      emAllCategories: '-- All Categories --',
      emFormCriteria: 'Criteria',
      emCriteriaSelectDefault: '-- Select criteria or enter points directly --',
      emFormPoints: 'Points (–5 to +5)',
      emFormReason: 'Reason / Note',
      emSaveScoreBtn: 'Save Points',
      emScoreRecorded: 'Points recorded for {count} student(s) successfully!',
      emNoHistory: 'No points recorded for this week.',
      emModalCriteriaTitle: 'Add New Emulation Criteria',
      emCriteriaCategoryLabel: 'Category (1 of 6 fixed groups) *',
      emCriteriaNameLabel: 'Criteria Name *',
      emCriteriaPointsLabel: 'Default Points (–5 to +5) *',
      emCriteriaSaved: 'New criteria added.',
      emCriteriaDeleted: 'Criteria deleted.',
      emDeleteScoreConfirm: 'Delete this score entry? Week total will be recalculated.',

      // ── 6 Fixed Criteria Groups ──
      cat1: '1. Punctuality & Attendance',
      cat2: '2. Discipline & Rules',
      cat3: '3. Hygiene & Cleanliness',
      cat4: '4. Demeanor & Uniform',
      cat5: '5. Responsibility & Behavior',
      cat6: '6. Academics',

      // ── Rank Tiers ──
      tierDiamond: 'Diamond',
      tierGold: 'Gold',
      tierSilver: 'Silver',
      tierBronze: 'Bronze',
      tierIron: 'Iron',

      // ── Settings Page ──
      setPageTitle: 'System Settings',
      setClassInfo: '📚 Class & Homeroom Teacher Information',
      setClassName: 'Class Name *',
      setSchoolYear: 'School Year *',
      setTeacherName: 'Homeroom Teacher (GVCN) *',
      setBtnSaveClass: '💾 Save Class Info',
      setClassSaved: 'Class and teacher information saved successfully.',
      setEmulationHeader: '🏆 Emulation Settings',
      setPrivacyTitle: 'Privacy Mode',
      setPrivacyDesc: 'On: students only see their own score history; Off: transparent for whole class',
      setPrivacyOn: 'Privacy Mode: ON.',
      setPrivacyOff: 'Privacy Mode: OFF.',
      setSecurityTitle: '🔐 Data & Restore',
      setResetTitle: 'Restore Original Seed Data (Reset Default)',
      setResetDesc: 'Restore all 24 students, emulation points, and seating chart back to the default prototype state.',
      setBtnReset: '🔄 Restore Default Data',
      setResetConfirm: 'Are you sure you want to restore default seed data? All custom modifications will be refreshed.',
      setResetSuccess: 'Default data restored successfully!',
      setSysInfoTitle: 'ℹ️ System Information',
      setVersion: 'Version',
      setMode: 'Operating Mode',
      setModeValue: 'Standalone Prototype (Embedded Data)',
      setStudentNotice: '🔒 Only teachers have permission to modify settings on this page.',

      // ── Student Picker Component (1) ──
      pickerPlaceholder: 'Search (Name, Student ID, Group)...',
      pickerSelectAll: 'Select All',
      pickerDeselectAll: 'Deselect All',
      pickerNoResult: 'No matching students found',
    }
  };

  let currentLang = 'vi';
  try {
    currentLang = localStorage.getItem('sochunhiem_lang') || 'vi';
  } catch (_) {}

  const listeners = [];

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (lang !== 'vi' && lang !== 'en') return;
    currentLang = lang;
    try {
      localStorage.setItem('sochunhiem_lang', lang);
    } catch (_) {}
    document.documentElement.lang = lang;
    listeners.forEach(fn => fn(lang));
  }

  function toggleLang() {
    const next = currentLang === 'vi' ? 'en' : 'vi';
    setLang(next);
    return next;
  }

  function t(key, params = {}) {
    const dict = translations[currentLang] || translations.vi;
    let text = dict[key] || translations.vi[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return text;
  }

  function onLangChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function translateTier(tierName) {
    const map = {
      'Kim cương': 'tierDiamond',
      'Vàng': 'tierGold',
      'Bạc': 'tierSilver',
      'Đồng': 'tierBronze',
      'Sắt': 'tierIron',
    };
    const key = map[tierName];
    return key ? t(key) : tierName;
  }

  function translateCategory(catName) {
    const map = {
      '1. Giờ giấc - chuyên cần': 'cat1',
      'Giờ giấc - chuyên cần': 'cat1',
      '2. Nội quy - trật tự': 'cat2',
      'Nội quy - trật tự': 'cat2',
      '3. Vệ sinh': 'cat3',
      'Vệ sinh': 'cat3',
      '4. Tác phong - trang phục': 'cat4',
      'Tác phong - trang phục': 'cat4',
      '5. Trách nhiệm - ứng xử': 'cat5',
      'Trách nhiệm - ứng xử': 'cat5',
      '6. Học tập': 'cat6',
      'Học tập': 'cat6',
    };
    const key = map[catName];
    return key ? t(key) : catName;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', t(key));
    });
  }

  const i18n = {
    translations,
    getLang,
    setLang,
    toggleLang,
    t,
    onLangChange,
    translateTier,
    translateCategory,
    applyTranslations
  };

  root.i18n = i18n;
})(typeof window !== 'undefined' ? window : this);
