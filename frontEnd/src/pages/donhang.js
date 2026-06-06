import { renderFooter } from './footer.js';
import { renderPortalHeader } from './portalHeader.js';

function getStatusColor(status) {
    const colors = {
        'Mới': 'bg-blue-100 text-blue-700',
        'Đã xác nhận': 'bg-purple-100 text-purple-700',
        'Đang giao': 'bg-orange-100 text-orange-700',
        'Hoàn thành': 'bg-green-100 text-green-700',
        'Hủy': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
}

function mapDBStatusToUI(status) {
    return status || 'Mới';
}

function mapUIStatusToDB(status) {
    return status || 'Mới';
}

export function renderDonhang() {
    setTimeout(fetchOrders, 0);

    return `
    <div class="flex flex-col mt-0 min-h-screen">
        ${renderPortalHeader({
        activeLabel: 'Đơn hàng',
        tabs: [
            {
                label: 'Vật tư',
                iconClass: 'fas fa-truck text-lg',
                onClick: "navigateTo('CTTnhacungcap')",
            },
            {
                label: 'Đơn hàng',
                iconClass: 'fas fa-clipboard-list',
                onClick: "navigateTo('donhang')",
            },
            {
                label: 'Tài khoản',
                iconClass: 'fas fa-user-circle text-lg',
                onClick: "navigateTo('taikhoanNCC')",
            },
        ],
    })}

        <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Danh sách đơn hàng</h2>
                <div class="flex gap-3">
                    <button onclick="window.showToast('In danh sách đơn hàng')" class="bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
                        <i class="fas fa-print"></i> Xuất báo cáo
                    </button>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 mb-8">
                <div class="flex-1 min-w-[300px] relative">
                    <input type="text" id="searchOrder" oninput="handleOrderFilter()" 
                           placeholder="Tìm theo mã PO hoặc tên dự án..." 
                           class="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 pl-14 bg-white shadow-sm">
                    <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div class="min-w-[200px] relative">
                    <select id="filterStatus" onchange="handleOrderFilter()" 
                            class="w-full appearance-none px-6 pr-12 py-4 border border-gray-200 rounded-3xl focus:outline-none bg-white shadow-sm cursor-pointer font-bold text-gray-600">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Mới">Mới</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="orderCards">
                <div class="col-span-full py-12 text-center text-gray-400 font-medium">Đang tải danh sách đơn hàng...</div>
            </div>
        </main>

        ${renderFooter()}
    </div>`;
}

async function fetchOrders() {
    const container = document.getElementById('orderCards');
    if (!container) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error?.message || 'Không thể lấy đơn hàng');

        const rawOrders = result.data || [];
        window.cachedOrders = rawOrders.map(o => {
            const dateObj = new Date(o.expected_date || o.created_at);
            const expectedDate = isNaN(dateObj.getTime()) ? '---' : dateObj.toLocaleDateString('vi-VN');
            const items = (o.items || []).map(item => ({
                name: item.material_name || item.name || 'Vật tư',
                sku: item.material_sku || item.sku || 'SKU-NONE',
                qty: item.quantity || 0,
                price: parseFloat(item.material_price || item.price || 0),
                unit: item.material_unit || item.unit || 'Cái'
            }));
            const calculatedTotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            return {
                id: o.id,
                dbId: o.id,
                projectName: o.project_title || 'Dự án chưa rõ',
                totalAmount: calculatedTotal,
                expectedDate: expectedDate,
                expectedDateRaw: o.expected_date,
                status: mapDBStatusToUI(o.status),
                address: o.address || 'Kho tổng e-Teck, Hải Phòng',
                receiver: o.receiver_name || 'Phòng Vật tư e-Teck',
                supplierName: o.supplier_name || 'Nhà cung cấp',
                note: o.note || '',
                items: items
            };
        });

        renderOrderCards(window.cachedOrders);
    } catch (err) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-red-500 font-bold">Lỗi: ${err.message}</div>`;
    }
}

export function renderOrderCards(orders = []) {
    const container = document.getElementById('orderCards');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-gray-400 font-medium">Không tìm thấy đơn hàng nào phù hợp.</div>`;
        return;
    }

    container.innerHTML = orders.map(o => {
        return `
        <div onclick="openOrderDetail('${o.id}')" 
             class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-6 cursor-pointer group">
            <div class="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-2xl flex-shrink-0">
                <i class="fas fa-file-invoice-dollar"></i>
            </div>

            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-black text-gray-800 text-xl">${o.id}</h3>
                    <span class="px-3 py-1 ${getStatusColor(o.status)} rounded-xl text-xs font-bold uppercase tracking-widest">
                        ${o.status}
                    </span>
                </div>
                <p class="text-gray-500 text-base font-medium line-clamp-2 mb-2">${o.projectName}</p>
                
                <div class="pt-3 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400 font-bold whitespace-nowrap">Tổng giá trị:</span>
                        <span class="text-xl font-black text-blue-700 whitespace-nowrap">${o.totalAmount.toLocaleString('vi-VN')} <small class="text-sm font-normal">đ</small></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400 font-bold whitespace-nowrap">Hạn giao:</span>
                        <span class="text-xl font-black text-gray-800 whitespace-nowrap">${o.expectedDate}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

window.openOrderDetail = async function (id) {
    let o = null;
    if (window.cachedOrders) {
        o = window.cachedOrders.find(item => item.id === id);
    }
    
    if (!o) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/orders/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success && result.data) {
                const dbOrder = result.data;
                const dateObj = new Date(dbOrder.expected_date || dbOrder.created_at);
                const expectedDate = isNaN(dateObj.getTime()) ? '---' : dateObj.toLocaleDateString('vi-VN');
                const items = (dbOrder.items || []).map(item => ({
                    name: item.material_name || item.name || 'Vật tư',
                    sku: item.material_sku || item.sku || 'SKU-NONE',
                    qty: item.quantity || 0,
                    price: parseFloat(item.material_price || item.price || 0),
                    unit: item.material_unit || item.unit || 'Cái'
                }));
                const calculatedTotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
                o = {
                    id: dbOrder.id,
                    dbId: dbOrder.id,
                    projectName: dbOrder.project_title || 'Dự án chưa rõ',
                    totalAmount: calculatedTotal,
                    expectedDate: expectedDate,
                    expectedDateRaw: dbOrder.expected_date,
                    status: dbOrder.status || 'Mới',
                    address: dbOrder.address || 'Kho tổng e-Teck, Hải Phòng',
                    receiver: dbOrder.receiver_name || 'Phòng Vật tư e-Teck',
                    supplierName: dbOrder.supplier_name || 'Nhà cung cấp',
                    note: dbOrder.note || '',
                    items: items
                };
                window.cachedOrders = window.cachedOrders || [];
                if (!window.cachedOrders.some(item => item.id === id)) {
                    window.cachedOrders.push(o);
                }
            }
        } catch (e) {
            console.error('Lỗi khi tải chi tiết đơn hàng ngoài cache:', e);
            window.showToast('❌ Không thể tải thông tin đơn hàng!', 'error');
            return;
        }
    }
    
    if (!o) return;

    let actionHeaderHtml = '';
    if (o.status === 'Mới') {
        actionHeaderHtml = `
            <button onclick="updateOrderStatus('${o.id}', 'Đã xác nhận')" class="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2">
                <i class="fas fa-check-circle"></i> Xác nhận đơn
            </button>
            <button onclick="updateOrderStatus('${o.id}', 'Hủy')" class="bg-red-500 text-white hover:bg-red-600 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2">
                <i class="fas fa-times-circle"></i> Từ chối đơn
            </button>
        `;
    } else if (o.status === 'Đã xác nhận') {
        actionHeaderHtml = `<button onclick="updateOrderStatus('${o.id}', 'Đang giao')" class="bg-orange-50 text-white hover:bg-orange-600 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2"><i class="fas fa-truck"></i> Giao hàng</button>`;
    } else if (o.status === 'Đang giao') {
        actionHeaderHtml = `<button onclick="updateOrderStatus('${o.id}', 'Hoàn thành')" class="bg-green-600 text-white hover:bg-green-700 px-6 py-2.5 rounded-2xl font-bold text-base transition shadow-md flex items-center gap-2"><i class="fas fa-check-double"></i> Hoàn thành</button>`;
    }

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/10 flex items-center justify-center z-[100] p-4 backdrop-blur-md";
    modal.id = "orderDetailModal";
    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-[40px] w-full max-w-6xl max-h-[92vh] overflow-hidden border border-slate-200/80 shadow-md shadow-slate-100 flex flex-col animate-scaleIn">
        
        <div class="px-10 py-6 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
                <div class="flex items-center gap-4">
                    <h2 class="text-3xl font-black text-gray-800">${o.id}</h2>
                    <span class="px-4 py-1.5 ${getStatusColor(o.status)} rounded-xl text-xs font-black uppercase tracking-widest">${o.status}</span>
                </div>
                <p class="text-gray-400 font-bold text-base mt-1.5">${o.projectName}</p>
            </div>
            
            <div class="flex items-center gap-4">
                ${actionHeaderHtml}
                <div class="w-[1px] h-8 bg-gray-100 mx-1"></div>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-300 w-10 h-10 rounded-xl hover:bg-gray-50 hover:text-gray-500 transition">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto px-10 pb-10 pt-2 bg-gray-50/20">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h4 class="text-base font-black text-gray-400 mb-6">Danh mục vật tư</h4>
                        <table class="w-full text-left">
                            <thead class="text-sm text-gray-400 font-black border-b border-gray-50">
                                <tr>
                                    <th class="pb-4">Vật tư</th>
                                    <th class="pb-4 text-center">SL</th>
                                    <th class="pb-4 text-right">Đơn giá</th>
                                    <th class="pb-4 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                ${o.items.map(item => `
                                    <tr>
                                        <td class="py-5 pr-4">
                                            <p class="font-bold text-gray-800 text-lg leading-tight">${item.name}</p>
                                            <p class="text-xs text-gray-400 uppercase font-bold mt-1.5">${item.sku}</p>
                                        </td>
                                        <td class="py-5 text-center font-bold text-blue-600 text-lg">${item.qty}</td>
                                        <td class="py-5 text-right font-medium text-gray-500 text-base">${item.price.toLocaleString('vi-VN')}</td>
                                        <td class="py-5 text-right font-black text-gray-800 text-lg">${(item.qty * item.price).toLocaleString('vi-VN')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span class="text-base font-bold text-gray-400 ">Tổng thanh toán:</span>
                            <span class="text-4xl font-black text-blue-700">${o.totalAmount.toLocaleString('vi-VN')} <small class="text-base font-normal">VNĐ</small></span>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h4 class="text-base font-black text-gray-400 mb-6">Thông tin giao nhận</h4>
                        <div class="space-y-6">
                            <div class="flex gap-4">
                                <i class="fas fa-map-pin text-blue-500 mt-1 text-lg"></i>
                                <div>
                                    <p class="text-sm font-black text-gray-400 mb-1.5">Địa chỉ nhận</p>
                                    <p class="text-base font-bold text-gray-800 leading-snug">${o.address}</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <i class="fas fa-user-circle text-blue-500 mt-1 text-lg"></i>
                                <div>
                                    <p class="text-sm font-black text-gray-400 mb-1.5">Đại diện e-Teck</p>
                                    <p class="text-base font-bold text-gray-800">${o.receiver}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onclick="window.previewOrderDocx('${o.id}')" class="w-full bg-blue-600 text-white hover:bg-blue-700 py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3 shadow-md">
                        <i class="fas fa-file-word"></i> Xuất / Xem trước đơn hàng
                    </button>
                    <p class="text-xs text-gray-400 text-center mt-5 font-medium italic">Vui lòng xuất PO kèm theo bộ chứng từ khi giao hàng.</p>
                </div>
            </div>
        </div>
    </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}

window.previewOrderDocx = async function (id) {
    // 1. Tạo modal preview
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fadeIn";
    modal.id = "orderDocxPreviewModal";

    modal.innerHTML = `
    <div onclick="event.stopImmediatePropagation()" class="bg-white rounded-3xl w-full max-w-5xl h-[90vh] overflow-hidden border border-slate-200/80 shadow-2xl flex flex-col animate-scaleUp">
        <div class="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-500">
                    <i class="fas fa-file-word text-lg"></i>
                </div>
                <div class="min-w-0">
                    <h2 class="text-sm font-bold text-gray-800 truncate">Đơn đặt hàng ${id}</h2>
                    <p class="text-[10px] text-gray-400 font-medium">Xem trước và xuất bản ghi</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button id="downloadDocxBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm">
                    <i class="fas fa-download"></i> Tải file Word (.docx)
                </button>
                <button id="printDocxBtn" class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm">
                    <i class="fas fa-print"></i> In đơn hàng
                </button>
                <button onclick="document.getElementById('orderDocxPreviewModal').remove()" class="w-9 h-9 rounded-xl hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
        </div>
        
        <div class="bg-slate-100 p-8 overflow-y-auto flex-1 flex justify-center" id="docx-preview-body">
            <div class="flex flex-col items-center justify-center py-12 space-y-3" id="docx-preview-loading">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p class="text-gray-500 text-xs font-medium">Đang tạo file Word và tải bản xem trước...</p>
            </div>
        </div>
    </div>`;

    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/orders/${id}/export-docx`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Không thể kết nối đến server để tạo file Word");
        const blob = await response.blob();

        const bodyContainer = document.getElementById('docx-preview-body');
        const loading = document.getElementById('docx-preview-loading');
        if (loading) loading.remove();

        const wordRenderDiv = document.createElement('div');
        wordRenderDiv.className = "bg-white shadow-lg p-16 max-w-[850px] w-full min-h-[1100px] overflow-x-auto text-black";
        bodyContainer.appendChild(wordRenderDiv);

        // Render docx
        await docx.renderAsync(blob, wordRenderDiv);

        // Attach download event
        document.getElementById('downloadDocxBtn').onclick = () => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Don_dat_hang_${id}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        };

        // Attach print event
        document.getElementById('printDocxBtn').onclick = () => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>In Đơn Hàng</title>');
            printWindow.document.write('<style>body { font-family: "Times New Roman", serif; padding: 40px; } table { width: 100%; border-collapse: collapse; margin: 20px 0; } th, td { border: 1px solid black; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } .text-center { text-align: center; } .text-right { text-align: right; } .bold { font-weight: bold; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(wordRenderDiv.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        };

    } catch (err) {
        console.error(err);
        document.getElementById('docx-preview-body').innerHTML = `
            <div class="m-auto p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center text-sm font-semibold max-w-md shadow-sm flex flex-col items-center gap-3">
                <i class="fas fa-exclamation-circle text-2xl text-red-500"></i>
                <span>Lỗi: ${err.message}</span>
            </div>`;
    }
};

window.updateOrderStatus = async function (id, newStatus) {
    if (!window.cachedOrders) return;
    const o = window.cachedOrders.find(item => item.id === id);
    if (!o) return;

    const dbStatus = mapUIStatusToDB(newStatus);
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${o.dbId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: dbStatus })
        });
        const result = await res.json();
        if (result.success) {
            o.status = newStatus;
            const currentModal = document.getElementById('orderDetailModal');
            if (currentModal) currentModal.remove();
            handleOrderFilter();
            setTimeout(() => {
                openOrderDetail(id);
            }, 50);
        } else {
            window.showToast("❌ Cập nhật thất bại: " + (result.error?.message || 'Lỗi không xác định'), 'error');
        }
    } catch (err) {
        window.showToast("❌ Lỗi kết nối: " + err.message, 'error');
    }
};

window.handleOrderFilter = function () {
    if (!window.cachedOrders) return;
    const keyword = document.getElementById('searchOrder')?.value.toLowerCase().trim() || '';
    const status = document.getElementById('filterStatus')?.value || '';

    const filtered = window.cachedOrders.filter(o => {
        const matchKeyword = o.id.toLowerCase().includes(keyword) || o.projectName.toLowerCase().includes(keyword);
        const matchStatus = status === "" || o.status === status;
        return matchKeyword && matchStatus;
    });
    renderOrderCards(filtered);
};

window.renderOrderCards = renderOrderCards;