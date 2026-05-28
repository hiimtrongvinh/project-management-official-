export const db = {
    // 1. BẢNG ACCOUNT: Trục liên kết trung tâm (ID số nguyên tự tăng)
    accounts: [
        // Accounts cho Nhân sự 
        { id: 1, email: "anh.ht@eteck.vn", password: "123", role: "admin" },
        { id: 2, email: "linh.ntk@eteck.vn", password: "nhansu123", role: "staff" },
        { id: 3, email: "dieu.plh@eteck.vn", password: "123", role: "admin" },
        { id: 4, email: "quan.dm@eteck.vn", password: "nhansu123", role: "staff" },
        { id: 5, email: "nam.lh@eteck.vn", password: "nhansu123", role: "staff" },
        { id: 6, email: "thao.btp@eteck.vn", password: "nhansu123", role: "staff" },
        { id: 7, email: "thanh.tc@eteck.vn", password: "nhansu123", role: "staff" },
        { id: 8, email: "khoi.dtm@eteck.vn", password: "123", role: "admin" },
        { id: 9, email: "chi.vm@eteck.vn", password: "nhansu123", role: "staff" },
        { id: 10, email: "hiimtrongvinh@gmail.com", password: "nhansu123", role: "staff" },

        // Accounts cho Khách hàng
        { id: 11, email: "contact@reginamiracle.vn", password: "123", role: "client" },
        { id: 12, email: "info@greatstar.com.vn", password: "123", role: "client" },
        { id: 13, email: "infra@haengsung.com", password: "123", role: "client" },
        { id: 14, email: "admin.hp@lgdisplay.com", password: "123", role: "client" },
        { id: 15, email: "office@samsung.com", password: "123", role: "client" },
        { id: 16, email: "support@tesa.com", password: "123", role: "client" },
        { id: 17, email: "pjm.vn@antolin.com", password: "123", role: "client" },
        { id: 18, email: "management@deepc.vn", password: "123", role: "client" },
        { id: 19, email: "info@polarium.com", password: "123", role: "client" },
        { id: 20, email: "nguyenvanan@gmail.com", password: "123", role: "client" },

        // Accounts cho Nhà cung cấp 
        { id: 21, email: "sale@vnpt.vn", password: "123", role: "supplier" },
        { id: 22, email: "contact@viettel.com.vn", password: "123", role: "supplier" },
        { id: 23, email: "info@menkar.vn", password: "123", role: "supplier" },
        { id: 24, email: "cskh@fpt.vn", password: "123", role: "supplier" },
        { id: 25, email: "info@capdien.vn", password: "123", role: "supplier" },
        { id: 26, email: "info@techlinks.vn", password: "123", role: "supplier" },
        { id: 27, email: "lienhe@hitron.com", password: "123", role: "supplier" },
    ],

    // 2. BẢNG STAFF: staffID là khóa chính
    staffs: [
        { staffID: "NV001", accId: 1, name: "Hoàng Thế Anh", department: "Ban Giám đốc", role: "Quản lý", email: "anh.ht@eteck.vn", phone: "0988123456", status: "Hoạt động" },
        { staffID: "NV002", accId: 2, name: "Nguyễn Trần Khánh Linh", department: "Phòng Kinh doanh", role: "Nhân viên", email: "linh.ntk@eteck.vn", phone: "0912009988", status: "Hoạt động" },
        { staffID: "NV003", accId: 3, name: "Phan Lê Hoàng Diệu", department: "Phòng Quản trị và Kế toán", role: "Quản lý", email: "dieu.plh@eteck.vn", phone: "0904332211", status: "Hoạt động" },
        { staffID: "NV004", accId: 4, name: "Đặng Minh Quân", department: "Phòng Kỹ thuật", role: "Nhân viên", email: "quan.dm@eteck.vn", phone: "0345678901", status: "Hoạt động" },
        { staffID: "NV005", accId: 5, name: "Lê Hải Nam", department: "Phòng Kỹ thuật", role: "Nhân viên", email: "nam.lh@eteck.vn", phone: "0868112233", status: "Hoạt động" },
        { staffID: "NV006", accId: 6, name: "Bùi Trần Phương Thảo", department: "Phòng Kinh doanh", role: "Nhân viên", email: "thao.btp@eteck.vn", phone: "0707554433", status: "Hoạt động" },
        { staffID: "NV007", accId: 7, name: "Trịnh Công Thành", department: "Phòng Kỹ thuật", role: "Nhân viên", email: "thanh.tc@eteck.vn", phone: "0945667788", status: "Hoạt động" },
        { staffID: "NV008", accId: 8, name: "Đỗ Trí Minh Khôi", department: "Phòng Quản trị và Kế toán", role: "Quản lý", email: "khoi.dtm@eteck.vn", phone: "0936998877", status: "Hoạt động" },
        { staffID: "NV009", accId: 9, name: "Vũ Mai Chi", department: "Phòng Kinh doanh", role: "Nhân viên", email: "chi.vm@eteck.vn", phone: "0888123789", status: "Hoạt động" },
        { staffID: "NV010", accId: 10, name: "Nguyễn Trọng Vinh", department: "Phòng Kỹ thuật", role: "Nhân viên", email: "hiimtrongvinh@gmail.com", phone: "0335736204", status: "Nghỉ việc" }
    ],

    // 3. BẢNG CLIENT: clientID là khóa chính
    clients: [
        { clientID: "KH001", accId: 11, type: "Doanh nghiệp", idNumber: "0201889595", name: "Regina Miracle International Vietnam", email: "contact@reginamiracle.vn", phone: "02253123456", address: "Khu Công nghiệp VSIP Hải Phòng" },
        { clientID: "KH002", accId: 12, type: "Doanh nghiệp", idNumber: "0100109106", name: "GreatStar Industrial Vietnam", email: "info@greatstar.com.vn", phone: "02253123456", address: "Khu Công nghiệp Nam Cầu Kiền, Hải Phòng" },
        { clientID: "KH003", accId: 13, type: "Doanh nghiệp", idNumber: "0304556677", name: "Haengsung Electronics Vietnam", email: "infra@haengsung.com", phone: "02253999888", address: "Khu Công nghiệp Tràng Duệ, Hải Phòng" },
        { clientID: "KH004", accId: 14, type: "Doanh nghiệp", idNumber: "0202334455", name: "LG Display Vietnam HaiPhong", email: "admin.hp@lgdisplay.com", phone: "02253777666", address: "Khu Công nghiệp Tràng Duệ, Hải Phòng" },
        { clientID: "KH005", accId: 15, type: "Doanh nghiệp", idNumber: "0315443322", name: "Samsung Engineering LSP", email: "office@samsung.com", phone: "02253555444", address: "Long Sơn, Bà Rịa - Vũng Tàu" },
        { clientID: "KH006", accId: 16, type: "Doanh nghiệp", idNumber: "0108776655", name: "Tesa Site Hai Phong", email: "support@tesa.com", phone: "02253222111", address: "Khu Công nghiệp DEEP C, Hải Phòng" },
        { clientID: "KH007", accId: 17, type: "Doanh nghiệp", idNumber: "0309112233", name: "Antolin Vietnam", email: "pjm.vn@antolin.com", phone: "02253333444", address: "Tổ hợp Vinfast, Cát Hải, Hải Phòng" },
        { clientID: "KH008", accId: 18, type: "Tổ chức", idNumber: "031094001234", name: "Ban Quản lý Khu Công nghiệp DEEP C", email: "management@deepc.vn", phone: "0912345678", address: "Hải Phòng & Quảng Ninh" },
        { clientID: "KH009", accId: 19, type: "Doanh nghiệp", idNumber: "0200283441", name: "Polarium Vietnam", email: "info@polarium.vn", phone: "02253735138", address: "Khu Công nghiệp DEEP C, Hải Phòng" },
        { clientID: "KH010", accId: 20, type: "Cá nhân", idNumber: "031204005678", name: "Nguyễn Văn An", email: "nguyenvanan@gmail.com", phone: "0123456789", address: "Xã Quyết Thắng, Thành phố Hải Phòng" }
    ],

    // 4. BẢNG SUPPLIER: supplierID là khóa chính
    suppliers: [
        { supplierID: "NC001", accId: 21, idNumber: "0100686174", name: "VNPT Hải Phòng", email: "sale@vnpt.vn", phone: "18001166", address: "Số 4 Lạch Tray, Ngô Quyền, Hải Phòng" },
        { supplierID: "NC002", accId: 22, idNumber: "0100109106", name: "Viettel Hải Phòng", email: "contact@viettel.com.vn", phone: "18008098", address: "Tòa nhà Viettel, Lê Hồng Phong, Hải Phòng" },
        { supplierID: "NC003", accId: 23, idNumber: "0202030405", name: "Công ty TNHH Menkar", email: "info@menkar.vn", phone: "02253505550", address: "Số 447 Quán Rẽ, Mỹ Đức, An Lão, Hải Phòng" },
        { supplierID: "NC004", accId: 24, idNumber: "0201987654", name: "FPT Telecom Hải Phòng", email: "cskh@fpt.vn", phone: "0869020999", address: "KCN Tràng Duệ, An Dương, Hải Phòng" },
        { supplierID: "NC005", accId: 25, idNumber: "0201112233", name: "Công ty TNHH Dây cáp điện Hải Phòng", email: "info@capdien.vn", phone: "0904392288", address: "Hồng Bàng, Hải Phòng" },
        { supplierID: "NC006", accId: 26, idNumber: "0203334445", name: "Công ty TNHH Giải Pháp Techlink", email: "info@techlinks.vn", phone: "0982001363", address: "Lê Chân, Hải Phòng" },
        { supplierID: "NC007", accId: 27, idNumber: "0204445556", name: "Công Ty TNHH Công Nghệ Hitron Việt Nam", email: "lienhe@hitron.com", phone: "02253123456", address: "Số 15, đường 17, KCN VSIP, Thủy Nguyên, Hải Phòng" }
    ]
};