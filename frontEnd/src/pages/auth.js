export function isLoggedIn() {
    return !!localStorage.getItem('authEmail');
}

export function getAuthRole() {
    return localStorage.getItem('authRole');
}

export function handleLogout() {
    localStorage.clear();
    console.log("🔒 Đã đăng xuất khỏi hệ thống.");
    
    // Khởi tạo lại app (sẽ tự động vẽ lại màn hình đăng nhập)
    if (typeof window.initApp === 'function') {
        window.initApp();
    }
}


