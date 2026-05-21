-- =========================================
-- Sky Cafe - Tabel Settings (Konfigurasi Cafe)
-- =========================================
-- Menyimpan semua pengaturan cafe yang bisa diubah admin:
-- nama cafe, logo, alamat, nomor WA, biaya layanan, warna tema, dll.
-- Web customer akan fetch settings ini saat pertama kali load.

CREATE TABLE IF NOT EXISTS settings (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: semua orang bisa baca, hanya admin yang bisa ubah
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- Default settings (ubah sesuai kebutuhan)
-- =========================================
INSERT INTO settings (key, value) VALUES
  ('cafe_name', 'Sky Cafe'),
  ('cafe_tagline', 'Luxury Roastery'),
  ('logo_url', '/logo.svg'),
  ('address', 'Jl. Contoh No. 123, Kota'),
  ('whatsapp_number', '6285947522947'),
  ('biaya_layanan', '4000'),
  ('primary_color', '#FF8F00'),
  ('footer_text', 'Terima kasih telah memesan');

-- =========================================
-- Penjelasan key:
-- =========================================
-- cafe_name       : Nama cafe yang tampil di header & struk
-- cafe_tagline    : Tagline di bawah nama (misal "Luxury Roastery")
-- logo_url        : URL logo (bisa dari Supabase Storage)
-- address         : Alamat cafe
-- whatsapp_number : Nomor WA untuk konfirmasi (format: 62xxx)
-- biaya_layanan   : Biaya layanan per pesanan (dalam Rupiah)
-- primary_color   : Warna utama tema website (hex color)
-- footer_text     : Teks footer di web & struk
