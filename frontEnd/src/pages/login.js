export function renderLogin() {
    return `
    <div id="loginScreen" class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50/50">
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-slate-50/50">
            <!-- Animated gradient orbs -->
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;"></div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-float" style="animation-delay: 3s;"></div>
            
            <!-- Grid pattern overlay -->
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(59,130,246,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
            
            <!-- Floating particles -->
            <div class="absolute top-[10%] left-[15%] w-2 h-2 bg-blue-400/30 rounded-full animate-float" style="animation-duration: 4s;"></div>
            <div class="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-float" style="animation-duration: 5s; animation-delay: 1s;"></div>
            <div class="absolute bottom-[30%] left-[10%] w-1 h-1 bg-cyan-400/50 rounded-full animate-float" style="animation-duration: 3.5s; animation-delay: 2s;"></div>
        </div>

        <!-- Login Card Container -->
        <div class="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-gray-100 animate-scaleUp">
            
            <!-- Left Panel: Branding and Slogan -->
            <div class="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900 p-10 flex-col justify-between text-white border-r border-blue-700/20 relative overflow-hidden">
                <!-- Floating shapes for left panel -->
                <div class="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div class="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
                
                <div class="relative z-10 my-auto">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-sm">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <h1 class="text-4xl font-bold text-white leading-none">e-Teck</h1>
                            <p class="text-white text-base font-bold mt-1 ">Projects</p>
                        </div>
                    </div>
                    <p class="text-white text-2xl font-semibold uppercase leading-relaxed">
                        Hệ thống đặt hàng <br/>và quản lý dự án
                    </p>
                </div>
                
                <div class="relative z-10 text-white/40 text-xs font-semibold">
                    © 2026 e-Teck Technology
                </div>
            </div>
            
            <!-- Right Panel: Login Form and Navigation -->
            <div class="w-full md:w-3/5 p-10 flex flex-col justify-center bg-gray-50/20">
                <div class="mb-8">
                    <!-- Mobile Logo (shown only when left panel is hidden) -->
                    <div class="flex md:hidden items-center gap-3 mb-6">
                        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <span class="text-xl font-bold text-blue-600">e-Teck</span>
                            <span class="text-blue-600 text-[10px] block font-bold -mt-1 leading-none">Projects</span>
                        </div>
                    </div>
                    
                    <h3 class="text-2xl font-bold text-gray-800 ">Đăng nhập hệ thống</h3>
                </div>
                
                <!-- Login Form -->
                <div class="space-y-5">
                    <!-- Email Input -->
                    <div class="relative group">
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Email đăng nhập</label>
                        <div class="relative flex items-center">
                            <i class="fas fa-envelope absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                            <input id="username" type="text" 
                                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold">
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div class="relative group">
                        <div class="flex justify-between items-center mb-1.5">
                            <label class="block text-xs font-bold text-gray-500 uppercase">Mật khẩu</label>
                            <a onclick="window.showQuenMatKhauModal()" class="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">Quên mật khẩu?</a>
                        </div>
                        <div class="relative flex items-center">
                            <i class="fas fa-lock absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                            <input id="password" type="password" 
                                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold">
                        </div>
                    </div>

                    <!-- Login Button -->
                    <button id="btnLogin"
                        class="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer border-none">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-right-to-bracket"></i>
                            Đăng nhập
                        </span>
                        <!-- Button glow effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </div>

                <!-- Register Link -->
                <div class="text-center bg-gray-50/50 p-4 ">
                    <p class="text-slate-400 text-xs mb-1.5 font-semibold">Chưa có tài khoản?</p>
                    <a onclick="window.goToDangKyKhachHang()"
                        class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-bold cursor-pointer transition-colors">
                        <i class="fas fa-user-plus text-xs"></i>
                        Đăng ký ngay (Khách hàng)
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Forgot Password Modal -->
    <div id="quenMatKhauModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md mx-4 p-8 rounded-3xl shadow-2xl border border-gray-100 animate-scaleUp relative">
            <button onclick="window.hideQuenMatKhauModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-xl">
                <i class="fas fa-times"></i>
            </button>
            
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h3>
            <p class="text-xs text-gray-500 mb-6">Xác nhận email và số điện thoại đã đăng ký để đặt mật khẩu mới.</p>
            
            <div class="space-y-4">
                <div class="relative group">
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase font-semibold">Email tài khoản</label>
                    <div class="relative flex items-center">
                        <i class="fas fa-envelope absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                        <input id="resetEmail" type="email" placeholder="example@eteck.vn"
                            class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold">
                    </div>
                </div>
                
                <div class="relative group">
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase font-semibold">Số điện thoại xác thực</label>
                    <div class="relative flex items-center">
                        <i class="fas fa-phone absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                        <input id="resetPhone" type="text" placeholder="09xxxxxxx"
                            class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold">
                    </div>
                </div>
                
                <div class="relative group">
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase font-semibold">Mật khẩu mới</label>
                    <div class="relative flex items-center">
                        <i class="fas fa-lock absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                        <input id="resetNewPassword" type="password" placeholder="Tối thiểu 6 ký tự"
                            class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold">
                    </div>
                </div>
                
                <button id="btnSubmitReset" onclick="window.handleForgotPasswordSubmit()"
                    class="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer border-none">
                    <span class="flex items-center justify-center gap-2">
                        <i class="fas fa-key"></i>
                        Cập nhật mật khẩu mới
                    </span>
                </button>
            </div>
        </div>
    </div>
    `;
}

export async function handleLogin() {
    const email = (document.getElementById('username')?.value || '').trim();
    const password = (document.getElementById('password')?.value || '').trim();

    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        return;
    }

    // Show loading state
    const btn = document.getElementById('btnLogin');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('authEmail', result.data.user.email);
            localStorage.setItem('authRole', result.data.user.role);
            localStorage.setItem('authAccId', String(result.data.user.id));
            localStorage.setItem('authLoggedInAt', new Date().toISOString());

            try {
                const profileRes = await fetch('/api/auth/profile', {
                    headers: { 'Authorization': `Bearer ${result.data.token}` }
                });
                const profileResult = await profileRes.json();
                if (profileResult.success) {
                    const prof = profileResult.data;
                    if (prof.supplier_id) localStorage.setItem('supplierId', String(prof.supplier_id));
                    if (prof.client_id) localStorage.setItem('clientId', String(prof.client_id));
                    if (prof.staff_id) localStorage.setItem('staffId', String(prof.staff_id));
                    if (prof.name) localStorage.setItem('authName', prof.name);
                }
            } catch (e) {
                console.error("Không thể tải thông tin hồ sơ chi tiết:", e);
            }

            // Success animation before redirect
            btn.innerHTML = '<i class="fas fa-check"></i> Thành công!';
            btn.classList.remove('from-blue-500', 'to-indigo-600');
            btn.classList.add('from-emerald-500', 'to-emerald-600');

            setTimeout(() => {
                if (typeof window.initApp === 'function') window.initApp();
            }, 500);
        } else {
            btn.innerHTML = originalText;
            btn.disabled = false;

            // Shake animation on error
            const card = btn.closest('.backdrop-blur-xl');
            if (card) {
                card.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => card.style.animation = '', 500);
            }
            alert('❌ Đăng nhập thất bại: ' + (result.error?.message || 'Sai tài khoản hoặc mật khẩu.'));
        }
    } catch (error) {
        btn.innerHTML = originalText;
        btn.disabled = false;
        console.error("Lỗi khi kết nối đến máy chủ:", error);
        alert('❌ Có lỗi kết nối đến máy chủ. Vui lòng kiểm tra lại Back-end.');
    }
}

export function attachLoginEvents() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', handleLogin);
    }

    document.addEventListener('keydown', function enterListener(event) {
        const loginScreen = document.getElementById('loginScreen');
        if (event.key === 'Enter' && loginScreen) {
            event.preventDefault();
            handleLogin();
        }
    });
}

// Global window helpers for Forgot Password modal
window.showQuenMatKhauModal = function() {
    const modal = document.getElementById('quenMatKhauModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.hideQuenMatKhauModal = function() {
    const modal = document.getElementById('quenMatKhauModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.handleForgotPasswordSubmit = async function() {
    const email = (document.getElementById('resetEmail')?.value || '').trim();
    const phone = (document.getElementById('resetPhone')?.value || '').trim();
    const newPassword = (document.getElementById('resetNewPassword')?.value || '').trim();

    if (!email || !phone || !newPassword) {
        alert('Vui lòng nhập đầy đủ các trường thông tin.');
        return;
    }

    if (newPassword.length < 6) {
        alert('Mật khẩu mới phải có tối thiểu 6 ký tự.');
        return;
    }

    const btn = document.getElementById('btnSubmitReset');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, newPassword })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('🎉 Đặt lại mật khẩu thành công! Thông báo đã được gửi về cho Quản trị viên (Admin).');
            window.hideQuenMatKhauModal();
            // Clear inputs
            document.getElementById('resetEmail').value = '';
            document.getElementById('resetPhone').value = '';
            document.getElementById('resetNewPassword').value = '';
        } else {
            alert('❌ Thất bại: ' + (result.error?.message || 'Có lỗi xảy ra.'));
        }
    } catch (error) {
        console.error("Lỗi khôi phục mật khẩu:", error);
        alert('❌ Lỗi kết nối đến máy chủ.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};
