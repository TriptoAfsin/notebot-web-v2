import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({ root: __dirname }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        /* Precache the shell, not the long tail. The default glob swept up every
         * lazily-split chunk — including the Shiki grammars — and pushed the
         * precache manifest past 11 MB, which a student on mobile data was
         * downloading before the app would even open. Route chunks are cached at
         * runtime instead, the first time they're actually visited. */
        globPatterns: ["**/*.{css,html,ico,png,svg,webmanifest}", "assets/index-*.js"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            // route + vendor chunks: serve instantly, refresh in the background
            urlPattern: ({ request }) => request.destination === "script",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "notebot-scripts" },
          },
          {
            urlPattern: /^https:\/\/api\.fontshare\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "notebot-fontshare",
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "notebot-fonts",
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "logo.png",
        "icon.png",
        "icons/*.png",
        "images/*.png",
      ],
      manifest: {
        name: "NoteBot Web",
        short_name: "NoteBot Web",
        description:
          "NoteBOT is the flagship educational platform for BUTEX and it's related students",
        theme_color: "#ffffff",
        screenshots: [
          {
            src: "ss-wide.png",
            sizes: "1253x669",
            type: "image/png",
            form_factor: "wide",
            label: "NoteBot Dashboard Desktop",
          },
          {
            src: "ss-1.png",
            sizes: "345x747",
            type: "image/png",
            form_factor: "narrow",
            label: "NoteBot Dashboard",
          },
          {
            src: "ss-2.png",
            sizes: "345x747",
            type: "image/png",
            form_factor: "narrow",
            label: "NoteBot Dashboard 2",
          },
        ],
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    /* Split the big, rarely-changing vendors out of the app chunk so a code
     * change doesn't invalidate React and the PDF renderer along with it. */
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query", "axios"],
          motion: ["framer-motion"],
          markdown: ["react-markdown", "remark-gfm", "remark-breaks", "marked"],
          /* @react-pdf is deliberately NOT listed. Naming it here promoted it to
           * a chunk in the entry's static graph, so Vite emitted a
           * <link rel="modulepreload"> for it and every visitor downloaded 1.4 MB
           * of PDF renderer on first paint — even though the only import of it is
           * the dynamic one behind the "Save PDF" button. Left unlisted, it lands
           * in that dynamic import's own chunk and is fetched on click. */
        },
      },
    },
    // the PDF renderer is legitimately large; warn above that, not below it
    chunkSizeWarningLimit: 900,
  },
});
