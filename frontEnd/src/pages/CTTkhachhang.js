// src/pages/CTTkhachhang.js
import { renderFooter } from './footer.js';
import { renderPortalHeader } from './portalHeader.js';

let loadedClientProjects = [];

export async function fetchClientProjectsFromServer() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/projects?limit=100', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            loadedClientProjects = result.data || [];
            const container = document.getElementById('clientProjectsGrid');
            if (container) {
                container.innerHTML = renderOriginalProjectCards(loadedClientProjects);
            }
        }
    } catch (err) {
        console.error('Lỗi tải danh sách dự án của khách hàng:', err);
    }
}

window.fetchClientProjectsFromServer = fetchClientProjectsFromServer;

export function renderCTTkhachhang() {
    setTimeout(fetchClientProjectsFromServer, 50);

    return `
    <div class="flex flex-col mt-0 min-h-screen bg-gray-50/50 animate-fadeIn"> 
        ${renderPortalHeader({
        activeLabel: 'Dự án',
        tabs: [
            {
                label: 'Dự án',
                iconClass: 'fas fa-briefcase text-lg',
                onClick: "navigateTo('CTTkhachhang')",
            },
            {
                label: 'Tạo yêu cầu',
                iconClass: 'fas fa-plus',
                onClick: "navigateTo('taoyeucau')",
            },
            {
                label: 'Tài khoản',
                iconClass: 'fas fa-user-circle text-lg',
                onClick: "navigateTo('taikhoanKH')",
            },
        ],
    })}

        <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
            <div class="mb-8 animate-fadeInDown">
                <h2 class="text-3xl font-bold text-gray-800 ">Dự án của tôi</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeInUp" id="clientProjectsGrid">
                <div class="col-span-full py-12 text-center text-gray-400">Đang tải danh sách dự án...</div>
            </div>
        </main>
      ${renderFooter()}
    </div>`;
}

function renderOriginalProjectCards(projects) {
    if (projects.length === 0) {
        return `<div class="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">Bạn chưa có dự án nào trong hệ thống.</div>`;
    }

    let html = '';
    projects.forEach((p) => {
        const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100'];
        const memberCount = p.member_count || 0;
        const members = typeof p.members_json === 'string' ? JSON.parse(p.members_json || '[]') : (p.members_json || []);
        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'];
        let avatarsHtml = '';
        members.slice(0, 4).forEach((m, i) => {
            if (m.avatar) {
                avatarsHtml += `
                <div class="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 overflow-hidden shadow-sm" title="${m.name}">
                    <img src="http://localhost:3000${m.avatar}" alt="${m.name}" class="w-full h-full object-cover">
                </div>`;
            } else {
                const initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
                avatarsHtml += `
                <div class="w-8 h-8 ${colors[i % colors.length]} rounded-full border-2 border-white flex items-center justify-center -ml-2 first:ml-0 shadow-sm text-xs text-white font-bold" title="${m.name}">
                    ${initial}
                </div>`;
            }
        });

        const formattedDeadline = p.end_date ? new Date(p.end_date).toLocaleDateString('vi-VN') : 'Không có';
        const totalTasks = p.total_tasks || 0;
        const approvedTasks = p.approved_tasks || 0;

        html += `
        <div onclick="window.openProjectDetail('${p.id}', 'client')" class="bg-white rounded-3xl p-6 border border-transparent hover:border-blue-200 transition-all cursor-pointer hover:shadow-md group">
            <h3 class="font-bold text-lg mb-2 line-clamp-2 min-h-[52px] text-gray-800 group-hover:text-blue-700 transition-colors">${p.title}</h3>
            
            <div class="flex items-center mb-4">
                <div class="flex">
                    ${avatarsHtml}
                    ${memberCount > 4 ? `
                        <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center -ml-2 text-[10px] font-bold text-gray-600 ">
                            +${memberCount - 4}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="flex items-center justify-between mb-4">
                <span class="px-4 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-xl">
                    ${p.status}
                </span>
                <div class="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <i class="fas fa-calendar-alt text-blue-500"></i>
                    <span>${formattedDeadline}</span>
                </div>
            </div>

            <div class="mb-4">
                <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-600 rounded-full transition-all duration-700" style="width: ${p.progress}%"></div>
                </div>
            </div>

            <div class="flex justify-between items-center text-sm font-bold">
                <span class="text-blue-600">${p.progress}% hoàn thành</span>
                <span class="text-gray-400 font-medium">${approvedTasks}/${totalTasks} công việc</span>
            </div>
        </div>`;
    });
    return html;
}

window.addRequest = function () {
    alert("Hệ thống sẽ cập nhật Form gửi yêu cầu dự án trong phiên bản tới!");
};
