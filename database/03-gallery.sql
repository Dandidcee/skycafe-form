-- =========================================
-- Sky Cafe - Tabel Gallery
-- =========================================
-- Menyimpan foto-foto galeri cafe.
-- Dikelola oleh admin melalui web admin.
-- Gambar disimpan di Supabase Storage (bucket: assets).

CREATE TABLE IF NOT EXISTS gallery (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url         TEXT NOT NULL,                       -- URL gambar dari Supabase Storage
  caption     TEXT,                               -- keterangan foto (opsional)
  urutan      INT DEFAULT 0,                      -- untuk sorting tampilan
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: semua orang bisa baca, hanya admin yang bisa kelola
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
