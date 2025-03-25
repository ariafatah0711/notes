# How to Run

Untuk menjalankan aplikasi ini, ikuti langkah-langkah berikut:

## Frontend
```bash
npm install

# development
npm run dev

# preview production
npm run build; npm run preview

# deploy
# tambahkan secret ke variable github repository
npm run deploy
```

### Config Base Path
Pastikan untuk mengatur base path di `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/notes/",
});
```

### Set Environment Variables
Tambahkan file `.env` di root folder dengan isi seperti ini:

```
VITE_NOTES_PASSWORD=<pass>
VITE_API_DOMAIN=https://api.notes.com/api
```

## Backend
```bash
cd backend
npm install
vercel dev
```

---

# Belajar

## How to Setup React and Vite
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

```bash
npm install react-router-dom axios tailwindcss

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# jika error pake ini
npx tailwindcss-cli@latest init
```

## How to Setup Vercel for Backend
```bash
cd backend
npm install -g vercel  # Install Vercel CLI
vercel login           # Login ke akun Vercel
vercel link             # Hubungkan proyek dengan akun Vercel
vercel env add GITHUB_TOKEN  # Tambahkan token GitHub ke Vercel
vercel                  # Deploy pertama kali
vercel --prod           # Deploy ke production
vercel dev
```

Jika perlu memperbarui konfigurasi atau variable environment, pastikan melakukan perintah berikut:

```bash
vercel env pull         # Mengambil env dari Vercel
```