# How to Run

Aplikasi ini adalah frontend-only (React + Vite), langsung terhubung ke GitHub Gist API. Mendukung multi user (default dari env, custom lokal/token, hapus user lokal, dsb).

## clone this repo
```bash
git clone https://github.com/ariafatah0711/notes
cd notes
```

## Install & Jalankan Frontend
```bash
npm install

# development
npm run dev

# preview production
npm run build; npm run preview
```

### Config Base Path
Pastikan untuk mengatur base path di `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // untuk Vercel, cukup "/"
});
```

### Set Environment Variables (Multi Akun)
Buat file `.env` di root folder dengan format berikut:

```
VITE_ACCOUNT_1_USER=namauser1
VITE_ACCOUNT_1_PASS=password1
VITE_ACCOUNT_1_API=token_gist_1

VITE_ACCOUNT_2_USER=namauser2
VITE_ACCOUNT_2_PASS=password2
VITE_ACCOUNT_2_API=token_gist_2

# Tambah lagi untuk akun berikutnya (urut 3, 4, dst)
```

- **USER**: Username akun default
- **PASS**: Password login akun default
- **API**: Personal Access Token GitHub (scope hanya `gist`)

> **Catatan:**
> - Token API harus dibuat di GitHub dengan scope `gist` saja (lihat petunjuk di aplikasi saat tambah user lokal).
> - User juga bisa menambah user lokal/token langsung dari aplikasi (tidak perlu di .env).

### Fitur
- Multi akun default dari .env (bisa login dengan username/password)
- Tambah user lokal/token (langsung dari aplikasi)
- Hapus user lokal/token
- Write mode (untuk akun default, aktifkan dengan password)
- Semua request langsung ke GitHub Gist API (tidak ada backend)

### Deploy with Vercel (Rekomendasi)
#### Deploy via Dashboard (GUI)
1. **Login ke [Vercel](https://vercel.com/)** dan hubungkan repo GitHub kamu.
2. **Set Environment Variables** di dashboard Vercel (menu Project > Settings > Environment Variables):
   - Tambahkan semua variabel `VITE_ACCOUNT_1_USER`, `VITE_ACCOUNT_1_PASS`, `VITE_ACCOUNT_1_API`, dst sesuai kebutuhan.
3. **Deploy**: Vercel akan otomatis build dan deploy project kamu.
4. **Base path** di `vite.config.js` cukup `/` (default).

#### Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel link # hubungkan ke project Vercel
# Set env (bisa juga dari dashboard):
vercel env add VITE_ACCOUNT_1_USER production
vercel env add VITE_ACCOUNT_1_PASS production
vercel env add VITE_ACCOUNT_1_API production
# dst untuk akun berikutnya

# Deploy ke production
vercel --prod
```

> **Kenapa tidak GitHub Pages?**
> - GitHub Pages akan error (secret leak) jika ada token di env, karena token dianggap secret oleh GitHub.
> - Vercel lebih aman untuk aplikasi yang butuh token di env.

---

# Belajar / Setup Awal React + Vite
```bash
npm create vite@latest notes --template react
cd notes
npm install
npm run dev

# add this in package.json 
"homepage": "https://USERNAME.github.io/REPO-NAME"

npm install gh-pages --save-dev

# add this in package.json
"deploy": "gh-pages -d dist"

git init
git add .
git commit -m "Initial commit"

# remote repo

npm run build
npm run deploy
```

---

# tailwind
```bash
npm install react-router-dom axios tailwindcss

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# jika error pake ini
npx tailwindcss-cli@latest init
```