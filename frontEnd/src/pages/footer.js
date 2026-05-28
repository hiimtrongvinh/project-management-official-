export function renderFooter() {
    return `
    <footer class="w-full bg-blue-50 border-t border-blue-100 py-8 text-[15px] text-gray-600">
        <div class="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <div class="flex flex-col">
                <div class="flex items-center gap-3 text-blue-700 font-bold text-2xl mb-2">
                    <span>📈</span> e-Teck Projects
                </div>
                <p class="font-bold text-gray-800 uppercase text-base mb-0.5">Hệ thống đặt hàng & quản lý dự án</p>
                <p class="text-base mb-1">Công ty TNHH Đào tạo & Tích hợp Công nghệ e-Teck</p>
                <p class="text-[11px] text-gray-400 font-bold uppercase mt-1">
                    &copy; 2026 E-TECK PROJECTS. ALL RIGHTS RESERVED.
                </p>
            </div>
            
            <div class="space-y-1.5">
                <p class="flex items-center gap-3">
                    <i class="fas fa-map-marker-alt w-5 text-blue-500 text-center"></i> 
                    Số 24 Đoàn Kết, An Đồng, Hải Phòng
                </p>
                <p class="flex items-center gap-3">
                    <i class="fas fa-phone-alt w-5 text-blue-500 text-center"></i> 
                    0225.3601.496 / 0987.868.142
                </p>
                <p class="flex items-center gap-3">
                    <i class="fas fa-envelope w-5 text-blue-500 text-center"></i> 
                    admin@e-teck.vn
                </p>
                <p class="flex items-center gap-3">
                    <i class="fas fa-clock w-5 text-blue-500 text-center"></i> 
                    8:00 - 22:00 (Thứ Hai - Chủ nhật)
                </p>
            </div>
        </div>
    </footer>`;
}