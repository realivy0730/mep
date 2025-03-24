import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        base: '/',
        plugins: [vue()],
        server: {
            port: 3000,
            open: true,
            host: true,
            // 加入跨域代理設定，解決 API 請求問題
            proxy: {
                // 當路徑以 /api 開頭時，代理到實際的 API 伺服器
                '/api': {
                    target: 'https://cdn.sit.crm.ddpay.ai',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('代理請求錯誤', err);
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            console.log('發送代理請求:', req.method, req.url);
                        });
                        proxy.on('proxyRes', (proxyRes, req, _res) => {
                            console.log('收到代理回應:', req.method, req.url, proxyRes.statusCode);
                        });
                    }
                },
                // 直接代理特定路徑
                '/data': {
                    target: 'https://cdn.sit.crm.ddpay.ai',
                    changeOrigin: true,
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('代理請求錯誤', err);
                        });
                    }
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                vue: 'vue/dist/vue.esm-bundler.js',
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        define: {
            'process.env.VITE_THEME': JSON.stringify(env.VITE_THEME),
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: mode === 'development',
            chunkSizeWarningLimit: 3000,
            rollupOptions: {
                input: {
                    main: fileURLToPath(new URL('./index.html', import.meta.url)),
                },
                output: {
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                    manualChunks: {
                        'vendor': ['vue', 'vue-router', 'pinia']
                    }
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @use "@/assets/themes/${env.VITE_THEME || 'default'}/theme" as *;
          `,
                },
            },
        },
        esbuild: {
            tsconfigRaw: true,
            logOverride: { 'this-is-undefined-in-esm': 'silent' }
        },
        optimizeDeps: {
            include: ['vue', 'vue-router', 'pinia']
        }
    };
});
