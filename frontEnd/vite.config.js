import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        // SPA fallback: trả về index.html cho mọi route
        historyApiFallback: true
    },
    // Đảm bảo build output hỗ trợ SPA routing
    build: {
        rollupOptions: {
            input: './index.html'
        }
    }
});
