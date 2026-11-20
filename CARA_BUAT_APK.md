# Panduan Menjadikan Ibadah Tracker sebagai APK / Aplikasi HP

Aplikasi **Ibadah Tracker** telah berhasil dikonfigurasi ke dalam 2 format siap pakai:
1. **PWA (Progressive Web App)** dengan offline service worker, manifest, dan icon.
2. **Capacitor Native Android Project** di folder `ibadah-tracker/android/` lengkap dengan konfigurasi Gradle dan ikon aplikasi.

Berikut 4 cara termudah untuk menginstal atau menghasilkan file `.apk`:

---

### Cara 1: Instal Langsung di HP (Paling Cepat, Tanpa Compile)
Karena sudah dikonfigurasi sebagai **PWA (Progressive Web App)**:
1. Pastikan HP dan Laptop Anda terhubung ke jaringan Wi-Fi yang sama.
2. Cek IP lokal laptop Anda (misal `192.168.1.10`).
3. Buka browser **Google Chrome** di HP, lalu akses:
   ```text
   http://IP_LAPTOP_ANDA/track/ibadah-tracker
   ```
4. Tekan tombol **menu titik tiga (⋮)** di pojok kanan atas Chrome, lalu pilih:
   👉 **"Tambahkan ke Layar Utama"** atau **"Instal Aplikasi"**.
5. Aplikasi akan langsung terpasang di HP Anda dengan ikon dan nama **Ibadah Tracker**, berjalan full-screen tanpa address bar, serta berfungsi secara offline.

---

### Cara 2: Build APK Otomatis via GitHub Actions (Cloud, Gratis, Tanpa Install Apa pun di Laptop)
File workflow GitHub Actions telah disiapkan di:
[`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml)

Langkah-langkah:
1. Buat repository baru di akun GitHub Anda.
2. Push seluruh folder project ini ke repository tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial Ibadah Tracker commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. Buka repository Anda di GitHub, lalu klik tab **Actions**.
4. GitHub akan otomatis menjalankan proses build APK (menggunakan JDK & Android SDK di server cloud).
5. Setelah selesai (~2 menit), klik hasil run tersebut dan unduh artifact **`IbadahTracker-v1.0-debug.apk`**.

---

### Cara 3: Generate APK via PWABuilder (Online)
1. Buka [PWABuilder (pwabuilder.com)](https://www.pwabuilder.com).
2. Jika web sudah di-hosting (misal di Vercel, Netlify, atau GitHub Pages), masukkan URL aplikasi Anda.
3. Klik **Start**.
4. Di bagian Android, klik **Package for Stores** / **Generate APK**.
5. Unduh file `.apk` dan langsung transfer ke HP.

---

### Cara 4: Build APK Lokal via Android Studio
Folder project Android asli sudah tersedia di:
`C:\laragon\www\track\ibadah-tracker\android`

Langkah-langkah:
1. Buka software **Android Studio**.
2. Pilih **Open**, lalu arahkan ke folder `C:\laragon\www\track\ibadah-tracker\android`.
3. Tunggu hingga Gradle selesai mengunduh dependensi (Sync).
4. Klik menu atas: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
5. Setelah selesai, klik tombol **locate** di notifikasi pojok kanan bawah.
   File APK Anda berada di:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Perintah Penting (Capacitor)
Jika di kemudian hari Anda mengubah kode HTML/CSS/JS dan ingin memperbarui project Android:
```bash
cd C:\laragon\www\track\ibadah-tracker
npm run sync
```
Perintah ini akan otomatis meng-copy file web terbaru ke dalam project Android.
