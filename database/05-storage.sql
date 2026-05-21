-- =========================================
-- Sky Cafe - Storage Bucket (Upload Gambar)
-- =========================================
-- Bucket untuk menyimpan file gambar:
-- - Logo cafe
-- - Foto galeri
-- - Foto menu (jika diperlukan nanti)
--
-- Bucket ini PUBLIC (bisa diakses tanpa auth untuk tampil di web customer).
-- Hanya admin (authenticated) yang bisa upload dan hapus.

INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Semua orang bisa lihat/download gambar
CREATE POLICY "Public read assets" ON storage.objects
FOR SELECT USING (bucket_id = 'assets');

-- Hanya admin yang bisa upload
CREATE POLICY "Admin upload assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Hanya admin yang bisa hapus
CREATE POLICY "Admin delete assets" ON storage.objects
FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Hanya admin yang bisa update
CREATE POLICY "Admin update assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
