export function renderTaikhoanNS() {
    setTimeout(loadTaikhoanNSData, 0);

    return `
    <div id="taikhoanNSContainer" class="max-w-5xl mx-auto animate-fadeIn">
        <div class="flex items-center justify-center h-64">
            <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
                    <i class="fas fa-spinner fa-spin text-gray-300"></i>
                </div>
                <p class="text-gray-400 font-medium text-sm">Đang tải thông tin tài khoản...</p>
            </div>
        </div>
    </div>`;
}

async function loadTaikhoanNSData() {
    const container = document.getElementById('taikhoanNSContainer');
    if (!container) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error?.message || 'Không thể lấy thông tin');

        const profile = result.data;
        const name = profile.name || '---';
        const staffID = profile.staff_id || '---';
        const department = profile.department || '---';
        const position = profile.position || (profile.role === 'admin' ? 'Quản lý' : 'Nhân viên');
        const phone = profile.phone || '---';
        const email = profile.email || '---';
        const avatar = profile.avatar || '';
        const role = profile.role;

        const avatarHtml = avatar
            ? `<img src="http://localhost:3000${avatar}" alt="${name}" class="w-full h-full object-cover">`
            : `<span class="text-3xl font-bold text-blue-600">${name.charAt(0).toUpperCase()}</span>`;

        const roleBadge = role === 'admin'
            ? '<span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">Admin</span>'
            : '<span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Nhân viên</span>';

        container.innerHTML = `
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex flex-1 items-center gap-5">
                <!-- Avatar -->
                <div class="relative group">
                    <div id="profileAvatarDisplay" class="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm cursor-pointer animate-scaleUp"
                         onclick="document.getElementById('profileAvatarInput').click()">
                        ${avatarHtml}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] border-2 border-white shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                         onclick="document.getElementById('profileAvatarInput').click()">
                        <i class="fas fa-camera"></i>
                    </div>
                    <input type="file" id="profileAvatarInput" accept="image/png,image/jpeg" class="hidden" onchange="window.handleProfileAvatarUpload(this, '${staffID}')">
                </div>
                
                <!-- Info -->
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        <h1 class="text-xl font-bold text-gray-800 leading-none">${name}</h1>
                        ${roleBadge}
                    </div>
                    <p class="text-gray-500 font-semibold text-xs">${department} • ${position}</p>
                    <p class="text-gray-400 font-medium text-[11px] mt-0.5">${email}</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
                <button onclick="window.toggleProfileEdit()" id="btnEditProfile" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all text-xs font-bold">
                    <i class="fas fa-pen text-xs"></i> Chỉnh sửa
                </button>
                <button onclick="logout()" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all text-xs font-bold">
                    <i class="fas fa-sign-out-alt text-xs"></i> Đăng xuất
                </button>
            </div>
        </div>

        <!-- Content Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Profile Info Card -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeInUp" style="animation-delay: 0.1s; animation-fill-mode: both;">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="font-bold text-gray-800 flex items-center gap-2">
                        <i class="fas fa-user-circle text-blue-500"></i> Thông tin cá nhân
                    </h3>
                    <span class="text-xs text-gray-400 font-medium">${staffID}</span>
                </div>
                
                <div id="profileInfoContent" class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                            <p class="text-base font-semibold text-gray-800" id="displayName">${name}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                            <p class="text-base font-semibold text-gray-800">${email}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                            <p class="text-base font-semibold text-gray-800" id="displayPhone">${phone}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phòng ban</label>
                            <p class="text-base font-semibold text-gray-800" id="displayDept">${department}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chức vụ</label>
                            <p class="text-base font-semibold text-gray-800">${position}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vai trò hệ thống</label>
                            <p class="text-base font-semibold text-gray-800">${role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</p>
                        </div>
                    </div>
                </div>

                <!-- Edit Form (hidden by default) -->
                <div id="profileEditForm" class="p-6 hidden">
                    <form id="formEditProfile" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                            <input type="text" name="name" value="${name}" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                            <input type="email" value="${email}" disabled class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 cursor-not-allowed">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                            <input type="text" name="phone" value="${phone !== '---' ? phone : ''}" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phòng ban</label>
                            <select name="department" ${role !== 'admin' ? 'disabled class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 cursor-not-allowed"' : 'class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium"'}>
                                <option value="Ban Giám đốc" ${department === 'Ban Giám đốc' ? 'selected' : ''}>Ban Giám đốc</option>
                                <option value="Phòng Quản trị và Kế toán" ${department === 'Phòng Quản trị và Kế toán' ? 'selected' : ''}>Phòng Quản trị và Kế toán</option>
                                <option value="Phòng Kinh doanh" ${department === 'Phòng Kinh doanh' ? 'selected' : ''}>Phòng Kinh doanh</option>
                                <option value="Phòng Kỹ thuật" ${department === 'Phòng Kỹ thuật' ? 'selected' : ''}>Phòng Kỹ thuật</option>
                            </select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chức vụ</label>
                            <input type="text" name="position" value="${position !== '---' ? position : ''}" ${role !== 'admin' ? 'disabled class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 cursor-not-allowed"' : 'class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-medium"'}>
                        </div>
                        <div class="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onclick="window.toggleProfileEdit()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                            <button type="button" onclick="window.saveProfileChanges('${staffID}')" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg transition-all">
                                <i class="fas fa-save mr-1.5"></i>Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-5 animate-fadeInUp" style="animation-delay: 0.2s; animation-fill-mode: both;">
                <!-- Security Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <h3 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
                            <i class="fas fa-shield-alt text-emerald-500"></i> Bảo mật
                        </h3>
                    </div>
                    <div class="p-5 space-y-3">
                        <button onclick="window.showChangePasswordModal()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all group">
                            <div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <i class="fas fa-key text-blue-600 text-sm"></i>
                            </div>
                            <div class="text-left">
                                <p class="text-sm font-bold text-gray-700">Đổi mật khẩu</p>
                                <p class="text-[10px] text-gray-400">Cập nhật mật khẩu đăng nhập</p>
                            </div>
                            <i class="fas fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Activity Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <h3 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
                            <i class="fas fa-clock text-amber-500"></i> Hoạt động
                        </h3>
                    </div>
                    <div class="p-5 space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <p class="text-xs text-gray-600">Đang hoạt động</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                            <p class="text-xs text-gray-500">Đăng nhập lần cuối: Hôm nay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    } catch (err) {
        container.innerHTML = `<div class="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold border border-red-100"><i class="fas fa-exclamation-circle mr-2"></i>Lỗi: ${err.message}</div>`;
    }
}

// Toggle edit mode
window.toggleProfileEdit = function () {
    const infoContent = document.getElementById('profileInfoContent');
    const editForm = document.getElementById('profileEditForm');
    const btnEdit = document.getElementById('btnEditProfile');

    if (infoContent && editForm) {
        const isEditing = !editForm.classList.contains('hidden');
        if (isEditing) {
            editForm.classList.add('hidden');
            infoContent.classList.remove('hidden');
            if (btnEdit) btnEdit.innerHTML = '<i class="fas fa-pen text-xs"></i> Chỉnh sửa';
        } else {
            editForm.classList.remove('hidden');
            infoContent.classList.add('hidden');
            if (btnEdit) btnEdit.innerHTML = '<i class="fas fa-times text-xs"></i> Hủy chỉnh sửa';
        }
    }
};

// Save profile changes
window.saveProfileChanges = async function (staffId) {
    const form = document.getElementById('formEditProfile');
    if (!form) return;

    const formData = new FormData(form);
    const body = {
        name: formData.get('name'),
        phone: formData.get('phone')
    };

    const deptInput = form.querySelector('[name="department"]');
    if (deptInput && !deptInput.disabled) {
        body.department = deptInput.value;
    }
    const posInput = form.querySelector('[name="position"]');
    if (posInput && !posInput.disabled) {
        body.position = posInput.value;
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/users/${staffId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Cập nhật thông tin thành công!');
            loadTaikhoanNSData(); // Reload
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể cập nhật'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

// Upload avatar
window.handleProfileAvatarUpload = async function (input, staffId) {
    if (!input.files || !input.files[0]) return;

    // Preview immediately
    const preview = document.getElementById('profileAvatarDisplay');
    if (preview) {
        const reader = new FileReader();
        reader.onload = (e) => { preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`; };
        reader.readAsDataURL(input.files[0]);
    }

    // Upload
    const formData = new FormData();
    formData.append('avatar', input.files[0]);

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/users/${staffId}/avatar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Đã cập nhật ảnh đại diện!');
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể upload'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

// Change password modal
window.showChangePasswordModal = function () {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4';
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scaleUp overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-key text-white"></i>
                </div>
                <div>
                    <h3 class="text-lg font-extrabold text-white">Đổi mật khẩu</h3>
                    <p class="text-xs text-blue-100/70">Nhập mật khẩu mới để cập nhật</p>
                </div>
            </div>
        </div>
        <form id="formChangePassword" class="p-6 space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Mật khẩu hiện tại</label>
                <input type="password" name="currentPassword" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                <input type="password" name="newPassword" required minlength="6" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                <input type="password" name="confirmPassword" required minlength="6" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transition-all">
                    <i class="fas fa-check mr-1.5"></i>Xác nhận
                </button>
            </div>
        </form>
    </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);

    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const newPwd = fd.get('newPassword');
        const confirmPwd = fd.get('confirmPassword');

        if (newPwd !== confirmPwd) {
            alert('❌ Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: fd.get('currentPassword'), newPassword: newPwd })
            });
            const result = await res.json();
            if (result.success) {
                alert('✅ Đổi mật khẩu thành công!');
                modal.remove();
            } else {
                alert('❌ Lỗi: ' + (result.error?.message || 'Không thể đổi mật khẩu'));
            }
        } catch (err) {
            alert('❌ Lỗi kết nối: ' + err.message);
        }
    };
};
