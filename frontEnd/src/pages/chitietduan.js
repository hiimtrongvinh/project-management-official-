// src/pages/chitietduan.js
import { renderHoso } from './hoso.js';
import { renderPhancong } from './phancong.js';
import { renderTabVattuDuan } from './vattuduan.js';

window.projectDetails = window.projectDetails || {};
const projectDetails = window.projectDetails;
window.isProjectEditMode = false;

export async function openProjectDetail(projectId, roleParam, activeTab = 'hoso') {
    window.isProjectEditMode = false;

    try {
        const token = localStorage.getItem('token');

        const projectRes = await fetch(`/api/projects/${projectId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const projectResult = await projectRes.json();
        if (!projectResult.success) { alert('Không thể tải chi tiết dự án!'); return; }
        const projData = projectResult.data;

        const tasksRes = await fetch(`/api/tasks/project/${projectId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasksResult = await tasksRes.json();
        const tasks = tasksResult.success ? tasksResult.data : [];

        try {
            const clientsRes = await fetch('/api/users/clients?limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const clientsResult = await clientsRes.json();
            window.cachedClients = clientsResult.success ? clientsResult.data : [];
        } catch (e) { window.cachedClients = []; }

        let projectMaterials = [];
        let clientQuotations = [];
        let supplierQuotations = [];
        try {
            const ordersRes = await fetch(`/api/orders/project/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const ordersResult = await ordersRes.json();
            const orders = ordersResult.success ? ordersResult.data : [];

            orders.forEach(o => {
                const supplierName = o.supplier_name || o.supplier_id || 'Nhà cung cấp';
                const statusLabel = o.status === 'Hoàn thành' ? 'Hoàn thành' :
                    o.status === 'Đang giao' ? 'Đang giao' :
                        o.status === 'Đã xác nhận' ? 'Đã xác nhận' :
                            o.status === 'Đang xử lý' ? 'Chờ chốt đơn' :
                                o.status === 'Mới' ? 'Mới' :
                                    o.status === 'Hủy' ? 'Đã hủy' :
                                        o.status === 'Chưa đặt hàng' ? 'Chưa đặt hàng' : 'Yêu cầu báo giá';
                if (o.items && o.items.length > 0) {
                    o.items.forEach(item => {
                        const priceBuy = parseFloat(item.material_price || 0);
                        const markup = parseInt(item.markup || 10);
                        projectMaterials.push({
                            id: item.id,
                            name: item.material_name || 'Vật tư không tên',
                            priceBuy: priceBuy,
                            quantity: parseInt(item.quantity || 1),
                            markup: markup,
                            supplier: supplierName,
                            supplier_id: o.supplier_id,
                            status: statusLabel,
                            material_id: item.material_id
                        });
                    });
                }
            });
        } catch (e) {
            console.error('Lỗi tải đơn hàng/vật tư:', e);
        }

        if (projData.current_step === 2) {
            clientQuotations.push({
                id: `BG-${projectId}`,
                status: 'pending',
                project_title: projData.title
            });
        } else if (projData.current_step >= 3) {
            clientQuotations.push({
                id: `BG-${projectId}`,
                status: 'approved',
                project_title: projData.title
            });
        }

        const assignments = [1, 2, 3, 4, 5].map(stepNum => {
            const stepTasks = tasks.filter(t => t.step === stepNum).map(t => ({
                id: t.id, title: t.title || t.description || 'Không có tiêu đề',
                assignee: t.assignee_name || 'Chưa phân công',
                deadline: t.deadline ? new Date(t.deadline).toLocaleDateString('vi-VN') : 'Không có',
                file: t.file_path || '', status: t.status || 'Chưa nộp',
                files: t.files || [],
                submit_note: t.submit_note || '',
                feedback: t.feedback || ''
            }));
            return { step: `Bước ${stepNum}:`, tasks: stepTasks };
        });

        const totalTasksCount = tasks.length;
        const approvedTasksCount = tasks.filter(t => t.status === 'Đã duyệt').length;

        projectDetails[projectId] = {
            id: projectId, currentStep: projData.current_step || 1,
            profile: {
                title: projData.title, description: projData.description || 'Chưa có mô tả chi tiết.',
                category: projData.category || 'Chưa phân loại',
                startDate: projData.start_date ? new Date(projData.start_date).toLocaleDateString('vi-VN') : '--/--/----',
                endDate: projData.end_date ? new Date(projData.end_date).toLocaleDateString('vi-VN') : '--/--/----',
                status: projData.status || 'Khởi tạo', progress: projData.progress || 0,
                client: projData.client_name || 'Không có',
                clientId: projData.client_id || null,
                budget: projData.budget ? `${projData.budget.toLocaleString()}đ` : 'Chưa có',
                members: projData.members ? projData.members.map(m => ({ id: m.staff_id || m.id, name: m.staff_name || m.name, role: m.role || 'Thành viên', avatar: m.avatar || null })) : [],
                documents: projData.documents ? projData.documents.map(d => d.file_name) : []
            },
            documentsList: projData.documents || [],
            assignments: assignments, materials: projectMaterials,
            taskInfo: `${approvedTasksCount}/${totalTasksCount}`,
            clientQuotations: clientQuotations,
            supplierQuotations: supplierQuotations
        };
    } catch (err) {
        console.error('Lỗi tải chi tiết dự án:', err);
        alert('❌ Đã xảy ra lỗi khi đồng bộ dữ liệu dự án từ máy chủ.');
        return;
    }

    const projectDetail = projectDetails[projectId];
    const projectName = projectDetail.profile.title;
    const role = roleParam || localStorage.getItem('authRole');
    const isClient = role === 'client';

    const clientQuotations = projectDetail.clientQuotations || [];
    const hasApprovedContract = clientQuotations.some(q => q.status === 'approved' || q.status === 'Đã duyệt');

    const standardSteps = [
        "Khảo sát và lập kế hoạch",
        "Lập báo giá và xác nhận hợp đồng",
        "Triển khai lắp đặt",
        "Bàn giao và nghiệm thu",
        "Thanh toán"
    ];
    const currentStepName = standardSteps[(projectDetail.currentStep || 1) - 1] || '';

    const isAdmin = role === 'admin';
    const isPendingApproval = projectDetail.currentStep === 0;
    const actionButtonsHtml = isAdmin ? `
        <div id="modal-action-buttons" class="flex items-center gap-2">
            ${isPendingApproval ? `
            <button onclick="window.approveProject('${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-sm transition-all animate-pulse">
                <i class="fas fa-check text-xs"></i> Phê duyệt dự án
            </button>
            ` : ''}
            <button onclick="window.toggleEditProject(true, '${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm transition-all">
                <i class="fas fa-edit text-xs"></i> Sửa
            </button>
            <button onclick="window.deleteProject('${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm transition-all">
                <i class="fas fa-trash text-xs"></i> Xóa
            </button>
        </div>` : '';

    const existingModal = document.getElementById('projectDetailModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'projectDetailModal';
    modal.className = 'fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4 animate-fadeIn';

    const tabItems = [
        { id: 'hoso', label: 'Hồ sơ', icon: 'fa-file-alt' },
        { id: 'phancong', label: isClient ? 'Tiến độ' : 'Phân công', icon: 'fa-tasks' },
        { id: 'vattuduan', label: isClient ? 'Báo giá' : 'Vật tư', icon: 'fa-boxes' }
    ];

    const tabsHtml = tabItems.map(tab => `
        <button onclick="switchTab(this, '${tab.id}', '${projectId}')" id="tab-${tab.id}" 
                class="tab-button flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${tab.id === activeTab ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}">
            <i class="fas ${tab.icon} text-xs"></i> ${tab.label}
        </button>
    `).join('');

    modal.innerHTML = `
    <div class="bg-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl flex overflow-hidden relative animate-scaleUp border border-gray-100">
        <div class="flex-1 flex flex-col h-full overflow-hidden">
            <div class="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div class="flex items-center gap-4 flex-1 min-w-0 mr-6">
                    <div class="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <i class="fas fa-project-diagram text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 id="projectTitleContainer" class="text-lg font-extrabold text-gray-800 truncate w-full">${projectName}</h2>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${actionButtonsHtml}
                    <button onclick="document.getElementById('projectDetailModal').remove()" 
                            class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-all">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="px-6 py-2 border-b border-gray-50 bg-gray-50/50 flex-shrink-0 flex flex-wrap justify-between items-center gap-3">
                <div class="flex items-center gap-1">${tabsHtml}</div>
            </div>

            <!-- Content -->
            <div class="flex-1 px-6 py-5 bg-gray-50/30 overflow-hidden flex flex-col">
                <div id="modalContent" class="flex-1 overflow-hidden animate-fadeIn"></div>
            </div>
        </div>
    </div>`;

    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const defaultTabBtn = document.getElementById(`tab-${activeTab}`) || document.getElementById('tab-hoso');
    window.switchTab(defaultTabBtn, activeTab, projectId);
}

window.toggleEditProject = function (isEdit, projectId) {
    window.isProjectEditMode = isEdit;
    const btnContainer = document.getElementById('modal-action-buttons');

    if (btnContainer) {
        if (isEdit) {
            btnContainer.innerHTML = `
                <button onclick="window.toggleEditProject(false, '${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-sm transition-all">
                    <i class="fas fa-times text-xs"></i> Hủy
                </button>
                <button onclick="window.saveProject('${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl gradient-success text-white font-bold text-sm transition-all shadow-md hover:shadow-lg">
                    <i class="fas fa-save text-xs"></i> Lưu
                </button>`;
        } else {
            btnContainer.innerHTML = `
                <button onclick="window.toggleEditProject(true, '${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm transition-all">
                    <i class="fas fa-edit text-xs"></i> Sửa
                </button>
                <button onclick="window.deleteProject('${projectId}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm transition-all">
                    <i class="fas fa-trash text-xs"></i> Xóa
                </button>`;
        }
    }

    const titleContainer = document.getElementById('projectTitleContainer');
    if (titleContainer) {
        if (isEdit) {
            const currentTitle = titleContainer.innerText.trim();
            titleContainer.innerHTML = `<input id="editProjectTitle" type="text" value="${currentTitle}" class="w-full text-lg font-extrabold text-gray-800 focus:outline-none bg-transparent border-b-2 border-blue-400 py-1 transition-all">`;
        } else {
            const inputEl = document.getElementById('editProjectTitle');
            const newTitle = inputEl ? inputEl.value.trim() : titleContainer.innerText.trim();
            titleContainer.innerHTML = newTitle;
        }
    }

    const tabHosoBtn = document.getElementById('tab-hoso');
    if (tabHosoBtn) window.switchTab(tabHosoBtn, 'hoso', projectId);
};

window.saveProject = async function (projectId) {
    const title = document.getElementById('editProjectTitle')?.value.trim();
    const description = document.getElementById('editProjectDescription')?.value.trim();
    const clientId = document.getElementById('editProjectClient')?.value;
    const category = document.getElementById('editProjectCategory')?.value;
    const budgetRaw = document.getElementById('editProjectBudget')?.value || '';
    const budget = budgetRaw.replace(/[^0-9]/g, '') ? parseInt(budgetRaw.replace(/[^0-9]/g, '')) : null;
    const endDate = document.getElementById('editProjectEndDate')?.value || null;

    if (!title) { alert('❌ Tiêu đề dự án không được để trống!'); return; }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, description, clientId: clientId || null, category, budget, endDate })
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Đã lưu thông tin dự án!');
            window.toggleEditProject(false, projectId);
            await openProjectDetail(projectId);
            if (typeof window.fetchProjectsFromServer === 'function') window.fetchProjectsFromServer();
        } else {
            alert('❌ Cập nhật thất bại: ' + (result.error?.message || 'Lỗi không xác định'));
        }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

export function switchTab(btn, tab, projectId) {
    document.querySelectorAll('.tab-button').forEach((b) => {
        b.classList.remove('bg-blue-50', 'text-blue-600');
        b.classList.add('text-gray-400');
    });

    if (btn) {
        btn.classList.add('bg-blue-50', 'text-blue-600');
        btn.classList.remove('text-gray-400');
    }

    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;

    const role = localStorage.getItem('authRole');

    if (tab === 'hoso') {
        const renderHosoFn = window.renderHoso || renderHoso;
        if (typeof renderHosoFn === 'function') {
            try {
                modalContent.innerHTML = renderHosoFn(projectId, window.isProjectEditMode);
            } catch (e) {
                console.error("Lỗi renderHoso:", e);
                modalContent.innerHTML = `<div class="text-red-500 p-6 font-bold">Lỗi hiển thị hồ sơ: ${e.message}</div>`;
            }
        }
    } else if (tab === 'phancong') {
        const renderPhancongFn = window.renderPhancong || renderPhancong;
        if (typeof renderPhancongFn === 'function') {
            try {
                modalContent.innerHTML = renderPhancongFn(projectId, role);
            } catch (e) {
                console.error("Lỗi renderPhancong:", e);
                modalContent.innerHTML = `<div class="text-red-500 p-6 font-bold">Lỗi hiển thị phân công: ${e.message}</div>`;
            }
        } else {
            console.error("renderPhancongFn is not a function");
            modalContent.innerHTML = `<div class="text-red-500 p-6 font-bold">Không tìm thấy hàm hiển thị phân công!</div>`;
        }
    } else if (tab === 'vattuduan') {
        const renderTabVattuDuanFn = window.renderTabVattuDuan || renderTabVattuDuan;
        if (typeof renderTabVattuDuanFn === 'function') {
            try {
                modalContent.innerHTML = renderTabVattuDuanFn(projectId, role);
            } catch (e) {
                console.error("Lỗi renderTabVattuDuan:", e);
                modalContent.innerHTML = `<div class="text-red-500 p-6 font-bold">Lỗi hiển thị vật tư dự án: ${e.message}</div>`;
            }
        }
    }
}

window.switchTab = switchTab;
window.openProjectDetail = openProjectDetail;

window.deleteProject = async function (projectId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn xóa dự án này? Thao tác này không thể hoàn tác.')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Dự án đã được xóa!');
            const modal = document.getElementById('projectDetailModal');
            if (modal) modal.remove();
            if (typeof window.fetchProjectsFromServer === 'function') window.fetchProjectsFromServer();
        } else {
            alert('❌ Xóa thất bại: ' + (result.error?.message || 'Lỗi không xác định'));
        }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};

window.approveProject = async function (projectId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn phê duyệt dự án này và chuyển sang giai đoạn Khảo sát và lập kế hoạch (bước 1)?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${projectId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ step: 1 })
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Phê duyệt dự án thành công!');
            await openProjectDetail(projectId);
            if (typeof window.fetchProjectsFromServer === 'function') window.fetchProjectsFromServer();
        } else {
            alert('❌ Phê duyệt thất bại: ' + (result.error?.message || 'Lỗi không xác định'));
        }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};
