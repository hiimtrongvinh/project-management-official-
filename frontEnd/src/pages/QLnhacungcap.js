let loadedSuppliers = [];
let supplierCurrentPage = 1;
const SUPPLIERS_PER_PAGE = 12;

export async function fetchSuppliersFromServer() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/suppliers?limit=100', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            loadedSuppliers = result.data;
            renderSupplierTable(loadedSuppliers);
        }
    } catch (error) {
        console.error('Lỗi tải danh sách nhà cung cấp:', error);
    }
}

window.fetchSuppliersFromServer = fetchSuppliersFromServer;

export function renderQLNhacungcap() {
    const selectClass = "appearance-none px-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat text-sm font-medium hover:border-gray-300 transition-all cursor-pointer";

    return `
    <div class="max-w-7xl mx-auto">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-truck-loading text-purple-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 ">Quản lý nhà cung cấp</h1>
                </div>
            </div>
            ${window.getAuthRole && window.getAuthRole() === 'admin' ? `
            <button onclick="addSupplier()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                <i class="fas fa-plus"></i> Thêm nhà cung cấp
            </button>` : ''}
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[300px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchSupplier" oninput="handleSupplierFilter()" 
                       placeholder="Tìm kiếm tên đơn vị, MST, email, SĐT..." 
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <select id="filterStatus" onchange="handleSupplierFilter()" class="${selectClass}">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr class="text-gray-500 text-xs font-bold uppercase">
                        <th class="px-3 py-3 text-left whitespace-nowrap w-24">Mã NCC</th>
                        <th class="px-3 py-3 text-left">Tên đơn vị</th>
                        <th class="px-3 py-3 text-left whitespace-nowrap w-32">Mã số thuế</th>
                        <th class="px-3 py-3 text-left whitespace-nowrap w-32">Điện thoại</th>
                        <th class="px-3 py-3 text-left">Email</th>
                        <th class="px-3 py-3 text-left">Địa chỉ</th>
                        <th class="px-3 py-3 text-center whitespace-nowrap w-24">Trạng thái</th>
                        ${window.getAuthRole && window.getAuthRole() === 'admin' ? '<th class="px-3 py-3 text-center whitespace-nowrap w-28">Thao tác</th>' : ''}
                    </tr>
                </thead>
                <tbody id="supplierTableBody" class="divide-y divide-gray-100"></tbody>
            </table>
        </div>
    </div>`;
}

export function renderSupplierTable(suppliers = null, page = supplierCurrentPage) {
    if (suppliers === null) {
        fetchSuppliersFromServer();
        return;
    }

    const totalPages = Math.ceil(suppliers.length / SUPPLIERS_PER_PAGE);
    if (page > totalPages && totalPages > 0) page = totalPages;
    if (page < 1) page = 1;
    supplierCurrentPage = page;

    const start = (page - 1) * SUPPLIERS_PER_PAGE;
    const pageSuppliers = suppliers.slice(start, start + SUPPLIERS_PER_PAGE);
    window._currentFilteredSuppliers = suppliers;

    let html = '';
    if (suppliers.length === 0) {
        html = `<tr><td colspan="${window.getAuthRole && window.getAuthRole() === 'admin' ? 8 : 7}" class="px-4 py-12 text-center text-gray-500 text-sm italic">Không tìm thấy nhà cung cấp phù hợp.</td></tr>`;
    } else {
        pageSuppliers.forEach(s => {
            const isActive = s.account_status === 'active';
            const statusHtml = isActive
                ? '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">Hoạt động</span>'
                : '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">Bị khóa</span>';

            const lockColorClass = isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800';
            const lockIcon = isActive ? 'fa-lock' : 'fa-lock-open';
            const lockTitle = isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản';

            html += `
            <tr class="hover:bg-blue-50/30 transition-colors text-sm text-gray-800">
                <td class="px-3 py-3 whitespace-nowrap text-gray-500 font-medium">${s.id}</td>
                <td class="px-3 py-3 font-bold text-gray-800 leading-snug">
                    <div class="max-w-[180px] break-words">${s.name}</div>
                </td>
                <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${s.id_number || ''}</td>
                <td class="px-3 py-3 text-gray-600 whitespace-nowrap">${s.phone || ''}</td>
                <td class="px-3 py-3 text-gray-600">
                    <div class="max-w-[150px] truncate" title="${s.email || ''}">${s.email || ''}</div>
                </td>
                <td class="px-3 py-3 text-gray-600 leading-snug">
                    <div class="max-w-[250px] break-words">${s.address || ''}</div>
                </td>
                <td class="px-3 py-3 text-center whitespace-nowrap">${statusHtml}</td>
                ${window.getAuthRole && window.getAuthRole() === 'admin' ? `<td class="px-3 py-3 text-center">
                    <div class="flex justify-center gap-3">
                        <button onclick="editSupplier('${s.id}')" class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                        <button onclick="lockSupplier('${s.id}', '${s.account_status}')" class="${lockColorClass}" title="${lockTitle}"><i class="fas ${lockIcon}"></i></button>
                    </div>
                </td>` : ''}
            </tr>`;
        });
    }
    const tbody = document.getElementById('supplierTableBody');
    if (tbody) tbody.innerHTML = html;

    // Render pagination
    renderSupplierPagination(suppliers.length, totalPages, page);
}

function renderSupplierPagination(total, totalPages, page) {
    let paginationContainer = document.getElementById('supplierPagination');
    if (!paginationContainer) {
        const table = document.querySelector('#supplierTableBody')?.closest('.bg-white');
        if (table) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'supplierPagination';
            paginationContainer.className = 'px-6 py-4 border-t border-gray-100 flex items-center justify-between';
            table.appendChild(paginationContainer);
        } else return;
    }

    if (totalPages <= 1) { paginationContainer.innerHTML = `<span class="text-sm text-gray-400">${total} nhà cung cấp</span><div></div>`; return; }

    const start = (page - 1) * SUPPLIERS_PER_PAGE + 1;
    const end = Math.min(page * SUPPLIERS_PER_PAGE, total);

    let btns = '';
    btns += `<button onclick="window.goToSupplierPage(${page - 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left text-xs"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - page) > 1) {
            if (i === 4 || i === totalPages - 2) btns += `<span class="text-gray-300 text-xs px-1">•••</span>`;
            continue;
        }
        btns += `<button onclick="window.goToSupplierPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition ${i === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}">${i}</button>`;
    }
    btns += `<button onclick="window.goToSupplierPage(${page + 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right text-xs"></i></button>`;

    paginationContainer.innerHTML = `
        <span class="text-sm text-gray-400 font-medium">Hiển thị ${start}-${end} / ${total} nhà cung cấp</span>
        <div class="flex items-center gap-1">${btns}</div>`;
}

window.goToSupplierPage = function (page) {
    const suppliers = window._currentFilteredSuppliers || loadedSuppliers;
    renderSupplierTable(suppliers, page);
};

window.handleSupplierFilter = function () {
    const keyword = document.getElementById('searchSupplier').value.toLowerCase().trim();
    const status = document.getElementById('filterStatus').value;

    const filtered = loadedSuppliers.filter(s => {
        const matchKeyword = (s.name || '').toLowerCase().includes(keyword) ||
            (s.id || '').toLowerCase().includes(keyword) ||
            (s.email || '').toLowerCase().includes(keyword) ||
            (s.phone || '').includes(keyword) ||
            (s.id_number || '').includes(keyword);

        const sStatus = s.account_status || 'active';
        const matchStatus = status === "" || sStatus === status;

        return matchKeyword && matchStatus;
    });
    renderSupplierTable(filtered, 1);
};

// =========================================================
// LOGIC MODAL THÊM & SỬA NHÀ CUNG CẤP
// =========================================================

window.addSupplier = function () {
    openSupplierModal();
};

window.editSupplier = function (supplierID) {
    const supplier = loadedSuppliers.find(s => s.id === supplierID);
    if (supplier) {
        openSupplierModal(supplier);
    }
};

window.lockSupplier = async function (supplierID, currentStatus) {
    const isLocking = currentStatus === 'active';
    const actionText = isLocking ? 'khóa' : 'mở khóa';
    const newStatus = isLocking ? 'locked' : 'active';

    if (await window.showConfirm(`Bạn có chắc chắn muốn ${actionText} tài khoản nhà cung cấp ${supplierID} không?`)) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${supplierID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert(`✅ Đã ${actionText} nhà cung cấp thành công!`);
                fetchSuppliersFromServer();
            } else {
                alert(`❌ Lỗi khi ${actionText}: ` + (result.error?.message || 'Có lỗi xảy ra'));
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến máy chủ:", error);
        }
    }
};

function openSupplierModal(supplier = null) {
    const isEdit = !!supplier;
    const title = isEdit ? 'Sửa thông tin nhà cung cấp' : 'Thêm nhà cung cấp mới';

    const sID = supplier ? supplier.id : '';
    const sName = supplier ? supplier.name : '';
    const sIdNumber = supplier ? supplier.id_number : '';
    const sPhone = supplier ? supplier.phone : '';
    const sEmail = supplier ? supplier.email : '';
    const sAddress = supplier ? supplier.address : '';

    const idExtraAttrs = isEdit
        ? "readonly class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '"
        : "readonly placeholder='Tự động tạo' class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '";

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-800">${title}</h2>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-500 px-4 py-2 hover:text-gray-700 font-semibold transition">Hủy</button>
                <button type="button" onclick="handleSaveSupplier(this, '${sID}')" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-semibold hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                    <i class="fas fa-save"></i> Lưu thông tin
                </button>
            </div>
        </div>

        <div class="p-10 bg-gray-50/20">
            <form id="formSupplierModal" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div class="flex flex-col space-y-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Mã nhà cung cấp</label>
                    <input type="text" name="supplierID" value="${sID}" ${idExtraAttrs}>
                </div>

                ${renderFormInput("Mã số thuế", "text", "id_number", sIdNumber, true)}

                <div class="flex flex-col space-y-2 md:col-span-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Tên nhà cung cấp <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${sName}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>
                
                ${renderFormInput("Điện thoại", "text", "phone", sPhone, true)}
                ${renderFormInput("Email", "email", "email", sEmail, !isEdit)}

                ${!isEdit ? renderFormInput("Mật khẩu ban đầu", "password", "password", "", true) : ''}
                ${!isEdit ? '<div></div>' : ''}
                
                <div class="flex flex-col space-y-2 md:col-span-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Địa chỉ <span class="text-red-500">*</span></label>
                    <input type="text" name="address" value="${sAddress}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

            </form>
        </div>
    </div>`;

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}

function renderFormInput(label, type, name, value, isRequired) {
    return `
    <div class="flex flex-col space-y-2">
        <label class="text-base font-semibold text-gray-600 ml-1">${label} ${isRequired ? '<span class="text-red-500">*</span>' : ''}</label>
        <input type="${type}" name="${name}" value="${value}" ${isRequired ? 'required' : ''}
               class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
    </div>`;
}

window.handleSaveSupplier = async function (btn, supplierID) {
    const form = document.getElementById('formSupplierModal');
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
        if (key !== 'supplierID') {
            payload[key] = value;
        }
    });

    try {
        const token = localStorage.getItem('token');
        let response;
        if (supplierID) {
            // Update
            response = await fetch(`/api/users/${supplierID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            response = await fetch(`/api/users/supplier`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
        }

        const result = await response.json();
        if (response.ok && result.success) {
            alert("✅ Thông tin nhà cung cấp đã được lưu thành công!");
            btn.closest('.fixed').remove();
            fetchSuppliersFromServer();
        } else {
            alert("❌ Lỗi: " + (result.error?.message || "Không thể lưu thông tin nhà cung cấp"));
        }
    } catch (error) {
        console.error('Lỗi lưu nhà cung cấp:', error);
        alert("❌ Có lỗi xảy ra khi lưu thông tin.");
    }
};