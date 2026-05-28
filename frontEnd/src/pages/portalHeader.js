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
    const tabsHtml = tabs
        .map((t) => {
            const isActive = t.label === activeLabel || t.active === true;
            const baseClass = isActive
                ? 'text-blue-700 font-bold text-base border-b-4 border-blue-600 pb-2 transition'
                : 'text-blue-700 hover:text-blue-800 text-base border-b-4 border-transparent pb-2 transition';

            return `
        <button onclick="${t.onClick}" class="${baseClass}">
          <span class="inline-flex items-center gap-2">
            <i class="${t.iconClass}"></i> ${t.label}
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
          <div class="text-3xl filter">${logoIcon}</div>
          <div>
            <h1 class="text-2xl font-bold text-blue-700 leading-none">e-Teck Projects</h1>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-6">
            ${tabsHtml}
          </div>

          ${renderPortalNotificationBell()}

          <button onclick="logout()" class="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-base flex items-center gap-2 transition">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  `;
}

