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
});
