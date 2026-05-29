let currentClientsList = [];
let clientCurrentPage = 1;
const CLIENTS_PER_PAGE = 12;

export function renderQLKhachhang() {
    const selectClass = "appearance-none px-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[position:right_1rem_center] bg-no-repeat text-sm font-medium hover:border-gray-300 transition-all cursor-pointer";
    const clientTypes = ["Doanh nghiệp", "Tổ chức", "Cá nhân"];
    const canManage = window.getAuthRole && window.getAuthRole() === 'admin';

    window.__canManageClient = canManage;

    return `
    <div class="max-w-7xl mx-auto">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-user-tie text-indigo-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 ">Quản lý khách hàng</h1>
                </div>
            </div>
            ${canManage ? `
            <button onclick="addClient()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                <i class="fas fa-plus"></i> Thêm khách hàng
            </button>` : ''}
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[300px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input type="text" id="searchClient" oninput="handleClientFilter()" 
                       placeholder="Tìm kiếm tên, mã, MST, email, SĐT..." 
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <select id="filterType" onchange="handleClientFilter()" class="${selectClass}">
                <option value="">Tất cả loại khách hàng</option>
                ${clientTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
            <select id="filterStatus" onchange="handleClientFilter()" class="${selectClass}">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <table class="w-full border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr class="text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-20">Mã KH</th>
                        <th class="px-2.5 py-3 text-left">Tên khách hàng</th>
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-24">Phân loại</th>
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-28">Mã định danh</th>
                        <th class="px-2.5 py-3 text-left whitespace-nowrap w-28">Điện thoại</th>
                        <th class="px-2.5 py-3 text-left">Email</th>
                        <th class="px-2.5 py-3 text-left">Địa chỉ</th>
                        <th class="px-2.5 py-3 text-center whitespace-nowrap w-24">Trạng thái</th>
                        ${canManage ? '<th class="px-2.5 py-3 text-center whitespace-nowrap w-24">Thao tác</th>' : ''}
                    </tr>
                </thead>
                <tbody id="clientTableBody" class="divide-y divide-gray-100">
                    <tr><td colspan="${canManage ? 9 : 8}" class="px-4 py-10 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Đang tải danh sách khách hàng...</td></tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

async function fetchClientsList() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users/clients?limit=100', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            currentClientsList = result.data.map(item => ({
                clientID: item.id,
                name: item.name,
                type: item.type,
                idNumber: item.id_number,
                phone: item.phone,
                email: item.email,
                address: item.address,
                status: item.account_status || 'active'
            }));
            renderClientTable(currentClientsList);
        } else {
            console.error('Không thể tải danh sách khách hàng:', result.error?.message);
        }
    } catch (error) {
        console.error('Lỗi kết nối tải khách hàng:', error);
    }
}

export function renderClientTable(clients = null, page = clientCurrentPage) {
    if (clients === null) {
        fetchClientsList();
        return;
    }

    const canManage = window.__canManageClient;
    const totalPages = Math.ceil(clients.length / CLIENTS_PER_PAGE);
    if (page > totalPages && totalPages > 0) page = totalPages;
    if (page < 1) page = 1;
    clientCurrentPage = page;

    const start = (page - 1) * CLIENTS_PER_PAGE;
    const pageClients = clients.slice(start, start + CLIENTS_PER_PAGE);
    window._currentFilteredClients = clients;

    let html = '';
    if (clients.length === 0) {
        html = `<tr><td colspan="${canManage ? 9 : 8}" class="px-4 py-12 text-center text-gray-500 text-sm italic">Không tìm thấy khách hàng phù hợp.</td></tr>`;
    } else {
        pageClients.forEach(client => {
            const isActive = client.status === 'active';
            const statusHtml = isActive
                ? '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Hoạt động</span>'
                : '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">Bị khóa</span>';

            const lockColorClass = isActive ? 'text-red-600 hover:text-red-800' : 'text-emerald-600 hover:text-emerald-800';
            const lockIcon = isActive ? 'fa-lock' : 'fa-lock-open';
            const lockTitle = isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản';

            html += `
            <tr class="hover:bg-blue-50/30 transition-colors text-sm text-gray-800">
                <td class="px-2.5 py-3 whitespace-nowrap text-gray-500 font-medium">${client.clientID}</td>
                <td class="px-2.5 py-3 font-semibold text-gray-800 leading-snug">
                    <div class="max-w-[200px] break-words">${client.name}</div>
                </td>
                <td class="px-2.5 py-3 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 font-semibold text-[12px] rounded bg-blue-50 text-blue-600 border border-blue-100">
                        ${client.type}
                    </span>
                </td>
                <td class="px-2.5 py-3 text-gray-600 whitespace-nowrap">${client.idNumber}</td>
                <td class="px-2.5 py-3 whitespace-nowrap">${client.phone}</td>
                <td class="px-2.5 py-3 text-gray-600">
                    <div class="max-w-[170px] truncate" title="${client.email}">${client.email}</div>
                </td>
                <td class="px-2.5 py-3 text-gray-600 leading-snug">
                    <div class="max-w-[280px] break-words">${client.address}</div>
                </td>
                <td class="px-2.5 py-3 text-center whitespace-nowrap">${statusHtml}</td>
                ${canManage ? `<td class="px-2.5 py-3 text-center">
                    <div class="flex justify-center gap-3">
                        <button onclick="editClient('${client.clientID}')" class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>
                        <button onclick="lockClient('${client.clientID}', '${client.status}')" class="${lockColorClass}" title="${lockTitle}"><i class="fas ${lockIcon}"></i></button>
                    </div>
                </td>` : ''}
            </tr>`;
        });
    }
    const tbody = document.getElementById('clientTableBody');
    if (tbody) tbody.innerHTML = html;

    // Render pagination
    renderClientPagination(clients.length, totalPages, page);
}

function renderClientPagination(total, totalPages, page) {
    let paginationContainer = document.getElementById('clientPagination');
    if (!paginationContainer) {
        const table = document.querySelector('#clientTableBody')?.closest('.bg-white');
        if (table) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'clientPagination';
            paginationContainer.className = 'px-6 py-4 border-t border-gray-100 flex items-center justify-between';
            table.appendChild(paginationContainer);
        } else return;
    }

    if (totalPages <= 1) { paginationContainer.innerHTML = `<span class="text-xs text-gray-400">${total} khách hàng</span><div></div>`; return; }

    const start = (page - 1) * CLIENTS_PER_PAGE + 1;
    const end = Math.min(page * CLIENTS_PER_PAGE, total);

    let btns = '';
    btns += `<button onclick="window.goToClientPage(${page - 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left text-xs"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - page) > 1) {
            if (i === 4 || i === totalPages - 2) btns += `<span class="text-gray-300 text-xs px-1">•••</span>`;
            continue;
        }
        btns += `<button onclick="window.goToClientPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}">${i}</button>`;
    }
    btns += `<button onclick="window.goToClientPage(${page + 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right text-xs"></i></button>`;

    paginationContainer.innerHTML = `
        <span class="text-xs text-gray-400 font-medium">Hiển thị ${start}-${end} / ${total} khách hàng</span>
        <div class="flex items-center gap-1">${btns}</div>`;
}

window.goToClientPage = function (page) {
    const clients = window._currentFilteredClients || currentClientsList;
    renderClientTable(clients, page);
};

window.handleClientFilter = function () {
    const keyword = document.getElementById('searchClient').value.toLowerCase();
    const type = document.getElementById('filterType').value;
    const status = document.getElementById('filterStatus').value;

    const filtered = currentClientsList.filter(c => {
        const matchKeyword = c.name.toLowerCase().includes(keyword) ||
            c.clientID.toLowerCase().includes(keyword) ||
            c.email.toLowerCase().includes(keyword) ||
            c.phone.includes(keyword) ||
            c.idNumber.includes(keyword);
        const matchType = type === "" || c.type === type;
        const matchStatus = status === "" || c.status === status;

        return matchKeyword && matchType && matchStatus;
    });
    renderClientTable(filtered, 1);
};

// =========================================================
// LOGIC MODAL THÊM & SỬA KHÁCH HÀNG
// =========================================================

window.addClient = function () {
    openClientModal();
};

window.editClient = function (clientID) {
    const client = currentClientsList.find(c => c.clientID === clientID);
    if (client) {
        openClientModal(client);
    }
};

window.lockClient = async function (clientID, currentStatus) {
    const isLocking = currentStatus === 'active';
    const actionText = isLocking ? 'khóa' : 'mở khóa';
    const newStatus = isLocking ? 'locked' : 'active';

    if (await window.showConfirm(`Bạn có chắc chắn muốn ${actionText} tài khoản khách hàng ${clientID} không?`)) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/users/${clientID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert(`✅ Đã ${actionText} khách hàng thành công!`);
                fetchClientsList();
            } else {
                alert(`❌ Lỗi khi ${actionText}: ` + (result.error?.message || 'Có lỗi xảy ra'));
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến máy chủ:", error);
        }
    }
};

function openClientModal(client = null) {
    const isEdit = !!client;
    const title = isEdit ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới';

    const cID = client ? client.clientID : '';
    const cName = client ? client.name : '';
    const cType = client ? client.type : '';
    const cIdNumber = client ? client.idNumber : '';
    const cPhone = client ? client.phone : '';
    const cEmail = client ? client.email : '';
    const cAddress = client ? client.address : '';

    const clientTypes = ["Doanh nghiệp", "Tổ chức", "Cá nhân"];
    const typeOptions = clientTypes.map(t => `<option value="${t}" ${cType === t ? 'selected' : ''}>${t}</option>`).join('');

    const idExtraAttrs = isEdit
        ? "readonly class='w-full px-6 py-4 border border-gray-200 rounded-3xl bg-gray-100 text-gray-500 cursor-not-allowed '"
        : "required class='w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800'";

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-2xl font-bold text-gray-800">${title}</h2>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-500 px-4 py-2 hover:text-gray-700 font-semibold transition">Hủy</button>
                <button type="button" onclick="handleSaveClient(this, '${cID}')" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-semibold hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                    <i class="fas fa-save"></i> Lưu thông tin
                </button>
            </div>
        </div>

        <div class="p-10 bg-gray-50/20">
            <form id="formClientModal" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="flex flex-col space-y-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Mã khách hàng <span class="text-red-500">*</span></label>
                    <input type="text" name="clientID" value="${cID}" ${idExtraAttrs}>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-base font-semibold text-gray-600 ml-1">Phân loại <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <select name="type" required class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 outline-none appearance-none cursor-pointer">
                            <option value="" disabled ${!cType ? 'selected' : ''}></option>
                            ${typeOptions}
                        </select>
                        <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                ${renderFormInput("Mã định danh (MST/CCCD)", "text", "idNumber", cIdNumber, true)}

                <div class="flex flex-col space-y-2 md:col-span-3">
                    <label class="text-base font-semibold text-gray-600 ml-1">Tên khách hàng <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${cName}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

                ${renderFormInput("Số điện thoại", "text", "phone", cPhone, true)}
                
                <div class="flex flex-col space-y-2 ${isEdit ? 'md:col-span-1' : ''}">
                    <label class="text-base font-semibold text-gray-600 ml-1">Email <span class="text-red-500">*</span></label>
                    <input type="email" name="email" value="${cEmail}" required
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800">
                </div>

                ${!isEdit ? renderFormInput("Mật khẩu ban đầu", "password", "password", "", true) : ''}
                
                <div class="flex flex-col space-y-2 md:col-span-3">
                    <label class="text-base font-semibold text-gray-600 ml-1">Địa chỉ <span class="text-red-500">*</span></label>
                    <input type="text" name="address" value="${cAddress}" required
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

window.handleSaveClient = async function (btn, originalID) {
    const form = document.getElementById('formClientModal');
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
    const url = isEdit ? `http://localhost:3000/api/users/${originalID}` : `http://localhost:3000/api/users/client`;
    const method = isEdit ? 'PUT' : 'POST';

    const bodyData = {
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
        type: data.type,
        id_number: data.idNumber
    };

    if (!isEdit) {
        bodyData.id = data.clientID;
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
            alert(`✅ ${isEdit ? 'Cập nhật' : 'Thêm mới'} khách hàng thành công!`);
            btn.closest('.fixed').remove();
            fetchClientsList();
        } else {
            alert(`❌ Có lỗi xảy ra: ${result.error?.message || 'Không thể lưu thông tin.'}`);
        }
    } catch (error) {
        console.error("Lỗi khi kết nối đến máy chủ:", error);
        alert("❌ Lỗi kết nối máy chủ.");
    }
};