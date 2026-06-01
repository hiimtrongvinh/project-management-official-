// src/pages/danhmuc.js

const GROUP_LABELS = {
    departments: 'Phòng ban/Nhóm',
    priorities: 'Mức độ ưu tiên',
    taskStatuses: 'Trạng thái công việc',
    projectTypes: 'Phân loại dự án',
    projectStatuses: 'Trạng thái dự án'
};

let cachedCategories = {};

async function fetchCategories() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            cachedCategories = result.data;
        }
    } catch (err) {
        console.error('Lỗi tải danh mục:', err);
    }
}

function createListItem(item) {
    return `
    <div class="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-xl group transition-all hover:bg-gray-100" data-id="${item.id}">
        <span class="text-base font-medium text-gray-700">${item.value}</span>
        <div class="flex gap-3 opacity-0 group-hover:opacity-100 transition">
            <button onclick="editItem(${item.id}, '${item.value.replace(/'/g, "\\'")}')" class="text-blue-600 hover:text-blue-700 text-xs"><i class="fas fa-pen"></i></button>
            <button onclick="deleteItem(${item.id})" class="text-red-600 hover:text-red-700 text-xs"><i class="fas fa-trash"></i></button>
        </div>
    </div>`;
}

function createCategoryBlock(title, items, groupName) {
    const itemsHtml = items.map(createListItem).join('');
    return `
    <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 break-inside-avoid mb-5">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">${title}</h2>
            <button onclick="addItem('${groupName}')" class="text-blue-600 hover:text-blue-700"><i class="fas fa-plus-circle text-xl"></i></button>
        </div>
        <div class="space-y-2" id="${groupName}-list">
            ${itemsHtml}
        </div>
    </div>`;
}

export function renderDanhmuc() {
    return `
    <div class="max-w-7xl mx-auto h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Quản lý danh mục</h1>
        </div>
        <div id="categoryContainer" class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-5">
            <div class="text-gray-400 text-center py-10">Đang tải danh mục...</div>
        </div>
    </div>`;
}

export async function initDanhmuc() {
    await fetchCategories();
    const container = document.getElementById('categoryContainer');
    if (!container) return;

    let html = '';
    for (const [groupName, label] of Object.entries(GROUP_LABELS)) {
        const items = cachedCategories[groupName] || [];
        html += createCategoryBlock(label, items, groupName);
    }
    container.innerHTML = html;
}

window.editItem = async (id, oldValue) => {
    const newVal = prompt('Nhập giá trị mới:', oldValue);
    if (!newVal || newVal.trim() === '' || newVal.trim() === oldValue) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ value: newVal.trim() })
        });
        const result = await res.json();
        if (result.success) {
            initDanhmuc();
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể sửa'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

window.deleteItem = async (id) => {
    if (!await window.showConfirm('Bạn có chắc muốn xóa mục này?')) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
            initDanhmuc();
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể xóa'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};

window.addItem = async (groupName) => {
    const val = prompt('Nhập mục mới:');
    if (!val || val.trim() === '') return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ group_name: groupName, value: val.trim() })
        });
        const result = await res.json();
        if (result.success) {
            initDanhmuc();
        } else {
            alert('❌ Lỗi: ' + (result.error?.message || 'Không thể thêm'));
        }
    } catch (err) {
        alert('❌ Lỗi kết nối: ' + err.message);
    }
};