// --- IMPORT CÁC TRANG ---
import { renderDanhmuc, initDanhmuc } from './pages/danhmuc.js';
import { renderDuan, renderProjectCards } from './pages/duan.js';
import { renderCongviec } from './pages/congviec.js';
import { renderNhansu, renderStaffTable } from './pages/nhansu.js';
import { renderQLKhachhang, renderClientTable } from './pages/QLkhachhang.js';
import { renderQLNhacungcap, renderSupplierTable } from './pages/QLnhacungcap.js';
import { renderTaikhoanNS } from './pages/taikhoanNS.js';
import { renderTaikhoanNCC } from './pages/taikhoanNCC.js';
import { renderCTTnhacungcap } from './pages/CTTnhacungcap.js';
import { renderVattu } from './pages/vattu.js';
import { renderHoso } from './pages/hoso.js';
import { renderPhancong } from './pages/phancong.js';
import { openProjectDetail, switchTab } from './pages/chitietduan.js';
import { renderBaocao } from './pages/baocao.js';
import { renderDangKyKhachHang } from './pages/dangkikhachhang.js';
import { renderCTTkhachhang } from './pages/CTTkhachhang.js';
import { renderTaikhoanKH } from './pages/taikhoanKH.js';
import { renderTaoyeucau } from './pages/taoyeucau.js';
import { renderDonhang } from './pages/donhang.js';

// --- IMPORT MODULE MỚI ---
import { renderLogin, attachLoginEvents } from './pages/login.js';
import { isLoggedIn, getAuthRole, handleLogout } from './pages/auth.js';
import { renderNotificationBell, startNotificationPolling, stopNotificationPolling, renderNotificationPage, initNotificationPage } from './pages/notification.js';

// --- PREMIUM TOAST & CONFIRM UTILITIES ---
window.showToast = function (message, type = 'success') {
    const msgStr = String(message);
    
    // Auto detect toast type based on text content & emojis
    if (msgStr.includes('❌') || msgStr.toLowerCase().includes('lỗi') || msgStr.toLowerCase().includes('thất bại') || msgStr.toLowerCase().includes('không thể') || msgStr.toLowerCase().includes('không được')) {
        type = 'error';
    } else if (msgStr.includes('⚠️') || msgStr.toLowerCase().includes('cảnh báo') || msgStr.toLowerCase().includes('chưa') || msgStr.toLowerCase().includes('vui lòng')) {
        type = 'warning';
    } else if (msgStr.includes('✅') || msgStr.toLowerCase().includes('thành công') || msgStr.toLowerCase().includes('đã thêm') || msgStr.toLowerCase().includes('đã lưu') || msgStr.toLowerCase().includes('đã đặt hàng')) {
        type = 'success';
    }

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'flex items-center gap-3 px-5 py-4 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl max-w-sm pointer-events-auto transform translate-x-12 opacity-0 transition-all duration-300 ease-out';
    
    let iconClass = 'fas fa-check-circle text-emerald-500 text-lg animate-bounce-sm';
    if (type === 'error') {
        iconClass = 'fas fa-times-circle text-red-500 text-lg animate-bounce-sm';
    } else if (type === 'warning') {
        iconClass = 'fas fa-exclamation-triangle text-amber-500 text-lg animate-bounce-sm';
    } else if (type === 'info') {
        iconClass = 'fas fa-info-circle text-blue-500 text-lg animate-bounce-sm';
    }

    // Clean emoji prefixes from message text for a cleaner premium look
    let cleanMsg = msgStr.replace(/^[✅❌⚠️⏳💡ℹ️]\s*/, '');

    toast.innerHTML = `
        <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl ${
            type === 'success' ? 'bg-emerald-50' : 
            type === 'error' ? 'bg-red-50' : 
            type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
        }">
            <i class="${iconClass}"></i>
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-800 leading-tight">${cleanMsg}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 pl-2">
            <i class="fas fa-times text-xs"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-12', 'opacity-0');
    }, 10);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('translate-x-12', 'opacity-0');
            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }
    }, 3500);
};

// Override native window.alert to automatically show the unified toast
window.alert = function (message) {
    window.showToast(message);
};

// Promise-based custom premium confirmation dialog modal
window.showConfirm = function (message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn";
        modal.id = "customConfirmModal";
        
        modal.innerHTML = `
        <div class="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col border border-gray-100 animate-scaleIn">
            <div class="p-6 space-y-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 animate-pulse-slow">
                        <i class="fas fa-exclamation-triangle text-base"></i>
                    </div>
                    <h3 class="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Xác nhận thao tác</h3>
                </div>
                <p class="text-xs font-semibold text-gray-500 leading-relaxed">${message}</p>
            </div>
            <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-2.5 justify-end">
                <button id="confirmCancelBtn" class="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition-all cursor-pointer">
                    Hủy bỏ
                </button>
                <button id="confirmOkBtn" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer">
                    Đồng ý
                </button>
            </div>
        </div>`;
        
        document.body.appendChild(modal);
        
        const close = (result) => {
            modal.remove();
            resolve(result);
        };
        
        modal.querySelector('#confirmCancelBtn').onclick = () => close(false);
        modal.querySelector('#confirmOkBtn').onclick = () => close(true);
        modal.onclick = (e) => { if (e.target === modal) close(false); };
    });
};

// Đăng ký các hàm render lên window để sử dụng trong navigateTo
window.renderDanhmuc = renderDanhmuc;
window.renderDuan = renderDuan;
window.renderCongviec = renderCongviec;
window.renderTaikhoanNS = renderTaikhoanNS;
window.renderTaikhoanNCC = renderTaikhoanNCC;
window.renderCTTnhacungcap = renderCTTnhacungcap;
window.renderHoso = renderHoso;
window.renderPhancong = renderPhancong;
window.renderBaocao = renderBaocao;
window.renderDangKyKhachHang = renderDangKyKhachHang;
window.renderNhansu = renderNhansu;
window.renderStaffTable = renderStaffTable;
window.renderCTTkhachhang = renderCTTkhachhang;
window.renderTaikhoanKH = renderTaikhoanKH;
window.getAuthRole = getAuthRole;
window.renderTaoyeucau = renderTaoyeucau;
window.renderDonhang = renderDonhang;
window.renderVattu = renderVattu;
window.openProjectDetail = openProjectDetail;
window.switchTab = switchTab;
window.renderQLkhachhang = renderQLKhachhang;
window.renderClientTable = renderClientTable;
window.renderQLnhacungcap = renderQLNhacungcap;
window.renderSupplierTable = renderSupplierTable;
window.renderThongbao = renderNotificationPage;
window.initNotificationPage = initNotificationPage;

// Đăng ký hàm logout lên window
window.logout = handleLogout;

// --- HÀM RENDER KHUNG GIAO DIỆN CHÍNH (SIDEBAR + CONTENT) ---
function renderMainAppLayout() {
    return `
    <div id="mainApp" class="h-screen flex overflow-hidden">
        <div class="sidebar sticky top-0 w-64 flex-shrink-0 p-5 flex flex-col h-screen overflow-y-auto custom-scrollbar">
            <div class="flex items-center gap-3 px-3 mb-10">
                <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-blue-600 leading-none">e-Teck</h1>
                    <p class="text-blue-600 text-xs font-bold mt-0.5">Projects</p>
                </div>
            </div>
            <nav class="flex-1 space-y-1">
                <a href="/duan" onclick="event.preventDefault(); navigateTo('duan')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-duan">
                    <i class="fas fa-briefcase w-5 text-center"></i> Dự án
                </a>
                <a href="/congviec" onclick="event.preventDefault(); navigateTo('congviec')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-congviec">
                    <i class="fas fa-tasks w-5 text-center"></i> Công việc
                </a>
                ${getAuthRole() === 'admin' ? `
                <a href="/nhansu" onclick="event.preventDefault(); navigateTo('nhansu')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-nhansu">
                    <i class="fas fa-users w-5 text-center"></i> Nhân sự
                </a>
                <a href="/QLkhachhang" onclick="event.preventDefault(); navigateTo('QLkhachhang')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-QLkhachhang">
                    <i class="fas fa-handshake w-5 text-center"></i> Khách hàng
                </a>
                <a href="/QLnhacungcap" onclick="event.preventDefault(); navigateTo('QLnhacungcap')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-QLnhacungcap">
                    <i class="fas fa-truck w-5 text-center"></i> Nhà cung cấp
                </a>
                <a href="/vattu" onclick="event.preventDefault(); navigateTo('vattu')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-vattu">
                    <i class="fas fa-box-open w-5 text-center"></i> Vật tư
                </a>
                ` : ''}
                <a href="/thongbao" onclick="event.preventDefault(); navigateTo('thongbao')" class="nav-link flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-thongbao">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-bell w-5 text-center"></i> <span>Thông báo</span>
                    </div>
                    <span id="sidebarNotiBadge" class="hidden min-w-[18px] h-[18px] px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
                </a>
                <a href="/taikhoanNS" onclick="event.preventDefault(); navigateTo('taikhoanNS')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer" id="nav-taikhoanNS">
                    <i class="fas fa-user-circle w-5 text-center"></i> ${localStorage.getItem('authName') || 'Tài khoản'}
                </a>
            </nav>
            <div class="mt-auto space-y-2">
                <div onclick="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-all">
                    <i class="fas fa-sign-out-alt w-5 text-center"></i><span>Đăng xuất</span>
                </div>
            </div>
        </div>

        <div class="flex-1 p-8 overflow-y-auto bg-gray-50/80" id="contentArea"></div>
    </div>
    `;
}

// --- KHỞI TẠO ỨNG DỤNG ---
window.initApp = function initApp() {
    const appRoot = document.getElementById('appRoot');

    if (!isLoggedIn()) {
        window.history.replaceState(null, '', '/login');
        appRoot.innerHTML = renderLogin();
        attachLoginEvents();
    } else {
        appRoot.innerHTML = renderMainAppLayout();

        // Khởi tạo polling thông báo
        startNotificationPolling();

        // Lắng nghe popstate (Back/Forward)
        window.addEventListener('popstate', handleRouteChange);

        // Điều hướng ban đầu: đọc pathname hiện tại hoặc dùng default theo role
        const currentPath = window.location.pathname.replace('/', '');
        if (currentPath && currentPath !== 'login' && currentPath !== '') {
            renderPage(currentPath);
        } else {
            const role = getAuthRole();
            if (role === 'client') {
                window.navigateTo('CTTkhachhang');
            } else if (role === 'supplier') {
                window.navigateTo('CTTnhacungcap');
            } else {
                window.navigateTo('duan');
            }
        }
    }
};

// --- XỬ LÝ ROUTE CHANGE (Back/Forward) ---
function handleRouteChange() {
    const path = window.location.pathname.replace('/', '');
    if (path && path !== 'login') {
        renderPage(path);
    }
}

// --- RENDER PAGE (không push state) ---
function renderPage(page) {
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('nav-active', 'bg-blue-50'));
    const activeLink = document.getElementById('nav-' + page);
    if (activeLink) activeLink.classList.add('nav-active', 'bg-blue-50');

    const sidebar = document.querySelector('.sidebar');
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    const isPortalUser = ['client', 'supplier'].includes(getAuthRole());
    const portalPages = ['CTTkhachhang', 'taikhoanKH', 'CTTnhacungcap', 'taikhoanNCC', 'taoyeucau', 'donhang'];
    if (sidebar) {
        if (isPortalUser || portalPages.includes(page)) {
            sidebar.classList.add('hidden');
            contentArea.classList.remove('p-8');
            contentArea.classList.add('p-0');
        } else {
            sidebar.classList.remove('hidden');
            contentArea.classList.remove('p-0');
            contentArea.classList.add('p-8');
        }
    }

    // Render Component Content
    const renderFunc = window['render' + page.charAt(0).toUpperCase() + page.slice(1)];
    if (typeof renderFunc === 'function') {
        contentArea.innerHTML = renderFunc();

        if (page === 'duan' && typeof renderProjectCards === 'function') setTimeout(renderProjectCards, 50);
        if (page === 'nhansu' && typeof renderStaffTable === 'function') setTimeout(renderStaffTable, 50);
        if (page === 'QLkhachhang' && typeof renderClientTable === 'function') setTimeout(renderClientTable, 50);
        if (page === 'QLnhacungcap' && typeof renderSupplierTable === 'function') setTimeout(renderSupplierTable, 50);
        if (page === 'CTTnhacungcap' && typeof renderMaterialCards === 'function') setTimeout(renderMaterialCards, 50);
        if (page === 'vattu' && typeof renderMaterialCards === 'function') setTimeout(renderMaterialCards, 50);
        if (page === 'danhmuc' && typeof initDanhmuc === 'function') setTimeout(initDanhmuc, 50);
        if (page === 'thongbao' && typeof initNotificationPage === 'function') setTimeout(initNotificationPage, 50);
    }
}

// --- LOGIC ĐIỀU HƯỚNG BÊN TRONG ỨNG DỤNG ---
window.navigateTo = function navigateTo(page) {
    window.history.pushState(null, '', '/' + page);
    renderPage(page);
};

window.goToDangKyKhachHang = function goToDangKyKhachHang() {
    const appRoot = document.getElementById('appRoot');
    if (!appRoot) return;

    window.history.pushState(null, '', '/dangky');

    appRoot.innerHTML = renderMainAppLayout();
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.add('hidden');

    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
        contentArea.classList.remove('p-8');
        contentArea.classList.add('p-0');
        contentArea.innerHTML = window.renderDangKyKhachHang ? window.renderDangKyKhachHang() : '<p>Lỗi tải trang đăng ký</p>';
    }
};

// Chạy ứng dụng lần đầu tiên
console.log("%c✅ e-Teck Projects Demo đã sẵn sàng!", "color: #1e40af; font-weight: bold");
window.initApp();