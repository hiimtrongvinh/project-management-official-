export function renderBaocao() {
    setTimeout(() => { window.fetchDashboardReport(); }, 0);

    return `
    <div class="max-w-7xl mx-auto animate-fadeIn space-y-6">
        <!-- Header -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-7 shadow-xl animate-fadeInDown">
            <div class="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div class="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
            <div class="absolute top-1/3 right-1/3 w-14 h-14 bg-white/10 rounded-full animate-float"></div>
            
            <div class="relative z-10 flex justify-between items-center">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <i class="fas fa-chart-pie text-white"></i>
                        </div>
                        <span class="text-blue-100 text-xs font-semibold tracking-wide uppercase">Analytics</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-white tracking-tight">Báo cáo & Thống kê</h1>
                    <p class="text-blue-100/70 font-medium text-sm mt-0.5">Tổng quan hiệu suất và tiến độ dự án</p>
                </div>
                <button onclick="window.fetchDashboardReport()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all text-sm font-bold">
                    <i class="fas fa-sync-alt text-xs"></i> Làm mới
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-4 relative z-20">
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.05s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><i class="fas fa-folder text-blue-500"></i></div>
                    <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
                <p id="statTotalProjects" class="text-2xl font-extrabold text-gray-800">0</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Tổng dự án</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.1s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><i class="fas fa-bolt text-amber-500"></i></div>
                </div>
                <p id="statActiveProjects" class="text-2xl font-extrabold text-gray-800">0</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Đang thực hiện</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.15s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><i class="fas fa-check-double text-emerald-500"></i></div>
                </div>
                <p id="statCompletedProjects" class="text-2xl font-extrabold text-gray-800">0</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Hoàn thành</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover-lift animate-fadeInUp" style="animation-delay:0.2s;animation-fill-mode:both;">
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><i class="fas fa-coins text-purple-500"></i></div>
                </div>
                <p id="statApprovedBudget" class="text-lg font-extrabold text-gray-800">0 ₫</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5">Doanh thu duyệt</p>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Donut Chart: Task Status -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp" style="animation-delay:0.25s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-tasks text-blue-400"></i> Trạng thái công việc</h3>
                <div class="flex items-center justify-center" id="donutChartContainer">
                    <div class="w-40 h-40 rounded-full bg-gray-100 animate-pulse-slow"></div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-4" id="donutLegend"></div>
            </div>

            <!-- Bar Chart: Tasks per Project -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 animate-fadeInUp" style="animation-delay:0.3s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-chart-bar text-indigo-400"></i> Công việc theo dự án</h3>
                <div id="barChartContainer" class="h-48 flex items-end gap-3 px-2">
                    <div class="flex-1 bg-gray-100 rounded-t-lg animate-pulse-slow h-full"></div>
                </div>
            </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Budget Progress -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp" style="animation-delay:0.35s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2"><i class="fas fa-wallet text-emerald-400"></i> Ngân sách & Báo giá</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-gray-500">Đã duyệt</span>
                        <span id="budgetApprovedText" class="text-sm font-bold text-emerald-600">0 ₫</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-gray-500">Chờ duyệt</span>
                        <span id="budgetPendingText" class="text-sm font-bold text-amber-600">0 ₫</span>
                    </div>
                    <div class="pt-3 border-t border-gray-100">
                        <div class="flex justify-between text-xs font-bold text-gray-400 mb-1.5">
                            <span>Tỉ lệ duyệt</span>
                            <span id="approvedRatioText">0%</span>
                        </div>
                        <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div id="approvedRatioBar" class="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-700 progress-bar" style="width:0%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Task Status Bars -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp" style="animation-delay:0.4s;animation-fill-mode:both;">
                <h3 class="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2"><i class="fas fa-list-check text-amber-400"></i> Chi tiết trạng thái</h3>
                <div class="space-y-3" id="taskChartContainer"></div>
            </div>
        </div>
    </div>`;
}

function renderDonutChart(tasks) {
    const container = document.getElementById('donutChartContainer');
    const legend = document.getElementById('donutLegend');
    if (!container) return;

    const statuses = [
        { label: 'Chưa nộp', count: tasks['Chưa nộp'] || 0, color: '#F59E0B' },
        { label: 'Đã nộp', count: tasks['Đã nộp'] || 0, color: '#3B82F6' },
        { label: 'Cần sửa', count: tasks['Cần sửa'] || 0, color: '#EF4444' },
        { label: 'Đã duyệt', count: tasks['Đã duyệt'] || 0, color: '#10B981' }
    ];

    const total = statuses.reduce((a, b) => a + b.count, 0) || 1;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    let arcs = '';
    statuses.forEach(s => {
        const pct = s.count / total;
        const dashLength = pct * circumference;
        arcs += `<circle cx="80" cy="80" r="${radius}" fill="none" stroke="${s.color}" stroke-width="20" 
                    stroke-dasharray="${dashLength} ${circumference - dashLength}" 
                    stroke-dashoffset="${-offset}" 
                    class="transition-all duration-700" style="transform-origin: center;"/>`;
        offset += dashLength;
    });

    container.innerHTML = `
        <div class="relative">
            <svg width="160" height="160" viewBox="0 0 160 160" class="-rotate-90">
                ${arcs}
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                    <p class="text-2xl font-extrabold text-gray-800">${total}</p>
                    <p class="text-[10px] text-gray-400 font-medium">Công việc</p>
                </div>
            </div>
        </div>`;

    if (legend) {
        legend.innerHTML = statuses.map(s => `
            <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" style="background:${s.color}"></div>
                <span class="text-xs text-gray-600 font-medium">${s.label} (${s.count})</span>
            </div>`).join('');
    }
}

function renderBarChart(projects) {
    const container = document.getElementById('barChartContainer');
    if (!container || !projects || projects.length === 0) {
        if (container) container.innerHTML = '<p class="text-xs text-gray-400 text-center w-full py-10">Không có dữ liệu</p>';
        return;
    }

    const maxTasks = Math.max(...projects.map(p => p.total_tasks || 1), 1);
    const colors = ['from-blue-400 to-blue-600', 'from-indigo-400 to-indigo-600', 'from-purple-400 to-purple-600', 'from-cyan-400 to-cyan-600', 'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600'];

    container.innerHTML = projects.slice(0, 8).map((p, i) => {
        const height = Math.max(((p.total_tasks || 0) / maxTasks) * 100, 8);
        const color = colors[i % colors.length];
        return `
        <div class="flex-1 flex flex-col items-center gap-1.5 group">
            <span class="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">${p.total_tasks || 0}</span>
            <div class="w-full bg-gradient-to-t ${color} rounded-t-lg transition-all duration-500 hover:opacity-80 relative" style="height:${height}%">
                <div class="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span class="text-[9px] font-medium text-gray-400 text-center leading-tight max-w-full truncate px-0.5" title="${p.title}">${p.title.split(' ').slice(0, 2).join(' ')}</span>
        </div>`;
    }).join('');
}

window.fetchDashboardReport = async function () {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/reports/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            const data = result.data;

            document.getElementById('statTotalProjects').innerText = data.projects.total;
            document.getElementById('statActiveProjects').innerText = data.projects.active;
            document.getElementById('statCompletedProjects').innerText = data.projects.completed;
            document.getElementById('statApprovedBudget').innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.budget.approved);

            document.getElementById('budgetPendingText').innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.budget.pending);
            document.getElementById('budgetApprovedText').innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.budget.approved);

            const totalBudget = data.budget.approved + data.budget.pending;
            const ratio = totalBudget > 0 ? Math.round((data.budget.approved / totalBudget) * 100) : 0;
            document.getElementById('approvedRatioText').innerText = `${ratio}%`;
            document.getElementById('approvedRatioBar').style.width = `${ratio}%`;

            // Render charts
            renderDonutChart(data.tasks);
            renderTaskBars(data.tasks);

            // Fetch projects for bar chart
            const projRes = await fetch('/api/projects?limit=10', { headers: { 'Authorization': `Bearer ${token}` } });
            const projResult = await projRes.json();
            if (projResult.success) renderBarChart(projResult.data);
        }
    } catch (error) {
        console.error('Lỗi khi tải báo cáo:', error);
    }
};

function renderTaskBars(tasks) {
    const container = document.getElementById('taskChartContainer');
    if (!container) return;

    const totalTasks = Object.values(tasks).reduce((a, b) => a + b, 0) || 1;
    const statuses = [
        { label: 'Đã duyệt', count: tasks['Đã duyệt'] || 0, color: 'bg-emerald-500', bg: 'bg-emerald-100' },
        { label: 'Đã nộp', count: tasks['Đã nộp'] || 0, color: 'bg-blue-500', bg: 'bg-blue-100' },
        { label: 'Chưa nộp', count: tasks['Chưa nộp'] || 0, color: 'bg-amber-500', bg: 'bg-amber-100' },
        { label: 'Cần sửa', count: tasks['Cần sửa'] || 0, color: 'bg-red-500', bg: 'bg-red-100' }
    ];

    container.innerHTML = statuses.map(s => {
        const pct = Math.round((s.count / totalTasks) * 100);
        return `
        <div class="flex items-center gap-3">
            <span class="text-xs font-medium text-gray-600 w-16 text-right">${s.label}</span>
            <div class="flex-1 ${s.bg} h-2.5 rounded-full overflow-hidden">
                <div class="${s.color} h-full rounded-full transition-all duration-700" style="width:${pct}%"></div>
            </div>
            <span class="text-xs font-bold text-gray-500 w-8">${s.count}</span>
        </div>`;
    }).join('');
}
