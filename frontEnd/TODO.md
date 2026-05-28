# TODO
- [ ] Refactor: tách `login/logout/getAuthRole` và `loginScreen` render/logic ra `src/pages/login.js`
- [ ] Sửa `src/pages/login.js` (thêm code login/logout + đăng ký `window.login/logout/goToDangKyKhachHang`)
- [ ] Sửa `src/pages/auth.js` (chỉ giữ `getAuthRole`)
- [ ] Sửa `src/main.js`: import `./pages/login.js`; xóa các định nghĩa `window.login`, `window.logout`, `window.goToDangKyKhachHang` khỏi main
- [ ] Đảm bảo `index.html` vẫn gọi được `login()`/`goToDangKyKhachHang()` (vì login.js gán vào `window`)
- [ ] Chạy kiểm tra thủ công: login/logout và điều hướng theo role

