// src/pages/dangkikhachhang.js

export function renderDangKyKhachHang() {
    return `
    <div class="h-full flex items-center justify-center -mt-4">
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-5xl flex overflow-hidden border border-gray-100">
            
            <div class="hidden md:flex w-2/5 bg-blue-600 p-8 flex-col justify-between text-white relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
                <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-700 rounded-full opacity-50 blur-2xl"></div>

                <div class="relative z-10">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-3xl shadow-md">📈</div>
                        <div>
                            <h1 class="text-3xl font-bold ">e-Teck</h1>
                            <p class="text-orange-400 text-sm font-bold  -mt-1">Projects</p>
                        </div>
                    </div>
                    <h2 class="text-3xl font-bold uppercase leading-snug mb-3">Cổng thông tin<br>Khách hàng</h2>
                    <p class="text-blue-100 text-base leading-relaxed">
                        Quản lý dự án, theo dõi tiến độ <br> và nhận báo giá chuyên nghiệp từ e-Teck.
                    </p>
                </div>
                
                <div onclick="window.goToLogin()" class="relative z-10 cursor-pointer flex items-center gap-2 text-blue-100 hover:text-white transition w-fit px-4 py-2.5 rounded-xl hover:bg-blue-700 bg-blue-600/50 backdrop-blur-sm">
                    <i class="fas fa-arrow-left"></i> <span>Quay lại đăng nhập</span>
                </div>
            </div>
            
            <div class="w-full md:w-3/5 p-8 flex flex-col justify-center bg-gray-50/50">
                <div class="mb-5">
                    <h3 class="text-2xl font-bold text-gray-800 ">Đăng ký tài khoản</h3>
                    <p class="text-gray-500 text-sm mt-1">Vui lòng khai báo chính xác và đầy đủ các thông tin sau:</p>
                </div>
                
                <div class="grid grid-cols-2 gap-x-5 gap-y-4">
                    
                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Loại khách hàng</label>
                        <div class="relative">
                            <select id="reg-type" class="appearance-none w-full px-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm text-gray-700 cursor-pointer">
                                <option value="Cá nhân">👤 Cá nhân</option>
                                <option value="Doanh nghiệp">🏢 Doanh nghiệp</option>
                                <option value="Tổ chức sự nghiệp">🏛️ Tổ chức sự nghiệp</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <i class="fas fa-chevron-down text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Mã định danh/mã số thuế</label>
                        <input type="text" id="reg-id" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Tên khách hàng *</label>
                        <input type="text" id="reg-name" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Email liên hệ *</label>
                        <input type="email" id="reg-email" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                        <input type="tel" id="reg-phone" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm">
                    </div>

                    <div class="col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                        <input type="text" id="reg-address" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm" >
                    </div>

                    <div class="col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu *</label>
                        <input type="password" id="reg-password" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm" >
                    </div>
                    
                    <div class="col-span-1 flex items-end">
                        <button onclick="window.handleDangKyKhachHang()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30 h-[46px] flex justify-center items-center gap-2">
                            <span>Đăng ký</span> <i class="fas fa-arrow-right text-sm"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>`;
}

export async function handleDangKyKhachHang() {
    const name = document.getElementById('reg-name').value.trim();
    const type = document.getElementById('reg-type').value;
    const idNum = document.getElementById('reg-id').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (!name || !email || !password) {
        alert("Vui lòng điền đầy đủ Tên, Email và Mật khẩu!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, type, id_number: idNum, phone, address })
        });
        const result = await res.json();
        if (result.success) {
            alert(`✅ Đăng ký thành công!\n\nBạn có thể đăng nhập ngay với email: ${email}`);
            goToLogin();
        } else {
            alert('❌ Đăng ký thất bại: ' + (result.error?.message || 'Lỗi không xác định'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
}

export function goToLogin() {
    // Sử dụng cơ chế initApp mới của hệ thống SPA
    if (typeof window.initApp === 'function') {
        window.initApp();
    } else {
        // Fallback an toàn nếu có lỗi
        window.location.reload();
    }
}

// Export cho file main.js gọi được qua window
window.renderDangKyKhachHang = renderDangKyKhachHang;
window.goToLogin = goToLogin;
window.handleDangKyKhachHang = handleDangKyKhachHang;