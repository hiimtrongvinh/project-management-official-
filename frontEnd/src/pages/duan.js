const allStatuses = [
    "Chờ phê duyệt",
    "Khảo sát và lập kế hoạch",
    "Lập báo giá và xác nhận hợp đồng",
    "Triển khai lắp đặt",
    "Bàn giao và nghiệm thu",
    "Thanh toán",
    "Hoàn thành"
];

const statusColors = {
    "Chờ phê duyệt": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
    "Khảo sát và lập kế hoạch": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
    "Lập báo giá và xác nhận hợp đồng": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    "Triển khai lắp đặt": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    "Bàn giao và nghiệm thu": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
    "Thanh toán": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
    "Hoàn thành": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" }
};

let loadedProjects = [];

export async function fetchProjectsFromServer() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/projects?limit=100', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            loadedProjects = result.data;
            renderProjectCards(loadedProjects);
        }
    } catch (error) {
        console.error('Lỗi tải danh sách dự án:', error);
    }
}

window.fetchProjectsFromServer = fetchProjectsFromServer;

export function renderDuan() {
    const isAdmin = window.getAuthRole && window.getAuthRole() === 'admin';

    return `
    <div class="max-w-7xl mx-auto animate-fadeIn">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col lg:flex-row lg:flex-nowrap justify-between items-start lg:items-center gap-4 animate-fadeInDown">
            <!-- Left: Title & Description -->
            <div class="flex items-center gap-4 flex-shrink-0">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-rocket text-blue-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 ">Quản lý dự án</h1>
                </div>
            </div>

            <!-- Middle: Sleek Stats Pill Badges centered horizontally -->
            <div class="flex flex-wrap lg:flex-nowrap items-center justify-center gap-3 flex-grow" id="projectStats"></div>

            <!-- Right: Action Buttons aligned beautifully -->
            ${isAdmin ? `
            <div class="flex flex-wrap lg:flex-nowrap items-center gap-3 flex-shrink-0 justify-end">
                <button onclick="exportExcel()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                    <i class="fas fa-file-excel"></i> Xuất Excel
                </button>
                <button onclick="addProject()" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                    <i class="fas fa-plus"></i> Thêm dự án
                </button>
            </div>` : ''}
        </div>

        <!-- Filter Bar -->
            <div class="flex flex-wrap gap-3 items-center">
                <div class="flex-1 min-w-[260px] relative group">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="text" id="searchDuan" oninput="handleProjectFilter()" 
                           placeholder="Tìm kiếm dự án theo tên..." 
                           class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
                </div>
                <div class="relative">
                    <select id="filterDeadline" onchange="handleProjectFilter()" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-medium cursor-pointer min-w-[160px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả hạn chót</option>
                        <option value="quahan">🔴 Quá hạn</option>
                        <option value="homnay">🟡 Hôm nay</option>
                        <option value="tuannay">🔵 Tuần này</option>
                        <option value="thangnay">🟢 Tháng này</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
                <div class="relative">
                    <select id="filterStatus" onchange="handleProjectFilter()" 
                            class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm font-medium cursor-pointer min-w-[190px] hover:border-gray-300 transition-all">
                        <option value="">Tất cả trạng thái</option>
                        ${allStatuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
            </div>

        <!-- Project Cards Grid -->
        <div id="projectCards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
    </div>`;
}

export function renderProjectCards(projects = null) {
    if (projects === null) {
        fetchProjectsFromServer();
        return;
    }

    // Render stats
    renderProjectStats(projects);

    const container = document.getElementById('projectCards');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = `
        <div class="col-span-full py-20 text-center animate-fadeIn">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-folder-open text-3xl text-gray-300"></i>
            </div>
            <p class="text-gray-500 font-semibold text-lg">Không tìm thấy dự án nào</p>
            <p class="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo dự án mới</p>
        </div>`;
        return;
    }

    let html = '';
    projects.forEach((p, index) => {
        const sc = statusColors[p.status] || statusColors["Khảo sát và lập kế hoạch"];
        const memberCount = p.member_count || 0;
        const formattedDeadline = p.end_date ? new Date(p.end_date).toLocaleDateString('vi-VN') : 'Chưa đặt';
        const totalTasks = p.total_tasks || 0;
        const approvedTasks = p.approved_tasks || 0;
        const progress = p.progress || 0;

        // Check if overdue (projects with 'Hoàn thành' status or 100% progress are NOT overdue)
        const isCompleted = p.status?.trim() === 'Hoàn thành' || (p.progress !== undefined && p.progress >= 100);
        const isOverdue = p.end_date && new Date(p.end_date) < new Date() && !isCompleted;
        const progressColor = isOverdue ? 'bg-red-500' : progress >= 75 ? 'bg-emerald-500' : progress >= 40 ? 'bg-blue-500' : 'bg-amber-500';

        let avatarsHtml = '';
        const members = typeof p.members_json === 'string' ? JSON.parse(p.members_json || '[]') : (p.members_json || []);
        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'];
        members.slice(0, 4).forEach((m, i) => {
            if (m.avatar) {
                avatarsHtml += `<div class="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 overflow-hidden shadow-sm shadow-gray-200/50" title="${m.name}">
                    <img src="${m.avatar}" alt="${m.name}" class="w-full h-full object-cover">
                </div>`;
            } else {
                const initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
                avatarsHtml += `<div class="w-8 h-8 ${colors[i % colors.length]} rounded-full border-2 border-white flex items-center justify-center -ml-2 first:ml-0 shadow-sm text-xs text-white font-bold" title="${m.name}">
                    ${initial}
                </div>`;
            }
        });
        if (memberCount > 4) {
            avatarsHtml += `<div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center -ml-2 text-[10px] font-bold text-gray-600 shadow-sm">+${memberCount - 4}</div>`;
        }

        html += `
        <div onclick="openProjectDetail('${p.id}')" 
             class="bg-white rounded-3xl p-6 border border-transparent hover:border-blue-200 transition-all cursor-pointer hover:shadow-md group animate-fadeInUp relative"
             style="animation-delay: ${index * 0.05}s; animation-fill-mode: both;">
            
            <h3 class="font-bold text-lg mb-2 line-clamp-2 min-h-[52px] text-gray-800 group-hover:text-blue-700 transition-colors">${p.title}</h3>
            
            <div class="flex items-center mb-4">
                <div class="flex">
                    ${avatarsHtml || '<span class="text-xs text-gray-400">Chưa có thành viên</span>'}
                </div>
            </div>

            <div class="flex items-center justify-between mb-4">
                <span class="px-4 py-1 text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border} rounded-xl">
                    ${p.status}
                </span>
                <div class="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <i class="fas fa-calendar-alt text-blue-500"></i>
                    <span>${formattedDeadline}</span>
                </div>
            </div>

            <div class="mb-4">
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full ${progressColor} rounded-full transition-all duration-700" style="width: ${progress}%"></div>
                </div>
            </div>

            <div class="flex justify-between items-center text-sm font-bold">
                <span class="${isOverdue ? 'text-red-600' : 'text-blue-600'}">${progress}% hoàn thành</span>
                <span class="text-gray-400 font-medium">${approvedTasks}/${totalTasks} công việc</span>
            </div>
        </div>`;
    });

    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5';
    container.innerHTML = html;

    // Initialize drag-and-drop for project cards
    if (typeof Sortable !== 'undefined') {
        Sortable.create(container, {
            animation: 250,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            delay: 150,
            delayOnTouchOnly: true,
        });
    }
}

function renderProjectStats(projects) {
    const statsContainer = document.getElementById('projectStats');
    if (!statsContainer) return;

    const total = projects.length;
    const completed = projects.filter(p => p.status?.trim() === 'Hoàn thành' || (p.progress !== undefined && p.progress >= 100)).length;
    const inProgress = total - completed;
    const overdue = projects.filter(p => {
        const isComp = p.status?.trim() === 'Hoàn thành' || (p.progress !== undefined && p.progress >= 100);
        return p.end_date && new Date(p.end_date) < new Date() && !isComp;
    }).length;

    statsContainer.innerHTML = `
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span>Tổng: <strong class="text-gray-800 ml-0.5">${total}</strong></span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 transition-all hover:bg-amber-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Đang thực hiện: <strong class="text-amber-800 ml-0.5">${inProgress}</strong></span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Hoàn thành: <strong class="text-emerald-800 ml-0.5">${completed}</strong></span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-700 transition-all hover:bg-red-100/80 cursor-default">
            <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
            <span>Quá hạn: <strong class="text-red-800 ml-0.5">${overdue}</strong></span>
        </div>
    `;
}

window.handleProjectFilter = function () {
    const keyword = document.getElementById('searchDuan')?.value.toLowerCase().trim() || '';
    const status = document.getElementById('filterStatus')?.value.trim() || '';
    const deadlineFilter = document.getElementById('filterDeadline')?.value || '';

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const filtered = loadedProjects.filter(p => {
        const matchKeyword = p.title.toLowerCase().includes(keyword);
        const matchStatus = status === "" || p.status.trim() === status;
        let matchDeadline = true;
        if (deadlineFilter !== "") {
            if (!p.end_date) {
                matchDeadline = false;
            } else {
                const projectDate = new Date(p.end_date);
                projectDate.setHours(0, 0, 0, 0);
                if (deadlineFilter === "quahan") {
                    const isComp = p.status.trim() === "Hoàn thành" || (p.progress !== undefined && p.progress >= 100);
                    matchDeadline = projectDate < now && !isComp;
                }
                else if (deadlineFilter === "homnay") matchDeadline = projectDate.getTime() === now.getTime();
                else if (deadlineFilter === "tuannay") {
                    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
                    const endOfWeek = new Date(now);
                    endOfWeek.setDate(now.getDate() + (7 - dayOfWeek));
                    matchDeadline = projectDate >= now && projectDate <= endOfWeek;
                } else if (deadlineFilter === "thangnay") {
                    matchDeadline = projectDate.getMonth() === now.getMonth() && projectDate.getFullYear() === now.getFullYear();
                }
            }
        }
        return matchKeyword && matchStatus && matchDeadline;
    });
    renderProjectCards(filtered);
};

window.addProject = async function () {
    let clients = [];
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/clients?limit=100', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        clients = result.success ? result.data : [];
    } catch (e) {
        console.error('Lỗi tải khách hàng:', e);
    }

    const today = new Date().toISOString().split('T')[0];

    const modal = document.createElement('div');
    modal.id = "addProjectModal";
    modal.className = "fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col p-8 animate-scaleUp">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-2xl font-bold text-gray-800">Tạo dự án mới</h3>
                <p class="text-sm text-gray-400 mt-0.5">Điền thông tin để khởi tạo dự án</p>
            </div>
            <button onclick="document.getElementById('addProjectModal').remove()" class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <i class="fas fa-times text-gray-500"></i>
            </button>
        </div>

        <form id="newProjectForm" class="space-y-4" onsubmit="submitNewProject(event)">
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Tên dự án *</label>
                <input type="text" id="newProjTitle" required placeholder="Nhập tên dự án..." 
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 transition-all">
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Khách hàng</label>
                <select id="newProjClient" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                    <option value="">Chọn khách hàng...</option>
                    ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Phân loại</label>
                <select id="newProjCategory" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                    <option value="Phần mềm">Phần mềm</option>
                    <option value="Xây dựng">Xây dựng</option>
                    <option value="An ninh, kiểm soát truy cập">An ninh, kiểm soát truy cập</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-bold text-gray-600 mb-1.5">Mô tả dự án</label>
                <textarea id="newProjDesc" placeholder="Mô tả tóm tắt..." 
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 h-20 resize-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-600 mb-1.5">Ngày bắt đầu</label>
                    <input type="date" id="newProjStart" min="${today}" onchange="const endEl = document.getElementById('newProjEnd'); endEl.min = this.value; if (endEl.value && endEl.value < this.value) { endEl.value = this.value; }" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-600 mb-1.5">Ngày hoàn thành</label>
                    <input type="date" id="newProjEnd" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50">
                </div>
            </div>
            <div class="pt-4 flex gap-3">
                <button type="button" onclick="document.getElementById('addProjectModal').remove()" 
                        class="flex-1 btn-ghost border border-gray-200 py-3.5 text-center">Hủy</button>
                <button type="submit" class="flex-1 btn-primary py-3.5 text-center">
                     <i class="fas fa-rocket mr-2"></i>Tạo dự án
                </button>
            </div>
        </form>
    </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

window.submitNewProject = async function (e) {
    e.preventDefault();
    const title = document.getElementById('newProjTitle').value.trim();
    const clientId = document.getElementById('newProjClient').value;
    const category = document.getElementById('newProjCategory').value;
    const description = document.getElementById('newProjDesc').value.trim();
    const startDate = document.getElementById('newProjStart').value || null;
    const endDate = document.getElementById('newProjEnd').value || null;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, clientId: clientId || null, category, description, startDate, endDate })
        });
        const result = await res.json();
        if (result.success) {
            window.showToast('✅ Dự án đã được tạo thành công!');
            document.getElementById('addProjectModal').remove();
            fetchProjectsFromServer();
        } else {
            window.showToast('❌ Tạo dự án thất bại: ' + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message, 'error');
    }
};

window.requestProjectApproval = function () {
    window.showToast("⏳ Tính năng gửi yêu cầu phê duyệt dự án!", "info");
};

window.exportExcel = async function () {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/reports/export-progress', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            if (res.status === 403) {
                window.showToast('❌ Bạn không có quyền xuất Excel báo cáo!', 'error');
            } else {
                window.showToast('❌ Lỗi xuất báo cáo tiến độ: ' + res.statusText, 'error');
            }
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bao_cao_tien_do_du_an_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        window.showToast('❌ Lỗi kết nối: ' + err.message, 'error');
    }
};
