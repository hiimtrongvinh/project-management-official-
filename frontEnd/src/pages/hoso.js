// src/pages/hoso.js
const projectDetails = window.projectDetails || {};

function parseDateToInput(dateStr) {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
}

export function renderHoso(projectId, isEditMode = false) {
    const project = window.projectDetails?.[projectId];
    if (!project) {
        return `<div class="text-red-500 font-bold p-6">Dự án không tồn tại!</div>`;
    }

    const { profile } = project;
    const clientName = profile.client || "Không có";
    const category = profile.category || "Chưa phân loại";
    const budget = profile.budget || "Chưa có";
    const startDate = profile.startDate || "--/--/----";
    const endDate = profile.endDate || "--/--/----";
    const status = profile.status || "Khởi tạo";
    const progress = profile.progress !== undefined ? profile.progress : 0;
    const taskInfo = project.taskInfo || "0/0";

    const role = localStorage.getItem('authRole');
    const isClient = role === 'client';

    // Edit mode fields
    const descriptionHtml = isEditMode
        ? `<textarea id="editProjectDescription" class="w-full text-gray-700 font-normal text-[15px] leading-snug border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 bg-gray-50/50 resize-none h-[60px] transition-shadow shadow-sm custom-scrollbar" placeholder="Nhập mô tả dự án...">${profile.description || ''}</textarea>`
        : `<p class="text-gray-600 font-normal text-base leading-relaxed text-justify h-[60px] overflow-y-auto custom-scrollbar">${profile.description || 'Chưa có mô tả chi tiết.'}</p>`;

    const clientHtml = isEditMode
        ? `<div class="relative flex-1 ml-2 max-w-[320px]">
            <select id="editProjectClient" class="w-full px-3 py-1.5 pr-8 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 text-[15px] outline-none appearance-none cursor-pointer transition-shadow shadow-sm font-normal">
                <option value="">Chọn khách hàng...</option>
                ${(window.cachedClients || []).map(c => `<option value="${c.id}" ${c.name === clientName ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
           </div>`
        : `<span class="text-gray-700 text-base ml-1.5 font-semibold">${clientName}</span>`;

    const categoryHtml = isEditMode
        ? `<div class="relative w-full ml-2">
            <select id="editProjectCategory" class="w-full px-3 py-1.5 pr-8 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 text-[15px] outline-none appearance-none cursor-pointer transition-shadow shadow-sm font-normal">
                <option value="Phần mềm" ${category === 'Phần mềm' ? 'selected' : ''}>Phần mềm</option>
                <option value="Xây dựng" ${category === 'Xây dựng' ? 'selected' : ''}>Xây dựng</option>
                <option value="An ninh, kiểm soát truy cập" ${category === 'An ninh, kiểm soát truy cập' ? 'selected' : ''}>An ninh, kiểm soát truy cập</option>
                <option value="Khác" ${category === 'Khác' ? 'selected' : ''}>Khác</option>
            </select>
            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
           </div>`
        : `<span class="text-gray-600 font-normal text-base ml-1.5 truncate block font-semibold">${category}</span>`;

    const numericBudget = budget.toString().replace(/[^0-9]/g, '');
    const formattedBudget = numericBudget ? new Intl.NumberFormat('vi-VN').format(numericBudget) : '';
    const budgetHtml = isEditMode
        ? `<div class="relative w-full ml-2 flex items-center">
            <input type="text" id="editProjectBudget" value="${formattedBudget}" 
                   oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.')"
                   class="w-full px-3 py-1.5 pr-7 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50/50 text-gray-800 text-[15px] transition-shadow shadow-sm font-normal" placeholder="VD: 100.000.000" />
            <span class="absolute right-3 text-gray-500 text-[15px] font-medium pointer-events-none">đ</span>
           </div>`
        : `<span class="text-gray-600 font-normal text-base ml-1.5 font-semibold">${budget}</span>`;

    const dateHtml = isEditMode
        ? `<div class="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 rounded-xl px-2 py-1.5 focus-within:border-blue-500 transition-all shadow-sm ml-2 flex-1 min-w-0">
            <span class="text-gray-600 font-normal text-[15px] whitespace-nowrap">${startDate}</span>
            <span class="text-gray-400 text-[15px]">-</span>
            <input type="date" id="editProjectEndDate" value="${parseDateToInput(endDate)}" class="bg-transparent outline-none text-gray-800 cursor-pointer font-medium text-[15px] w-full min-w-0" />
           </div>`
        : `<span class="text-gray-600 font-normal text-base ml-1.5 whitespace-nowrap font-semibold">${startDate} – ${endDate}</span>`;

    const addMemberBtn = isClient ? '' : `
    <div onclick="window.showAddMemberModal('${projectId}')" class="flex-shrink-0 flex flex-col items-center group cursor-pointer min-w-fit">
        <div class="w-14 h-14 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm">
            <i class="fas fa-plus text-xl"></i>
        </div>
        <p class="text-sm font-bold text-blue-600 leading-tight whitespace-nowrap px-2 mt-1 text-center">Thêm mới</p>
        <p class="text-xs text-gray-400 font-medium whitespace-nowrap text-center">Nhân sự</p>
    </div>`;

    return `
    <div class="h-full flex flex-col space-y-4 bg-white rounded-3xl p-6 text-gray-700 animate-fadeIn">
        
        <div class="grid grid-cols-12 gap-8 flex-shrink-0 items-start">
            
            <div class="col-span-8 flex flex-col justify-between h-full py-0.5">
                <div class="flex flex-col mb-2.5">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Mô tả dự án</h3>
                    ${descriptionHtml}
                </div>
                <div class="flex items-center mt-auto">
                    <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Khách hàng:</span>
                    ${clientHtml}
                </div>
            </div>
            
            <div class="col-span-4 flex flex-col space-y-2.5">
                <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1.5">Trạng thái - tiến độ</h3>
                    <div class="flex justify-between items-center gap-3">
                        <div class="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-semibold flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            ${status}
                        </div>
                        <span class="text-base font-bold text-blue-600 flex-shrink-0">${progress}%</span>
                    </div>
                </div>
                
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100/30">
                    <div class="h-full bg-yellow-400 transition-all duration-500" style="width: ${progress}%"></div>
                </div>

                <div class="text-sm font-medium text-gray-400 pl-1">
                    Đã hoàn thành ${taskInfo} công việc
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-8 py-1 flex-shrink-0 items-center mt-2">
            
            <div class="col-span-8 grid grid-cols-5 gap-4">
                <div class="flex items-center col-span-3">
                    <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Phân loại:</span>
                    ${categoryHtml}
                </div>
                <div class="flex items-center col-span-2">
                    <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Ngân sách:</span>
                    ${budgetHtml}
                </div>
            </div>

            <div class="col-span-4 flex items-center">
                <span class="text-lg font-bold text-gray-900 flex-shrink-0 whitespace-nowrap">Thời gian:</span>
                ${dateHtml}
            </div>
        </div>

        <div class="flex-1 flex flex-col space-y-4 min-h-0 pt-2">
            <div class="flex flex-col flex-shrink-0">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Nhân sự thực hiện</h3>
                <div class="flex items-start gap-6 overflow-x-auto pb-1 custom-scrollbar">
                    ${profile.members.map(member => createSmallMember(projectId, member.id, member.name, member.role, member.avatar, isClient, isEditMode)).join('')}
                    ${isEditMode ? addMemberBtn : (isClient ? '' : addMemberBtn)} 
                </div>
            </div>

            <div class="flex flex-col flex-shrink-0 pt-3 border-t border-gray-100/40">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Tài liệu đính kèm</h3>
                <div class="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                    ${profile.documents && profile.documents.length > 0 ? profile.documents.map(doc => createSmallDoc(doc)).join('') : '<span class="text-xs text-gray-400 italic">Chưa có tài liệu</span>'}
                </div>
            </div>
        </div>

    </div>`;
}

function createSmallMember(projectId, staffId, name, role, avatar, isClient, isEditMode) {
    const authRole = localStorage.getItem('authRole');
    const deleteBtn = (authRole === 'admin' && staffId) ? `
        <div onclick="event.stopPropagation(); window.handleDeleteMember('${projectId}', '${staffId}')" 
             class="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center border border-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 cursor-pointer">
            <i class="fas fa-times"></i>
        </div>` : '';

    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'];
    const colorClass = colors[name.charCodeAt(0) % colors.length];

    const avatarContent = avatar
        ? `<img src="http://localhost:3000${avatar}" alt="${name}" class="w-full h-full object-cover">`
        : `<span class="text-lg font-bold text-white">${name.charAt(0).toUpperCase()}</span>`;
    
    const avatarClass = avatar
        ? `w-14 h-14 rounded-2xl overflow-hidden relative shadow-sm`
        : `w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center relative shadow-sm`;

    return `
    <div class="flex-shrink-0 flex flex-col items-center group cursor-pointer min-w-fit">
        <div class="${avatarClass}">
            ${avatarContent}
            ${deleteBtn}
        </div>
        <p class="text-sm font-bold text-gray-800 leading-tight whitespace-nowrap px-2 mt-1 text-center truncate">${name}</p>
        <p class="text-xs text-gray-500 font-medium whitespace-nowrap text-center">${role}</p>
    </div>`;
}

function createSmallDoc(file) {
    return `<div class="flex-shrink-0 flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer">
        <i class="fas fa-file text-blue-500"></i>${file}
    </div>`;
}

async function fetchStaffList() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/users/staff?limit=100', { headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();
        return result.success ? result.data : [];
    } catch (err) { console.error(err); return []; }
}

async function refreshProjectDetail(projectId) {
    const modal = document.getElementById('projectDetailModal');
    if (modal) modal.remove();
    const role = localStorage.getItem('authRole');
    const { openProjectDetail } = await import('./chitietduan.js');
    await openProjectDetail(projectId, role);
}

window.showAddMemberModal = async function (projectId) {
    const staffs = await fetchStaffList();
    const currentMembers = window.projectDetails?.[projectId]?.profile?.members || [];
    const currentMemberIds = currentMembers.map(m => m.id);
    const availableStaffs = staffs.filter(s => !currentMemberIds.includes(s.id) && s.account_status === 'active');
    const staffOptions = availableStaffs.map(s => `<option value="${s.id}">${s.name} (${s.position || ''})</option>`).join('');

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp">
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <i class="fas fa-user-plus"></i>
            </div>
            <h3 class="text-lg font-extrabold text-gray-800">Thêm nhân sự</h3>
        </div>
        <form id="formAddMember" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Chọn nhân sự</label>
                <select name="staffId" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm">
                    <option value="">-- Chọn nhân sự --</option>
                    ${staffOptions}
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Vai trò</label>
                <input type="text" name="role" required placeholder="Nhập vai trò (VD: Kỹ thuật viên)..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 bg-gray-50/50 text-sm font-semibold text-gray-800">
            </div>
            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onclick="this.closest('.fixed').remove()" class="btn-ghost text-sm px-4 py-2">Hủy</button>
                <button type="submit" class="btn-primary text-sm px-5 py-2">Thêm</button>
            </div>
        </form>
    </div>`;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const body = { staffId: fd.get('staffId'), role: fd.get('role') };
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/projects/${projectId}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            const result = await res.json();
            if (result.success) { modal.remove(); await refreshProjectDetail(projectId); }
            else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể thêm nhân sự')); }
        } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
    };
};

window.handleDeleteMember = async function (projectId, staffId) {
    if (!confirm('Bạn có chắc muốn xóa nhân sự này khỏi dự án?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/projects/${projectId}/members/${staffId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();
        if (result.success) { await refreshProjectDetail(projectId); }
        else { alert('❌ Lỗi: ' + (result.error?.message || 'Không thể xóa nhân sự')); }
    } catch (err) { alert('❌ Lỗi kết nối: ' + err.message); }
};
