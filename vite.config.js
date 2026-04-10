import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Spring (and similar stacks) may reject proxied requests if the browser Origin is forwarded. */
const devApiProxy = {
  target: "http://localhost:5000",
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on("proxyReq", (proxyReq) => {
      proxyReq.removeHeader("origin");
    });
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev-only: same-origin API calls avoid browser CORS; backend runs on :5000
      "/api": devApiProxy,
      "/auth": devApiProxy,
      "/onboarding": devApiProxy,
      "/users": devApiProxy,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // 👈 revert to default
  },
});
