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
        { name: "Lập báo giá và xác nhận hợp đồng", icon: "fa-file-invoice-dollar", color: "amber" },
        { name: "Triển khai lắp đặt", icon: "fa-tools", color: "blue" },
        { name: "Bàn giao và nghiệm thu", icon: "fa-clipboard-check", color: "purple" },
        { name: "Thanh toán", icon: "fa-money-bill-wave", color: "emerald" }
    ];

    const currentStep = project.currentStep !== undefined ? project.currentStep : 1;

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
            ${stepNum < 5 ? `<div class="absolute left-[19px] top-[48px] bottom-0 w-0.5 ${stepNum < currentStep ? 'bg-emerald-200' : 'bg-gray-200'}"></div>` : ''}
            
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
                    ${hasTasks ? validTasks.map(task => createTaskCard(task, projectId)).join('')
                : `<div class="py-3 px-4 text-center text-gray-300 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        <i class="fas fa-inbox mr-1"></i> Chưa có công việc cho bước này
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
        } else if (currentStep === 5) {
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
                        <p class="font-extrabold text-blue-800">Đang ở Bước ${currentStep}: ${standardSteps[currentStep - 1]?.name || ''}</p>
                        <p class="text-xs text-blue-600 font-medium">Duyệt hết công việc ở bước hiện tại → hệ thống tự động chuyển sang bước tiếp theo.</p>
                    </div>
                </div>`;
        }
    }

    // Progress indicator
    const progressPercent = Math.round(((currentStep - 1) / 5) * 100);
    const progressHtml = `
    <div class="flex items-center gap-3 mb-4">
        <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <span class="text-xs font-bold text-gray-500">${currentStep}/5</span>
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

function createTaskCard(task, projectId) {
    const { id, title, assignee: user, deadline: date, file, status, files, submit_note, feedback } = task;
    const role = localStorage.getItem('authRole');
    const isNhanSu = role === 'staff';
    const isClient = role === 'client';
    const config = getStatusConfig(status);

    let actionButtons = '';
    if (!isClient) {
        actionButtons += `
            <button onclick="event.stopPropagation(); window.showEditTaskModal('${projectId}', '${id}')" title="Sửa" 
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
                <i class="fas fa-pen text-[10px]"></i>
            </button>
            <button onclick="event.stopPropagation(); window.handleDeleteTask('${projectId}', '${id}')" title="Xóa" 
                    class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
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

                <div class="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 font-medium flex-wrap">
                    <span class="flex items-center gap-1"><i class="fas fa-user-circle text-blue-400"></i>${user}</span>
                    <span class="flex items-center gap-1"><i class="far fa-calendar text-gray-300"></i>${date}</span>
                    <span class="status-chip ${config.chipClass} text-[10px] px-2 py-0.5">${status}</span>
                    ${files && files.length > 0 ? files.map((doc, idx) => {
                        const fileName = doc.file_name || doc.file_path.split('/').pop();
                        return `
                        <a href="#" onclick="event.stopPropagation(); event.preventDefault(); window.previewDocument('${doc.file_path}', '${fileName.replace(/'/g, "\\'")}')" class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors px-1.5 py-0.5 rounded-md shadow-sm">
                            <i class="fas fa-paperclip text-[9px] text-blue-500"></i>
                            <span class="max-w-[120px] truncate" title="${fileName}">${fileName}</span>
                        </a>`;
                    }).join('') : file ? `
                    <a href="#" onclick="event.stopPropagation(); event.preventDefault(); window.previewDocument('${file}', '${file.split('/').pop().replace(/'/g, "\\'")}')" class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors px-1.5 py-0.5 rounded-md shadow-sm">
                        <i class="fas fa-paperclip text-[9px] text-blue-500"></i>
                        <span class="max-w-[120px] truncate" title="${file.split('/').pop()}">${file.split('/').pop()}</span>
                    </a>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
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
                onEnd: function (evt) {
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
        const res = await fetch('/api/users/staff?limit=100', {
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
            const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            const result = await res.json();
            if (result.success) { modal.remove(); refreshProjectDetail(projectId); }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể thêm công việc')); }
        } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
    };
};

window.showEditTaskModal = async function (projectId, taskId) {
    try {
        const token = localStorage.getItem('token');
        const resTasks = await fetch(`/api/tasks/project/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const rTasks = await resTasks.json();
        const task = rTasks.success ? rTasks.data.find(t => String(t.id) === String(taskId)) : null;
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
            const res = await fetch(`/api/tasks/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            const result = await res.json();
            if (result.success) { modal.remove(); refreshProjectDetail(projectId); }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể cập nhật')); }
        };
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.handleDeleteTask = async function (projectId, taskId) {
    if (!await window.showConfirm('Bạn có chắc muốn xóa công việc này?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();
        if (result.success) refreshProjectDetail(projectId);
        else alert('❌ Lỗi: ' + (result.error?.message || 'Không thể xóa'));
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.handleApproveTaskDirect = async function (projectId, taskId) {
    if (!await window.showConfirm('Xác nhận phê duyệt nhanh công việc này?')) return;
    try {
        const token = localStorage.getItem('token');
        const body = { status: 'Đã duyệt', feedback: 'Phê duyệt hoàn thành công việc.' };
        const res = await fetch(`/api/tasks/${taskId}/review`, {
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
            const res = await fetch(`/api/tasks/${taskId}/review`, {
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

window.handlePhancongFileSelect = function (input) {
    const label = document.getElementById('uploadFileNamePhancong');
    if (!label) return;
    if (!input.files || input.files.length === 0) {
        label.textContent = 'Kéo thả hoặc bấm để chọn file (Có thể chọn nhiều)';
        return;
    }
    if (input.files.length === 1) {
        label.textContent = input.files[0].name;
    } else {
        label.textContent = `${input.files.length} file được chọn: ` + Array.from(input.files).map(f => f.name).join(', ');
    }
};

window.showSubmitTaskModal = function (projectId, taskId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4';
    modal.id = "submitTaskModalPhancong";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-cloud-upload-alt text-white"></i>
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-white">Nộp báo cáo kết quả</h2>
                    <p class="text-xs text-purple-100/70">Tải lên các file báo cáo kết quả của bạn</p>
                </div>
            </div>
        </div>
        
        <form id="formSubmitTask" class="p-6">
            <div class="mb-5">
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">File kết quả *</label>
                <div class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group" onclick="this.querySelector('input').click()">
                    <div class="w-14 h-14 bg-gray-100 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                        <i class="fas fa-cloud-upload-alt text-xl text-gray-300 group-hover:text-purple-500 transition-colors"></i>
                    </div>
                    <p class="text-sm text-gray-500 font-semibold text-wrap break-all" id="uploadFileNamePhancong">Kéo thả hoặc bấm để chọn file (Có thể chọn nhiều)</p>
                    <p class="text-[10px] text-gray-400 mt-1">PDF, DOCX, ZIP, RAR, hình ảnh (tối đa 10MB)</p>
                    <input type="file" name="file" required class="hidden" multiple onclick="event.stopPropagation()" onchange="window.handlePhancongFileSelect(this)">
                </div>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200 transition-all">
                    <i class="fas fa-paper-plane mr-1.5"></i>Nộp kết quả
                </button>
            </div>
        </form>
    </div>`;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = modal.querySelector('input[type="file"]');
        if (!fileInput.files || fileInput.files.length === 0) return;

        const fd = new FormData();
        for (let i = 0; i < fileInput.files.length; i++) {
            fd.append('file', fileInput.files[i]);
        }
        fd.append('note', 'Nộp báo cáo kết quả công việc.');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/tasks/${taskId}/submit`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
            const result = await res.json();
            if (result.success) { 
                modal.remove(); 
                alert('✅ Đã nộp báo cáo thành công!');
                refreshProjectDetail(projectId); 
            }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể nộp')); }
        } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
    };
};

window.xemLaiBaoCaoAdmin = function (projectId, taskId) {
    const project = window.projectDetails?.[projectId];
    if (!project) return;
    
    // Find task
    let task = null;
    if (project.assignments) {
        for (const assign of project.assignments) {
            const found = assign.tasks.find(t => String(t.id) === String(taskId));
            if (found) {
                task = found;
                break;
            }
        }
    }
    if (!task) return;

    const formattedDeadline = task.deadline ? task.deadline : 'Không có';

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4";
    modal.id = "viewAdminReportModal";

    let fileHtml = '';
    if (task.files && task.files.length > 0) {
        fileHtml = task.files.map(doc => {
            const fileName = doc.file_name || doc.file_path.split('/').pop();
            return `
            <div class="mt-2 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <div class="flex items-center gap-2.5 overflow-hidden flex-1">
                    <i class="fas fa-file-alt text-blue-500 text-lg flex-shrink-0"></i>
                    <span class="text-xs font-bold text-gray-700 truncate" title="${fileName}">${fileName}</span>
                </div>
                <button onclick="window.previewDocument('${doc.file_path}', '${fileName.replace(/'/g, "\\'")}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex-shrink-0 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ml-2">
                    <i class="fas fa-eye mr-1"></i> Xem trước
                </button>
            </div>`;
        }).join('');
    } else if (task.file) {
        const fileName = task.file.split('/').pop();
        fileHtml = `
        <div class="mt-2 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div class="flex items-center gap-2.5 overflow-hidden flex-1">
                <i class="fas fa-file-alt text-blue-500 text-lg flex-shrink-0"></i>
                <span class="text-xs font-bold text-gray-700 truncate" title="${fileName}">${fileName}</span>
            </div>
            <button onclick="window.previewDocument('${task.file}', '${fileName.replace(/'/g, "\\'")}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex-shrink-0 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ml-2">
                <i class="fas fa-eye mr-1"></i> Xem trước
            </button>
        </div>`;
    } else {
        fileHtml = `<p class="text-xs text-gray-400 italic">Không có file đính kèm</p>`;
    }

    let feedbackHtml = '';
    if (task.feedback) {
        feedbackHtml = `
        <div class="mb-5 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100">
            <span class="block text-xs font-bold text-orange-600 mb-1 uppercase tracking-wider">Phản hồi của người duyệt</span>
            <p class="text-sm font-semibold text-gray-700 leading-relaxed">${task.feedback}</p>
        </div>`;
    }

    let actionButtonsHtml = `
        <button type="button" onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">Đóng</button>
    `;

    if (task.status === 'Đã nộp') {
        actionButtonsHtml = `
            <button type="button" onclick="this.closest('.fixed').remove()" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">Hủy</button>
            <button type="button" onclick="window.xemLaiBaoCaoAdminAction('${projectId}', '${taskId}', 'rework')" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all">
                <i class="fas fa-redo mr-1.5"></i>Yêu cầu sửa
            </button>
            <button type="button" onclick="window.xemLaiBaoCaoAdminAction('${projectId}', '${taskId}', 'approve')" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-200 transition-all">
                <i class="fas fa-check mr-1.5"></i>Duyệt báo cáo
            </button>
        `;
    }

    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-eye text-white"></i>
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-white">Báo cáo công việc (Admin)</h2>
                    <p class="text-xs text-teal-100/70">Chi tiết thông tin nộp báo cáo & duyệt kết quả</p>
                </div>
            </div>
        </div>
        
        <div class="p-6">
            <!-- Task Info -->
            <div class="mb-5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <span class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Thông tin công việc</span>
                <h3 class="text-sm font-bold text-gray-800 leading-snug mb-2">${task.title}</h3>
                <div class="flex flex-wrap gap-2.5 items-center">
                    <span class="text-xs font-semibold text-gray-500">Người thực hiện: <span class="text-gray-700 font-bold">${task.assignee}</span></span>
                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span class="text-xs font-semibold text-gray-500">Hạn chót: <span class="text-gray-700">${formattedDeadline}</span></span>
                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span class="status-chip ${task.status.toLowerCase() === 'đã duyệt' ? 'status-chip-green' : task.status.toLowerCase() === 'đã nộp' ? 'status-chip-blue' : 'status-chip-orange'} text-[10px]">${task.status}</span>
                </div>
            </div>

            <!-- Feedback if exists -->
            ${feedbackHtml}

            <!-- Report content -->
            <div class="mb-5">
                <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Nội dung báo cáo / ghi chú nộp bài</label>
                <div class="bg-gray-50/50 px-4 py-3.5 border border-gray-100 rounded-xl">
                    <p class="text-sm font-semibold text-gray-700 leading-relaxed">${task.submit_note || 'Không có ghi chú'}</p>
                </div>
            </div>

            <!-- Attached File -->
            <div class="mb-6">
                <label class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Các file đính kèm kết quả</label>
                <div class="max-h-48 overflow-y-auto pr-1">
                    ${fileHtml}
                </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                ${actionButtonsHtml}
            </div>
        </div>
    </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

window.xemLaiBaoCaoAdminAction = async function(projectId, taskId, action) {
    document.getElementById('viewAdminReportModal')?.remove();
    if (action === 'approve') {
        await window.handleApproveTaskDirect(projectId, taskId);
    } else if (action === 'rework') {
        window.showReworkTaskModal(projectId, taskId);
    }
};

window.handleAdvanceStep = async function (projectId, nextStep) {
    if (!await window.showConfirm(`Bạn có chắc muốn chuyển dự án sang Bước ${nextStep}?`)) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ step: nextStep }) });
        const result = await res.json();
        if (result.success) { alert(`✅ Đã chuyển sang Bước ${nextStep}!`); refreshProjectDetail(projectId); }
        else { alert('❌ Chuyển bước thất bại: ' + (result.error?.message || 'Có công việc chưa được phê duyệt.')); }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.handleCloseProject = async function (projectId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn hoàn thành dự án này?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/close`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
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

        const res = await fetch('/api/tasks', {
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
