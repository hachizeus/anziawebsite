import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath } from 'url'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Add proper preload directives
      include: "**/*.{jsx,tsx}",
    }),
    ViteImageOptimizer({
      // Image optimization options
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: false,
        quality: 80,
        effort: 6,
      },
      avif: {
        lossless: false,
        quality: 80,
      },
      // SVG optimization
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                cleanupNumericValues: {
                  floatPrecision: 2,
                },
              },
            },
          },
          'removeDimensions',
        ],
      },
    }),
  ],
  base: '/', // Changed from './' to '/'
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'https://makini-realtors-backend.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "lucide-react": path.resolve(__dirname, "./src/utils/icons.js")
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    // Configure asset handling
    assetsInlineLimit: 4096, // 4kb - files smaller than this will be inlined as base64
    // Enable minification for better performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Generate source maps for production
    sourcemap: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|webp)$/i.test(assetInfo.name)) {
            return `assets/images/[name].[hash][extname]`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        // Optimize chunk size
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group node_modules into vendor chunks
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('@emotion') || id.includes('framer-motion') || id.includes('@chakra-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('axios') || id.includes('js-cookie')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
          // Split app code into logical chunks
          if (id.includes('/components/')) {
            if (id.includes('/components/properties/')) {
              return 'properties';
            }
            if (id.includes('/components/forms/')) {
              return 'forms';
            }
            return 'components';
          }
        }
      }
    },
    // Optimize for modern browsers
    target: 'es2018',
    // Reduce chunk size
    chunkSizeWarningLimit: 800
  },
  // Optimize preview
  preview: {
    port: process.env.PORT || 5173,
    strictPort: true,
    host: true
  }
}))