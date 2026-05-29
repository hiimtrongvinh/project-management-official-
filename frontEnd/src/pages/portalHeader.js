// Shared header component for client/supplier portal pages (CTT/taikhoan)
// Renders logo + tab strip + notification bell + logout button.
import { renderPortalNotificationBell, startNotificationPolling } from './notification.js';

export function renderPortalHeader({
  // portalActive: 'duan' | 'vat tu' | 'taikhoan' (we’ll map labels by page config)
  logoIcon = '📈',
  activeLabel,
  tabs = [],
}) {
  // tabs: [{ label, iconClass, onClick, active? }]
  const allTabs = [...tabs];
  if (!allTabs.some(t => t.label === 'Thông báo')) {
    allTabs.push({
      label: 'Thông báo',
      iconClass: 'fas fa-bell text-lg',
      onClick: "navigateTo('thongbao')",
      isNotification: true
    });
  }

  const tabsHtml = allTabs
    .map((t) => {
      const isActive = t.label === activeLabel || t.active === true;
      const baseClass = isActive
        ? 'text-blue-700 font-bold text-base border-b-4 border-blue-600 pb-2 transition cursor-pointer bg-transparent'
        : 'text-blue-700 hover:text-blue-800 text-base border-b-4 border-transparent pb-2 transition cursor-pointer bg-transparent';

      let badgeHtml = '';
      if (t.isNotification) {
        badgeHtml = `<span id="notiBadge" class="hidden min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md ml-1 inline-flex">0</span>`;
      }

      return `
        <button onclick="${t.onClick}" class="${baseClass} border-none">
          <span class="inline-flex items-center gap-2">
            <i class="${t.iconClass}"></i> ${t.label}${badgeHtml}
          </span>
        </button>`;
    })
    .join('\n');

  // Bắt đầu polling thông báo sau khi render
  setTimeout(() => startNotificationPolling(), 0);

  return `
    <header class="sticky top-0 z-50 bg-blue-50 border-b border-blue-100 py-4 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">
            <i class="fas fa-chart-line"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-blue-600 leading-none">e-Teck Projects</h1>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-6">
            ${tabsHtml}
          </div>

          <button onclick="logout()" class="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-base flex items-center gap-2 transition cursor-pointer bg-transparent border-none">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  `;
}

