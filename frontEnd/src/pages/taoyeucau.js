import { renderFooter } from './footer.js';
import { renderPortalHeader } from './portalHeader.js';

export function renderTaoyeucau() {
    return `
    <div class="flex flex-col mt-0 min-h-screen">
        ${renderPortalHeader({
        activeLabel: 'Tạo yêu cầu',
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

    <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12">            
            <div class="flex justify-between items-end mb-6">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800">Tạo yêu cầu mới</h2>
                </div>
                <button type="submit" form="formTaoYeuCau" class="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                        <i class="fas fa-paper-plane text-sm"></i> Gửi yêu cầu
                </button>
            </div>

            <form id="formTaoYeuCau" onsubmit="handleSubmitRequest(event)" class="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6">
                    
                    <div class="md:col-span-2 space-y-6">
                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Tiêu đề yêu cầu <span class="text-red-500">*</span></label>
                            <input type="text" required name="title" 
                                   class="w-full px-6 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all text-gray-800 font-bold">
                        </div>

                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Mô tả nhu cầu <span class="text-red-500">*</span></label>
                            <textarea required name="description" rows="6"  
                                      class="w-full px-6 py-4 border border-gray-100 rounded-[32px] focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all resize-none text-gray-800 text-base"></textarea>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Phân loại dịch vụ <span class="text-red-500">*</span></label>
                            <div class="relative group">
                                <select required name="serviceType" class="w-full appearance-none px-6 pr-12 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 cursor-pointer font-bold text-gray-700 transition-all">
                                    <option value="" disabled selected></option>
                                    <option value="Thiết bị mạng">Thiết bị mạng</option>
                                    <option value="Hệ thống điện">Hệ thống điện</option>
                                    <option value="Bảo trì">Bảo trì</option>
                                </select>
                                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors"></i>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Hạn chót mong muốn</label>
                            <input type="date" name="deadline" 
                                   class="w-full px-6 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all font-bold text-gray-800">
                        </div>

                        <div class="space-y-2">
                            <label class="text-base font-bold text-gray-400 ml-1">Ngân sách dự kiến</label>
                            <div class="relative">
                                <input type="text" name="budget" oninput="formatCurrency(this)"
                                       class="w-full px-6 pr-16 py-4 border border-gray-100 rounded-3xl focus:outline-none focus:border-blue-500 bg-gray-50/50 transition-all font-bold text-gray-800">
                                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pt-8 border-t border-gray-50 space-y-4">
                    <div class="flex justify-between items-center px-1">
                        <label class="text-base font-bold text-gray-400">Tài liệu đính kèm</label>
                        <button type="button" onclick="document.getElementById('fileInput').click()" class="text-blue-600 font-bold text-sm hover:text-blue-800 transition">+ Thêm tệp tin</button>
                    </div>
                    
                    <div class="min-h-[70px] p-5 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200" id="fileContainer">
                        <input type="file" id="fileInput" class="hidden" multiple onchange="window.handleRequestFileSelect(this)">
                        <div id="fileList" class="flex flex-wrap gap-3 w-full">
                            <p id="noFileText" class="text-gray-300 italic text-sm w-full text-center py-2">Chưa có tài liệu nào được đính kèm.</p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
      ${renderFooter()}
    </div>`;
}

// Bổ sung hàm format số tiền phòng trường hợp chưa có ở global scope
window.formatCurrency = window.formatCurrency || function (input) {
    let value = input.value.replace(/\D/g, '');
    if (value !== '') {
        input.value = parseInt(value, 10).toLocaleString('vi-VN');
    } else {
        input.value = '';
    }
};

window.handleRequestFileSelect = function (input) {
    const fileList = document.getElementById('fileList');
    const noFileText = document.getElementById('noFileText');
    if (!fileList) return;

    if (input.files.length > 0 && noFileText) {
        noFileText.classList.add('hidden');
    }

    Array.from(input.files).forEach((file) => {
        const fileId = 'file-' + Math.random().toString(36).substr(2, 9);
        const item = document.createElement('div');
        item.id = fileId;
        item.className = "flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-700 animate-fadeIn hover:border-blue-200 transition-all";
        item.innerHTML = `
            <i class="fas fa-file text-blue-500"></i>
            <span class="max-w-[180px] truncate">${file.name}</span>
            <button type="button" class="ml-1 text-gray-300 hover:text-red-500 transition-colors" onclick="removeFile('${fileId}')">
                <i class="fas fa-times-circle"></i>
            </button>
        `;
        fileList.appendChild(item);
    });

    input.value = '';
};

window.removeFile = function (fileId) {
    const fileItem = document.getElementById(fileId);
    if (fileItem) {
        fileItem.remove();
    }

    const fileList = document.getElementById('fileList');
    const noFileText = document.getElementById('noFileText');
    if (fileList && fileList.children.length === 1 && noFileText) {
        noFileText.classList.remove('hidden');
    }
};

window.handleSubmitRequest = async function (event) {
    event.preventDefault();
    const form = document.getElementById('formTaoYeuCau');
    const formData = new FormData(form);

    const budgetRaw = (formData.get('budget') || '0').replace(/\./g, '').replace(/,/g, '');
    const body = {
        title: formData.get('title'),
        description: formData.get('description'),
        serviceType: formData.get('serviceType'),
        deadline: formData.get('deadline') || null,
        budget: parseFloat(budgetRaw) || 0
    };

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/projects/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
            alert('✅ Yêu cầu đã được gửi đến e-Teck thành công!');
            if (typeof navigateTo === 'function') navigateTo('CTTkhachhang');
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể gửi yêu cầu'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};