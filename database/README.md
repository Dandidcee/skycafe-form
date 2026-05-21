# Database Setup - Sky Cafe

## Cara Pakai

Jalankan file SQL ini secara **berurutan** di [Supabase SQL Editor](https://supabase.com/dashboard):

| No | File | Fungsi |
|----|------|--------|
| 1 | `01-orders.sql` | Tabel pesanan |
| 2 | `02-menu-items.sql` | Tabel menu makanan & minuman |
| 3 | `03-gallery.sql` | Tabel foto galeri |
| 4 | `04-settings.sql` | Tabel pengaturan cafe (nama, logo, WA, dll) |
| 5 | `05-storage.sql` | Storage bucket untuk upload gambar |

## Urutan Penting!

Jalankan dari `01` sampai `05` secara berurutan karena beberapa tabel saling bergantung.

## Setelah SQL Dijalankan

1. Buat akun admin di Supabase Auth (Authentication > Users > Add User)
2. Isi email & password untuk login di web admin
3. Settings default sudah terisi, bisa diubah nanti dari web admin

## Struktur Tabel

### orders
Menyimpan semua pesanan dari web customer. Status flow:
- `pending` → Menunggu dikonfirmasi
- `confirmed` → Menunggu pembayaran  
- `paid` → Pesanan sedang dibuat
- `completed` → Pesanan selesai
- `cancelled` → Dibatalkan

### menu_items
Daftar menu yang tampil di web customer. Field `tersedia` mengontrol apakah menu tampil atau tidak.

### gallery
Foto-foto galeri cafe. URL gambar mengarah ke Supabase Storage.

### settings
Key-value store untuk konfigurasi cafe. Semua pengaturan yang bisa diubah admin tanpa perlu edit kode.

### Storage: assets
Bucket publik untuk menyimpan gambar (logo, galeri, dll).
