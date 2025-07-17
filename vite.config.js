import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const pwaConfig = {
  registerType: "autoUpdate",
  manifest: {
    name: "notes-gists",
    short_name: "notes-gists",
    description: "note web online",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/notes/icon.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  workbox: {
    runtimeCaching: [
      // Mencocokkan file statis seperti HTML, CSS, JS, gambar, dan font di root directory
      {
        urlPattern:
          /^(https:\/\/notes-gist-testing\.vercel\.app\/(.*\.(html|css|js|jpg|jpeg|png|svg|gif|woff|woff2|eot|ttf|otf)))$/i,
        handler: "CacheFirst", // Caching file statis dengan prioritas cache
        options: {
          cacheName: "static-assets-cache", // Nama cache untuk menyimpan file statis
          expiration: {
            maxEntries: 50, // Maksimum 50 entri di cache
            maxAgeSeconds: 604800, // Cache kedaluwarsa setelah 1 minggu
          },
        },
      },
      // Mencocokkan request API untuk Gists (di bawah /api/gists)
      {
        urlPattern: /^https:\/\/notes-gist-testing\.vercel\.app\/api\/gists.*/i, // Pola URL untuk API
        handler: "NetworkFirst", // Coba ambil dari jaringan terlebih dahulu, jika gagal ambil dari cache
        options: {
          cacheName: "gists-api-cache-dev", // Nama cache untuk API
          expiration: {
            maxEntries: 20, // Maksimum 20 entri di cache
            maxAgeSeconds: 86400, // Cache API kedaluwarsa setelah 1 hari
          },
          networkTimeoutSeconds: 3, // Timeout jaringan 10 detik
        },
      },
      {
        urlPattern: /^https:\/\/notes-gist\.vercel\.app\/api\/gists.*/i, // Pola URL untuk API
        handler: "NetworkFirst", // Coba ambil dari jaringan terlebih dahulu, jika gagal ambil dari cache
        options: {
          cacheName: "gists-api-cache-prod", // Nama cache untuk API
          expiration: {
            maxEntries: 20, // Maksimum 20 entri di cache
            maxAgeSeconds: 86400, // Cache API kedaluwarsa setelah 1 hari
          },
          networkTimeoutSeconds: 3, // Timeout jaringan 10 detik
        },
      },
    ],
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(pwaConfig)],
  base: "/",
});
