import { renderMaterialCards } from './CTTnhacungcap.js';

let materialCurrentPage = 1;
const MATERIALS_PER_PAGE = 12;
let allLoadedMaterials = [];

export function renderVattu() {
    setTimeout(async () => {
        await window.loadSupplierFilterOptions();
        window.fetchMaterials('staff');
    }, 0);

    return `
    <div class="flex flex-col min-h-screen animate-fadeIn">
        <!-- Unified Premium Header Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i class="fas fa-boxes text-violet-500 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 ">Danh sách vật tư</h1>
                </div>
            </div>
            <!-- Stats Badges -->
            <div class="flex items-center gap-3" id="materialStatsBar"></div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap gap-3 items-center mb-6">
            <div class="flex-1 min-w-[260px] relative group">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors"></i>
                <input type="text" id="searchMaterial" oninput="window.fetchMaterials('staff')" 
                       placeholder="Tìm kiếm tên hoặc mã vật tư..."
                       class="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white focus:shadow-sm transition-all text-sm font-medium placeholder:text-gray-400">
            </div>
            <div class="relative">
                <select id="filterSupplier" onchange="window.fetchMaterials('staff')" 
                        class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm font-medium cursor-pointer min-w-[170px] hover:border-gray-300 transition-all">
                    <option value="">Tất cả nhà cung cấp</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
            <div class="relative">
                <select id="filterStatus" onchange="window.fetchMaterials('staff')" 
                        class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm font-medium cursor-pointer min-w-[150px] hover:border-gray-300 transition-all">
                    <option value="">Tất cả trạng thái</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                    <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
            <div class="relative">
                <select id="filterCategory" onchange="window.fetchMaterials('staff')" 
                        class="appearance-none px-4 py-3 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm font-medium cursor-pointer min-w-[160px] hover:border-gray-300 transition-all">
                    <option value="">Tất cả phân loại</option>
                    <option value="Thiết bị mạng">Thiết bị mạng</option>
                    <option value="Cáp & Dây dẫn">Cáp & Dây dẫn</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Thiết bị điện">Thiết bị điện</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
        </div>

        <!-- Material Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5" id="materialCards"></div>
        
        <!-- Pagination -->
        <div id="materialPagination" class="mt-6"></div>
    </div>`;
}

window.fetchMaterials = async function (role = 'staff') {
    const search = document.getElementById('searchMaterial')?.value || '';
    const supplierId = document.getElementById('filterSupplier')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    const category = document.getElementById('filterCategory')?.value || '';

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (supplierId) params.append('supplierId', supplierId);
    if (status) params.append('status', status);
    if (category) params.append('category', category);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/materials?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            allLoadedMaterials = result.data;
            window._allMaterialsCache = result.data;
            materialCurrentPage = 1;
            renderPaginatedMaterials(allLoadedMaterials, role, 1);
            renderMaterialStatsBar(allLoadedMaterials);
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách vật tư:', error);
    }
};

function renderPaginatedMaterials(materials, role, page) {
    const totalPages = Math.ceil(materials.length / MATERIALS_PER_PAGE);
    if (page > totalPages && totalPages > 0) page = totalPages;
    if (page < 1) page = 1;
    materialCurrentPage = page;

    const start = (page - 1) * MATERIALS_PER_PAGE;
    const pageMaterials = materials.slice(start, start + MATERIALS_PER_PAGE);

    renderMaterialCards(pageMaterials, role);
    renderMaterialPagination(materials.length, totalPages, page, role);
}

function renderMaterialStatsBar(materials) {
    const bar = document.getElementById('materialStatsBar');
    if (!bar) return;
    const total = materials.length;
    const ready = materials.filter(m => m.status === 'Sẵn sàng').length;
    const outOfStock = materials.filter(m => m.status === 'Hết hàng').length;

    bar.innerHTML = `
        <div class="flex flex-wrap items-center justify-end gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 cursor-default">
                <span>Tổng: <strong>${total}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Sẵn sàng: <strong>${ready}</strong></span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700 cursor-default">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Hết hàng: <strong>${outOfStock}</strong></span>
            </div>
        </div>
    `;
}

function renderMaterialPagination(total, totalPages, page, role) {
    const container = document.getElementById('materialPagination');
    if (!container) return;

    if (totalPages <= 1) { container.innerHTML = `<div class="text-center text-xs text-gray-400 py-2">${total} vật tư</div>`; return; }

    const start = (page - 1) * MATERIALS_PER_PAGE + 1;
    const end = Math.min(page * MATERIALS_PER_PAGE, total);

    let btns = '';
    btns += `<button onclick="window.goToMaterialPage(${page - 1}, '${role}')" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left text-xs"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - page) > 1) {
            if (i === 4 || i === totalPages - 2) btns += `<span class="text-gray-300 text-xs px-1">•••</span>`;
            continue;
        }
        btns += `<button onclick="window.goToMaterialPage(${i}, '${role}')" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${i === page ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}">${i}</button>`;
    }
    btns += `<button onclick="window.goToMaterialPage(${page + 1}, '${role}')" class="w-8 h-8 rounded-lg flex items-center justify-center transition ${page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}" ${page >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right text-xs"></i></button>`;

    container.innerHTML = `
        <div class="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center justify-between">
            <span class="text-xs text-gray-400 font-medium pl-2">Hiển thị ${start}-${end} / ${total} vật tư</span>
            <div class="flex items-center gap-1">${btns}</div>
        </div>`;
}

window.goToMaterialPage = function (page, role) {
    renderPaginatedMaterials(allLoadedMaterials, role, page);
    document.getElementById('materialCards')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.loadSupplierFilterOptions = async function () {
    const filterSelect = document.getElementById('filterSupplier');
    if (!filterSelect) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/suppliers?limit=100', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            let html = '<option value="">Tất cả NCC</option>';
            result.data.forEach(s => { html += `<option value="${s.id}">${s.name}</option>`; });
            filterSelect.innerHTML = html;
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách nhà cung cấp cho bộ lọc:', error);
    }
};
