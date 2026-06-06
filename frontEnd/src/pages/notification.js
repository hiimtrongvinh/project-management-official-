// src/pages/notification.js
import { renderPortalHeader } from './portalHeader.js';
import { renderFooter } from './footer.js';

let cachedNotifications = [];
let unreadCount = 0;
let pollingTimer = null;
let currentPageFilter = 'all'; // 'all' | 'unread' | 'read'

const NOTI_TYPE_CONFIG = {
  task_assigned: { icon: 'fa-user-plus', color: 'text-blue-500', bg: 'bg-blue-50' },
  task_submitted: { icon: 'fa-paper-plane', color: 'text-purple-500', bg: 'bg-purple-50' },
  task_approved: { icon: 'fa-check-circle', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  task_rejected: { icon: 'fa-exclamation-circle', color: 'text-orange-500', bg: 'bg-orange-50' },
  task_deadline_warning: { icon: 'fa-clock', color: 'text-amber-500', bg: 'bg-amber-50' },
  task_overdue: { icon: 'fa-exclamation-triangle', color: 'text-red-500', bg: 'bg-red-50' },
  quotation_sent_to_client: { icon: 'fa-file-invoice-dollar', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  quotation_sent_to_supplier: { icon: 'fa-truck', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  order_status_updated: { icon: 'fa-sync-alt', color: 'text-teal-500', bg: 'bg-teal-50' },
  project_created: { icon: 'fa-folder-plus', color: 'text-blue-500', bg: 'bg-blue-50' },
  project_step_advanced: { icon: 'fa-arrow-right', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  project_completed: { icon: 'fa-trophy', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  project_deadline_warning: { icon: 'fa-calendar-times', color: 'text-amber-500', bg: 'bg-amber-50' },
  client_request_new: { icon: 'fa-inbox', color: 'text-violet-500', bg: 'bg-violet-50' }
};

function getConfig(type) {
  return NOTI_TYPE_CONFIG[type] || { icon: 'fa-bell', color: 'text-gray-500', bg: 'bg-gray-50' };
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

// Chuông thông báo ở Sidebar (Admin/Staff)
export function renderNotificationBell() {
  return `
    <div class="relative" id="notificationBellWrapper">
      <button onclick="window.navigateTo('thongbao')" 
              class="relative w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group"
              title="Thông báo">
        <i class="fas fa-bell text-blue-300 group-hover:text-white transition-colors"></i>
        <span id="notiBadge" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce-sm">0</span>
      </button>
    </div>`;
}

// Chuông thông báo ở Portal Header (Client/Supplier)
export function renderPortalNotificationBell() {
  return `
    <div class="relative" id="notificationBellWrapper">
      <button onclick="window.navigateTo('thongbao')" 
              class="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all group"
              title="Thông báo">
        <i class="fas fa-bell text-gray-500 group-hover:text-blue-600 transition-colors"></i>
        <span id="notiBadge" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce-sm">0</span>
      </button>
    </div>`;
}

// ==========================================
// RENDER TRANG THÔNG BÁO RIÊNG BIỆT (PAGE)
// ==========================================
export function renderNotificationPage() {
  const role = localStorage.getItem('authRole') || 'staff';

  // Khởi động tải dữ liệu bất đồng bộ ngay sau khi render DOM
  setTimeout(() => {
    if (typeof window.initNotificationPage === 'function') {
      window.initNotificationPage();
    }
  }, 50);

  const clientSupplierContent = `
    <!-- Spacious Elegant Notification Card for Portals -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-5xl mx-auto animate-scaleIn">
      <div class="px-6 md:px-8 py-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <!-- Filter Tabs -->
        <div class="flex gap-6">
          <button onclick="window.changeNotiFilter('all')" id="filter-all" class="text-sm font-bold text-blue-600 border-b-2 border-blue-500 pb-2 transition-all cursor-pointer bg-transparent border-none">Tất cả</button>
          <button onclick="window.changeNotiFilter('unread')" id="filter-unread" class="text-sm font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all cursor-pointer bg-transparent border-none">Chưa đọc</button>
          <button onclick="window.changeNotiFilter('read')" id="filter-read" class="text-sm font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all cursor-pointer bg-transparent border-none">Đã đọc</button>
        </div>
        <!-- Action Buttons -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button onclick="window.markAllNotiReadPage()" class="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm cursor-pointer bg-transparent border-none">
            <i class="fas fa-check-double"></i> Đọc tất cả
          </button>
          <button onclick="window.deleteAllNotiPage()" class="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all shadow-sm cursor-pointer bg-transparent border-none">
            <i class="fas fa-trash-alt"></i> Xóa tất cả
          </button>
        </div>
      </div>

      <!-- Spacious, Expandable List -->
      <div id="pageNotiList" class="divide-y divide-slate-100 min-h-[350px] flex flex-col">
        <div class="py-20 text-center text-slate-300 font-medium text-sm flex items-center justify-center flex-grow">Đang tải thông báo...</div>
      </div>
    </div>
  `;

  if (role === 'client') {
    return `
    <div class="flex flex-col mt-0 min-h-screen bg-gray-50/50 animate-fadeIn"> 
      ${renderPortalHeader({
      activeLabel: 'Thông báo',
      tabs: [
        { label: 'Dự án', iconClass: 'fas fa-briefcase text-lg', onClick: "navigateTo('CTTkhachhang')" },
        { label: 'Tạo yêu cầu', iconClass: 'fas fa-plus', onClick: "navigateTo('taoyeucau')" },
        { label: 'Tài khoản', iconClass: 'fas fa-user-circle text-lg', onClick: "navigateTo('taikhoanKH')" },
      ],
    })}
      <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
        <div class="mb-8 animate-fadeInDown">
            <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
              Thông báo của tôi
              <span id="pageNotiCount" class="hidden text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">0</span>
            </h2>
        </div>
        ${clientSupplierContent}
      </main>
      ${renderFooter()}
    </div>`;
  }

  if (role === 'supplier') {
    return `
    <div class="flex flex-col mt-0 min-h-screen bg-gray-50/50 animate-fadeIn">
      ${renderPortalHeader({
      activeLabel: 'Thông báo',
      tabs: [
        { label: 'Vật tư', iconClass: 'fas fa-truck text-lg', onClick: "navigateTo('CTTnhacungcap')" },
        { label: 'Đơn hàng', iconClass: 'fas fa-clipboard-list', onClick: "navigateTo('donhang')" },
        { label: 'Tài khoản', iconClass: 'fas fa-user-circle text-lg', onClick: "navigateTo('taikhoanNCC')" },
      ],
    })}
      <main class="max-w-7xl mx-auto w-full px-8 pt-8 pb-12 flex-1">
        <div class="mb-8 animate-fadeInDown">
            <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
              Thông báo của tôi
              <span id="pageNotiCount" class="hidden text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">0</span>
            </h2>
        </div>
        ${clientSupplierContent}
      </main>
      ${renderFooter()}
    </div>`;
  }

  // Admin hoặc Staff (Có Standalone Premium Header tương tự các trang khác)
  return `
    <div class="max-w-5xl mx-auto py-2">
      <!-- Unified Premium Header Card -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeInDown">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm animate-bounce-sm">
            <i class="fas fa-bell text-blue-500 text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
              Thông báo của bạn
              <span id="pageNotiCount" class="hidden text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">0</span>
            </h1>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button onclick="window.markAllNotiReadPage()" class="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm cursor-pointer bg-transparent border-none">
            <i class="fas fa-check-double"></i> Đọc tất cả
          </button>
          <button onclick="window.deleteAllNotiPage()" class="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all shadow-sm cursor-pointer bg-transparent border-none">
            <i class="fas fa-trash-alt"></i> Xóa tất cả
          </button>
        </div>
      </div>

      <!-- Main Notifications Card -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-scaleIn">
        <!-- Filter Tabs -->
        <div class="px-6 md:px-8 py-4 border-b border-gray-50 bg-white flex gap-6">
          <button onclick="window.changeNotiFilter('all')" id="filter-all" class="text-sm font-bold text-blue-600 border-b-2 border-blue-500 pb-2 transition-all cursor-pointer bg-transparent border-none">Tất cả</button>
          <button onclick="window.changeNotiFilter('unread')" id="filter-unread" class="text-sm font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all cursor-pointer bg-transparent border-none">Chưa đọc</button>
          <button onclick="window.changeNotiFilter('read')" id="filter-read" class="text-sm font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all cursor-pointer bg-transparent border-none">Đã đọc</button>
        </div>

        <!-- Notifications List -->
        <div id="pageNotiList" class="divide-y divide-slate-100 min-h-[400px] flex flex-col">
          <div class="py-20 text-center text-slate-300 font-medium text-sm flex items-center justify-center flex-grow">Đang tải thông báo...</div>
        </div>
      </div>
    </div>`;
}

// Tải và hiển thị danh sách thông báo trên Page
export async function initNotificationPage() {
  currentPageFilter = 'all';
  await fetchPageNotifications();
}

async function fetchPageNotifications() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      cachedNotifications = result.data || [];
      renderPageNotifications();
      // Cập nhật số đếm chưa đọc trên tiêu đề trang
      const unread = cachedNotifications.filter(n => !n.is_read).length;
      const countLabel = document.getElementById('pageNotiCount');
      if (countLabel) {
        if (unread > 0) {
          countLabel.textContent = unread;
          countLabel.classList.remove('hidden');
        } else {
          countLabel.classList.add('hidden');
        }
      }
    }
  } catch (err) {
    console.error('[Notification] Page fetch error:', err.message);
  }
}

function renderPageNotifications() {
  const container = document.getElementById('pageNotiList');
  if (!container) return;

  let filtered = cachedNotifications;
  if (currentPageFilter === 'unread') {
    filtered = cachedNotifications.filter(n => !n.is_read);
  } else if (currentPageFilter === 'read') {
    filtered = cachedNotifications.filter(n => n.is_read);
  }

  if (filtered.length === 0) {
    let msg = 'Không có thông báo nào.';
    if (currentPageFilter === 'unread') msg = 'Bạn không có thông báo chưa đọc.';
    if (currentPageFilter === 'read') msg = 'Bạn không có thông báo đã đọc.';

    const isPortal = ['client', 'supplier'].includes(localStorage.getItem('authRole'));
    container.innerHTML = `
      <div class="${isPortal ? 'py-12' : 'py-32'} text-center flex flex-col items-center justify-center flex-grow animate-fadeIn">
        <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3 shadow-sm border border-slate-100">
          <i class="fas fa-bell-slash text-2xl text-slate-300"></i>
        </div>
        <p class="text-slate-400 text-xs font-bold">${msg}</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(n => {
    const cfg = getConfig(n.type);
    const itemReadClass = n.is_read ? 'bg-white opacity-70 hover:opacity-100' : 'bg-blue-50/10 border-l-4 border-blue-500 pl-4 md:pl-5';
    const unreadIndicator = n.is_read ? '' : `<div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1.5 flex-shrink-0"></div>`;

    return `
      <div class="group/noti flex items-start gap-4 px-6 md:px-8 py-4 md:py-5 hover:bg-gray-50 transition-all cursor-pointer relative ${itemReadClass}"
           onclick="window.handlePageNotiClick(${n.id}, '${n.related_type || ''}', '${n.related_id || ''}')">
        <div class="w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <i class="fas ${cfg.icon} ${cfg.color} text-sm"></i>
        </div>
        <div class="flex-1 min-w-0 pr-4">
          <h4 class="${n.is_read ? 'text-gray-700 font-bold' : 'text-gray-900 font-bold'} text-sm md:text-base leading-snug break-words">${n.title}</h4>
          <p class="text-xs md:text-sm text-gray-500 mt-1 break-words leading-relaxed">${n.message || ''}</p>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <i class="far fa-clock"></i> ${timeAgo(n.created_at)}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 self-center flex-shrink-0">
          ${unreadIndicator}
          <button onclick="window.deletePageNoti(event, ${n.id})"
                  class="opacity-0 group-hover/noti:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 rounded-xl hover:bg-gray-100 bg-transparent border-none cursor-pointer"
                  title="Xóa thông báo">
            <i class="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>`;
  }).join('');
}

// Các handler đăng ký lên window cho Page
window.changeNotiFilter = function (filter) {
  currentPageFilter = filter;

  // Cập nhật trạng thái active tab
  const tabs = ['all', 'unread', 'read'];
  tabs.forEach(t => {
    const btn = document.getElementById('filter-' + t);
    if (btn) {
      if (t === filter) {
        btn.className = "text-sm font-bold text-blue-600 border-b-2 border-blue-500 pb-2 transition-all bg-transparent border-none cursor-pointer";
      } else {
        btn.className = "text-sm font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all bg-transparent border-none cursor-pointer";
      }
    }
  });

  renderPageNotifications();
};

function getRelatedTypeFromNotiType(notiType) {
  if (!notiType) return '';
  const typeLower = notiType.toLowerCase();
  if (typeLower.startsWith('task_') || ['revision_requested', 'deadline_reminder', 'deadline_warning', 'task_overdue'].includes(typeLower)) {
    return 'task';
  }
  if (typeLower.startsWith('project_') || typeLower.startsWith('client_') || typeLower === 'project_deadline') {
    return 'project';
  }
  if (typeLower.startsWith('quotation_') || typeLower.startsWith('order_') || typeLower === 'order_received') {
    return 'order';
  }
  return '';
}

window.handlePageNotiClick = async function (notiId, relatedType, relatedId) {
  // Tìm thông báo trong cache để suy diễn relatedType nếu đối số truyền vào bị trống
  let finalRelatedType = relatedType;
  const noti = cachedNotifications.find(n => n.id === notiId);
  if (!finalRelatedType && noti) {
    finalRelatedType = getRelatedTypeFromNotiType(noti.type);
  }
  const finalRelatedId = relatedId || (noti ? noti.related_id : '');

  try {
    const token = localStorage.getItem('token');
    await fetch(`/api/notifications/${notiId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Đánh dấu đã đọc trong cache local
    cachedNotifications = cachedNotifications.map(n => n.id === notiId ? { ...n, is_read: true } : n);
    renderPageNotifications();
    fetchUnreadCount();
  } catch (err) { /* ignore */ }

  if (!finalRelatedId) return;

  const role = localStorage.getItem('authRole');

  // 1. ĐIỀU HƯỚNG DỰ ÁN
  if (finalRelatedType === 'project') {
    window.openProjectDetail(finalRelatedId, role, 'hoso');
  }
  // 2. ĐIỀU HƯỚNG CÔNG VIỆC
  else if (finalRelatedType === 'task') {
    try {
      const token = localStorage.getItem('token');
      // Fetch thông tin công việc để lấy project_id
      const res = await fetch(`/api/tasks/${finalRelatedId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success && result.data) {
        const task = result.data;
        const projectId = task.project_id;
        
        // Mở modal chi tiết dự án tại tab Phân công
        await window.openProjectDetail(projectId, role, 'phancong');
        
        // Đợi DOM render rồi scroll và highlight card công việc
        setTimeout(() => {
          const taskEl = document.querySelector(`[data-task-id="${finalRelatedId}"]`);
          if (taskEl) {
            taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            taskEl.style.transition = 'all 0.5s ease';
            taskEl.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.8)';
            taskEl.style.border = '2px solid rgba(59, 130, 246, 0.8)';
            
            setTimeout(() => {
              taskEl.style.boxShadow = '';
              taskEl.style.border = '';
            }, 4000);

            // Nếu là Admin/Staff và công việc có trạng thái "Đã nộp", mở modal duyệt báo cáo của admin
            if (['admin', 'staff'].includes(role) && task.status === 'Đã nộp') {
              if (typeof window.xemLaiBaoCaoAdmin === 'function') {
                window.xemLaiBaoCaoAdmin(projectId, finalRelatedId);
              }
            }
          }
        }, 400);
      }
    } catch (err) {
      console.error('[Notification] Điều hướng công việc thất bại:', err);
    }
  }
  // 3. ĐIỀU HƯỚNG ĐƠN HÀNG
  else if (finalRelatedType === 'order') {
    if (role === 'supplier') {
      // Chuyển qua trang đơn hàng của nhà cung cấp
      window.navigateTo('donhang');
      
      // Chờ đơn hàng tải xong và mở modal chi tiết đơn hàng
      let attempts = 0;
      const interval = setInterval(() => {
        if (window.cachedOrders && window.cachedOrders.length > 0) {
          clearInterval(interval);
          if (typeof window.openOrderDetail === 'function') {
            window.openOrderDetail(finalRelatedId);
          }
        }
        attempts++;
        if (attempts > 30) {
          clearInterval(interval);
          // Kích hoạt dự phòng (openOrderDetail tự động fetch từ API nếu không có trong cache)
          if (typeof window.openOrderDetail === 'function') {
            window.openOrderDetail(finalRelatedId);
          }
        }
      }, 100);
    } else {
      // Admin/Staff/Client: Lấy project_id từ đơn hàng và mở dự án tại tab Vật tư
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${finalRelatedId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success && result.data) {
          const order = result.data;
          const projectId = order.project_id;
          await window.openProjectDetail(projectId, role, 'vattuduan');
        }
      } catch (err) {
        console.error('[Notification] Điều hướng đơn hàng thất bại:', err);
      }
    }
  }
};

window.deletePageNoti = async function (event, notiId) {
  event.stopPropagation();
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/notifications/${notiId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      cachedNotifications = cachedNotifications.filter(n => n.id !== notiId);
      renderPageNotifications();
      fetchUnreadCount();
    }
  } catch (err) {
    console.error('[Notification] Page Delete error:', err.message);
  }
};

window.markAllNotiReadPage = async function () {
  try {
    const token = localStorage.getItem('token');
    await fetch('/api/notifications/read-all', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    cachedNotifications = cachedNotifications.map(n => ({ ...n, is_read: true }));
    renderPageNotifications();
    fetchUnreadCount();
  } catch (err) { /* ignore */ }
};

window.deleteAllNotiPage = async function () {
  if (!await window.showConfirm('Bạn có chắc chắn muốn xóa tất cả thông báo không?')) return;
  try {
    const token = localStorage.getItem('token');
    const promises = cachedNotifications.map(n =>
      fetch(`/api/notifications/${n.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    );
    await Promise.all(promises);
    cachedNotifications = [];
    renderPageNotifications();
    fetchUnreadCount();
  } catch (err) {
    console.error('[Notification] Clear all error:', err.message);
  }
};

// ==========================================
// POLLING VÀ CẬP NHẬT BADGES
// ==========================================
async function fetchUnreadCount() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/notifications/unread-count', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      unreadCount = result.data.count;
      updateBadge();
    }
  } catch (err) {
    console.error('[Notification] Count error:', err.message);
  }
}

function updateBadge() {
  const badge = document.getElementById('notiBadge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  const sidebarBadge = document.getElementById('sidebarNotiBadge');
  if (sidebarBadge) {
    if (unreadCount > 0) {
      sidebarBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      sidebarBadge.classList.remove('hidden');
    } else {
      sidebarBadge.classList.add('hidden');
    }
  }
}

export function startNotificationPolling() {
  fetchUnreadCount();
  if (pollingTimer) clearInterval(pollingTimer);
  pollingTimer = setInterval(fetchUnreadCount, 30000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fetchUnreadCount();
  });
}

export function stopNotificationPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}
