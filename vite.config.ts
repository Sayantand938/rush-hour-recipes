import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "vite.svg"],
      manifest: {
        id: "/", // 👈 explicit App ID
        name: "Rush Hour Recipes",
        short_name: "Recipes",
        description: "Quick and delicious pressure cooker recipes",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/screenshot-mobile.png",
            sizes: "375x667",
            type: "image/png",
            label: "Mobile view",
            platform: "android",
          },
          {
            src: "/screenshots/screenshot-tablet.png",
            sizes: "768x1024",
            type: "image/png",
            label: "Tablet view",
            platform: "android",
          },
          {
            src: "/screenshots/screenshot-desktop.png",
            sizes: "1280x800",
            type: "image/png",
            label: "Desktop view",
            platform: "android",
          },
          {
            src: "/screenshots/screenshot-wide.png",
            sizes: "1920x1080",
            type: "image/png",
            label: "Wide desktop view",
            form_factor: "wide", // 👈 enables desktop install UI
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /\/recipes\/.*\.md$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "recipe-files",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
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