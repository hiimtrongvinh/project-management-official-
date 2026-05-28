export function renderLogin() {
    return `
    <div id="loginScreen" class="min-h-screen flex items-center justify-center relative overflow-hidden">
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
            <!-- Animated gradient orbs -->
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;"></div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-float" style="animation-delay: 3s;"></div>
            
            <!-- Grid pattern overlay -->
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
            
            <!-- Floating particles -->
            <div class="absolute top-[10%] left-[15%] w-2 h-2 bg-blue-400/40 rounded-full animate-float" style="animation-duration: 4s;"></div>
            <div class="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-float" style="animation-duration: 5s; animation-delay: 1s;"></div>
            <div class="absolute bottom-[30%] left-[10%] w-1 h-1 bg-cyan-400/60 rounded-full animate-float" style="animation-duration: 3.5s; animation-delay: 2s;"></div>
            <div class="absolute top-[60%] right-[10%] w-2.5 h-2.5 bg-blue-300/30 rounded-full animate-float" style="animation-duration: 6s; animation-delay: 0.5s;"></div>
            <div class="absolute bottom-[15%] right-[35%] w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-float" style="animation-duration: 4.5s; animation-delay: 3s;"></div>
            <div class="absolute top-[40%] left-[5%] w-1 h-1 bg-cyan-300/50 rounded-full animate-float" style="animation-duration: 5.5s; animation-delay: 1.5s;"></div>
            <div class="absolute top-[80%] left-[40%] w-2 h-2 bg-blue-400/30 rounded-full animate-float" style="animation-duration: 4s; animation-delay: 2.5s;"></div>
            <div class="absolute top-[5%] left-[60%] w-1.5 h-1.5 bg-indigo-300/40 rounded-full animate-float" style="animation-duration: 3s; animation-delay: 4s;"></div>
        </div>

        <!-- Login Card -->
        <div class="relative z-10 w-full max-w-md mx-4 animate-scaleUp">
            <!-- Glass card -->
            <div class="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-3xl p-8 shadow-2xl shadow-black/20">
                
                <!-- Logo & Brand -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4 animate-bounce-sm">
                        <i class="fas fa-chart-line text-white text-2xl"></i>
                    </div>
                    <h1 class="text-3xl font-extrabold text-white tracking-tight">e-Teck</h1>
                    <p class="text-blue-400 text-sm font-semibold -mt-0.5">Projects Management</p>
                    <p class="text-white/40 text-xs mt-2">Hệ thống đặt hàng & quản lý dự án</p>
                </div>

                <!-- Login Form -->
                <div class="space-y-4">
                    <!-- Email Input -->
                    <div class="relative group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative flex items-center">
                            <i class="fas fa-envelope absolute left-4 text-white/30 group-focus-within:text-blue-400 transition-colors"></i>
                            <input id="username" type="text" placeholder="Email đăng nhập"
                                class="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.1] transition-all text-sm font-medium">
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div class="relative group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative flex items-center">
                            <i class="fas fa-lock absolute left-4 text-white/30 group-focus-within:text-blue-400 transition-colors"></i>
                            <input id="password" type="password" placeholder="Mật khẩu"
                                class="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.1] transition-all text-sm font-medium">
                        </div>
                    </div>

                    <!-- Login Button -->
                    <button id="btnLogin"
                        class="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-right-to-bracket"></i>
                            Đăng nhập
                        </span>
                        <!-- Button glow effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </div>

                <!-- Divider -->
                <div class="flex items-center gap-3 my-6">
                    <div class="flex-1 h-px bg-white/10"></div>
                    <span class="text-white/30 text-xs font-medium">hoặc</span>
                    <div class="flex-1 h-px bg-white/10"></div>
                </div>

                <!-- Register Link -->
                <div class="text-center">
                    <p class="text-white/40 text-xs mb-1">Chưa có tài khoản?</p>
                    <a onclick="window.goToDangKyKhachHang()"
                        class="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold cursor-pointer transition-colors">
                        <i class="fas fa-user-plus text-xs"></i>
                        Đăng ký ngay (Khách hàng)
                    </a>
                </div>
            </div>

            <!-- Bottom text -->
            <p class="text-center text-white/20 text-[10px] mt-6 font-medium">
                © 2026 e-Teck Technology • Công ty TNHH Đào tạo và Tích hợp Công nghệ
            </p>
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
        const response = await fetch('http://localhost:3000/api/auth/login', {
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
                const profileRes = await fetch('http://localhost:3000/api/auth/profile', {
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
