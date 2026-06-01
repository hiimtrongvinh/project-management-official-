import { renderFooter } from './footer.js';
import { renderPortalHeader } from './portalHeader.js';

export function renderTaikhoanNCC() {
    // Tự động gọi render giao diện mặc định (chế độ xem)
    setTimeout(() => window.toggleEditNCC(false), 0);

    return `
    <div class="flex flex-col min-h-screen bg-gray-50/50">
      ${renderPortalHeader({
        activeLabel: 'Tài khoản',
        tabs: [
            { label: 'Vật tư', iconClass: 'fas fa-truck text-lg', onClick: "navigateTo('CTTnhacungcap')" },
            { label: 'Đơn hàng', iconClass: 'fas fa-clipboard-list', onClick: "navigateTo('donhang')" },
            { label: 'Tài khoản', iconClass: 'fas fa-user-circle text-lg', onClick: "navigateTo('taikhoanNCC')" },
        ],
    })}
      <main id="nccProfileWrapper" class="max-w-6xl mx-auto w-full px-8 py-20 flex-1"></main>
      ${renderFooter()}
    </div>`;
}

// Logic chuyển đổi chế độ Xem/Sửa
window.toggleEditNCC = async function (isEditing) {
    const wrapper = document.getElementById('nccProfileWrapper');
    if (!wrapper) return;

    if (!window.cachedProfile) {
        wrapper.innerHTML = `<div class="flex items-center justify-center h-64"><p class="text-gray-500 font-medium">Đang tải...</p></div>`;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                window.cachedProfile = result.data;
            } else {
                throw new Error(result.error?.message || 'Không thể lấy thông tin');
            }
        } catch (err) {
            wrapper.innerHTML = `<div class="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">Lỗi: ${err.message}</div>`;
            return;
        }
    }

    const supplier = window.cachedProfile;
    const sName = supplier?.name || '---';
    const sID = supplier?.supplier_id || '---';
    const sIdNumber = supplier?.id_number || '---';
    const sPhone = supplier?.phone || '---';
    const sAddress = supplier?.address || '---';
    const sEmail = supplier?.email || '---';

    if (isEditing) {
        wrapper.innerHTML = `
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Cập nhật thông tin</h1>
                <div class="flex gap-4">
                    <button onclick="toggleEditNCC(false)" class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-10 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition">
                        Hủy
                    </button>
                    <button onclick="saveNCCProfile()" class="bg-blue-600 text-white hover:bg-blue-700 px-10 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition shadow-sm">
                        <i class="fas fa-save"></i> Lưu thay đổi
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <form id="formEditNCCProfile" class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                    
                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Tên nhà cung cấp <span class="text-red-500">*</span></label>
                        <input type="text" name="name" value="${sName !== '---' ? sName : ''}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Mã nhà cung cấp</label>
                        <input type="text" value="${sID !== '---' ? sID : ''}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed ">
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">MST / Số định danh <span class="text-red-500">*</span></label>
                        <input type="text" value="${sIdNumber !== '---' ? sIdNumber : ''}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Điện thoại <span class="text-red-500">*</span></label>
                        <input type="text" name="phone" value="${sPhone !== '---' ? sPhone : ''}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50  text-gray-800">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Email <span class="text-red-500">*</span></label>
                        <input type="email" value="${sEmail !== '---' ? sEmail : ''}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>

                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Địa chỉ <span class="text-red-500">*</span></label>
                        <input type="text" name="address" value="${sAddress !== '---' ? sAddress : ''}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50  text-gray-800">
                    </div>
                </form>
            </div>`;
    } else {
        wrapper.innerHTML = `
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Thông tin tài khoản</h1>
                <div class="flex gap-4">
                    <button onclick="window.showChangePasswordModal()" class="bg-gray-800 hover:bg-black text-white px-10 py-3.5 rounded-2xl font-normal text-base flex items-center gap-2 transition">
                        <i class="fas fa-key"></i> Đổi mật khẩu
                    </button>
                    <button onclick="toggleEditNCC(true)" class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-10 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition">
                        <i class="fas fa-edit"></i> Cập nhật thông tin
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 pt-2">
                    <div class="md:col-span-2">
                        <p class="text-gray-500 font-bold text-sm mb-1">Tên nhà cung cấp</p>
                        <p class=" text-xl text-gray-800">${sName}</p>
                    </div>
                    <div class="md:col-span-1">
                        <p class="text-gray-500 font-bold text-sm mb-1">Mã nhà cung cấp</p>
                        <p class="text-xl text-gray-800">${sID}</p>
                    </div>

                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">MST / Số định danh</p>
                        <p class="text-xl text-gray-800">${sIdNumber}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Điện thoại</p>
                        <p class="text-xl text-gray-800">${sPhone}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Email</p>
                        <p class="text-lg text-gray-800">${sEmail}</p>
                    </div>
                    
                    <div class="md:col-span-2">
                        <p class="text-gray-500 font-bold text-sm mb-1">Địa chỉ</p>
                        <p class="text-lg text-gray-800 leading-relaxed">${sAddress}</p>
                    </div>
                    
                </div>
            </div>`;
    }
};

window.saveNCCProfile = async function () {
    const form = document.getElementById('formEditNCCProfile');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const formData = new FormData(form);
    const updateData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        const result = await res.json();
        if (result.success) {
            window.cachedProfile = result.data;
            alert("✅ Thông tin tài khoản đã được cập nhật thành công!");
            window.toggleEditNCC(false);
        } else {
            alert("❌ Cập nhật thất bại: " + (result.error?.message || 'Lỗi không xác định'));
        }
    } catch (err) {
        alert("❌ Lỗi kết nối: " + err.message);
    }
};