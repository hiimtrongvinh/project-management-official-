import { renderFooter } from './footer.js';
import { renderPortalHeader } from './portalHeader.js';

export function renderTaikhoanKH() {
    // Tự động gọi render giao diện mặc định (chế độ xem)
    setTimeout(() => window.toggleEditKH(false), 0);

    return `
    <div class="flex flex-col -mt-8 -mx-8 min-h-screen bg-gray-50/50">
        ${renderPortalHeader({
        activeLabel: 'Tài khoản',
        tabs: [
            { label: 'Dự án', iconClass: 'fas fa-briefcase text-lg', onClick: "navigateTo('CTTkhachhang')" },
            { label: 'Tạo yêu cầu', iconClass: 'fas fa-plus', onClick: "navigateTo('taoyeucau')" },
            { label: 'Tài khoản', iconClass: 'fas fa-user-circle text-lg', onClick: "navigateTo('taikhoanKH')" },
        ],
    })}
        <main id="khProfileWrapper" class="max-w-6xl mx-auto w-full px-8 py-20 flex-1"></main>
        ${renderFooter()}
    </div>`;
}

// Logic chuyển đổi chế độ Xem/Sửa
window.toggleEditKH = async function (isEditing) {
    const wrapper = document.getElementById('khProfileWrapper');
    if (!wrapper) return;

    if (!window.cachedKHProfile) {
        wrapper.innerHTML = `<div class="flex items-center justify-center h-64"><p class="text-gray-500 font-medium">Đang tải...</p></div>`;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                window.cachedKHProfile = result.data;
            } else {
                throw new Error(result.error?.message || 'Không thể lấy thông tin');
            }
        } catch (err) {
            wrapper.innerHTML = `<div class="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">Lỗi: ${err.message}</div>`;
            return;
        }
    }

    const client = window.cachedKHProfile;
    const clientTypes = ['Doanh nghiệp', 'Tổ chức', 'Cá nhân'];
    const typeOptions = clientTypes.map(t => `<option value="${t}" ${client.type === t ? 'selected' : ''}>${t}</option>`).join('');

    const cName = client?.name || '---';
    const cID = client?.client_id || '---';
    const cIdNumber = client?.id_number || '---';
    const cPhone = client?.phone || '---';
    const cAddress = client?.address || '---';
    const cEmail = client?.email || '---';

    if (isEditing) {
        wrapper.innerHTML = `
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Cập nhật thông tin</h1>
                <div class="flex gap-4 text-base font-normal">
                    <button onclick="toggleEditKH(false)" class="bg-gray-100 text-gray-600 px-8 py-3.5 rounded-2xl hover:bg-gray-200 transition font-bold">
                        Hủy
                    </button>
                    <button onclick="saveKHProfile()" class="bg-blue-600 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition flex items-center gap-2 font-bold shadow-sm">
                        <i class="fas fa-save"></i> Lưu thay đổi
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <form id="formEditKHProfile" class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Tên khách hàng<span class="text-red-500">*</span></label>
                        <input type="text" name="name" value="${cName !== '---' ? cName : ''}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Phân loại <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <select name="type" required class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 outline-none appearance-none cursor-pointer">
                                <option value="" disabled ${!client.type ? 'selected' : ''}></option>
                                ${typeOptions}
                            </select>
                            <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Mã khách hàng</label>
                        <input type="text" value="${cID !== '---' ? cID : ''}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Mã định danh (MST/CCCD) <span class="text-red-500">*</span></label>
                        <input type="text" value="${cIdNumber !== '---' ? cIdNumber : ''}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Điện thoại <span class="text-red-500">*</span></label>
                        <input type="text" name="phone" value="${cPhone !== '---' ? cPhone : ''}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>

                    <div class="md:col-span-2 flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Địa chỉ<span class="text-red-500">*</span></label>
                        <input type="text" name="address" value="${cAddress !== '---' ? cAddress : ''}" required 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-bold text-gray-500 ml-1">Email<span class="text-red-500">*</span></label>
                        <input type="email" value="${cEmail !== '---' ? cEmail : ''}" readonly 
                               class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed">
                    </div>
                </form>
            </div>`;
    } else {
        wrapper.innerHTML = `
            <div class="flex items-center justify-between mb-8 animate-scaleIn">
                <h1 class="text-3xl font-bold text-gray-800">Thông tin tài khoản</h1>
                <div class="flex gap-4 text-base font-normal">
                    <button onclick="window.showChangePasswordModal()" class="bg-gray-800 text-white px-8 py-3.5 rounded-2xl hover:bg-black transition flex items-center gap-2">
                        <i class="fas fa-key"></i> Đổi mật khẩu
                    </button>
                    <button onclick="toggleEditKH(true)" class="bg-blue-50 text-blue-600 px-8 py-3.5 rounded-2xl hover:bg-blue-100 transition flex items-center gap-2 font-bold">
                        <i class="fas fa-edit"></i> Cập nhật thông tin
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-[32px] shadow-sm p-12 border border-gray-100 animate-scaleIn">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                    <div class="md:col-span-2">
                        <p class="text-gray-500 text-sm font-bold mb-1">Tên khách hàng</p>
                        <p class="text-xl text-gray-800">${cName}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Phân loại</p>
                        <p class="text-xl text-gray-800">${client.type || '---'}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Mã khách hàng</p>
                        <p class="text-xl text-gray-800">${cID}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Mã định danh (MST/CCCD)</p>
                        <p class="text-xl text-gray-800">${cIdNumber}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Điện thoại</p>
                        <p class="text-xl text-gray-800">${cPhone}</p>
                    </div>
                    <div class="md:col-span-2">
                        <p class="text-gray-500 font-bold text-sm mb-1">Địa chỉ</p>
                        <p class="text-lg text-gray-800 leading-relaxed">${cAddress || '---'}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 font-bold text-sm mb-1">Email</p>
                        <p class="text-lg text-gray-800">${cEmail}</p>
                    </div>
                </div>
            </div>`;
    }
};

window.saveKHProfile = async function () {
    const form = document.getElementById('formEditKHProfile');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const formData = new FormData(form);
    const updateData = {
        name: formData.get('name'),
        type: formData.get('type'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        const result = await res.json();
        if (result.success) {
            window.cachedKHProfile = result.data;
            alert("✅ Thông tin tài khoản đã được cập nhật thành công!");
            window.toggleEditKH(false);
        } else {
            alert("❌ Cập nhật thất bại: " + (result.error?.message || 'Lỗi không xác định'));
        }
    } catch (err) {
        alert("❌ Lỗi kết nối: " + err.message);
    }
};