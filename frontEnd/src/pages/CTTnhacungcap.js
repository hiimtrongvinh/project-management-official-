// src/pages/CTTnhacungcap.js
import { renderFooter } from './footer.js';
import { renderPortalHeader } from './portalHeader.js';

let loadedSupplierMaterials = [];

const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200';
    if (url.startsWith('/uploads')) {
        return `http://localhost:3000${url}`;
    }
    return url;
};

export async function fetchSupplierMaterialsFromServer() {
    try {
        const token = localStorage.getItem('token');
        const supplierId = localStorage.getItem('supplierId');
        let url = 'http://localhost:3000/api/materials?limit=100';
        if (supplierId) {
            url += `&supplierId=${supplierId}`;
        }
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok && result.success) {
            loadedSupplierMaterials = result.data;
            renderMaterialCards(loadedSupplierMaterials, 'supplier');
        }
    } catch (err) {
        console.error('Lỗi tải danh sách vật tư:', err);
    }
}

window.fetchSupplierMaterialsFromServer = fetchSupplierMaterialsFromServer;

export function renderCTTnhacungcap() {
    setTimeout(fetchSupplierMaterialsFromServer, 50);

    return `
    <div class="flex flex-col mt-0 min-h-screen bg-gray-50/50 animate-fadeIn">
        ${renderPortalHeader({
        activeLabel: 'Vật tư',
        tabs: [
            { label: 'Vật tư', iconClass: 'fas fa-truck text-lg', onClick: "navigateTo('CTTnhacungcap')" },
            { label: 'Đơn hàng', iconClass: 'fas fa-clipboard-list', onClick: "navigateTo('donhang')" },
            { label: 'Tài khoản', iconClass: 'fas fa-user-circle text-lg', onClick: "navigateTo('taikhoanNCC')" },
        ],
    })}

        <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
            <div class="flex justify-between items-center mb-8 animate-fadeInDown">
                <h2 class="text-3xl font-bold text-gray-800">Quản lý vật tư</h2>
                <button onclick="addMaterial()" class="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition shadow-md font-bold">
                    <i class="fas fa-plus"></i> Thêm vật tư mới
                </button>
            </div>

            <div class="flex flex-wrap gap-4 mb-8 animate-fadeInUp">
                <div class="flex-1 min-w-[300px] relative">
                    <input type="text" id="searchMaterial" oninput="handleMaterialFilter('supplier')" 
                           placeholder="Tìm kiếm tên, mã vật tư..."
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 pl-14 bg-white shadow-sm">
                    <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>

                <div class="min-w-[240px] relative group">
                    <select id="filterStatus" onchange="handleMaterialFilter('supplier')" 
                            class="w-full appearance-none px-6 pr-14 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-white shadow-sm cursor-pointer text-gray-600 transition-all">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Sẵn sàng">Sẵn sàng</option>
                        <option value="Hết hàng">Hết hàng</option>
                        <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"></i>
                </div>

                <div class="min-w-[240px] relative group">
                    <select id="filterCategory" onchange="handleMaterialFilter('supplier')" 
                            class="w-full appearance-none px-6 pr-14 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 bg-white shadow-sm cursor-pointer text-gray-600 transition-all">
                        <option value="">Tất cả phân loại</option>
                        <option value="Thiết bị mạng">Thiết bị mạng</option>
                        <option value="Cáp & Dây dẫn">Cáp & Dây dẫn</option>
                        <option value="Phụ kiện">Phụ kiện</option>
                        <option value="Thiết bị điện">Thiết bị điện</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"></i>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp" id="materialCards"></div>
        </main>
        ${renderFooter()}
    </div>`;
}

export function renderMaterialCards(materials = [], role = 'staff') {
    const container = document.getElementById('materialCards');
    if (!container) return;

    if (materials.length === 0) {
        container.innerHTML = `
        <div class="col-span-full py-20 text-center animate-fadeIn">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <i class="fas fa-box-open text-2xl text-gray-300"></i>
            </div>
            <p class="text-gray-600 font-bold text-base">Không tìm thấy vật tư nào</p>
            <p class="text-gray-400 text-xs mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>`;
        return;
    }

    container.innerHTML = materials.map((m, index) => {
        const statusColor = m.status === 'Sẵn sàng' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            (m.status === 'Hết hàng' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200');

        let supplierText = '';
        if (role === 'staff') {
            const suppName = m.supplier_name || m.supplier_id || 'Chưa rõ NCC';
            supplierText = `<p class="text-xs text-gray-400 font-medium truncate" title="${suppName}"><i class="fas fa-truck text-[10px] mr-1 text-gray-300"></i>${suppName}</p>`;
        }

        const priceVal = typeof m.price === 'string' ? parseFloat(m.price) : (m.price || 0);
        const imageUrl = getImageUrl(m.image_url || m.image);
        const unitName = m.unit || m.uom || 'cái';

        return `
        <div onclick="openMaterialDetail('${m.id}', '${role}')" 
             class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex gap-5 cursor-pointer group animate-fadeInUp relative overflow-hidden"
             style="animation-delay: ${index * 0.04}s; animation-fill-mode: both;">
            
            <!-- Hover accent -->
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>
            
            <!-- Image -->
            <div class="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center group-hover:border-purple-100 transition-colors">
                <img src="${imageUrl}" alt="${m.name}" class="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500">
            </div>
            
            <!-- Content -->
            <div class="flex-1 flex flex-col justify-center min-w-0">
                <h3 class="font-bold text-gray-800 text-base line-clamp-1 mb-1 leading-snug group-hover:text-purple-700 transition-colors">${m.name}</h3>
                ${supplierText}
                <div class="flex flex-wrap gap-1.5 items-center mt-2">
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-md border border-gray-200">${m.sku}</span>
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-md border border-blue-100">${m.category}</span>
                    <span class="px-2 py-0.5 text-[10px] font-bold ${statusColor} rounded-md border">${m.status}</span>
                </div>
                <p class="text-lg font-extrabold text-purple-700 mt-2">
                    ${priceVal.toLocaleString('vi-VN')}đ <span class="text-xs font-medium text-gray-400">/ ${unitName}</span>
                </p>
            </div>
            
            <!-- Arrow -->
            <div class="flex items-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <i class="fas fa-chevron-right text-purple-300 text-sm"></i>
            </div>
        </div>`;
    }).join('');
}

window.openMaterialDetail = function (id, role, isEditing = false) {
    // Try to find material from multiple sources
    let m = loadedSupplierMaterials.find(item => String(item.id) === String(id));
    if (!m && window._allMaterialsCache) {
        m = window._allMaterialsCache.find(item => String(item.id) === String(id));
    }
    if (!m) return;

    const existingModal = document.getElementById('materialDetailModal');
    if (existingModal) existingModal.remove();

    const isSupplier = role === 'supplier';
    const suppName = m.supplier_name || 'Đang cập nhật';

    let actionButtonsHtml = '';
    if (isSupplier && !isEditing) {
        actionButtonsHtml = `
            <button onclick="openMaterialDetail('${m.id}', '${role}', true)" class="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                <i class="fas fa-edit text-sm"></i> Sửa
            </button>
            <button onclick="window.handleDeleteMaterial('${m.id}')" class="bg-white border border-red-100 text-red-500 px-5 py-2.5 rounded-2xl font-bold hover:bg-red-50 transition flex items-center gap-2">
                <i class="fas fa-trash-alt text-sm"></i> Xóa
            </button>
        `;
    } else if (isEditing) {
        actionButtonsHtml = `
            <button type="button" onclick="openMaterialDetail('${m.id}', '${role}', false)" class="text-gray-400 px-4 py-2 hover:text-gray-600 font-bold transition">Hủy</button>
            <button type="button" onclick="handleUpdateMaterial(this)" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                <i class="fas fa-save text-sm"></i> Lưu thay đổi
            </button>
        `;
    }

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/10 flex items-center justify-center z-[100] p-4 backdrop-blur-md";
    modal.id = "materialDetailModal";

    if (isEditing) {
        modal.innerHTML = `
        <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl max-h-[92vh] overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
            <div class="px-10 py-5 flex justify-between items-center bg-white sticky top-0 z-10">
                <div class="flex-1 mr-10">
                    <input type="text" name="name" form="formEditMaterial" required
                           class="w-full text-2xl font-bold text-gray-800 focus:outline-none bg-transparent border-transparent focus:border-blue-200 transition-all" 
                           value="${m.name}">
                </div>
                <div class="flex items-center gap-2">
                    ${actionButtonsHtml}
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-10 bg-gray-50/20">
                <form id="formEditMaterial" data-material-id="${m.id}" class="grid grid-cols-1 md:grid-cols-5 gap-10 items-stretch">
                    
                    <div class="md:col-span-2 flex flex-col gap-6">
                        <div class="w-full aspect-square bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center hover:border-blue-300 transition-all cursor-pointer relative group overflow-hidden"
                             onclick="document.getElementById('editMaterialImgInput').click()">
                            <input type="file" name="image" id="editMaterialImgInput" class="hidden" accept="image/*" onchange="previewMaterialImage(this, 'editMaterialImgPreview', 'editImgPreviewText')">
                            <img id="editMaterialImgPreview" src="${getImageUrl(m.image_url || m.image)}" alt="${m.name}" class="absolute inset-0 w-full h-full object-contain p-4 opacity-40 group-hover:opacity-20 transition-opacity rounded-[32px]">
                            <div id="editImgPreviewText" class="text-center z-10">
                                <i class="fas fa-camera text-gray-700 text-3xl mb-2 group-hover:text-blue-600 transition-colors"></i>
                                <p class="text-base font-bold text-gray-700">Thay ảnh mới</p>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50/50 px-6 py-5 rounded-[24px] border border-blue-100 flex items-center justify-between shadow-sm">
                            <label class="text-blue-600 text-base whitespace-nowrap">Đơn giá</label>
                            <div class="flex items-center gap-2 flex-1 justify-end ml-4">
                                <input type="text" name="price" value="${m.price.toLocaleString('vi-VN')}" oninput="formatCurrency(this)" class="w-full min-w-[80px] text-right font-black text-blue-700 focus:outline-none bg-transparent text-3xl" required>
                                <span class="text-lg font-bold text-blue-700">đ</span>
                            </div>
                        </div>
                    </div>

                    <div class="md:col-span-3">
                        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                            <div class="space-y-4">
                                ${renderCompactInput("Mã vật tư", "text", "sku", true, m.sku)}
                                ${renderCompactInput("Thương hiệu", "text", "brand", false, m.brand)}
                                
                                <div class="flex pb-2 items-center relative">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Phân loại</span>
                                    <select name="category" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer">
                                        <option value="Thiết bị mạng" ${m.category === 'Thiết bị mạng' ? 'selected' : ''}>Thiết bị mạng</option>
                                        <option value="Cáp & Dây dẫn" ${m.category === 'Cáp & Dây dẫn' ? 'selected' : ''}>Cáp & Dây dẫn</option>
                                        <option value="Phụ kiện" ${m.category === 'Phụ kiện' ? 'selected' : ''}>Phụ kiện</option>
                                        <option value="Thiết bị điện" ${m.category === 'Thiết bị điện' ? 'selected' : ''}>Thiết bị điện</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>

                                <div class="flex items-start">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Thông số</span>
                                    <textarea name="specs" rows="2" 
                                              class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base">${m.specs || ''}</textarea>
                                </div>
                                ${renderCompactInput("Đơn vị tính", "text", "unit", true, m.unit)}

                                <div class="flex pb-2 items-center relative">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Trạng thái</span>
                                    <select name="status" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none outline-none text-base appearance-none cursor-pointer">
                                        <option value="Sẵn sàng" ${m.status === 'Sẵn sàng' ? 'selected' : ''}>Sẵn sàng</option>
                                        <option value="Hết hàng" ${m.status === 'Hết hàng' ? 'selected' : ''}>Hết hàng</option>
                                        <option value="Ngừng cung cấp" ${m.status === 'Ngừng cung cấp' ? 'selected' : ''}>Ngừng cung cấp</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>
                                
                                ${!isSupplier ? `
                                <div class="flex pb-2 items-center relative">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Nhà cung cấp</span>
                                    <select name="supplierCode" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer">
                                        <option value="" disabled>Chọn nhà cung cấp</option>
                                        ${db.suppliers.map(s => `<option value="${s.supplierID}" ${m.supplierCode === s.supplierID ? 'selected' : ''}>${s.name}</option>`).join('')}
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>` : ''}

                                <div class="flex items-start">
                                    <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Mô tả</span>
                                    <textarea name="description" rows="2" 
                                              class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base">${m.description || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>`;
    } else {
        modal.innerHTML = `
        <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleUp">
            <!-- Header (White) -->
            <div class="bg-white px-8 py-5 flex justify-between items-center border-b border-gray-100 relative z-10">
                <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-violet-100">
                        <i class="fas fa-cube text-violet-500"></i>
                    </div>
                    <h2 class="text-lg font-bold text-gray-800 truncate">${m.name}</h2>
                    <span class="status-chip ${m.status === 'Sẵn sàng' ? 'status-chip-green' : m.status === 'Hết hàng' ? 'status-chip-orange' : 'status-chip-red'} text-xs ml-2 flex-shrink-0">
                        ${m.status}
                    </span>
                </div>
                <div class="flex items-center gap-3">
                    ${actionButtonsHtml}
                    <button onclick="this.closest('.fixed').remove()" class="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition border border-gray-200/50">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-8 bg-gray-50/30 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
                    
                    <!-- Left: Image + Price -->
                    <div class="md:col-span-2 flex flex-col gap-5">
                        <div class="w-full aspect-square bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img src="${getImageUrl(m.image_url || m.image)}" alt="${m.name}" class="w-full h-full object-contain p-2">
                        </div>
                        
                        <div class="bg-gradient-to-r from-purple-50 to-violet-50 px-5 py-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                            <span class="text-purple-600 text-sm font-bold">Đơn giá</span>
                            <span class="text-2xl font-extrabold text-purple-700">${m.price.toLocaleString('vi-VN')} <span class="text-base">đ</span></span>
                        </div>
                    </div>

                    <!-- Right: Details -->
                    <div class="md:col-span-3">
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin chi tiết</h3>
                            <div class="space-y-4">
                                ${renderDetailRow("Mã vật tư", m.sku)}
                                ${renderDetailRow("Thương hiệu", m.brand)}
                                ${renderDetailRow("Phân loại", m.category)}
                                ${renderDetailRow("Thông số kỹ thuật", m.specs || 'Chưa cập nhật')}
                                ${renderDetailRow("Đơn vị tính", m.unit)}
                                ${!isSupplier ? renderDetailRow("Nhà cung cấp", suppName) : ''}
                                ${renderDetailRow("Mô tả", m.description || 'Chưa có mô tả')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

function renderDetailRow(label, value) {
    return `
    <div class="flex pb-3 last:border-0 last:pb-0 items-start border-b border-gray-50">
        <span class="w-36 flex-shrink-0 text-gray-400 font-bold text-xs uppercase tracking-wide pt-0.5">${label}</span>
        <span class="text-gray-800 text-sm leading-relaxed font-medium">${value || '<span class="text-gray-300 italic">—</span>'}</span>
    </div>`;
}

window.handleMaterialFilter = function (role) {
    const keyword = document.getElementById('searchMaterial')?.value.toLowerCase().trim() || '';
    const category = document.getElementById('filterCategory')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';

    const filtered = loadedSupplierMaterials.filter(m => {
        const suppName = (m.supplier_name || '').toLowerCase();
        const matchKeyword = m.name.toLowerCase().includes(keyword) ||
            (m.sku || '').toLowerCase().includes(keyword) ||
            suppName.includes(keyword);

        const matchCategory = category === "" || m.category === category;
        const matchStatus = status === "" || m.status === status;

        return matchKeyword && matchCategory && matchStatus;
    });

    renderMaterialCards(filtered, role);
};

window.addMaterial = function () {
    const role = localStorage.getItem('authRole');
    const isSupplier = role === 'supplier';

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/10 flex items-center justify-center z-[100] p-4 backdrop-blur-md";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleIn">
        
        <div class="px-10 py-5 flex justify-between items-center bg-white sticky top-0 z-10">
            <div class="flex-1 mr-10">
                <input type="text" name="name" form="formAddMaterial" required
                       class="w-full text-2xl font-bold text-gray-800 focus:outline-none bg-transparent border-transparent focus:border-blue-200 transition-all" 
                       value="Tên vật tư mới">
            </div>
            <div class="flex items-center gap-3">
                <button type="button" onclick="this.closest('.fixed').remove()" class="text-gray-400 px-4 py-2 hover:text-gray-600 font-bold transition">Hủy</button>
                <button type="button" onclick="handleCreateMaterial(this)" class="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                    <i class="fas fa-plus-circle text-sm"></i> Tạo mới
                </button>
            </div>
        </div>

        <div class="p-8 bg-gray-50/20">
            <form id="formAddMaterial" class="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
                
                <div class="md:col-span-2 flex flex-col gap-4">
                    <div class="aspect-square bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-6 flex flex-col items-center justify-center hover:border-blue-300 transition-all cursor-pointer group"
                         onclick="document.getElementById('materialImgInput').click()">
                        <input type="file" name="image" id="materialImgInput" class="hidden" accept="image/*" onchange="previewMaterialImage(this, 'materialImgPreview', 'imgPreviewContainer')">
                        <div id="imgPreviewContainer" class="text-center">
                            <i class="fas fa-camera text-gray-200 text-3xl mb-2 group-hover:text-blue-400 transition-colors"></i>
                            <p class="text-base font-bold text-gray-300">Tải hình ảnh lên</p>
                        </div>
                        <img id="materialImgPreview" class="hidden w-full h-full object-contain rounded-xl">
                    </div>
                    
                    <div class="bg-blue-50/50 px-5 py-4 rounded-[24px] border border-blue-100 flex items-center justify-between shadow-sm">
                        <label class="text-blue-600 text-base font-bold whitespace-nowrap">Đơn giá</label>
                        <div class="flex items-center gap-2 flex-1 justify-end ml-4">
                            <input type="text" name="price" oninput="formatCurrency(this)" class="w-full min-w-[80px] text-right font-black text-blue-700 focus:outline-none bg-transparent text-3xl" required>
                            <span class="text-sm font-bold text-blue-400">đ</span>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-3">
                    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                        <div class="space-y-3">
                            ${renderCompactInput("Mã vật tư", "text", "sku", true)}
                            ${renderCompactInput("Thương hiệu", "text", "brand")}
                            
                            <div class="flex pb-2 items-center relative">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Phân loại</span>
                                <select name="category" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer">
                                    <option value="Thiết bị mạng">Thiết bị mạng</option>
                                    <option value="Cáp & Dây dẫn">Cáp & Dây dẫn</option>
                                    <option value="Phụ kiện">Phụ kiện</option>
                                    <option value="Thiết bị điện">Thiết bị điện</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>

                            <div class="flex items-start">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Thông số</span>
                                <textarea name="specs" rows="2" 
                                          class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base"></textarea>
                            </div>
                            ${renderCompactInput("Đơn vị", "text", "unit", true)}

                            <div class="flex pb-2 items-center relative">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Trạng thái</span>
                                <select name="status" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none  outline-none text-base appearance-none cursor-pointer">
                                    <option value="Sẵn sàng" selected>Sẵn sàng</option>
                                    <option value="Hết hàng">Hết hàng</option>
                                    <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                            
                            ${!isSupplier ? `
                            <div class="flex pb-2 items-center relative">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">Nhà cung cấp</span>
                                <select name="supplierCode" class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none text-gray-800 outline-none text-base appearance-none cursor-pointer" required>
                                    <option value="" disabled selected>Chọn nhà cung cấp</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>` : ''}

                            <div class="flex items-start">
                                <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm pt-2">Mô tả</span>
                                <textarea name="description" rows="2" 
                                          class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none resize-none text-base"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>`;

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

window.formatCurrency = window.formatCurrency || function (input) {
    let value = input.value.replace(/\D/g, '');
    if (value !== '') {
        input.value = parseInt(value, 10).toLocaleString('vi-VN');
    } else {
        input.value = '';
    }
};

window.previewMaterialImage = function (input, previewId = 'materialImgPreview', containerId = 'imgPreviewContainer') {
    const preview = document.getElementById(previewId);
    const container = document.getElementById(containerId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (container) container.classList.add('hidden');
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('hidden', 'opacity-40', 'group-hover:opacity-20');
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
};

function renderCompactInput(label, type, name, required = false, value = '') {
    return `
    <div class="flex pb-2 items-center">
        <span class="w-28 flex-shrink-0 font-bold text-gray-400 text-sm">${label} ${required ? '<span class="text-red-400">*</span>' : ''}</span>
        <input type="${type}" name="${name}" value="${value}" ${required ? 'required' : ''} 
               class="flex-1 bg-gray-50 px-4 py-2 rounded-xl border-none focus:ring-1 focus:ring-blue-100 outline-none text-gray-800 text-base">
    </div>`;
}

window.handleCreateMaterial = async function (btn) {
    const form = document.getElementById('formAddMaterial');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const formData = new FormData(form);
    
    // Lấy name thủ công từ input nằm ngoài form bằng cách tìm trong modal cha
    const modalEl = btn.closest('.fixed');
    const nameInput = modalEl ? modalEl.querySelector('input[name="name"]') : null;
    if (nameInput) {
        formData.set('name', nameInput.value);
    } else {
        formData.set('name', 'Tên vật tư mới');
    }

    // Format lại price thành số thực
    const priceRaw = (formData.get('price') || '0').replace(/\./g, '').replace(/,/g, '');
    formData.set('price', parseFloat(priceRaw) || 0);

    // Xử lý supplier_id
    if (!formData.get('supplierCode')) {
        formData.delete('supplierCode');
    } else {
        formData.set('supplier_id', formData.get('supplierCode'));
        formData.delete('supplierCode');
    }

    // Đảm bảo file được append đúng
    const fileInput = document.getElementById('materialImgInput');
    if (fileInput && fileInput.files[0]) {
        formData.set('image', fileInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/materials', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Thêm vật tư mới thành công!');
            btn.closest('.fixed').remove();
            fetchSupplierMaterialsFromServer();
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể tạo vật tư'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

window.handleUpdateMaterial = async function (btn) {
    const form = document.getElementById('formEditMaterial');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const materialId = form.dataset.materialId;
    const formData = new FormData(form);

    // Lấy name thủ công từ input nằm ngoài form bằng cách tìm trong modal cha
    const modalEl = btn.closest('.fixed');
    const nameInput = modalEl ? modalEl.querySelector('input[name="name"]') : null;
    if (nameInput) {
        formData.set('name', nameInput.value);
    }

    // Format lại price thành số thực
    const priceRaw = (formData.get('price') || '0').replace(/\./g, '').replace(/,/g, '');
    formData.set('price', parseFloat(priceRaw) || 0);

    // Đảm bảo file được append đúng
    const fileInput = document.getElementById('editMaterialImgInput');
    if (fileInput && fileInput.files[0]) {
        formData.set('image', fileInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/materials/${materialId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Cập nhật vật tư thành công!');
            btn.closest('.fixed').remove();
            fetchSupplierMaterialsFromServer();
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể cập nhật'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

window.handleDeleteMaterial = async function (materialId) {
    if (!await window.showConfirm('Bạn có chắc chắn muốn xóa vật tư này?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/materials/${materialId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Đã xóa vật tư thành công!');
            const modal = document.getElementById('materialDetailModal');
            if (modal) modal.remove();
            fetchSupplierMaterialsFromServer();
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể xóa'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};