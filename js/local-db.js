// =============================================================
// Sổ Chủ Nhiệm — Local Database Adapter & Embedded Seed Data
// Chạy 100% trong trình duyệt (LocalStorage), không cần Supabase
// =============================================================

(function (root) {
  const STORAGE_KEY = 'sochunhiem_proto_data_v2';
  const TERM_START_DATE = '2026-09-07';
  const INITIAL_SCORE = 81;

  // ── Default Embedded Seed Data ────────────────────────────────
  const DEFAULT_SEED_DATA = {
    settings: {
      ten_lop: '6/3',
      nam_hoc: '2026-2027',
      gvcn: 'Cô Nguyễn Thị Mai',
      che_do_rieng_tu: 'false',
      tuan_bat_dau: '2026-09-07',
      announcement: 'Chào mừng các em học sinh bước vào năm học mới 2026-2027! Hãy cùng nhau thi đua thật tốt nhé.',
    },

    students: [
      // Tổ 1 (to_so = 1)
      { id: 'hs-6301', ma_hs: '6301', ho_ten: 'Nguyễn Minh Anh',  gioi_tinh: 'Nữ',  to_so: 1, ngay_sinh: '2014-03-15', ghi_chu: 'Lớp trưởng' },
      { id: 'hs-6302', ma_hs: '6302', ho_ten: 'Trần Văn Bình',    gioi_tinh: 'Nam', to_so: 1, ngay_sinh: '2014-05-20', ghi_chu: '' },
      { id: 'hs-6303', ma_hs: '6303', ho_ten: 'Lê Thị Cẩm',      gioi_tinh: 'Nữ',  to_so: 1, ngay_sinh: '2014-08-11', ghi_chu: 'Tổ trưởng Tổ 1' },
      { id: 'hs-6304', ma_hs: '6304', ho_ten: 'Phạm Đức Dũng',   gioi_tinh: 'Nam', to_so: 1, ngay_sinh: '2014-01-25', ghi_chu: '' },
      { id: 'hs-6305', ma_hs: '6305', ho_ten: 'Hoàng Thị Em',    gioi_tinh: 'Nữ',  to_so: 1, ngay_sinh: '2014-11-04', ghi_chu: '' },
      { id: 'hs-6306', ma_hs: '6306', ho_ten: 'Vũ Minh Phú',     gioi_tinh: 'Nam', to_so: 1, ngay_sinh: '2014-09-18', ghi_chu: '' },

      // Tổ 2 (to_so = 2)
      { id: 'hs-6307', ma_hs: '6307', ho_ten: 'Đặng Thị Giang',  gioi_tinh: 'Nữ',  to_so: 2, ngay_sinh: '2014-04-12', ghi_chu: 'Lớp phó học tập' },
      { id: 'hs-6308', ma_hs: '6308', ho_ten: 'Bùi Văn Hải',     gioi_tinh: 'Nam', to_so: 2, ngay_sinh: '2014-07-29', ghi_chu: '' },
      { id: 'hs-6309', ma_hs: '6309', ho_ten: 'Ngô Thị Hoa',     gioi_tinh: 'Nữ',  to_so: 2, ngay_sinh: '2014-10-03', ghi_chu: 'Tổ trưởng Tổ 2' },
      { id: 'hs-6310', ma_hs: '6310', ho_ten: 'Đinh Văn Khoa',   gioi_tinh: 'Nam', to_so: 2, ngay_sinh: '2014-02-14', ghi_chu: '' },
      { id: 'hs-6311', ma_hs: '6311', ho_ten: 'Trịnh Thị Lan',   gioi_tinh: 'Nữ',  to_so: 2, ngay_sinh: '2014-12-09', ghi_chu: '' },
      { id: 'hs-6312', ma_hs: '6312', ho_ten: 'Lý Minh Mạnh',    gioi_tinh: 'Nam', to_so: 2, ngay_sinh: '2014-06-30', ghi_chu: '' },

      // Tổ 3 (to_so = 3)
      { id: 'hs-6313', ma_hs: '6313', ho_ten: 'Phan Thị Ngọc',   gioi_tinh: 'Nữ',  to_so: 3, ngay_sinh: '2014-03-22', ghi_chu: 'Tổ trưởng Tổ 3' },
      { id: 'hs-6314', ma_hs: '6314', ho_ten: 'Đỗ Văn Quân',     gioi_tinh: 'Nam', to_so: 3, ngay_sinh: '2014-08-17', ghi_chu: '' },
      { id: 'hs-6315', ma_hs: '6315', ho_ten: 'Hồ Thị Phương',   gioi_tinh: 'Nữ',  to_so: 3, ngay_sinh: '2014-05-05', ghi_chu: 'Lớp phó phong trào' },
      { id: 'hs-6316', ma_hs: '6316', ho_ten: 'Dương Văn Sang',  gioi_tinh: 'Nam', to_so: 3, ngay_sinh: '2014-11-28', ghi_chu: '' },
      { id: 'hs-6317', ma_hs: '6317', ho_ten: 'Tô Thị Tâm',      gioi_tinh: 'Nữ',  to_so: 3, ngay_sinh: '2014-07-07', ghi_chu: '' },
      { id: 'hs-6318', ma_hs: '6318', ho_ten: 'Cao Minh Tuấn',   gioi_tinh: 'Nam', to_so: 3, ngay_sinh: '2014-09-14', ghi_chu: '' },

      // Tổ 4 (to_so = 4)
      { id: 'hs-6319', ma_hs: '6319', ho_ten: 'Lưu Thị Uyên',    gioi_tinh: 'Nữ',  to_so: 4, ngay_sinh: '2014-01-19', ghi_chu: 'Tổ trưởng Tổ 4' },
      { id: 'hs-6320', ma_hs: '6320', ho_ten: 'Mai Văn Việt',    gioi_tinh: 'Nam', to_so: 4, ngay_sinh: '2014-04-26', ghi_chu: '' },
      { id: 'hs-6321', ma_hs: '6321', ho_ten: 'Chu Thị Xuân',    gioi_tinh: 'Nữ',  to_so: 4, ngay_sinh: '2014-10-15', ghi_chu: '' },
      { id: 'hs-6322', ma_hs: '6322', ho_ten: 'Kiều Văn Yên',    gioi_tinh: 'Nam', to_so: 4, ngay_sinh: '2014-06-08', ghi_chu: '' },
      { id: 'hs-6323', ma_hs: '6323', ho_ten: 'Trương Thị Yến',  gioi_tinh: 'Nữ',  to_so: 4, ngay_sinh: '2014-12-25', ghi_chu: '' },
      { id: 'hs-6324', ma_hs: '6324', ho_ten: 'Võ Minh Đức',     gioi_tinh: 'Nam', to_so: 4, ngay_sinh: '2014-02-03', ghi_chu: '' },
    ],

    // 6 Fixed Categories with sample criteria
    criteria: [
      { id: 'tc-1', nhom: '1. Giờ giấc - chuyên cần', ten: 'Đi học đúng giờ', diem_mac_dinh: 1, loai: 'cong' },
      { id: 'tc-2', nhom: '1. Giờ giấc - chuyên cần', ten: 'Đi học trễ', diem_mac_dinh: -1, loai: 'tru' },
      { id: 'tc-3', nhom: '2. Nội quy - trật tự', ten: 'Giữ trật tự tốt trong giờ học', diem_mac_dinh: 1, loai: 'cong' },
      { id: 'tc-4', nhom: '2. Nội quy - trật tự', ten: 'Mất trật tự / Làm việc riêng', diem_mac_dinh: -1, loai: 'tru' },
      { id: 'tc-5', nhom: '3. Vệ sinh', ten: 'Trực nhật lớp sạch sẽ', diem_mac_dinh: 1, loai: 'cong' },
      { id: 'tc-6', nhom: '3. Vệ sinh', ten: 'Xả rác bừa bãi / Không trực nhật', diem_mac_dinh: -1, loai: 'tru' },
      { id: 'tc-7', nhom: '4. Tác phong - trang phục', ten: 'Mặc đồng phục đúng quy định', diem_mac_dinh: 1, loai: 'cong' },
      { id: 'tc-8', nhom: '4. Tác phong - trang phục', ten: 'Sai đồng phục / Không đeo khăn quàng', diem_mac_dinh: -1, loai: 'tru' },
      { id: 'tc-9', nhom: '5. Trách nhiệm - ứng xử', ten: 'Nhiệt tình giúp đỡ bạn bè', diem_mac_dinh: 1, loai: 'cong' },
      { id: 'tc-10', nhom: '5. Trách nhiệm - ứng xử', ten: 'Nói tục / Thiếu lễ phép', diem_mac_dinh: -2, loai: 'tru' },
      { id: 'tc-11', nhom: '6. Học tập', ten: 'Tích cực phát biểu xây dựng bài', diem_mac_dinh: 1, loai: 'cong' },
      { id: 'tc-12', nhom: '6. Học tập', ten: 'Đạt điểm 9, 10 kiểm tra miệng', diem_mac_dinh: 2, loai: 'cong' },
      { id: 'tc-13', nhom: '6. Học tập', ten: 'Không làm bài tập về nhà', diem_mac_dinh: -1, loai: 'tru' },
    ],

    // Seating layout: 4 rows x 6 double desks (left & right)
    seating: {
      // Row 1 (Tổ 1)
      'day1_ban1_trai': 'hs-6301', 'day1_ban1_phai': 'hs-6302',
      'day1_ban2_trai': 'hs-6303', 'day1_ban2_phai': 'hs-6304',
      'day1_ban3_trai': 'hs-6305', 'day1_ban3_phai': 'hs-6306',
      'day1_ban4_trai': null,      'day1_ban4_phai': null,
      'day1_ban5_trai': null,      'day1_ban5_phai': null,
      'day1_ban6_trai': null,      'day1_ban6_phai': null,

      // Row 2 (Tổ 2)
      'day2_ban1_trai': 'hs-6307', 'day2_ban1_phai': 'hs-6308',
      'day2_ban2_trai': 'hs-6309', 'day2_ban2_phai': 'hs-6310',
      'day2_ban3_trai': 'hs-6311', 'day2_ban3_phai': 'hs-6312',
      'day2_ban4_trai': null,      'day2_ban4_phai': null,
      'day2_ban5_trai': null,      'day2_ban5_phai': null,
      'day2_ban6_trai': null,      'day2_ban6_phai': null,

      // Row 3 (Tổ 3)
      'day3_ban1_trai': 'hs-6313', 'day3_ban1_phai': 'hs-6314',
      'day3_ban2_trai': 'hs-6315', 'day3_ban2_phai': 'hs-6316',
      'day3_ban3_trai': 'hs-6317', 'day3_ban3_phai': 'hs-6318',
      'day3_ban4_trai': null,      'day3_ban4_phai': null,
      'day3_ban5_trai': null,      'day3_ban5_phai': null,
      'day3_ban6_trai': null,      'day3_ban6_phai': null,

      // Row 4 (Tổ 4)
      'day4_ban1_trai': 'hs-6319', 'day4_ban1_phai': 'hs-6320',
      'day4_ban2_trai': 'hs-6321', 'day4_ban2_phai': 'hs-6322',
      'day4_ban3_trai': 'hs-6323', 'day4_ban3_phai': 'hs-6324',
      'day4_ban4_trai': null,      'day4_ban4_phai': null,
      'day4_ban5_trai': null,      'day4_ban5_phai': null,
      'day4_ban6_trai': null,      'day4_ban6_phai': null,
    },

    // Sample score entries for Week 1
    score_entries: [
      { id: 'se-1', student_id: 'hs-6301', tuan: 1, nam_hoc: '2026-2027', so_diem: 2, ly_do: 'Đạt điểm 10 miệng Toán', tieu_chi_id: 'tc-12', created_at: '2026-09-08T08:30:00Z' },
      { id: 'se-2', student_id: 'hs-6307', tuan: 1, nam_hoc: '2026-2027', so_diem: 1, ly_do: 'Phát biểu sôi nổi môn Văn', tieu_chi_id: 'tc-11', created_at: '2026-09-09T09:15:00Z' },
      { id: 'se-3', student_id: 'hs-6315', tuan: 1, nam_hoc: '2026-2027', so_diem: 1, ly_do: 'Chuẩn bị phòng học chu đáo', tieu_chi_id: 'tc-5', created_at: '2026-09-10T07:45:00Z' },
      { id: 'se-4', student_id: 'hs-6319', tuan: 1, nam_hoc: '2026-2027', so_diem: 2, ly_do: 'Giải bài tập khó môn Tiếng Anh', tieu_chi_id: 'tc-12', created_at: '2026-09-11T14:20:00Z' },
      { id: 'se-5', student_id: 'hs-6304', tuan: 1, nam_hoc: '2026-2027', so_diem: -1, ly_do: 'Đi học muộn 15 phút', tieu_chi_id: 'tc-2', created_at: '2026-09-10T07:15:00Z' },
    ],

    // Cache of week total scores
    emulation_scores: []
  };

  class LocalDB {
    constructor() {
      this.data = this._loadData();
      this._ensureInitialScores();
    }

    _loadData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      } catch (e) {
        console.warn('[LocalDB] Could not parse localStorage, resetting to seed data.', e);
      }
      const seed = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
      this._saveData(seed);
      return seed;
    }

    _saveData(data = this.data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('[LocalDB] Failed to save data to localStorage', e);
      }
    }

    _ensureInitialScores() {
      if (!this.data.emulation_scores || this.data.emulation_scores.length === 0) {
        this.recalculateScores(1, '2026-2027');
      }
    }

    resetDefaultData() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
      this.recalculateScores(1, '2026-2027');
      this._saveData();
      return this.data;
    }

    getSettings() {
      return { ...this.data.settings };
    }

    getSetting(key, fallback = '') {
      return this.data.settings[key] ?? fallback;
    }

    saveSetting(key, val) {
      this.data.settings[key] = String(val);
      this._saveData();
    }

    saveSettings(obj) {
      Object.assign(this.data.settings, obj);
      this._saveData();
    }

    getStudents() {
      return [...this.data.students].sort((a, b) => a.to_so - b.to_so || a.ma_hs.localeCompare(b.ma_hs));
    }

    getStudentById(id) {
      return this.data.students.find(s => s.id === id) || null;
    }

    getStudentByMa(maHs) {
      return this.data.students.find(s => s.ma_hs === maHs) || null;
    }

    saveStudent(studentData) {
      const idx = this.data.students.findIndex(s => s.id === studentData.id || s.ma_hs === studentData.ma_hs);
      if (idx >= 0) {
        this.data.students[idx] = { ...this.data.students[idx], ...studentData };
      } else {
        const id = studentData.id || `hs-${studentData.ma_hs || Date.now()}`;
        this.data.students.push({ ...studentData, id });
      }
      this._saveData();
      return true;
    }

    deleteStudent(id) {
      this.data.students = this.data.students.filter(s => s.id !== id);
      Object.keys(this.data.seating).forEach(pos => {
        if (this.data.seating[pos] === id) {
          this.data.seating[pos] = null;
        }
      });
      this.data.score_entries = this.data.score_entries.filter(e => e.student_id !== id);
      this.data.emulation_scores = this.data.emulation_scores.filter(e => e.student_id !== id);
      this._saveData();
      return true;
    }

    importStudents(list) {
      let count = 0;
      list.forEach(item => {
        if (item.ma_hs && item.ho_ten) {
          this.saveStudent(item);
          count++;
        }
      });
      this._saveData();
      return count;
    }

    getSeating() {
      return { ...this.data.seating };
    }

    saveSeating(seatMap) {
      this.data.seating = { ...seatMap };

      Object.entries(seatMap).forEach(([pos, studentId]) => {
        if (studentId) {
          const match = pos.match(/^day(\d+)/);
          if (match) {
            const toSo = parseInt(match[1], 10);
            const st = this.data.students.find(s => s.id === studentId);
            if (st) st.to_so = toSo;
          }
        }
      });

      this._saveData();
      return true;
    }

    getCriteria() {
      return [...this.data.criteria];
    }

    saveCriteria(crit) {
      const id = crit.id || `tc-${Date.now()}`;
      const idx = this.data.criteria.findIndex(c => c.id === id);
      if (idx >= 0) {
        this.data.criteria[idx] = { ...this.data.criteria[idx], ...crit };
      } else {
        this.data.criteria.push({ ...crit, id });
      }
      this._saveData();
      return true;
    }

    deleteCriteria(id) {
      this.data.criteria = this.data.criteria.filter(c => c.id !== id);
      this._saveData();
      return true;
    }

    getRolloverScore(prevScore) {
      if (prevScore >= 91) return 91;
      if (prevScore >= 81) return 81;
      if (prevScore >= 66) return 71;
      if (prevScore >= 50) return 61;
      return 51;
    }

    getTierInfo(score) {
      const s = Math.max(0, Math.min(100, score));
      if (s >= 91) return { name: 'Kim cương', badgeClass: 'badge-kim-cuong' };
      if (s >= 81) return { name: 'Vàng',      badgeClass: 'badge-vang' };
      if (s >= 66) return { name: 'Bạc',       badgeClass: 'badge-bac' };
      if (s >= 50) return { name: 'Đồng',      badgeClass: 'badge-dong' };
      return              { name: 'Sắt',       badgeClass: 'badge-sat' };
    }

    getScoreEntries(week, namHoc) {
      const critMap = {};
      this.data.criteria.forEach(c => { critMap[c.id] = c; });

      return this.data.score_entries
        .filter(e => e.tuan === week && e.nam_hoc === namHoc)
        .map(e => ({
          ...e,
          tieu_chi: critMap[e.tieu_chi_id] || { ten: e.ly_do || 'Điểm điều chỉnh', nhom: 'Khác' }
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    getScores(week, namHoc) {
      let existing = this.data.emulation_scores.filter(s => s.tuan === week && s.nam_hoc === namHoc);
      if (!existing.length) {
        existing = this.recalculateScores(week, namHoc);
      }
      return existing;
    }

    recalculateScores(week, namHoc) {
      const entries = this.data.score_entries.filter(e => e.tuan === week && e.nam_hoc === namHoc);

      const prevScores = week > 1
        ? this.data.emulation_scores.filter(s => s.tuan === week - 1 && s.nam_hoc === namHoc)
        : [];
      const prevMap = {};
      prevScores.forEach(s => { prevMap[s.student_id] = s.diem_cuoi_tuan; });

      const result = this.data.students.map(st => {
        let dDau = INITIAL_SCORE;
        if (week > 1) {
          const prevFinal = prevMap[st.id] ?? INITIAL_SCORE;
          dDau = this.getRolloverScore(prevFinal);
        }

        const stEntries = entries.filter(e => e.student_id === st.id);
        const delta = stEntries.reduce((sum, e) => sum + e.so_diem, 0);
        const dCuoi = Math.max(0, Math.min(100, dDau + delta));

        return {
          student_id: st.id,
          tuan: week,
          nam_hoc: namHoc,
          diem_dau_tuan: dDau,
          diem_cuoi_tuan: dCuoi,
        };
      });

      this.data.emulation_scores = this.data.emulation_scores
        .filter(s => !(s.tuan === week && s.nam_hoc === namHoc))
        .concat(result);

      this._saveData();
      return result;
    }

    addScoreEntry({ studentId, week, namHoc, points, reason, criteriaId }) {
      const entry = {
        id: `se-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        student_id: studentId,
        tuan: week,
        nam_hoc: namHoc,
        so_diem: Number(points),
        ly_do: reason || '',
        tieu_chi_id: criteriaId || null,
        created_at: new Date().toISOString(),
      };
      this.data.score_entries.push(entry);
      this.recalculateScores(week, namHoc);
      this._saveData();
      return entry;
    }

    deleteScoreEntry(id) {
      const entry = this.data.score_entries.find(e => e.id === id);
      if (!entry) return false;
      const { tuan, nam_hoc } = entry;
      this.data.score_entries = this.data.score_entries.filter(e => e.id !== id);
      this.recalculateScores(tuan, nam_hoc);
      this._saveData();
      return true;
    }
  }

  const db = new LocalDB();

  root.TERM_START_DATE = TERM_START_DATE;
  root.INITIAL_SCORE = INITIAL_SCORE;
  root.DEFAULT_SEED_DATA = DEFAULT_SEED_DATA;
  root.db = db;
})(typeof window !== 'undefined' ? window : this);
