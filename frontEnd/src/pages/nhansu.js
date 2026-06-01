// Lưu trữ danh sách nhân sự hiện tại được fetch từ server
let currentStaffsList = [];
let staffCurrentPage = 1;
const STAFF_PER_PAGE = 12;

export function renderNhansu() {
    const selectClass = "appearance-none px-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat text-sm font-medium hover:border-gray-300 transition-all cursor-pointer";

    // Danh sách phòng ban mặc định hoặc cập nhật động sau khi load dữ liệu
    const departments = ["Ban Giám đốc", "Phòng Quản trị và Kế toán", "Phòng Kinh doanh", "Phòng Kỹ thuật"];

    return `
    <div class="max-w-7xl mx-auto">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-users text-blue-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Quản lý nhân sự</h1>
                </div>
            </div>
            ${window.getAuthRole && window.getAuthRole() === 'admin' ? `
            <button onclick="addStaff()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                <i class="fas fa-plus"></i> Thêm nhân sự
            </button>` : ''}
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[280px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchStaff" oninput="handleStaffFilter()" 
                       placeholder="Tìm kiếm theo tên, mã NV hoặc email..." 
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <select id="filterDept" onchange="handleStaffFilter()" class="${selectClass}">
                <option value="">Tất cả phòng ban</option>
                ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
            </select>
            <select id="filterRole" onchange="handleStaffFilter()" class="${selectClass}">
                <option value="">Tất cả vai trò</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Nhân viên">Nhân viên</option>
            </select>
            <select id="filterStatus" onchange="handleStaffFilter()" class="${selectClass}">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr class="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        <th class="px-4 py-3 text-left font-semibold w-16">Ảnh</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap w-24">Mã NV</th>
                        <th class="px-4 py-3 text-left font-semibold">Họ tên</th>
                        <th class="px-4 py-3 text-left font-semibold">Phòng ban</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap w-28">Vai trò</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Email</th>
                        <th class="px-4 py-3 text-left font-semibold whitespace-nowrap w-32">Điện thoại</th>
                        <th class="px-4 py-3 text-center font-semibold whitespace-nowrap w-28">Trạng thái</th>
                        ${window.getAuthRole && window.getAuthRole() === 'admin' ? '<th class="px-4 py-3 text-center font-semibold whitespace-nowrap w-24">Thao tác</th>' : ''}
                    </tr>
                </thead>
                <tbody id="staffTableBody" class="divide-y">
                    <tr><td colspan="9" class="px-4 py-10 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Đang tải danh sách nhân sự...</td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

// Gọi API để lấy danh sách nhân sự
async function fetchStaffsList() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/staff?limit=100', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            currentStaffsList = result.data.map(item => ({
                staffID: item.id,
                name: item.name,
                department: item.department,
                role: item.position || (item.role === 'admin' ? 'Quản lý' : 'Nhân viên'),
                email: item.email,
                phone: item.phone,
                avatar: item.avatar || null,
                status: item.account_status || 'active'
            }));
            renderStaffTable(currentStaffsList);
        } else {
            console.error('Không thể tải danh sách nhân sự:', result.error?.message);
        }
    } catch (error) {
        console.error('Lỗi kết nối tải nhân sự:', error);
    }
}

// Hàm render bảng dựa trên mảng dữ liệu truyền vào
export function renderStaffTable(staffs = null, page = staffCurrentPage) {
    if (staffs === null) {
        fetchStaffsList();
        return;
    }

    const totalPages = Math.ceil(staffs.length / STAFF_PER_PAGE);
    if (page > totalPages && totalPages > 0) page = totalPages;
    if (page < 1) page = 1;
    staffCurrentPage = page;

    const start = (page - 1) * STAFF_PER_PAGE;
    const pageStaffs = staffs.slice(start, start + STAFF_PER_PAGE);
    window._currentFilteredStaffs = staffs;

    let html = '';
    if (staffs.length === 0) {
        html = `<tr><td colspan="9" class="px-4 py-10 text-center text-gray-500">Không tìm thấy nhân sự nào phù hợp điều kiện.</td></tr>`;
    } else {
        pageStaffs.forEach(staff => {
            const avatarHtml = staff.avatar
                ? `<img src="${staff.avatar}" alt="${staff.name}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-100">`
                : `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">${staff.name.charAt(0).toUpperCase()}</div>`;

            const isActive = staff.status === 'active';
            const statusHtml = isActive
                ? '<span class="px-2.5 py-0.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Hoạt động</span>'
                : '<span class="px-2.5 py-0.5 rounded-full text-sm font-bold bg-red-50 text-red-700 border border-red-100">Bị khóa</span>';

            const lockColorClass = isActive ? 'text-red-600 hover:text-red-800' : 'text-emerald-600 hover:text-emerald-800';
            const lockIcon = isActive ? 'fa-lock' : 'fa-lock-open';
            const lockTitle = isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản';

            html += `
            <tr class="hover:bg-gray-50 transition-colors text-sm text-gray-800">
                <td class="px-4 py-3">${avatarHtml}</td>
                <td class="px-4 py-3 whitespace-nowrap text-gray-500 font-medium">${staff.staffID}</td>
                <td class="px-4 py-3 font-semibold text-gray-800 leading-snug">
                    <div class="max-w-[150px] break-words">${staff.name}</div>
                </td>
                <td class="px-4 py-3 text-gray-700 leading-snug">
                    <div class="max-w-[160px] break-words">${staff.department}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 font-semibold text-xs rounded-lg bg-blue-50 text-blue-600 border border-blue-100"> ${staff.role} </span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                    <div class="max-w-[140px] truncate" whitespace-nowrap title="${staff.email}">${staff.email}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">${staff.phone}</td>
                <td class="px-4 py-3 text-center whitespace-nowrap">${statusHtml}</td>
                <td class="px-4 py-5">
                    ${window.getAuthRole && window.getAuthRole() === 'admin' ? `<div class="flex justify-center gap-3 whitespace-nowrap">
                        <button onclick="editStaff('${staff.staffID}')" class="text-blue-600 hover:text-blue-700" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                        <button onclick="lockStaff('${staff.staffID}', '${staff.status}')" class="${lockColorClass}" title="${lockTitle}"><i class="fas ${lockIcon}"></i></button>
                    </div>` : ''}
                </td> 
            </tr>`;
        });
    }

    const tbody = document.getElementById('staffTableBody');
    if (tbody) tbody.innerHTML = html;

    // Render pagination
    renderStaffPagination(staffs.length, totalPages, page);
}

function renderStaffPagination(total, totalPages, page) {
    let paginationContainer = document.getElementById('staffPagination');
    if (!paginationContainer) {
        const table = document.querySelector('#staffTableBody')?.closest('.bg-white');
        if (table) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'staffPagination';
            paginationContainer.className = 'px-6 py-4 border-t border-gray-100 flex items-center justify-between';
            table.appendChild(paginationContainer);
        } else return;
    }

    if (totalPages <= 1) { paginationContainer.innerHTML = `<span class="text-xs text-gray-400">${total} nhân sự</span><div></div>`; return; }

    const start = (page - 1) * STAFF_PER_PAGE + 1;
    const end = Math.min(page * STAFF_PER_PAGE, total);

    let btns = '';
    btns += `<button onclick="window.goToStaffPage(${page - 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left text-xs"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - page) > 1) {
            if (i === 4 || i === totalPages - 2) btns += `<span class="text-gray-300 text-xs px-1">•••</span>`;
            continue;
        }
        btns += `<button onclick="window.goToStaffPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}">${i}</button>`;
    }
    btns += `<button onclick="window.goToStaffPage(${page + 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right text-xs"></i></button>`;

    paginationContainer.innerHTML = `
        <span class="text-xs text-gray-400 font-medium">Hiển thị ${start}-${end} / ${total} nhân sự</span>
        <div class="flex items-center gap-1">${btns}</div>`;
}

window.goToStaffPage = function (page) {
    const staffs = window._currentFilteredStaffs || currentStaffsList;
    renderStaffTable(staffs, page);
};

// LOGIC XỬ LÝ LỌC VÀ TÌM KIẾM
window.handleStaffFilter = function () {
    const keyword = document.getElementById('searchStaff').value.toLowerCase();
    const dept = document.getElementById('filterDept').value;
    const role = document.getElementById('filterRole').value;
    const status = document.getElementById('filterStatus').value;

    const filteredResult = currentStaffsList.filter(staff => {
        const matchKeyword = staff.name.toLowerCase().includes(keyword) ||
            staff.staffID.toLowerCase().includes(keyword) ||
            staff.email.toLowerCase().includes(keyword);
        const matchDept = dept === "" || staff.department === dept;
        const matchRole = role === "" || staff.role === role;
        const matchStatus = status === "" || staff.status === status;

        return matchKeyword && matchDept && matchRole && matchStatus;
    });

    renderStaffTable(filteredResult, 1);
};

// =========================================================
// LOGIC MODAL THÊM & SỬA NHÂN SỰ
// =========================================================

window.addStaff = function () {
    openStaffModal(); // Mở modal trống
};

window.editStaff = function (staffID) {
    const staff = currentStaffsList.find(s => s.staffID === staffID);
    if (staff) {
        openStaffModal(staff); // Mở modal có sẵn dữ liệu
    }
};

window.lockStaff = async function (staffID, currentStatus) {
    const isLocking = currentStatus === 'active';
    const actionText = isLocking ? 'khóa' : 'mở khóa';
    const newStatus = isLocking ? 'locked' : 'active';

    if (await window.showConfirm(`Bạn có chắc chắn muốn ${actionText} tài khoản nhân viên ${staffID} không?`)) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${staffID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert(`✅ Đã ${actionText} nhân viên thành công!`);
                fetchStaffsList();
            } else {
                alert(`❌ Lỗi khi ${actionText}: ` + (result.error?.message || 'Có lỗi xảy ra'));
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến máy chủ:", error);
        }
    }
};

function openStaffModal(staff = null) {
    const isEdit = !!staff;
    const title = isEdit ? 'Sửa thông tin nhân sự' : 'Thêm nhân sự mới';

    // Gán dữ liệu nếu đang ở chế độ Sửa, nếu Thêm thì để trống
    const sID = staff ? staff.staffID : '';
    const sName = staff ? staff.name : '';
    const sEmail = staff ? staff.email : '';
    const sPhone = staff ? staff.phone : '';
    const sDept = staff ? staff.department : '';
    const sRole = staff ? staff.role : 'Nhân viên';
    const sAvatar = staff ? staff.avatar : '';

    const departments = ["Ban Giám đốc", "Phòng Quản trị và Kế toán", "Phòng Kinh doanh", "Phòng Kỹ thuật"];
    const deptOptions = departments.map(d => `<option value="${d}" ${sDept === d ? 'selected' : ''}>${d}</option>`).join('');

    // Xử lý ô Input Mã NV (Chỉ đọc nếu đang Sửa)
    const idExtraAttrs = isEdit ? "readonly class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '" : "required class='w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800'";

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-800">${title}</h2>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-400 px-4 py-2 hover:text-gray-600 font-bold transition">Hủy</button>
                <button type="button" onclick="handleSaveStaff(this, '${sID}')" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                    <i class="fas fa-save text-sm"></i> Lưu thông tin
                </button>
            </div>
        </div>

        <div class="p-10 bg-gray-50/20 overflow-y-auto max-h-[75vh]">
            <form id="formStaffModal" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Avatar Upload -->
                <div class="md:col-span-2 flex items-center gap-6 pb-4 border-b border-gray-100 mb-2">
                    <div class="relative group">
                        <div id="staffAvatarPreview" class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden cursor-pointer"
                             onclick="document.getElementById('staffAvatarInput').click()">
                            ${sName ? (sAvatar ? `<img src="${sAvatar}" class="w-full h-full object-cover">` : sName.charAt(0).toUpperCase()) : '<i class="fas fa-user text-xl"></i>'}
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow cursor-pointer"
                             onclick="document.getElementById('staffAvatarInput').click()">
                            <i class="fas fa-camera"></i>
                        </div>
                        <input type="file" id="staffAvatarInput" accept="image/png,image/jpeg" class="hidden" onchange="previewStaffAvatar(this)">
                    </div>
                    <div>
                        <p class="font-bold text-gray-800 text-lg">${isEdit ? sName : 'Ảnh đại diện'}</p>
                        <p class="text-sm text-gray-400">Bấm vào ảnh để thay đổi (PNG, JPG, tối đa 5MB)</p>
                    </div>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-sm font-bold text-gray-600 ml-1">Mã nhân viên <span class="text-red-500">*</span></label>
                    <input type="text" name="staffID" value="${sID}" ${idExtraAttrs}>
                </div>

                ${!isEdit ? renderFormInput("Mật khẩu ban đầu", "password", "password", "", true) : ''}

                ${renderFormInput("Họ và tên", "text", "name", sName, true)}
                ${renderFormInput("Email", "email", "email", sEmail, true)}
                ${renderFormInput("Điện thoại", "text", "phone", sPhone, true)}
                
                <div class="flex flex-col space-y-2">
                    <label class="text-sm font-bold text-gray-600 ml-1">Phòng ban <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <select name="department" required class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-700 outline-none appearance-none cursor-pointer">
                            <option value="" disabled ${!sDept ? 'selected' : ''}></option>
                            ${deptOptions}
                        </select>
                        <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-sm font-bold text-gray-600 ml-1">Vai trò <span class="text-red-500">*</span></label>
                    <div class="w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-50/50 flex gap-8">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="role" value="Nhân viên" ${sRole === 'Nhân viên' ? 'checked' : ''} class="w-4 h-4 accent-blue-600 cursor-pointer">
                            <span class="font-bold text-gray-700">Nhân viên</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="role" value="Quản lý" ${sRole === 'Quản lý' ? 'checked' : ''} class="w-4 h-4 accent-blue-600 cursor-pointer">
                            <span class="font-bold text-gray-700">Quản lý</span>
                        </label>
                    </div>
                </div>

            </form>
        </div>
    </div>`;

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}

// Hàm hỗ trợ render HTML cho thẻ Input
function renderFormInput(label, type, name, value, isRequired) {
    return `
    <div class="flex flex-col space-y-2">
        <label class="text-sm font-bold text-gray-600 ml-1">${label} ${isRequired ? '<span class="text-red-500">*</span>' : ''}</label>
        <input type="${type}" name="${name}" value="${value}" ${isRequired ? 'required' : ''}
               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
    </div>`;
}

// Hàm xử lý lưu
window.handleSaveStaff = async function (btn, originalID) {
    const form = document.getElementById('formStaffModal');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = {};
    formData.forEach((val, key) => {
        data[key] = val;
    });

    const isEdit = !!originalID;
    const token = localStorage.getItem('token');
    const url = isEdit ? `/api/users/${originalID}` : `/api/users/staff`;
    const method = isEdit ? 'PUT' : 'POST';

    // Map fields to match API expectations
    const bodyData = {
        email: data.email,
        name: data.name,
        phone: data.phone,
        department: data.department,
        position: data.role,
        status: data.status
    };

    if (!isEdit) {
        bodyData.id = data.staffID;
        bodyData.password = data.password;
    } else if (data.password) {
        bodyData.password = data.password;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bodyData)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            // Upload avatar if selected
            const avatarInput = document.getElementById('staffAvatarInput');
            const staffId = isEdit ? originalID : (result.data?.id || data.staffID);
            if (avatarInput && avatarInput.files[0] && staffId) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', avatarInput.files[0]);
                await fetch(`/api/users/${staffId}/avatar`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: avatarFormData
                });
            }

            alert(`✅ ${isEdit ? 'Cập nhật' : 'Thêm mới'} nhân sự thành công!`);
            btn.closest('.fixed').remove();
            fetchStaffsList();
        } else {
            alert(`❌ Có lỗi xảy ra: ${result.error?.message || 'Không thể lưu thông tin.'}`);
        }
    } catch (error) {
        console.error("Lỗi khi kết nối đến máy chủ:", error);
        alert("❌ Lỗi kết nối máy chủ.");
    }
};

window.previewStaffAvatar = function (input) {
    const preview = document.getElementById('staffAvatarPreview');
    if (input.files && input.files[0] && preview) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
};