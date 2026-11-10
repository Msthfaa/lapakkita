# LapakKita 🏪
> **Etalase Digital Produk UMKM Lokal Terverifikasi**

LapakKita adalah platform web etalase digital yang mempertemukan pelaku UMKM lokal dengan calon pembeli tanpa perantara. Penjual mendaftar dan mempromosikan produknya, tim administrator memverifikasi kualitas dan kelayakan informasi sebelum produk tampil ke publik, dan calon pembeli yang berminat langsung terhubung ke WhatsApp resmi penjual dengan pesan pemesanan otomatis.

---

## 1. Masalah yang Diselesaikan

1. **Keterbatasan Visibilitas UMKM:** Banyak usaha kecil mengandalkan status WhatsApp atau media sosial pribadi yang cepat hilang dan sulit ditemukan oleh calon pembeli di mesin pencari.
2. **Kekhawatiran Penipuan Online:** Pembeli sering ragu membedakan toko online riil dengan akun fiktif/abal-abal. **Sistem moderasi dan verifikasi admin** LapakKita memastikan produk dan kontak yang dipajang adalah UMKM yang telah melalui kurasi awal.
3. **Kemudahan Transaksi Tanpa Biaya Tambahan:** UMKM mikro tidak dibebani sistem checkout atau payment gateway rumit. Transaksi tawar-menawar dan pembayaran berlangsung langsung secara alami lewat kanal yang paling nyaman bagi masyarakat Indonesia: **WhatsApp**.

---

## 2. Fitur Berdasarkan Peran Pengguna

### 👥 Pengunjung / Calon Pembeli (Tanpa Login)
- **Katalog Terkurasi:** Menjelajahi produk UMKM yang telah diverifikasi dan disetujui admin.
- **Produk Unggulan:** Menemukan produk-produk pilihan di bagian teratas beranda.
- **Pencarian Cerdas & Filter Kategori:** Mencari produk berdasarkan nama, deskripsi, atau kategori spesifik dengan URL search parameters yang dapat dibagikan.
- **Halaman Detail Produk:** Melihat foto berkualitas, harga Rupiah yang jelas, lokasi usaha, nama penjual, dan deskripsi produk.
- **Direct WhatsApp Order:** Satu klik tombol "Hubungi via WhatsApp" yang otomatis menyiapkan format pesan pemesanan resmi.

### 🛍️ Penjual UMKM (`seller`) (Wajib Login)
- **Registrasi & Login Mandiri:** Pendaftaran akun cepat dengan nama usaha/pemilik, email, dan kata sandi.
- **Dashboard Produk:** Memantau seluruh produk miliknya beserta status verifikasi:
  - 🟡 **Menunggu Moderasi (`pending`)**
  - 🟢 **Disetujui (`approved`)**
  - 🔴 **Ditolak (`rejected`)**: Disertai alasan penolakan rinci dari admin.
- **Manajemen Produk (CRUD):** Tambah, ubah, dan hapus produk.
- **Unggah Foto Produk:** Unggah foto langsung ke Supabase Storage (JPG, PNG, WEBP hingga 2 MB).
- **Alur Perbaikan Otomatis:** Mengubah produk yang ditolak akan mengembalikan statusnya ke `pending` untuk ditinjau ulang oleh admin secara otomatis.
- **Pelacak Minat Pembeli:** Mengetahui jumlah total klik tombol WhatsApp pada masing-masing produk ("Produkmu diklik X kali via WhatsApp").

### 🛡️ Administrator (`admin`) (Diberikan Manual via Database)
- **Ringkasan Statistik:** Kartu metrik real-time: jumlah produk pending, approved, rejected, dan total penjual terdaftar.
- **Moderasi Terpadu:** Tab antrean produk berdasarkan status verifikasi (`pending`, `approved`, `rejected`).
- **Persetujuan & Penolakan:** Menyetujui produk agar tayang ke publik, atau menolak produk dengan **kewajiban menyertakan alasan jelas**.
- **Kurasi Produk Unggulan:** Mengaktifkan/menonaktifkan penanda "Unggulan" untuk ditampilkan di showcase utama beranda.
- **Master Data:** Menambah, mengubah, dan menghapus kategori usaha dan wilayah/daerah operasional UMKM.
- **Manajemen Pengguna & Penjual (`/admin/users`):**
  - Melihat daftar seluruh pengguna terdaftar, pencarian nama/email, dan filter role.
  - Mengubah nama dan hak akses role (`seller` atau `admin`).
  - Halaman detail penjual (`/admin/users/[id]`) untuk melihat seluruh produk jualan miliknya, status moderasi, dan metrik klik WhatsApp.
  - Hapus pengguna dengan dialog peringatan bahaya: otomatis membersihkan seluruh produk jualan dan riwayat klik WA milik penjual secara aman (cascading) agar data tidak error.
  - Proteksi bawaan: admin tidak dapat menghapus akunnya sendiri yang sedang aktif.
- **Proteksi Server:** Hak akses administrasi dilindungi ketat di level Server Components, Actions, dan Row Level Security (RLS).

---

## 3. Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/).
- **Komponen UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives).
- **Database, Auth & Storage:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage Buckets).
- **Performa & Caching:** `unstable_cache` & ISR Data Cache (<5ms response time), Partial Prerendering (PPR), instant Top Loading Bar ala SPA, serta route-level shimmer skeleton.
- **Klien SSR:** `@supabase/ssr` (Sesi aman berbasis cookie HTTP-only via `proxy.ts`).
- **Validasi Skema:** [Zod](https://zod.dev/) & [react-hook-form](https://react-hook-form.com/) (`@hookform/resolvers`).
- **Ikon & Toast:** `lucide-react` & `sonner`.
- **Deployment:** Vercel.

---

## 4. Akun Demo untuk Penjurian

| Peran | Alamat Email | Kata Sandi | Kegunaan |
|---|---|---|---|
| **Admin** | `admin@gmail.com` | `123456` | Akses penuh panel `/admin`, moderasi & master data |
| **Penjual (UMKM)** | `penjual@gmail.com` | `123456` | Akses panel `/dashboard` penjual & kelola produk |

> *Catatan:* Supabase Auth mewajibkan panjang kata sandi minimal **6 karakter**, sehingga kata sandi demo diset menjadi `123456`. Pada halaman `/masuk` juga telah disediakan tombol klik otomatis untuk mempermudah login langsung.

---

## 5. Cara Menjalankan Proyek Secara Lokal

### Prasyarat:
- Node.js versi 18+ (disarankan Node.js 20+)
- Akun gratis di [supabase.com](https://supabase.com)

### Langkah Pemasangan:

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/lapakita.git
   cd lapakita
   ```

2. **Pasang seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable:**
   Salin berkas `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Buka `.env.local` dan isi dengan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Jalankan Skema Database di Supabase:**
   - Masuk ke dashboard Supabase > **SQL Editor** > **New query**.
   - Salin seluruh isi berkas `supabase/migrations/0001_init.sql`, tempel, lalu klik **Run**.
   - Di menu **Authentication** > **Providers** > **Email**, matikan opsi **Confirm email**.

5. **(Opsional) Pasang Data Seed Demo:**
   - Setelah membuat minimal 1 akun di halaman `/daftar`, buka kembali SQL Editor di Supabase.
   - Salin isi `supabase/seed.sql` dan klik **Run** untuk memasang 11 produk sampel realistis.

6. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

---

## 6. Penjelasan Environment Variable

| Variabel | Keterangan | Wajib? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL endpoint REST API project Supabase Anda (contoh: `https://[id].supabase.co`). | Ya |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Kunci publik/anon klien Supabase (`sb_publishable_...` atau `anon key`). Aman untuk browser karena diamankan oleh RLS. | Ya |
| `NEXT_PUBLIC_SITE_URL` | Domain dasar aplikasi (default lokal: `http://localhost:3000`, saat produksi gunakan domain Vercel). | Ya |

*Peringatan Keamanan: Aplikasi ini tidak memerlukan `service_role` key. Jangan pernah memasukkan secret key ke dalam kode maupun environment klien.*

---

## 7. Model Keamanan & Arsitektur Database

1. **Row Level Security (RLS):**
   - Pengunjung publik hanya dapat membaca data produk dengan status `approved`.
   - Penjual hanya dapat melihat, menambah, mengubah, dan menghapus produk milik akunnya sendiri (`seller_id = auth.uid()`).
   - Setiap modifikasi pada produk milik penjual dijaga oleh trigger Postgres (`guard_product_update`) yang otomatis memaksa status kembali ke `pending`, menghapus penanda unggulan, dan mengosongkan alasan tolak.
   - Hak cipta folder Supabase Storage dikunci sedemikian rupa sehingga penjual hanya bisa mengunggah ke path foldernya sendiri (`{user.id}/*`).
2. **Role Administrator Terproteksi:**
   - Pendaftaran publik selalu menghasilkan role `seller`.
   - Role `admin` hanya dapat diberikan langsung melalui query internal database oleh pengelola.
   - Semua rute `/admin/*` dan aksi moderasi diverifikasi berlapis di level Next.js Server Components, Server Actions, dan fungsi RLS `is_admin()`.
3. **Normalisasi Nomor WhatsApp:**
   - Nomor telepon dinormalisasi secara otomatis ke kode negara Indonesia `62...` (misal `0812...` dikonversi menjadi `62812...`) untuk memastikan keabsahan tautan pemesanan `wa.me`.

---

## 8. Rencana Pengembangan Lanjutan (Post-MVP)

- [ ] Integrasi peta lokasi interaktif (Google Maps / OpenStreetMap) untuk pencarian radius terdekat.
- [ ] Tombol laporan produk dari pengunjung jika menemukan indikasi pelanggaran.
- [ ] Notifikasi otomatis via email / WhatsApp ke penjual saat produk disetujui atau ditolak admin.
- [ ] Mode gelap (Dark mode) dan multi-bahasa.
- [ ] Analitik performa mingguan yang dikirimkan ke penjual.
