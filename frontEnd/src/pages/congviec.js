let loadedTasks = [];
let currentTaskPage = 1;
const TASKS_PER_PAGE = 10;

export function renderCongviec() {
    setTimeout(() => {
        window.fetchTasksFromServer();
        window.fetchFilterProjects();
    }, 0);

    return `
    <div class="max-w-7xl mx-auto h-full animate-fadeIn">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-clipboard-check text-emerald-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 ">Quản lý công việc</h1>
                </div>
            </div>
            <!-- Stats Badges -->
            <div class="flex items-center gap-3" id="taskStatsBar"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <!-- Sidebar Filters -->
            <div class="lg:col-span-3">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                    <!-- Search -->
                    <div class="p-4 border-b border-gray-100">
                        <div class="relative group">
                            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm group-focus-within:text-blue-500 transition-colors"></i>
                            <input type="text" id="searchTask" oninput="handleTaskFilter()" placeholder="Tìm kiếm công việc..." 
                                   class="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm text-sm font-medium transition-all placeholder:text-gray-400">
                        </div>
                        <button onclick="clearAllTaskFilters()" 
                                class="w-full mt-3 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-xs border border-gray-200 hover:border-red-200">
                            <i class="fas fa-filter-circle-xmark"></i> Xóa tất cả bộ lọc
                        </button>
                    </div>

                    <!-- Status Filter -->
                    <div class="p-4 border-b border-gray-100">
                        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <i class="fas fa-circle-dot text-blue-400"></i> Trạng thái
                        </h3>
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="chưa nộp" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-amber-500 focus:ring-amber-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                                <span class="text-sm font-medium text-gray-700">Chưa nộp</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="đã nộp" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span class="text-sm font-medium text-gray-700">Đã nộp</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="cần sửa" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-orange-500 focus:ring-orange-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-orange-400"></span>
                                <span class="text-sm font-medium text-gray-700">Cần sửa</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="đã duyệt" onchange="handleTaskFilter()" class="filter-status-checkbox rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span class="text-sm font-medium text-gray-700">Đã duyệt</span>
                            </label>
                        </div>
                    </div>

                    <!-- Deadline Filter -->
                    <div class="p-4 border-b border-gray-100">
                        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <i class="fas fa-clock text-amber-400"></i> Hạn chót
                        </h3>
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-red-50 transition-colors">
                                <input type="checkbox" value="quahan" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-red-500 focus:ring-red-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow"></span>
                                <span class="text-sm font-medium text-red-600">Quá hạn</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="homnay" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                                <span class="text-sm font-medium text-gray-700">Hôm nay</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="tuannay" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-blue-300"></span>
                                <span class="text-sm font-medium text-gray-700">Tuần này</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" value="thangnay" onchange="handleTaskFilter()" class="filter-deadline-checkbox rounded border-gray-300 text-blue-500 focus:ring-blue-400 w-4 h-4">
                                <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
                                <span class="text-sm font-medium text-gray-700">Tháng này</span>
                            </label>
                        </div>
                    </div>

                    <!-- Project Filter -->
                    <div class="p-4">
                        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <i class="fas fa-folder text-purple-400"></i> Dự án
                        </h3>
                        <div id="filterProjectsList" class="space-y-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                            <div class="flex items-center gap-2 py-2 px-2">
                                <div class="w-4 h-4 bg-gray-100 rounded skeleton"></div>
                                <div class="h-3 bg-gray-100 rounded flex-1 skeleton"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Task List -->
            <div class="lg:col-span-9 flex flex-col gap-3" id="taskListContainer">
                <div class="bg-white rounded-2xl py-20 text-center border border-gray-100 shadow-sm animate-fadeIn">
                    <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
                        <i class="fas fa-spinner fa-spin text-gray-300 text-lg"></i>
                    </div>
                    <p class="text-sm text-gray-400 font-medium">Đang tải danh sách công việc...</p>
                </div>
            </div>
        </div>
    </div>`;
}

export function renderTaskCards(tasks = [], page = currentTaskPage) {
    const container = document.getElementById('taskListContainer');
    if (!container) return;

    renderTaskStats(tasks);

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-2xl py-20 text-center border border-gray-100 shadow-sm animate-fadeIn">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <i class="fas fa-inbox text-2xl text-gray-300"></i>
                </div>
                <p class="text-gray-600 font-bold text-base">Không tìm thấy công việc</p>
                <p class="text-gray-400 text-xs mt-1.5 max-w-xs mx-auto">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác</p>
            </div>`;
        return;
    }

    const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;
    currentTaskPage = page;

    const start = (page - 1) * TASKS_PER_PAGE;
    const pageTasks = tasks.slice(start, start + TASKS_PER_PAGE);
    window._currentFilteredTasks = tasks;

    let html = '<div class="space-y-3">';
    html += pageTasks.map((task, index) => {
        const config = getStatusConfig(task);
        const projectTitle = task.project_title || task.project || 'Dự án e-Teck';
        const taskDesc = task.description || task.title;
        const formattedDeadline = task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có hạn';
        const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Đã duyệt';

        return `
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-${config.color}-200 transition-all duration-300 animate-fadeInUp group relative overflow-hidden"
             style="animation-delay: ${index * 0.04}s; animation-fill-mode: both;">
            
            <!-- Left color accent -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${config.color}-400 to-${config.color}-600 rounded-l-2xl"></div>
            
            <div class="flex items-start gap-4 pl-3">
                <!-- Status Icon Circle -->
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-${config.color}-50 to-${config.color}-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-${config.color}-100 group-hover:scale-110 transition-transform">
                    <i class="fas ${config.icon} text-${config.color}-500"></i>
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <!-- Project name -->
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md">${projectTitle}</span>
                        ${isOverdue ? '<span class="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 animate-pulse-slow"><i class="fas fa-exclamation-triangle mr-0.5"></i>QUÁ HẠN</span>' : ''}
                    </div>
                    
                    <!-- Task title -->
                    <h3 class="font-bold text-[15px] text-gray-800 leading-snug mb-2.5 group-hover:text-${config.color}-700 transition-colors">${taskDesc}</h3>
                    
                    <!-- Feedback if exists -->
                    ${task.status === 'Cần sửa' && task.feedback ? `
                    <div class="mb-3 bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-2.5 rounded-xl flex gap-2.5 items-start border border-orange-100">
                        <div class="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i class="fas fa-comment text-orange-500 text-[9px]"></i>
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed"><span class="font-bold text-gray-800">${task.reviewer_name || 'Người duyệt'}:</span> ${task.feedback}</p>
                    </div>` : ''}

                    <!-- Files list displayed sequentially under task title -->
                    ${task.files && task.files.length > 0 ? `
                    <div class="flex flex-wrap gap-2 mt-2.5 mb-1.5">
                        ${task.files.map((doc, idx) => {
                            const fileName = doc.file_name || doc.file_path.split('/').pop();
                            return `
                            <a href="${doc.file_path}" target="_blank" onclick="event.stopPropagation()" class="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:text-blue-800 transition-colors px-2.5 py-1 rounded-xl shadow-sm">
                                <i class="fas fa-paperclip text-[10px] text-blue-500"></i>
                                <span class="truncate max-w-[150px]" title="${fileName}">${fileName}</span>
                            </a>`;
                        }).join('')}
                    </div>` : task.file_path ? `
                    <div class="flex flex-wrap gap-2 mt-2.5 mb-1.5">
                        <a href="${task.file_path}" target="_blank" onclick="event.stopPropagation()" class="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:text-blue-800 transition-colors px-2.5 py-1 rounded-xl shadow-sm">
                            <i class="fas fa-paperclip text-[10px] text-blue-500"></i>
                            <span class="truncate max-w-[150px]" title="${task.file_path.split('/').pop()}">${task.file_path.split('/').pop()}</span>
                        </a>
                    </div>` : ''}

                    <!-- Meta info row -->
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}">
                            <i class="far fa-calendar-alt text-[10px]"></i> ${formattedDeadline}
                        </span>
                        <span class="status-chip ${config.chipClass} text-[10px]">${task.status}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    ${config.actions}
                </div>
            </div>
        </div>`;
    }).join('');
    html += '</div>';

    // Pagination
    if (totalPages > 1) {
        html += `
        <div class="flex items-center justify-between mt-6 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <span class="text-xs text-gray-400 font-medium pl-2">Hiển thị ${start + 1}-${Math.min(start + TASKS_PER_PAGE, tasks.length)} / ${tasks.length} công việc</span>
            <div class="flex items-center gap-1">
                <button onclick="window.goToTaskPage(${page - 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left text-xs"></i>
                </button>`;
        for (let i = 1; i <= totalPages; i++) {
            if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - page) > 1) {
                if (i === 4 || i === totalPages - 2) html += `<span class="text-gray-300 text-xs px-1">•••</span>`;
                continue;
            }
            html += `<button onclick="window.goToTaskPage(${i})" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i === page ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}">${i}</button>`;
        }
        html += `
                <button onclick="window.goToTaskPage(${page + 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page >= totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right text-xs"></i>
                </button>
            </div>
        </div>`;
    }

    container.innerHTML = html;
}

function renderTaskStats(tasks) {
    const bar = document.getElementById('taskStatsBar');
    if (!bar) return;
    const total = tasks.length;
    const pending = tasks.filter(t => t.status.toLowerCase() === 'chưa nộp').length;
    const submitted = tasks.filter(t => t.status.toLowerCase() === 'đã nộp').length;
    const needFix = tasks.filter(t => t.status.toLowerCase() === 'cần sửa').length;
    const approved = tasks.filter(t => t.status.toLowerCase() === 'đã duyệt').length;

    bar.innerHTML = `
        <div class="flex flex-wrap items-center justify-end gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 cursor-default">
                <span>Tổng: <strong>${total}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Chưa nộp: <strong>${pending}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Đã nộp: <strong>${submitted}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Cần sửa: <strong>${needFix}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Đã duyệt: <strong>${approved}</strong></span>
            </div>
        </div>
    `;
}

window.fetchTasksFromServer = async function () {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tasks/my-tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            loadedTasks = result.data;
            window.renderTaskCards(loadedTasks);
        }
    } catch (error) {
        console.error('Lỗi tải danh sách công việc:', error);
    }
};

window.fetchFilterProjects = async function () {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/projects?limit=100', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            const projects = result.data;
            const uniqueProjectNames = [...new Set(projects.map(p => p.title))];
            const container = document.getElementById('filterProjectsList');
            if (container) {
                if (uniqueProjectNames.length === 0) {
                    container.innerHTML = `<p class="text-gray-400 text-xs italic py-2 px-2">Không có dự án nào</p>`;
                } else {
                    container.innerHTML = uniqueProjectNames.map(projTitle => `
                    <label class="flex items-center gap-3 cursor-pointer select-none py-1.5 px-2 rounded-lg hover:bg-purple-50 transition-colors">
                        <input type="checkbox" value="${projTitle}" onchange="handleTaskFilter()" class="filter-project-checkbox rounded border-gray-300 text-purple-500 focus:ring-purple-400 w-4 h-4 flex-shrink-0"> 
                        <span class="text-xs font-medium text-gray-600 leading-tight truncate">${projTitle}</span>
                    </label>`).join('');
                }
            }
        }
    } catch (error) {
        console.error('Lỗi tải danh sách dự án cho bộ lọc:', error);
    }
};

window.handleTaskFilter = function () {
    const searchKeyword = document.getElementById('searchTask')?.value.toLowerCase().trim() || "";
    const checkedStatuses = Array.from(document.querySelectorAll('.filter-status-checkbox:checked')).map(cb => cb.value.toLowerCase().trim());
    const checkedDeadlines = Array.from(document.querySelectorAll('.filter-deadline-checkbox:checked')).map(cb => cb.value);
    const checkedProjects = Array.from(document.querySelectorAll('.filter-project-checkbox:checked')).map(cb => cb.value.toLowerCase().trim());

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const filteredTasks = loadedTasks.filter(task => {
        const projectTitle = task.project_title || task.project || '';
        const taskDesc = task.description || task.title || '';
        const matchesKeyword = projectTitle.toLowerCase().includes(searchKeyword) || taskDesc.toLowerCase().includes(searchKeyword);
        const matchesStatus = checkedStatuses.length === 0 || checkedStatuses.includes(task.status.toLowerCase().trim());
        const matchesProject = checkedProjects.length === 0 || checkedProjects.includes(projectTitle.toLowerCase().trim());

        let matchesDeadline = true;
        if (checkedDeadlines.length > 0 && task.deadline) {
            const taskDate = new Date(task.deadline);
            taskDate.setHours(0, 0, 0, 0);
            matchesDeadline = checkedDeadlines.some(type => {
                if (type === "quahan") return taskDate < now && task.status !== "Đã duyệt";
                if (type === "homnay") return taskDate.getTime() === now.getTime();
                if (type === "tuannay") {
                    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
                    const endOfWeek = new Date(now);
                    endOfWeek.setDate(now.getDate() + (7 - dayOfWeek));
                    return taskDate >= now && taskDate <= endOfWeek;
                }
                if (type === "thangnay") return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
                return false;
            });
        }
        return matchesKeyword && matchesStatus && matchesProject && matchesDeadline;
    });

    currentTaskPage = 1;
    renderTaskCards(filteredTasks, 1);
};

window.clearAllTaskFilters = function () {
    const inputSearch = document.getElementById('searchTask');
    if (inputSearch) inputSearch.value = '';
    document.querySelectorAll('.filter-status-checkbox, .filter-deadline-checkbox, .filter-project-checkbox').forEach(cb => { cb.checked = false; });
    currentTaskPage = 1;
    renderTaskCards(loadedTasks, 1);
};

function getStatusConfig(task) {
    const s = task.status.toLowerCase().trim();
    switch (s) {
        case "chưa nộp":
            return {
                color: "amber", icon: "fa-clock", chipClass: "status-chip-orange",
                actions: `<button onclick="openSubmitTaskModal('${task.id}')" class="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-amber-200 hover:shadow-md hover:shadow-amber-300">
                    <i class="fas fa-upload mr-1.5"></i>Nộp mới
                </button>`
            };
        case "đã nộp":
            return {
                color: "blue", icon: "fa-paper-plane", chipClass: "status-chip-blue",
                actions: ``
            };
        case "cần sửa":
            return {
                color: "orange", icon: "fa-exclamation-circle", chipClass: "status-chip-orange",
                actions: `<button onclick="openSubmitTaskModal('${task.id}')" class="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-300">
                    <i class="fas fa-redo mr-1.5"></i>Nộp lại
                </button>`
            };
        case "đã duyệt":
            return {
                color: "emerald", icon: "fa-check-circle", chipClass: "status-chip-green",
                actions: ``
            };
        default:
            return { color: "gray", icon: "fa-circle", chipClass: "status-chip-gray", actions: '' };
    }
}

window.handleFileSelect = function (input) {
    const label = document.getElementById('uploadFileName');
    if (!input.files || input.files.length === 0) {
        label.textContent = 'Kéo thả hoặc bấm để chọn file';
        return;
    }
    if (input.files.length === 1) {
        label.textContent = input.files[0].name;
    } else {
        label.textContent = `${input.files.length} file được chọn: ` + Array.from(input.files).map(f => f.name).join(', ');
    }
};

window.openSubmitTaskModal = function (taskId) {
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4";
    modal.id = "submitTaskModal";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-cloud-upload-alt text-white"></i>
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-white">Nộp kết quả công việc</h2>
                    <p class="text-xs text-purple-100/70">Tải lên các file báo cáo và ghi chú tiến độ</p>
                </div>
            </div>
        </div>
        
        <form id="formSubmitTask" onsubmit="handleTaskSubmit(event, '${taskId}')" class="p-6">
            <div class="mb-5">
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">File kết quả *</label>
                <div class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group" onclick="this.querySelector('input').click()">
                    <div class="w-14 h-14 bg-gray-100 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                        <i class="fas fa-cloud-upload-alt text-xl text-gray-300 group-hover:text-purple-500 transition-colors"></i>
                    </div>
                    <p class="text-sm text-gray-500 font-semibold" id="uploadFileName">Kéo thả hoặc bấm để chọn file (Có thể chọn nhiều)</p>
                    <p class="text-[10px] text-gray-400 mt-1">PDF, DOCX, ZIP, hình ảnh (tối đa 10MB)</p>
                    <input type="file" id="submitTaskFile" required class="hidden" multiple onchange="window.handleFileSelect(this)">
                </div>
            </div>
            <div class="mb-6">
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ghi chú tiến độ</label>
                <textarea id="submitTaskNote" rows="3" placeholder="Mô tả ngắn gọn kết quả công việc..." class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:shadow-sm bg-gray-50/50 text-sm resize-none transition-all"></textarea>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Hủy</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200 transition-all">
                    <i class="fas fa-paper-plane mr-1.5"></i>Xác nhận nộp
                </button>
            </div>
        </form>
    </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

window.handleTaskSubmit = async function (e, taskId) {
    e.preventDefault();
    const fileInput = document.getElementById('submitTaskFile');
    const noteInput = document.getElementById('submitTaskNote');
    if (!fileInput.files || fileInput.files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('file', fileInput.files[i]);
    }
    formData.append('note', noteInput.value);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${taskId}/submit`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ Đã nộp báo cáo thành công!');
            document.getElementById('submitTaskModal')?.remove();
            window.fetchTasksFromServer();
        } else {
            alert('❌ Lỗi: ' + result.error.message);
        }
    } catch (error) {
        console.error('Lỗi khi nộp công việc:', error);
        alert('❌ Có lỗi xảy ra khi nộp công việc.');
    }
};

window.xemLaiCongViec = (taskId) => {
    const task = loadedTasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    const formattedDeadline = task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có';

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 modal-overlay flex items-center justify-center z-[100] p-4";
    modal.id = "viewReportModal";

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
                <a href="${doc.file_path}" target="_blank" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex-shrink-0 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ml-2">
                    <i class="fas fa-download mr-1"></i> Tải về
                </a>
            </div>`;
        }).join('');
    } else if (task.file_path) {
        const fileName = task.file_path.split('/').pop();
        fileHtml = `
        <div class="mt-2 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div class="flex items-center gap-2.5 overflow-hidden flex-1">
                <i class="fas fa-file-alt text-blue-500 text-lg flex-shrink-0"></i>
                <span class="text-xs font-bold text-gray-700 truncate" title="${fileName}">${fileName}</span>
            </div>
            <a href="${task.file_path}" target="_blank" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex-shrink-0 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ml-2">
                <i class="fas fa-download mr-1"></i> Tải về
            </a>
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

    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <i class="fas fa-eye text-white"></i>
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-white">Báo cáo công việc</h2>
                    <p class="text-xs text-teal-100/70">Chi tiết thông tin nộp báo cáo & duyệt kết quả</p>
                </div>
            </div>
        </div>
        
        <div class="p-6">
            <!-- Task Info -->
            <div class="mb-5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <span class="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Thông tin công việc</span>
                <h3 class="text-sm font-bold text-gray-800 leading-snug mb-2">${task.title || task.description}</h3>
                <div class="flex flex-wrap gap-2.5 items-center">
                    <span class="text-xs font-semibold text-gray-500">Hạn chót: <span class="text-gray-700">${formattedDeadline}</span></span>
                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span class="status-chip ${task.status.toLowerCase() === 'đã duyệt' ? 'status-chip-green' : 'status-chip-blue'} text-[10px]">${task.status}</span>
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
            <div class="flex justify-end">
                <button type="button" onclick="this.closest('.fixed').remove()" class="px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">Đóng</button>
            </div>
        </div>
    </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

window.renderTaskCards = renderTaskCards;
window.handleTaskFilter = handleTaskFilter;
window.clearAllTaskFilters = clearAllTaskFilters;

window.goToTaskPage = function (page) {
    const tasks = window._currentFilteredTasks || loadedTasks;
    renderTaskCards(tasks, page);
    document.getElementById('taskListContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
