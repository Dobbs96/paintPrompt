import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist", // Vercel expects this by default
        emptyOutDir: true,
    },
    base: "/", // Important for SPA routing
    server: {
        port: 3000,
        open: true,
    },
});
