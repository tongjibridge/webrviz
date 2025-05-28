// import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// // https://vite.dev/config/
// export default defineConfig({
//     base: './',
//   plugins: [vue()],
// })
// vite.config.js 或 vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({
    base: './',
    plugins: [vue()],
    build: {
        // 关闭代码压缩
        rollupOptions: {
            // 配置输出格式，'es' 为 ES module，'cjs' 为 CommonJS
            output: {
                format: 'es',
                // 不生成sourcemap
                sourcemap: false,
            },
        },
        // 关闭terser压缩
        terserOptions: false,
        // 关闭兼容性填充代码（polyfill）
        polyfillModulePreload: false,
    },
});