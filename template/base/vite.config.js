import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import qiankun from 'vite-plugin-qiankun';

const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = { '@': pathResolve('src') };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envConfig = loadEnv(mode, `${process.cwd()}/env`);
  return {
    base: `${process.env.NODE_ENV === 'production' ? '/apps/sac/dataManagement/' : '/'}`,
    envDir: './env',
    resolve: { alias },
    plugins: [
      vue(),
      vueJsx(),
      qiankun('apps_sac_dataManagement', { useDevMode: true }),
      Components({
        dts: true,
        resolvers: [
          NaiveUiResolver(),
        ],
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
        ],
        imports: [
          'vue',
          'vue-router',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
            ],
          },
        ],
        dts: './auto-imports.d.ts',
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 8080,
      cors: true,
      https: false,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1/',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '/api'),
        },
      },
    },
    build: {
      target: "esnext",
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/main-[hash].js',
          assetFileNames: 'assets/[hash][extname]',
          manualChunks: {
            ui: ['naive-ui'],
            vue: ['pinia', 'vue-router', 'vue'],
          },
        },
      },
    },
    preview: {
      // https: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1/',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '/api'),
        },
      },
    },
    css: {
      // 🔥此处添加全局scss🔥
      preprocessorOptions: {
        scss: {
          // 避免出现: build时的 @charset 必须在第一行的警告
          charset: false,
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
  };
});
