import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default ({mode}) => {
    return defineConfig({
        server: {
            port: 3000,
            proxy: {
                "/ping": {
                    target: "http://127.0.0.1:1234",
                    changeOrigin: true
                },
                "/sync": {
                    target: "http://127.0.0.1:1234",
                    ws: true,
                    rewriteWsOrigin: true
                }
            }
        },
        build: {
            outDir: "build",
            minify: "terser",
            terserOptions: {
                compress: true,
                mangle: true
            }
        },
        plugins: [react()]
    })
}