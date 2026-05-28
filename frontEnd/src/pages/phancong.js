// src/pages/phancong.js
const projectDetails = window.projectDetails || {};

export function renderPhancong(projectId) {
    const project = window.projectDetails?.[projectId];
    const role = localStorage.getItem('authRole');
    if (!project) {
        return `<div class="text-red-500 font-bold p-6">Dự án không tồn tại!</div>`;
    }

    const clientQuotations = project.clientQuotations || [];
    const hasApprovedContract = clientQuotations.some(q => q.status === 'approved' || q.status === 'Đã duyệt');

    let contractWarningHtml = '';
    if (!hasApprovedContract && role !== 'client') {
        contractWarningHtml = `
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm mb-4 animate-fadeIn">
                <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                    <i class="fas fa-exclamation-triangle text-lg"></i>
                </div>
                <div>
                    <p class="font-extrabold text-amber-800 font-bold">Dự án chưa xác nhận hợp đồng</p>
                    <p class="text-xs text-amber-600 font-medium font-semibold">Vui lòng phê duyệt báo giá khách hàng để tiến hành phân công công việc.</p>
                </div>
            </div>`;
    }

    const standardSteps = [
        { name: "Khảo sát và lập kế hoạch", icon: "fa-clipboard-list", color: "indigo" },
        { name: "Mua thiết bị và lập báo giá", icon: "fa-shopping-cart", color: "amber" },
        { name: "Xác nhận thỏa thuận", icon: "fa-handshake", color: "cyan" },
        { name: "Triển khai lắp đặt", icon: "fa-tools", color: "blue" },
        { name: "Bàn giao và nghiệm thu", icon: "fa-clipboard-check", color: "purple" },
        { name: "Thanh toán", icon: "fa-money-bill-wave", color: "emerald" }
    ];

    const currentStep = project.currentStep || 1;

    const timelineHtml = standardSteps.map((step, index) => {
        const stepNum = index + 1;
        const assignment = project.assignments ? project.assignments.find(a => a.step && a.step.includes(`Bước ${stepNum}:`)) : null;
        const validTasks = assignment && assignment.tasks ? assignment.tasks.filter(task => task.title && String(task.title).trim() !== "") : [];
        const hasTasks = validTasks.length > 0;

        let stepStatus = 'pending';
        let dotClass = 'bg-gray-200 border-gray-300';
        let headerBg = 'bg-gray-50';
        let iconColor = 'text-gray-400';

        if (stepNum < currentStep) {
            stepStatus = 'completed';
            dotClass = 'bg-emerald-500 border-emerald-500 shadow-emerald-200';
            headerBg = 'bg-emerald-50/50';
            iconColor = 'text-emerald-600';
        } else if (stepNum === currentStep) {
            stepStatus = 'active';
            dotClass = 'bg-blue-500 border-blue-500 shadow-blue-200 animate-glow';
            headerBg = 'bg-blue-50/50';
            iconColor = 'text-blue-600';
        }

        return `
        <div class="relative animate-fadeInUp" style="animation-delay: ${index * 0.08}s; animation-fill-mode: both;">
            <!-- Timeline connector -->
            ${stepNum < 6 ? `<div class="absolute left-[19px] top-[48px] bottom-0 w-0.5 ${stepNum < currentStep ? 'bg-emerald-200' : 'bg-gray-200'}"></div>` : ''}
            
            <!-- Step Header -->
            <div class="flex items-center gap-3 mb-3 ${headerBg} rounded-xl p-3 border border-transparent hover:border-gray-200 transition-all group">
                <div class="relative z-10 w-10 h-10 rounded-xl ${dotClass} border-2 flex items-center justify-center shadow-sm flex-shrink-0 transition-all">
                    ${stepStatus === 'completed' 
                        ? '<i class="fas fa-check text-white text-sm"></i>' 
                        : `<i class="fas ${step.icon} ${stepStatus === 'active' ? 'text-white' : iconColor} text-sm"></i>`}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-800 text-sm">Bước ${stepNum}: ${step.name}</h3>
                    <p class="text-xs text-gray-400 font-medium">${validTasks.length} công việc ${stepStatus === 'completed' ? '• Hoàn thành' : stepStatus === 'active' ? '• Đang thực hiện' : ''}</p>
                </div>
                ${(role !== 'client') ? `<button onclick="window.addNewTaskInline('${projectId}', ${stepNum})" 
                        class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all text-xs">
                    <i class="fas fa-plus"></i>
                </button>` : ''}
            </div>

            <!-- Tasks Container (Drag & Drop) -->
            <div class="ml-[19px] pl-6 border-l-2 ${stepNum < currentStep ? 'border-emerald-100' : stepNum === currentStep ? 'border-blue-100' : 'border-gray-100'} pb-4">
                <div class="space-y-2 task-sortable-list" data-step="${stepNum}" data-project="${projectId}">
                    ${hasTasks ? validTasks.map(task => createTaskCard(task.id, task.title, task.assignee, task.deadline, task.file, task.status, projectId)).join('') 
                    : `<div class="py-3 px-4 text-center text-gray-300 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        <i class="fas fa-inbox mr-1"></i> Kéo thả công việc vào đây hoặc bấm + để thêm
                    </div>`}
                </div>
            </div>
        </div>`;
    }).join('');

    let advanceStepControlHtml = '';
    if (role === 'admin') {
        const isCompleted = project.profile?.status === 'Hoàn thành';
        if (isCompleted) {
            advanceStepControlHtml = `
                <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fadeIn">
                    <div class="w-12 h-12 gradient-success rounded-xl flex items-center justify-center text-white shadow-md">
                        <i class="fas fa-trophy text-lg"></i>
                    </div>
                    <div>
                        <p class="font-extrabold text-emerald-800">Dự án đã hoàn thành</p>
                        <p class="text-xs text-emerald-600 font-medium">Tất cả các giai đoạn đã được kết thúc tốt đẹp.</p>
                    </div>
                </div>`;
        } else if (currentStep === 6) {
            advanceStepControlHtml = `
                <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fadeIn">
                    <div class="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center text-white shadow-md">
                        <i class="fas fa-flag-checkered text-lg"></i>
                    </div>
                    <div>
                        <p class="font-extrabold text-blue-800">Giai đoạn cuối: Thanh toán</p>
                        <p class="text-xs text-blue-600 font-medium">Giai đoạn thanh toán và nghiệm thu cuối cùng.</p>
                    </div>
                </div>`;
        } else {
            advanceStepControlHtml = `
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fadeIn">
                    <div class="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center text-white shadow-md animate-float">
                        <i class="fas fa-tasks text-lg"></i>
                    </div>
                    <div>
                        <p class="font-extrabold text-blue-800">Đang ở Bước ${currentStep}: ${standardSteps[currentStep-1]?.name || ''}</p>
                        <p class="text-xs text-blue-600 font-medium">Duyệt hết công việc ở bước hiện tại → hệ thống tự động chuyển sang bước tiếp theo.</p>
                    </div>
                </div>`;
        }
    }

    // Progress indicator
    const progressPercent = Math.round(((currentStep - 1) / 6) * 100);
    const progressHtml = `
    <div class="flex items-center gap-3 mb-4">
        <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <span class="text-xs font-bold text-gray-500">${currentStep}/6</span>
    </div>`;

    return `
    <div class="h-full flex flex-col space-y-4 overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        ${progressHtml}
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            ${timelineHtml}
        </div>
    </div>`;
}

function getStatusConfig(status) {
    if (!status) return { bg: "bg-gray-100", text: "text-gray-600", icon: "fa-circle", chipClass: "status-chip-gray" };
    switch (status.toLowerCase()) {
        case "đã duyệt": return { bg: "bg-emerald-50", text: "text-emerald-700", icon: "fa-check-circle", chipClass: "status-chip-green" };
        case "đã nộp": return { bg: "bg-blue-50", text: "text-blue-700", icon: "fa-paper-plane", chipClass: "status-chip-blue" };
        case "cần sửa": return { bg: "bg-orange-50", text: "text-orange-700", icon: "fa-exclamation-circle", chipClass: "status-chip-orange" };
        default: return { bg: "bg-gray-50", text: "text-gray-600", icon: "fa-clock", chipClass: "status-chip-gray" };
    }
}

function createTaskCard(id, title, user, date, file, status, projectId) {
    const role = localStorage.getItem('authRole');
    const isNhanSu = role === 'staff';
    const isClient = role === 'client';
    const config = getStatusConfig(status);

    let actionButtons = '';
    if (!isClient) {
        actionButtons += `
            <button onclick="event.stopPropagation(); window.showEditTaskModal('${projectId}', '${id}')" title="Sửa" 
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all opacity-0 group-hover:opacity-100">
                <i class="fas fa-pen text-[10px]"></i>
            </button>
            <button onclick="event.stopPropagation(); window.handleDeleteTask('${projectId}', '${id}')" title="Xóa" 
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all opacity-0 group-hover:opacity-100">
                <i class="fas fa-trash text-[10px]"></i>
            </button>`;
    }
    if (status === 'Đã nộp' && !isClient && !isNhanSu) {
        actionButtons += `
            <button onclick="event.stopPropagation(); window.handleApproveTaskDirect('${projectId}', '${id}')" title="Duyệt trực tiếp" 
                    class="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">
                <i class="fas fa-check text-[10px]"></i>
            </button>
            <button onclick="event.stopPropagation(); window.showReworkTaskModal('${projectId}', '${id}')" title="Yêu cầu làm lại / Bình luận" 
                    class="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                <i class="fas fa-redo text-[10px]"></i>
            </button>`;
    }
    if (isNhanSu && (status === 'Chưa nộp' || status === 'Cần sửa')) {
        actionButtons += `
            <button onclick="event.stopPropagation(); window.showSubmitTaskModal('${projectId}', '${id}')" title="Nộp báo cáo" 
                    class="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all">
                <i class="fas fa-upload text-[10px]"></i>
            </button>`;
    }

    return `
    <div class="group ${config.bg} p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing hover:shadow-md relative" data-task-id="${id}">
        <div class="flex items-center gap-3">
            <div class="drag-handle flex-shrink-0 text-gray-300">
                <i class="fas fa-grip-vertical text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-gray-800 truncate">${title}</p>
                <div class="flex items-center gap-3 mt-1 text-[11px] text-gray-500 font-medium">
                    <span class="flex items-center gap-1"><i class="fas fa-user-circle text-blue-400"></i>${user}</span>
                    <span class="flex items-center gap-1"><i class="far fa-calendar text-gray-300"></i>${date}</span>
                    ${file ? `<a href="http://localhost:3000${file}" target="_blank" onclick="event.stopPropagation()" class="text-blue-500 hover:underline flex items-center gap-1"><i class="fas fa-paperclip"></i>Tài liệu</a>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
                <span class="status-chip ${config.chipClass} text-[10px] px-2 py-0.5">${status}</span>
                ${actionButtons}
            </div>
        </div>
    </div>`;
}

// Initialize drag-and-drop after render
setTimeout(() => {
    if (typeof Sortable !== 'undefined') {
        const role = localStorage.getItem('authRole');
        const isClient = role === 'client';
        const firstEl = document.querySelector('.task-sortable-list');
        const projectId = firstEl ? firstEl.dataset.project : '';
        const projObj = window.projectDetails?.[projectId];
        const clientQuotations = projObj ? (projObj.clientQuotations || []) : [];
        const hasApprovedContract = clientQuotations.some(q => q.status === 'approved' || q.status === 'Đã duyệt');
        const isDragDisabled = isClient;

        document.querySelectorAll('.task-sortable-list').forEach(el => {
            Sortable.create(el, {
                group: 'tasks',
                animation: 200,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                handle: '.drag-handle',
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                disabled: isDragDisabled,
                onEnd: function(evt) {
                    // Could implement task reordering API call here
                    console.log('Task moved:', evt.item.dataset.taskId, 'to step:', evt.to.dataset.step);
                }
            });
        });
    }
}, 100);

// Helpers
async function fetchStaffList() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/users/staff?limit=100', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        return result.success ? result.data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function refreshProjectDetail(projectId) {
    const modal = document.getElementById('projectDetailModal');
    if (modal) modal.remove();
    const role = localStorage.getItem('authRole');
    const { openProjectDetail } = await import('./chitietduan.js');
    await openProjectDetail(projectId, role);
    const tabBtn = document.getElementById('tab-phancong');
    if (tabBtn) tabBtn.click();
}

function parseDateToInput(dateStr) {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
}

window.showAddTaskModal = async function (projectId, stepNum) {
    const project = window.projectDetails?.[projectId];
    const members = project?.profile?.members || [];
    const staffOptions = members.map(s => `<option value="${s.id}">${s.name} (${s.role || ''})</option>`).join('');

    const today = new Date().toISOString().split('T')[0];
    const pStartDate = parseDateToInput(project?.profile?.startDate);
    const minDeadline = (pStartDate && pStartDate > today) ? pStartDate : today;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white">
                <i class="fas fa-plus"></i>
            </div>
            <div>
                <h3 class="text-lg font-extrabold text-gray-800">Thêm công việc mới</h3>
                <p class="text-xs text-gray-400">Bước ${stepNum}</p>
            </div>
        </div>
        <form id="formAddTask" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tiêu đề</label>
                <input type="text" name="title" required placeholder="Nhập tiêu đề công việc..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Mô tả</label>
                <textarea name="description" placeholder="Mô tả chi tiết..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="2"></textarea>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Người thực hiện</label>
                <select name="assignee_id" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                    <option value="">-- Chọn nhân sự --</option>
                    ${staffOptions}
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Hạn hoàn thành</label>
                <input type="date" name="deadline" min="${minDeadline}" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="btn-primary text-sm px-5 py-2">Thêm công việc</button>
            </div>
        </form>
    </div>`;

    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const body = { project_id: projectId, step: stepNum, title: fd.get('title'), description: fd.get('description'), assignee_id: fd.get('assignee_id') || null, deadline: fd.get('deadline') || null };
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            const result = await res.json();
            if (result.success) { modal.remove(); refreshProjectDetail(projectId); }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể thêm công việc')); }
        } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
    };
};

window.showEditTaskModal = async function (projectId, taskId) {
    try {
        const token = localStorage.getItem('token');
        const resTasks = await fetch(`http://localhost:3000/api/tasks/project/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const rTasks = await resTasks.json();
        const task = rTasks.success ? rTasks.data.find(t => t.id === taskId) : null;
        if (!task) { alert('Không tìm thấy thông tin công việc!'); return; }

        const project = window.projectDetails?.[projectId];
        const members = project?.profile?.members || [];
        const staffOptions = members.map(s => `<option value="${s.id}" ${s.id === task.assignee_id ? 'selected' : ''}>${s.name} (${s.role || ''})</option>`).join('');

        const today = new Date().toISOString().split('T')[0];
        const pStartDate = parseDateToInput(project?.profile?.startDate);
        const minDeadline = (pStartDate && pStartDate > today) ? pStartDate : today;

        const formattedDeadline = task.deadline ? new Date(task.deadline).toISOString().substring(0, 10) : '';

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4';
        modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <i class="fas fa-edit"></i>
                </div>
                <h3 class="text-lg font-extrabold text-gray-800">Chỉnh sửa công việc</h3>
            </div>
            <form id="formEditTask" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tiêu đề</label>
                    <input type="text" name="title" required value="${task.title || ''}" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Mô tả</label>
                    <textarea name="description" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="2">${task.description || ''}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Người thực hiện</label>
                    <select name="assignee_id" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                        <option value="">-- Chọn nhân sự --</option>
                        ${staffOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Hạn hoàn thành</label>
                    <input type="date" name="deadline" value="${formattedDeadline}" min="${minDeadline}" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                </div>
                <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                    <button type="submit" class="btn-primary text-sm px-5 py-2">Lưu thay đổi</button>
                </div>
            </form>
        </div>`;
        document.body.appendChild(modal);
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        modal.querySelector('form').onsubmit = async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const body = { title: fd.get('title'), description: fd.get('description'), assignee_id: fd.get('assignee_id') || null, deadline: fd.get('deadline') || null };
            const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            const result = await res.json();
            if (result.success) { modal.remove(); refreshProjectDetail(projectId); }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể cập nhật')); }
        };
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.handleDeleteTask = async function (projectId, taskId) {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();
        if (result.success) refreshProjectDetail(projectId);
        else alert('❌ Lỗi: ' + (result.error?.message || 'Không thể xóa'));
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.handleApproveTaskDirect = async function (projectId, taskId) {
    if (!confirm('Xác nhận phê duyệt nhanh công việc này?')) return;
    try {
        const token = localStorage.getItem('token');
        const body = { status: 'Đã duyệt', feedback: 'Phê duyệt hoàn thành công việc.' };
        const res = await fetch(`http://localhost:3000/api/tasks/${taskId}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Đã phê duyệt công việc thành công!');
            refreshProjectDetail(projectId);
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể phê duyệt'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

window.showReworkTaskModal = function (projectId, taskId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <i class="fas fa-redo-alt"></i>
            </div>
            <div>
                <h3 class="text-lg font-extrabold text-gray-800">Yêu cầu sửa đổi</h3>
                <p class="text-xs text-gray-400">Bình luận và chỉ rõ nội dung cần làm lại</p>
            </div>
        </div>
        <form id="formReworkTask" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Ý kiến bình luận / Yêu cầu chi tiết</label>
                <textarea name="feedback" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="4" placeholder="Nhập ý kiến bình luận cần chỉnh sửa..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5">
                    <i class="fas fa-paper-plane"></i> Gửi yêu cầu
                </button>
            </div>
        </form>
    </div>`;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const body = { status: 'Cần sửa', feedback: fd.get('feedback') };
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/tasks/${taskId}/review`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify(body) 
            });
            const result = await res.json();
            if (result.success) { 
                modal.remove(); 
                refreshProjectDetail(projectId); 
            } else { 
                alert('❌ Lỗi: ' + (result.error?.message || 'Không thể gửi yêu cầu')); 
            }
        } catch (err) { 
            alert('❌ Lỗi kết nối: ' + err.message); 
        }
    };
};

window.showSubmitTaskModal = function (projectId, taskId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h3 class="text-lg font-extrabold text-gray-800">Nộp báo cáo kết quả</h3>
        </div>
        <form id="formSubmitTask" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Tài liệu đính kèm</label>
                <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer" onclick="this.querySelector('input').click()">
                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-300 mb-2"></i>
                    <p class="text-xs text-gray-500 font-medium">Kéo thả hoặc bấm để chọn file</p>
                    <input type="file" name="file" required class="hidden" onchange="this.closest('div').querySelector('p').textContent = this.files[0]?.name || 'Chọn file...'">
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Ghi chú</label>
                <textarea name="note" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm resize-none" rows="2" placeholder="Ghi chú thêm..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="btn-primary text-sm px-5 py-2">Nộp kết quả</button>
            </div>
        </form>
    </div>`;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/tasks/${taskId}/submit`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
            const result = await res.json();
            if (result.success) { modal.remove(); refreshProjectDetail(projectId); }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể nộp')); }
        } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
    };
};

window.handleAdvanceStep = async function (projectId, nextStep) {
    if (!confirm(`Bạn có chắc muốn chuyển dự án sang Bước ${nextStep}?`)) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/projects/${projectId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ step: nextStep }) });
        const result = await res.json();
        if (result.success) { alert(`✅ Đã chuyển sang Bước ${nextStep}!`); refreshProjectDetail(projectId); }
        else { alert('❌ Chuyển bước thất bại: ' + (result.error?.message || 'Có công việc chưa được phê duyệt.')); }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.handleCloseProject = async function (projectId) {
    if (!confirm('Bạn có chắc chắn muốn hoàn thành dự án này?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/projects/${projectId}/close`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();
        if (result.success) { alert('✅ Dự án đã hoàn thành!'); refreshProjectDetail(projectId); }
        else { alert('❌ Hoàn thành thất bại: ' + (result.error?.message || 'Có lỗi xảy ra.')); }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.addNewTaskInline = async function (projectId, stepNum) {
    const project = window.projectDetails?.[projectId];
    if (!project) return;

    // Find the task list container for this step
    const listContainer = document.querySelector(`.task-sortable-list[data-step="${stepNum}"][data-project="${projectId}"]`);
    if (!listContainer) return;

    // Remove any existing inline add cards to prevent duplicates
    const existingCard = listContainer.querySelector('.inline-add-task-card');
    if (existingCard) {
        existingCard.querySelector('.inline-task-title')?.focus();
        return;
    }

    // Hide placeholder if any
    const placeholder = listContainer.querySelector('.border-dashed');
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    const members = project?.profile?.members || [];
    const staffOptions = members.map(s => `<option value="${s.id}">${s.name} (${s.role || ''})</option>`).join('');

    const today = new Date().toISOString().split('T')[0];
    const pStartDate = parseDateToInput(project?.profile?.startDate);
    const minDeadline = (pStartDate && pStartDate > today) ? pStartDate : today;

    const card = document.createElement('div');
    card.className = "inline-add-task-card bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-md space-y-3 animate-scaleUp mt-2";
    card.innerHTML = `
        <div class="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <i class="fas fa-plus-circle"></i> Tạo công việc mới (Bước ${stepNum})
        </div>
        <div>
            <input type="text" placeholder="Nhập tiêu đề công việc..." 
                   class="inline-task-title w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-gray-50/50 font-bold text-gray-800">
        </div>
        <div>
            <textarea placeholder="Mô tả công việc (không bắt buộc)..." 
                      class="inline-task-desc w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 bg-gray-50/50 text-gray-600 resize-none" rows="1.5"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div>
                <label class="block text-[10px] font-black text-gray-400 mb-1 uppercase">Người phụ trách</label>
                <select class="inline-task-assignee w-full px-2.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-gray-600">
                    <option value="">-- Chọn nhân sự --</option>
                    ${staffOptions}
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-black text-gray-400 mb-1 uppercase">Hạn hoàn thành</label>
                <input type="date" min="${minDeadline}" 
                       class="inline-task-deadline w-full px-2.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50/50 text-gray-600">
            </div>
        </div>
        <div class="flex justify-end gap-2 text-xs font-bold pt-1">
            <button onclick="window.cancelInlineTask(this)" 
                    class="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">Hủy</button>
            <button onclick="window.saveInlineTask('${projectId}', ${stepNum}, this)" 
                    class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"><i class="fas fa-save"></i> Thêm</button>
        </div>
    `;

    listContainer.appendChild(card);
    card.querySelector('.inline-task-title')?.focus();
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.cancelInlineTask = function (btn) {
    const listContainer = btn.closest('.task-sortable-list');
    btn.closest('.inline-add-task-card').remove();
    if (listContainer) {
        const hasTasks = listContainer.querySelectorAll('.group[data-task-id]').length > 0;
        if (!hasTasks) {
            const placeholder = listContainer.querySelector('.border-dashed');
            if (placeholder) {
                placeholder.style.display = 'block';
            }
        }
    }
};

window.saveInlineTask = async function (projectId, stepNum, btn) {
    const card = btn.closest('.inline-add-task-card');
    const titleInput = card.querySelector('.inline-task-title');
    const descInput = card.querySelector('.inline-task-desc');
    const assigneeSelect = card.querySelector('.inline-task-assignee');
    const deadlineInput = card.querySelector('.inline-task-deadline');

    const title = titleInput?.value.trim() || '';
    if (!title) {
        alert('❌ Tiêu đề công việc không được để trống!');
        titleInput?.focus();
        return;
    }

    const description = descInput?.value.trim() || '';
    const assignee_id = assigneeSelect?.value || null;
    const deadline = deadlineInput?.value || null;

    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const token = localStorage.getItem('token');
        const body = { project_id: projectId, step: stepNum, title, description, assignee_id, deadline };
        
        const res = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
            card.remove();
            refreshProjectDetail(projectId);
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể thêm công việc'));
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
};
