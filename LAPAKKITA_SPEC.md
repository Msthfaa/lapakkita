# LapakKita: Spesifikasi Proyek untuk AI Coding Agent

> **Untuk agent:** Baca seluruh file ini sebelum menulis kode. File ini adalah sumber kebenaran (source of truth) proyek. Jika ada yang ambigu, pilih opsi paling sederhana yang tetap memenuhi spesifikasi, lalu catat asumsi di `README.md`. Fokus tahap ini adalah **fungsionalitas berjalan dulu**; desain visual akan dipoles belakangan, jadi gunakan UI bersih dan sederhana (komponen siap pakai), jangan habiskan waktu untuk estetika.

---

## 1. Ringkasan Proyek

**LapakKita** adalah etalase digital UMKM lokal. Penjual mendaftar dan memasang produk, **admin memverifikasi** sebelum produk tampil publik, dan pembeli yang tertarik langsung diarahkan ke **WhatsApp penjual**.

- Web ini **hanya untuk promosi/etalase**. **Tidak ada** keranjang, checkout, atau pembayaran. Transaksi terjadi di luar web, lewat WhatsApp.
- Dibuat untuk lomba web dengan tenggat sangat singkat (pengumpulan **16 November 2026, 23.59 WIB**). Penilaian menekankan ide, kebermanfaatan, fungsi, kerapian, dan stabilitas demo. Maka: **lingkup kecil, stabil, tidak ada error saat demo**.
- Tema Halloween dari panitia **diabaikan**. Tema bebas.

**Masalah yang diselesaikan:** banyak UMKM kecil tidak punya website dan hanya mengandalkan status WhatsApp/medsos sehingga sulit ditemukan. Pembeli juga sulit membedakan usaha yang nyata dari yang abal-abal. Verifikasi admin menjawab masalah kedua.

---

## 2. Peran Pengguna

| Peran | Perlu login? | Kemampuan |
|---|---|---|
| **Pengunjung** | Tidak | Melihat produk approved, mencari, memfilter kategori, membuka detail produk, klik tombol WhatsApp |
| **Penjual** (`seller`) | Ya | Register/login/logout, tambah/ubah/hapus **produk miliknya**, upload foto, melihat status (pending/approved/rejected) dan alasan penolakan, melihat jumlah klik WA per produk |
| **Admin** (`admin`) | Ya | Melihat semua produk, **menyetujui** atau **menolak (wajib dengan alasan)**, menandai produk unggulan, melihat statistik ringkas |

Aturan penting:
- Register publik **selalu** menghasilkan role `seller`. Role `admin` hanya diberikan **manual lewat SQL** (lihat bagian 9). Tidak boleh ada opsi "daftar sebagai admin" di UI.
- Persetujuan dilakukan **per produk**, bukan per akun.

---

## 3. Alur Utama

1. Penjual register, lalu login.
2. Penjual mengisi form produk: nama, deskripsi, harga, kategori, foto (maks 2 MB), nomor WA, alamat/lokasi singkat. Status otomatis `pending`.
3. Admin membuka halaman moderasi, lalu **Setujui** atau **Tolak** (dengan alasan).
4. Produk berstatus `approved` muncul di halaman publik. Produk `pending`/`rejected` hanya terlihat oleh pemiliknya dan admin.
5. Jika ditolak, penjual melihat alasan, memperbaiki produk, dan produk kembali ke `pending` secara otomatis (dijaga trigger database).
6. Pembeli klik **"Hubungi via WhatsApp"**: klik dicatat ke tabel `wa_clicks`, lalu terbuka chat WA penjual dengan pesan otomatis:
   `https://wa.me/62812xxxx?text=Halo, saya tertarik dengan produk *Keripik Pisang* yang saya lihat di LapakKita`

---

## 4. Tech Stack

Gunakan **versi stabil terbaru** dari semuanya. Jalankan `npm view <paket> version` atau cek dokumentasi resmi sebelum menginstal, jangan menebak versi dari ingatan. Hindari paket beta/canary.

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js (App Router, stable terbaru) + TypeScript** | SSR/SEO untuk halaman produk, URL detail yang bisa dibagikan, deploy mulus di Vercel |
| Styling | **Tailwind CSS (v4)** | Cepat, mudah diubah belakangan saat poles desain |
| Komponen UI | **shadcn/ui** (Radix + Tailwind) | Komponen siap pakai dan bisa dimodifikasi, jadi desain mudah diganti nanti |
| Backend/DB | **Supabase** (Postgres, Auth, Storage, RLS) | Tanpa server sendiri |
| Klien Supabase | `@supabase/supabase-js` + `@supabase/ssr` | Sesi login lewat cookie, bekerja di Server Components |
| Validasi | **Zod** + **react-hook-form** (`@hookform/resolvers`) | Validasi form dan input terpusat |
| Ikon | `lucide-react` | Dipakai shadcn |
| Toast | `sonner` | Umpan balik aksi |
| Hosting | **Vercel** | Gratis, terintegrasi GitHub |
| Package manager | npm (atau pnpm) | Konsisten, satu saja |

Catatan versi: pada Next.js terbaru, file `middleware.ts` telah digantikan `proxy.ts`. Cek dokumentasi Next.js dan panduan resmi Supabase SSR untuk Next.js (`supabase.com/docs/guides/auth/server-side/nextjs`) untuk pola yang benar pada versi yang terpasang. Supabase kini menyediakan **publishable key** (`sb_publishable_...`) sebagai pengganti anon key lama. Keduanya bersifat publik dan aman di klien selama RLS aktif. Pakai yang tersedia di dashboard project.

### Prinsip kemudahan maintenance
- **TypeScript ketat** dan tipe database digenerate dari Supabase: `npx supabase gen types typescript --project-id <ID> > src/types/database.ts`.
- **Struktur berbasis fitur**, logika terpisah dari tampilan, tidak ada query Supabase langsung di dalam komponen UI (lewat fungsi di `src/features/*/queries.ts` dan `actions.ts`).
- Semua konstanta (nama situs, batas ukuran foto, daftar status) di `src/lib/constants.ts`.
- Semua env divalidasi di satu tempat (`src/lib/env.ts`).
- Komponen UI dipisah di `src/components/ui` (shadcn) dan `src/components/*` (milik proyek), supaya redesain nanti tidak menyentuh logika.
- Jangan menambah library tanpa alasan jelas.

---

## 5. Struktur Folder

```
lapakkita/
├─ supabase/
│  ├─ migrations/
│  │  └─ 0001_init.sql          # semua tabel, RLS, trigger, storage (bagian 8)
│  └─ seed.sql                  # kategori + data contoh (bagian 10)
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx            # beranda: unggulan + daftar + cari + filter
│  │  │  └─ produk/[id]/page.tsx# detail produk + tombol WA
│  │  ├─ (auth)/
│  │  │  ├─ masuk/page.tsx
│  │  │  └─ daftar/page.tsx
│  │  ├─ dashboard/             # khusus penjual (login wajib)
│  │  │  ├─ page.tsx            # daftar produk saya + status + klik WA
│  │  │  ├─ produk/baru/page.tsx
│  │  │  └─ produk/[id]/ubah/page.tsx
│  │  ├─ admin/                 # khusus admin
│  │  │  ├─ page.tsx            # statistik ringkas
│  │  │  └─ moderasi/page.tsx   # setujui/tolak, tandai unggulan
│  │  ├─ api/wa-click/route.ts  # (opsional) pencatat klik; boleh juga lewat server action
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ ui/                    # shadcn
│  │  ├─ product-card.tsx
│  │  ├─ product-form.tsx
│  │  ├─ wa-button.tsx
│  │  ├─ status-badge.tsx
│  │  └─ navbar.tsx
│  ├─ features/
│  │  ├─ products/ (queries.ts, actions.ts, schema.ts)
│  │  ├─ auth/     (actions.ts, schema.ts)
│  │  └─ admin/    (queries.ts, actions.ts)
│  ├─ lib/
│  │  ├─ supabase/ (client.ts, server.ts, proxy-helper.ts)
│  │  ├─ whatsapp.ts            # normalisasi nomor + builder link wa.me
│  │  ├─ format.ts              # format rupiah
│  │  ├─ constants.ts
│  │  └─ env.ts
│  ├─ types/database.ts         # hasil generate Supabase
│  └─ proxy.ts                  # refresh sesi (di Next lama: middleware.ts)
├─ .env.example
├─ .gitignore                   # .env.local WAJIB ada di sini
└─ README.md
```

---

## 6. Halaman dan Perilaku

### Publik
- **Beranda `/`**: bagian "Produk Unggulan" (`is_featured = true`, maks 6), lalu grid semua produk approved. Ada kolom cari (nama/deskripsi, `ilike`), dropdown kategori, dan pagination (12 per halaman). Filter disimpan di **URL search params** (`?q=keripik&kategori=3&page=2`) agar bisa dibagikan. Tampilkan *empty state* yang ramah jika hasil kosong.
- **Detail `/produk/[id]`**: foto, nama, harga (format Rupiah), kategori, deskripsi, alamat, nama penjual, tombol WA. Jika produk tidak ada atau tidak approved (dan bukan milik pengguna/admin), tampilkan 404.
- **Tombol WA**: saat diklik, catat satu baris ke `wa_clicks`, lalu buka `wa.me` di tab baru. Pencatatan **tidak boleh menghalangi** pembukaan WA (jalankan paralel, abaikan kegagalannya).

### Auth
- **Daftar**: nama, email, password (min 8 karakter). Nama dikirim lewat `options.data.nama` pada `signUp` agar trigger database membuat profil.
- **Masuk/Keluar**: email + password. Setelah masuk, arahkan admin ke `/admin`, penjual ke `/dashboard`.
- Konfirmasi email **dimatikan** untuk demo (bagian 9).

### Dashboard penjual
- Daftar produk milik sendiri dengan badge status (pending kuning, approved hijau, rejected merah). Jika rejected, tampilkan `alasan_tolak` jelas dan tombol "Perbaiki".
- Kolom jumlah klik WA per produk ("Produkmu diklik 24 kali").
- Form tambah/ubah: nama, deskripsi, harga (angka), kategori, foto, no. WA, alamat. Upload foto langsung ke Supabase Storage, validasi tipe (jpeg/png/webp) dan ukuran ≤ 2 MB di sisi klien **dan** diperkuat batasan bucket.
- Hapus produk dengan dialog konfirmasi. Hapus juga fotonya dari Storage jika memungkinkan.
- Mengubah produk membuat status kembali `pending` (dijaga trigger).

### Admin
- **`/admin`**: kartu angka: jumlah produk pending, approved, rejected, dan total penjual.
- **`/admin/moderasi`**: tab/filter per status (default `pending`). Tiap produk menampilkan data lengkap dan tombol **Setujui** / **Tolak**. Tolak membuka dialog dengan kolom alasan **wajib diisi**. Ada toggle **Unggulan** untuk produk approved.
- Akses ke `/admin/*` hanya untuk role admin. **Cek role di server** (di layout/page lewat query `profiles`), jangan hanya mengandalkan proxy atau UI yang disembunyikan.

---

## 7. Aturan Teknis Penting

1. **Normalisasi nomor WA** (`src/lib/whatsapp.ts`): buang semua karakter non-digit; jika diawali `0` ganti dengan `62`; jika diawali `8` tambahkan `62`; jika sudah `62` biarkan; tolak jika panjang di luar 10-15 digit. Simpan nomor dalam format ternormalisasi (`62812...`) di database. Zod schema memvalidasi ini.
2. **Link WA**: `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`. Pesan: `Halo, saya tertarik dengan produk *${nama}* yang saya lihat di LapakKita`.
3. **Harga**: simpan sebagai integer (rupiah), tampilkan dengan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
4. **Keamanan**: semua pembatasan akses dijaga **RLS di database**, bukan hanya UI. Validasi input dengan Zod di server action. Di server gunakan `supabase.auth.getUser()` (atau `getClaims()` sesuai panduan versi terpasang) untuk memastikan identitas, **jangan** mempercayai `getSession()` saja untuk keputusan otorisasi.
5. **Gambar**: pakai `next/image` dan daftarkan host Supabase di `images.remotePatterns` pada `next.config`. Path upload: `${user.id}/${crypto.randomUUID()}.${ext}`.
6. **Bahasa antarmuka**: Bahasa Indonesia. Pesan error ramah, bukan teks mentah dari Supabase.
7. **Responsif**: mobile-first. Grid 1 kolom di HP, 2-4 kolom di layar lebih besar. Tombol cukup besar untuk jari.
8. **Penanganan error/loading**: tiap halaman data punya `loading.tsx`/skeleton sederhana dan error boundary. Tidak boleh ada layar putih atau crash saat data kosong.
9. **Jangan pernah** memakai atau menaruh `service_role` key di kode, repo, atau env klien. Aplikasi ini **tidak memerlukannya**.

---

## 8. Skema Database (Migration SQL)

Simpan sebagai `supabase/migrations/0001_init.sql`. Skrip ini idempotent sejauh wajar dan dapat dijalankan sekali di SQL Editor atau lewat Supabase CLI.

```sql
-- =========================================================
-- LapakKita: skema awal
-- =========================================================

-- ---------- TABEL ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null default 'Penjual',
  role text not null default 'seller' check (role in ('seller', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id serial primary key,
  nama text not null unique
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id int references public.categories(id) on delete set null,
  nama text not null check (char_length(nama) between 3 and 100),
  deskripsi text not null default '' check (char_length(deskripsi) <= 2000),
  harga int not null check (harga >= 0),
  foto_url text,
  no_wa text not null check (no_wa ~ '^62[0-9]{8,13}$'),
  alamat text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  alasan_tolak text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.wa_clicks (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index products_status_idx on public.products(status);
create index products_seller_idx on public.products(seller_id);
create index products_category_idx on public.products(category_id);
create index wa_clicks_product_idx on public.wa_clicks(product_id);

-- ---------- FUNGSI BANTU ----------
-- security definer agar tidak terjadi rekursi RLS saat cek role
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Buat profil otomatis saat user mendaftar (role SELALU 'seller')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nama, role)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'nama', ''), 'Penjual'), 'seller');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Penjaga update produk: non-admin tidak boleh mengubah status/unggulan/pemilik.
-- Setiap edit oleh penjual otomatis mengembalikan produk ke 'pending'.
create or replace function public.guard_product_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  new.seller_id := old.seller_id;
  new.is_featured := false;
  new.status := 'pending';
  new.alasan_tolak := null;
  return new;
end;
$$;

create trigger products_guard_update
  before update on public.products
  for each row execute function public.guard_product_update();

-- ---------- RLS ----------
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.wa_clicks  enable row level security;

-- profiles
create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
-- role tidak boleh diubah lewat API: hanya kolom nama yang boleh diupdate
revoke update on public.profiles from anon, authenticated;
grant update (nama) on public.profiles to authenticated;

-- categories: publik baca, hanya admin tulis
create policy "categories_select_all" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- products
create policy "products_select" on public.products
  for select using (
    status = 'approved'
    or seller_id = (select auth.uid())
    or public.is_admin()
  );
create policy "products_insert_own" on public.products
  for insert to authenticated
  with check (
    seller_id = (select auth.uid())
    and status = 'pending'
    and is_featured = false
  );
create policy "products_update_own" on public.products
  for update to authenticated
  using (seller_id = (select auth.uid()))
  with check (seller_id = (select auth.uid()));
create policy "products_update_admin" on public.products
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "products_delete_own_or_admin" on public.products
  for delete to authenticated
  using (seller_id = (select auth.uid()) or public.is_admin());

-- wa_clicks: siapa pun boleh mencatat klik pada produk approved; penjual/admin boleh membaca
create policy "wa_clicks_insert_public" on public.wa_clicks
  for insert to anon, authenticated
  with check (exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'approved'
  ));
create policy "wa_clicks_select_owner_or_admin" on public.wa_clicks
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.seller_id = (select auth.uid())
    )
  );

-- ---------- STORAGE ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images', 'product-images', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product_images_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "product_images_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "product_images_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ---------- DATA AWAL ----------
insert into public.categories (nama) values
  ('Makanan'), ('Minuman'), ('Fashion'), ('Kerajinan'),
  ('Pertanian'), ('Jasa'), ('Lainnya')
on conflict (nama) do nothing;
```

Query statistik yang dibutuhkan (lakukan lewat Supabase client dengan `count`):
- Penjual: jumlah klik per produk dari `wa_clicks` untuk produk miliknya.
- Admin: `select count(*)` per status dari `products`, dan total baris `profiles` ber-role `seller`.

---

## 9. PANDUAN SETUP SUPABASE (untuk agent dan pemilik proyek)

Agent tidak punya akses ke dashboard Supabase milik pemilik. Maka setup dibagi dua: bagian yang **dikerjakan agent** (membuat file) dan bagian yang **dikerjakan pemilik proyek secara manual** (agent memberi instruksi langkah demi langkah dan menunggu konfirmasi).

### Aturan untuk agent
- **Jangan meminta atau menyimpan** `service_role` key atau password database. Yang dibutuhkan hanya **Project URL** dan **publishable/anon key**.
- Tulis semua perubahan skema sebagai file migration di `supabase/migrations/`, jangan hanya menyuruh pemilik mengetik SQL dari ingatan.
- Setelah membuat file, **berhenti dan minta pemilik menjalankan langkah manual di bawah**, lalu minta ia mengonfirmasi atau menempel hasil/error.
- Jangan lanjut ke langkah kode yang bergantung pada database sebelum pemilik mengonfirmasi bahwa langkah 1-5 selesai.

### Langkah manual untuk pemilik proyek (agent: sampaikan ini ke pemilik dengan bahasa jelas)

**Langkah 1. Buat project**
1. Buka `supabase.com`, login, klik **New project**.
2. Isi nama `lapakkita`, buat database password (simpan sendiri, tidak perlu dibagikan ke agent), pilih region terdekat (misalnya Singapore).
3. Tunggu sampai status project aktif.

**Langkah 2. Jalankan skema**
1. Buka menu **SQL Editor** > **New query**.
2. Salin seluruh isi `supabase/migrations/0001_init.sql`, tempel, klik **Run**.
3. Pastikan muncul "Success". Jika ada error, salin pesan errornya ke agent.
4. Cek di **Table Editor**: tabel `profiles`, `categories`, `products`, `wa_clicks` ada, dan `categories` berisi 7 baris. Cek di **Storage**: bucket `product-images` ada.

*(Alternatif untuk pengguna Supabase CLI: `npx supabase login`, `npx supabase link --project-ref <REF>`, lalu `npx supabase db push`. Agent boleh menyarankan jalur ini hanya jika pemilik menyatakan nyaman memakai terminal.)*

**Langkah 3. Matikan konfirmasi email (wajib untuk demo)**
- **Authentication** > **Sign In / Providers** (atau **Providers**) > **Email** > matikan **Confirm email**, simpan.
- Tanpa ini, juri yang mendaftar tidak bisa langsung login.

**Langkah 4. Ambil kunci API**
- **Project Settings** > **API Keys** (atau **API**): salin **Project URL** dan **publishable key** (atau **anon key**).
- Tempel ke `.env.local` (lihat bagian 11). **Jangan** salin `service_role`/secret key.

**Langkah 5. Atur URL Auth**
- **Authentication** > **URL Configuration**:
  - Saat pengembangan: **Site URL** = `http://localhost:3000`.
  - Setelah deploy: ganti **Site URL** dengan URL Vercel (mis. `https://lapakkita.vercel.app`) dan tambahkan ke **Redirect URLs** (boleh juga `http://localhost:3000/**` untuk tetap bisa uji lokal).

**Langkah 6. Buat akun admin** (dilakukan setelah aplikasi bisa register)
1. Daftar akun biasa lewat halaman `/daftar` dengan email admin yang diinginkan.
2. Buka **SQL Editor**, jalankan (ganti emailnya):
   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'admin@contoh.com');
   ```
3. Pastikan hasilnya `UPDATE 1`. Login ulang dengan akun itu, lalu pastikan `/admin` terbuka.
4. Buat juga 1 akun penjual demo (misalnya `penjual@contoh.com`) untuk README.

**Langkah 7. Verifikasi RLS** (agent bantu tuliskan skenario uji, pemilik menjalankannya)
- Tanpa login: hanya produk approved yang terlihat.
- Penjual A tidak bisa melihat atau mengubah produk Penjual B.
- Penjual tidak bisa mengubah status jadi `approved` (cobalah, harus kembali `pending`).
- Hanya admin yang bisa menyetujui/menolak.
- Upload ke folder user lain ditolak.

### Pengingat operasional Supabase
- Project paket gratis bisa **di-pause** jika lama tidak aktif. Buka dan gunakan aplikasi **sebelum penjurian (17-18 November)** dan sebelum Grand Final (25 November). Jika ter-pause, klik **Restore** di dashboard.
- Pantau batas paket gratis (ukuran storage, bandwidth).

---

## 10. Data Contoh (Seed)

Agar web tidak tampak kosong saat demo, siapkan `supabase/seed.sql` atau panduan input manual:
- Buat 2 akun penjual demo, masing-masing 4-5 produk.
- Total sekitar **8-10 produk `approved`** (beberapa `is_featured = true`), **2 produk `pending`**, **1 produk `rejected`** dengan alasan.
- Gunakan foto asli ringan (< 500 KB) dan nomor WA yang valid (milik tim sendiri) agar uji klik WA bisa dilakukan.
- Karena `seller_id` bergantung pada user yang dibuat lewat Auth, lebih aman seed produk **setelah** akun penjual dibuat, memakai `select id from public.profiles where nama = '...'`. Agent: tulis `seed.sql` dengan pola ini dan beri instruksi cara menjalankannya.

---

## 11. Environment Variable

`.env.example` (commit ke repo) dan `.env.local` (jangan di-commit):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
# Jika project masih memakai kunci lama, boleh pakai NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- Pastikan `.env*.local` ada di `.gitignore` **sebelum** commit pertama.
- Di Vercel: isi variabel yang sama di **Project Settings > Environment Variables**, lalu **redeploy** (variabel hanya terbaca saat build).

---

## 12. Deploy ke Vercel

1. Push ke GitHub (tanpa `.env.local`).
2. Vercel > **Add New Project** > import repo. Framework terdeteksi Next.js otomatis.
3. Isi environment variable (bagian 11), klik Deploy.
4. Salin URL Vercel ke **Site URL** dan **Redirect URLs** di Supabase (langkah 5 bagian 9).
5. Uji dari **HP** dan **jendela incognito**: register, tambah produk, setujui sebagai admin, cari, klik WA.
6. Lakukan ini paling lambat **hari ke-5**, jangan di menit akhir.

---

## 13. Urutan Kerja untuk Agent

Kerjakan **berurutan**. Setelah tiap tahap, pastikan `npm run build` lolos dan fitur tahap itu dapat diuji manual sebelum lanjut.

1. **Inisialisasi**: buat project Next.js (TypeScript, Tailwind, App Router, ESLint), pasang shadcn/ui, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `@hookform/resolvers`, `sonner`. Buat struktur folder, `.env.example`, `.gitignore`.
2. **Database**: tulis `0001_init.sql` persis seperti bagian 8. **Berhenti**, sampaikan Langkah 1-5 bagian 9 ke pemilik, tunggu konfirmasi. Lalu generate `src/types/database.ts`.
3. **Klien Supabase & sesi**: `client.ts`, `server.ts`, `proxy.ts` sesuai panduan resmi untuk versi Next.js terpasang. `env.ts` validasi.
4. **Auth**: halaman daftar, masuk, keluar; navbar yang sadar login dan role. Setelah ini, minta pemilik membuat akun admin (Langkah 6).
5. **Penjual**: CRUD produk + upload foto + dashboard dengan status dan alasan tolak.
6. **Publik**: beranda (unggulan, cari, filter, pagination), detail produk, tombol WA + pencatatan klik.
7. **Admin**: statistik, moderasi (setujui/tolak dengan alasan), toggle unggulan, proteksi role di server.
8. **Statistik klik** di dashboard penjual.
9. **Pengerasan**: loading/error/empty state, responsif HP, pesan error berbahasa Indonesia, pengujian skenario RLS (Langkah 7).
10. **Seed & README**: data contoh dan README lengkap.

### Fitur MVP (wajib)
Register/login/logout, CRUD produk penjual, upload foto, moderasi admin dengan alasan tolak, halaman publik dengan cari + filter kategori, detail produk, tombol WA dengan pesan otomatis, penghitung klik WA, tampilan responsif.

### Di luar lingkup (JANGAN dikerjakan sekarang)
Keranjang, pembayaran, chat internal, review/rating, notifikasi email, multi-bahasa, peta lokasi, mode gelap, tombol laporkan produk. Boleh dicatat di README sebagai **pengembangan lanjutan**.

---

## 14. Definition of Done

- [ ] `npm run build` dan `npm run lint` lolos tanpa error.
- [ ] Alur lengkap berjalan: daftar penjual > tambah produk (pending) > admin setujui > tampil publik > cari > klik WA terbuka dengan pesan benar > klik tercatat > statistik tampil di dashboard.
- [ ] Alur penolakan berjalan: tolak dengan alasan > penjual melihat alasan > ubah produk > kembali pending.
- [ ] RLS lolos semua skenario Langkah 7.
- [ ] Nomor `0812...` otomatis menjadi `62812...` dan link WA valid.
- [ ] Tidak ada `service_role` key atau `.env.local` di repo.
- [ ] Berjalan baik di layar HP (~375 px) dan desktop.
- [ ] Sudah di-deploy di Vercel dan diuji dari HP serta incognito.
- [ ] `README.md` lengkap (lihat bagian 15).

---

## 15. Isi README.md yang Wajib Dibuat Agent

1. Nama dan deskripsi singkat LapakKita, serta masalah yang diselesaikan.
2. Daftar fitur per peran.
3. Tech stack dan alasan singkat.
4. **Akun demo**: admin (email + password) dan penjual (email + password), serta URL situs yang sudah di-deploy.
5. **Cara menjalankan lokal**: clone, `npm install`, salin `.env.example` ke `.env.local` dan isi, jalankan migration SQL di Supabase, `npm run dev`.
6. Penjelasan variabel environment (tanpa nilai rahasia).
7. Ringkasan struktur folder dan model keamanan (RLS, role admin dibuat manual).
8. Catatan pengembangan lanjutan.

---

## 16. Instruksi Komunikasi untuk Agent

- Jelaskan setiap langkah singkat dalam **Bahasa Indonesia** yang mudah dipahami, karena pemilik proyek memantau pengerjaan.
- Jika butuh tindakan manual dari pemilik (dashboard Supabase, Vercel, GitHub), tulis **langkah bernomor** yang jelas dan tunggu konfirmasi.
- Jika menemui error, tampilkan penyebab dan perbaikan yang diusulkan, jangan diam-diam mengubah rancangan.
- Jika ada keputusan di luar spesifikasi ini, pilih yang paling sederhana dan catat di README.
- Prioritas utama: **stabil dan tidak error saat demo**, bukan fitur yang banyak.
