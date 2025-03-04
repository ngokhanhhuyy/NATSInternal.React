import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
    plugins: [pluginReact({
        fastRefresh: true
    })],
    source: {
        entry: {
            index: "./src/main.tsx"
        }
    },
    html: {
        template: "./src/assets/index.html"
    },
    output: {
        filename: {
            js: "[name].[hash].js",
        },
        cssModules: {
          namedExport: true,
        },
    },
    performance: {
        buildCache: false,
        chunkSplit: {
            strategy: "all-in-one"
        }
    },
    resolve: {
        aliasStrategy: "prefer-alias",
        alias: {
            "@": "./src",
            "@models": "./src/models",
            "@requestDtos": "./src/services/dtos/requestDtos",
            "@responseDtos": "./src/services/dtos/responseDtos",
            "@enums": "./src/services/dtos/enums",
            "@form": "./src/views/form",
            "@layouts": "./src/views/layouts",
            "@/composables": "./src/composables",
            "@/component": "./src/component",
            "@/stores": "./src/stores",
            "@errors": "./src/errors",
            "@router": "./src/router",
            "@/assets": "./src/assets"
        },
    },
    server: {
        port: 5173,
        historyApiFallback: true,
        publicDir: {
            name: "./src/assets"
        },
        headers: {
          "Allow-Control-Allow-Origin": "*",
          "Allow-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Allow-Control-Allow-Headers": "Content-Type,Authorization",
        },
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                pathRewrite: { "^/api": "/api" },
                changeOrigin: true,
                secure: false,
                ws: true,
            },
            "/images": {
                target: "http://localhost:5000",
                pathRewrite: { "^/images": "/images" },
                changeOrigin: true,
                secure: false
            }
        }
    },
    dev: {
        client: {
            // host: "frontend-workstation.khanhhuy.dev",

        }
    }
});
