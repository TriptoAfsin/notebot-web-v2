import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

/* Runtime cache generation.
 *
 * The precache needs no version: its entries are content-hashed per build and
 * Workbox's cleanupOutdatedCaches prunes the previous revision on activation.
 * The runtime caches below are the opposite — they're keyed by a fixed name and
 * survive every deploy, so this is the one lever that forces them to be rebuilt.
 *
 * Bump it to hand every client empty runtime caches on their next visit. Note
 * that the superseded caches are orphaned rather than deleted (cleanupOutdated-
 * Caches only touches precaches); the browser evicts them under quota pressure.
 */
const RUNTIME_CACHE = "v2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({ root: __dirname }),
    react(),
    VitePWA({
      /* "prompt", not "autoUpdate": a new build installs and waits, and
       * <PwaUpdatePrompt> lets the visitor apply it. autoUpdate swapped the
       * worker out mid-session, which can hand a running page chunks from a
       * build its HTML doesn't match.
       *
       * The retired-domain kill switch is unaffected — public/sw-kill.js calls
       * skipWaiting() itself rather than relying on the page to trigger it. */
      registerType: "prompt",
      workbox: {
        /* Precache the shell, not the long tail. The default glob swept up every
         * lazily-split chunk — including the Shiki grammars — and pushed the
         * precache manifest past 11 MB, which a student on mobile data was
         * downloading before the app would even open. Route chunks are cached at
         * runtime instead, the first time they're actually visited. */
        /* PNGs are named individually instead of swept with a recursive glob.
         * The old catch-all pulled in every PNG under public/ — including 1.1 MB
         * of icons left over from before the launcher moved to SVG glyphs, which
         * every install downloaded and nothing ever rendered. Naming them also
         * means a PNG dropped into public/ tomorrow can't silently join the
         * precache. Store screenshots (ss-1, ss-2) stay out on purpose: the
         * install UI fetches those on demand, the app never displays them. */
        globPatterns: [
          "**/*.{css,html,ico,svg,webmanifest,woff2,webp}",
          "assets/index-*.js",
          "pwa-*.png",
          "apple-touch-icon-*.png",
          "maskable-icon-*.png",
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            // route + vendor chunks: serve instantly, refresh in the background
            urlPattern: ({ request }) => request.destination === "script",
            handler: "StaleWhileRevalidate",
            options: { cacheName: `notebot-scripts-${RUNTIME_CACHE}` },
          },
          /* The fontshare and fonts.gstatic.com rules are gone: the fonts are
           * self-hosted now, so they're same-origin and precached by the woff2
           * glob above. Nothing requests those hosts any more. */
        ],
      },
      /* `includeAssets` is gone rather than fixed. Every entry it listed was
       * either a file that doesn't exist (mask-icon.svg, logo.png, images/*.png,
       * apple-touch-icon.png — the real one is apple-touch-icon-180x180.png) or
       * one globPatterns above already picks up. */
      manifest: {
        name: "NoteBot Web",
        short_name: "NoteBot Web",
        description:
          "NoteBOT is the flagship educational platform for BUTEX and it's related students",
        theme_color: "#ffffff",
        screenshots: [
          /* The `wide` form_factor entry pointed at ss-wide.png, which isn't in
           * public/ — Chrome logs a manifest error and drops the whole richer
           * install UI. Removed rather than left broken; add a real 1253x669
           * capture and it can come back. */
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
