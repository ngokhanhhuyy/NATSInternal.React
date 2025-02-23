import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    plugins: [
        react(), // React plugin with fast refresh
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@models": fileURLToPath(new URL("./src/models", import.meta.url)),
            "@requestDtos": fileURLToPath(
                new URL("./src/services/dtos/requestDtos", import.meta.url)
            ),
            "@responseDtos": fileURLToPath(
                new URL("./src/services/dtos/responseDtos", import.meta.url)
            ),
            "@enums": fileURLToPath(
                new URL("./src/services/dtos/enums", import.meta.url)
            ),
            "@form": fileURLToPath(
                new URL("./src/views/form", import.meta.url)
            ),
            "@layouts": fileURLToPath(
                new URL("./src/views/layouts", import.meta.url)
            ),
            "@/composables": fileURLToPath(
                new URL("./src/composables", import.meta.url)
            ),
            "@/component": fileURLToPath(
                new URL("./src/component", import.meta.url)
            ),
            "@/stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
            "@errors": fileURLToPath(new URL("./src/errors", import.meta.url)),
            "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
            "@/assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        },
    },
    optimizeDeps: {
        // include: ["src/**/*", "src/services/**/*", "src/views/layouts/**/*"],
    },
    server: {
        allowedHosts: ["frontend.khanhhuy.dev"],
        strictPort: true,
        port: 5173, // Development server port
        proxy: {
            "^/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/api/, "/api"),
            },
            "^/images": {
                target: "http://localhost:5000",
                changeOrigin: false,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/images/, "/images"),
            },
            "^/proxyWebsocket": {
                target: "http://localhost:5175",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) =>
                    path.replace(/^\/proxyWebsocket/, "/proxyWebsocket"),
            },
        },
    },
    build: {
        rollupOptions: {
            input: {
                app: "./src/assets/index.html"
            },
            output: {
                manualChunks: undefined, // Reduces code splitting in both dev and prod
            },
        },
    },
});
