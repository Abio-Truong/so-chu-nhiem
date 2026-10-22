# 📒 Sổ Chủ Nhiệm — Classroom Management Log

> A modern, responsive web application for homeroom teachers and students.  
> **Standalone Prototype** with pre-loaded embedded data, real-time **English 🇬🇧 / Tiếng Việt 🇻🇳** bilingual support, and an instant **Teacher / Student** role switcher.

---

## 🇬🇧 English Overview

### ✨ Prototype Highlights

- 💾 **Pre-loaded Embedded Data (`js/local-db.js`)**: Comes with 24 pre-configured students (Class 6/3 divided into 4 groups), 48 double-desk seating spots, emulation criteria across 6 fixed groups, and initial scores. Persisted in `LocalStorage` with a one-click **"Reset Default Data"** button.
- 👨‍🏫 **Instant Role Switcher on Navbar**:
  - `[ 👨‍🏫 Teacher ]`: Full administrative access to add/edit/delete students, drag-and-drop seating chart, award/deduct emulation points, customize criteria, and update announcements.
  - `[ 🎓 Student ▾ ]`: Read-only student view with an identity dropdown to test the student experience and privacy mode restrictions.
- 🌐 **Real-time Bilingual Support**: Toggle between **English 🇬🇧** and **Tiếng Việt 🇻🇳** anytime using the `[ 🌐 EN | VI ]` button on the navigation bar.
- 🛡️ **Strict Guardrail Compliance**: 100% client-side static application. Does not use your local machine as a server or database.

---

### 📱 5 Feature Modules

| Page | Features & Capabilities |
|------|-------------------------|
| 🏠 **Overview (`overview.html`)** | Class info (Class 6/3, School Year 2026-2027, Homeroom Teacher: Cô Nguyễn Thị Mai), key metrics (total students, current week calculated from Sept 7, 2026, leading group, today's score activity), 4-Group rankings, Top 5 weekly students, and teacher announcement board. |
| 👥 **Students (`students.html`)** | Complete student roster with tier badges (Diamond, Gold, Silver, Bronze, Iron). **Smart Search (1)** brings matching students to the top of the table with highlight styles without truncating the rest. Teacher can add/edit/delete students, **import from Excel/CSV** via SheetJS, and **export to Excel (`.xlsx`)**. |
| 🗺️ **Seating Chart (`seating.html`)** | Authentic classroom layout: Blackboard at the top, Teacher Desk at the top-left corner, and 4 group rows with 6 double desks each (48 total spots). Teacher can drag-and-drop students between seats, automatically updating group affiliation upon saving. Features **Random Seat Shuffle** and a **Random Student Picker** wheel. |
| 🏆 **Emulation & Ranking (`emulation.html`)** | **Weekly Score Rollover Engine**: Students start at 81 pts (Gold); week $n+1$ baseline rolls over based on week $n$ tier (Diamond $\rightarrow$ 91, Gold $\rightarrow$ 81, Silver $\rightarrow$ 71, Bronze $\rightarrow$ 61, Iron $\rightarrow$ 51). Emulation scoring based on 6 fixed criteria groups with -5 to +5 adjustment points. Tie-handling rankings and audit history. |
| ⚙️ **Settings (`settings.html`)** | Edit class name, academic year, and teacher name. Toggle student privacy mode. Includes a **"Reset Default Data"** button to restore initial sample data anytime. |

---

## 📁 Project Structure / Cấu Trúc Thư Mục

```
my-first-project/
├── index.html              # Entry point (auto-redirects to pages/overview.html)
├── pages/
│   ├── overview.html       # Page 1: Overview Dashboard
│   ├── students.html       # Page 2: Students & Profiles
│   ├── seating.html        # Page 3: Seating Chart (4x6 double desks)
│   ├── emulation.html      # Page 4: Emulation & Rollover Scoring
│   ├── settings.html       # Page 5: System Settings & Reset Data
│   └── login.html          # Fallback Login Page
├── css/
│   ├── shared.css          # Design system, Navbar switchers, role styles
│   ├── overview.css
│   ├── students.css
│   ├── seating.css
│   ├── emulation.css
│   └── settings.css
├── js/
    ├── i18n.js             # Bilingual EN/VI Dictionary & translation helpers
    ├── local-db.js         # Embedded seed data & LocalStorage engine
    ├── auth.js             # Client-side Role & Identity Manager
    ├── nav.js              # Navbar with Role & Language Switchers
    ├── student-picker.js   # Reusable student search & autocomplete component (1)
    ├── overview.js
    ├── students.js
    ├── seating.js
    ├── emulation.js
    ├── settings.js
    └── login.js

```

---

## 🇻🇳 Mô Tả Tiếng Việt

### ✨ Điểm Nổi Bật của Bản Prototype

- 💾 **Dữ Liệu Nhúng Sẵn Trong Mã Nguồn (`js/local-db.js`)**: Sẵn sàng 24 học sinh lớp 6/3 (chia 4 tổ), 48 vị trí ghế ngồi, tiêu chí thi đua thuộc 6 nhóm lớn và điểm số tuần. Dữ liệu lưu trong `LocalStorage`, có nút **"Khôi phục dữ liệu gốc"** bất kỳ lúc nào.
- 👨‍🏫 **Bộ Chuyển Đổi Vai Trò trên Menu (Role Switcher)**:
  - `[ 👨‍🏫 Giáo viên ]`: Toàn quyền thêm, sửa, xoá học sinh, kéo thả sơ đồ lớp, ghi nhận điểm, cài đặt tiêu chí và lưu thông báo.
  - `[ 🎓 Học sinh ▾ ]`: Chế độ chỉ đọc, có danh sách chọn cụ thể từng học sinh để kiểm tra tính năng bảo mật riêng tư.
- 🌐 **Hỗ Trợ Song Ngữ (VI 🇻🇳 / EN 🇬🇧)**: Nút `[ 🌐 EN | VI ]` chuyển đổi toàn bộ nhãn giao diện, bảng xếp hạng, danh hiệu Mức và 6 nhóm tiêu chí thi đua theo thời gian thực.
- 🛡️ **Tuân Thủ Tuyệt Đối Quy Tắc Guardrails**: Hoạt động 100% phía trình duyệt (Client-side), không biến máy tính cá nhân thành máy chủ.

---

### 📱 5 Phân Hệ Tính Năng

| Trang | Mô tả chi tiết tính năng |
|-------|--------------------------|
| 🏠 **Tổng quan (`overview.html`)** | Thông tin lớp 6/3, niên khóa 2026-2027, GVCN; thẻ thống kê sĩ số, tuần hiện tại (tính từ 07/09/2026), tổ dẫn đầu, thi đua hôm nay; bảng xếp hạng 4 tổ; Top 5 học sinh xuất sắc; nhận xét & thông báo của giáo viên. |
| 👥 **Học sinh (`students.html`)** | Danh sách lớp đầy đủ, cột **Mức** danh hiệu (Kim cương, Vàng, Bạc, Đồng, Sắt); tìm kiếm thông minh (1) **đưa học sinh khớp lên đầu bảng** có viền sáng; nhập danh sách từ file Excel/CSV và xuất danh sách ra file `.xlsx`. |
| 🗺️ **Sơ đồ chỗ ngồi (`seating.html`)** | Bố cục lớp học chuẩn thực tế: Bảng ở trên, Bàn GV ở góc trên bên trái, 4 dãy bàn đôi (mỗi dãy 6 bàn = 48 chỗ); kéo thả chỗ ngồi tự động cập nhật Tổ; xếp ngẫu nhiên và vòng quay **Gọi tên học sinh**. |
| 🏆 **Thi đua (`emulation.html`)** | Động cơ **Rollover điểm tuần** theo 5 mức (Kim cương 91, Vàng 81, Bạc 71, Đồng 61, Sắt 51); ghi điểm cộng/trừ (-5 đến +5) theo **6 nhóm tiêu chí cố định**; xếp hạng đồng hạng và lịch sử điểm chi tiết. |
| ⚙️ **Cài đặt (`settings.html`)** | Cập nhật tên lớp, niên khóa, tên GVCN; bật/tắt chế độ riêng tư cho học sinh; nút **Khôi phục dữ liệu mẫu gốc**. |

