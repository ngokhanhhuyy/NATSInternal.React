/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const rspack = require("@rspack/core");
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: "./src/main.tsx", output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
    filename: "[name].[hash].js",
  },
  optimization: {
    splitChunks: false
  },
  cache: false,
  resolve: {
    extensions: [".js",".jxs", ".json", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@models": path.resolve(__dirname, "src/models"),
      "@requestDtos": path.resolve(__dirname, "src/services/dtos/requestDtos"),
      "@responseDtos": path.resolve(__dirname, "src/services/dtos/responseDtos"),
      "@enums": path.resolve(__dirname, "src/services/dtos/enums"),
      "@form": path.resolve(__dirname, "src/views/form"),
      "@layouts": path.resolve(__dirname, "src/views/layouts"),
      "@/composables": path.resolve(__dirname, "src/composables"),
      "@/component": path.resolve(__dirname, "src/component"),
      "@/stores": path.resolve(__dirname, "src/stores"),
      "@errors": path.resolve(__dirname, "src/errors"),
      "@router": path.resolve(__dirname, "src/router"),
      "@/assets": path.resolve(__dirname, "src/assets")
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.less$/,
        type: "css/auto",
        use: ["less-loader"],
      },
      {
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/,
        use: [rspack.CssExtractRspackPlugin.loader, "css-loader"],
      },
    ],
    parser: {
      'css/auto': {
        namedExports: true,
      },
    },
  },
  experiments: {
    css: false,
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      inject: "body",
    }),
    new rspack.CssExtractRspackPlugin({}),
    isDev && new ReactRefreshPlugin()
  ].filter(Boolean),
  devServer: {
    allowedHosts: "all",
    port: 5173,
    historyApiFallback: true,
    static: "./src/assets",
    headers: {
      "Allow-Control-Allow-Origin": "*",
      "Allow-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Allow-Control-Allow-Headers": "Content-Type,Authorization",
    },
    client: {
      webSocketURL: "wss://frontend.khanhhuy.dev/ws",
    },
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
        secure: false,
        ws: true,
      },
      {
        context: ["/images"],
        target: "http://localhost:5000",
        pathRewrite: { "^/images": "/images" },
        changeOrigin: true,
        secure: false,
      },
      {
        context: ["/proxyWebsocket"],
        target: "http://localhost:5175",
        changeOrigin: true,
        pathRewrite: { "^/proxyWebsocket": "/proxyWebsocket" },
        secure: false,
        ws: true,
      }
    ]
  }
};