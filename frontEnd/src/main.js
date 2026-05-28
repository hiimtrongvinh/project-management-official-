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
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <i class="fas fa-chart-line text-blue-400 text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-extrabold text-white tracking-tight">e-Teck</h1>
                    <p class="text-blue-400 text-xs font-semibold -mt-0.5 tracking-wide">Projects</p>
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
                <div onclick="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
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