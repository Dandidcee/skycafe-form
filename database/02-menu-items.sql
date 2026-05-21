-- =========================================
-- Sky Cafe - Tabel Menu Items
-- =========================================
-- Menyimpan daftar menu makanan & minuman.
-- Dikelola oleh admin melalui web admin.
-- Web customer akan fetch data dari tabel ini.

CREATE TABLE IF NOT EXISTS menu_items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kategori    TEXT NOT NULL,                       -- Coffee, Non Coffee, Dessert, dll
  nama        TEXT NOT NULL,
  harga       INT NOT NULL,
  tersedia    BOOLEAN DEFAULT true,               -- false = tidak tampil di customer
  urutan      INT DEFAULT 0,                      -- untuk sorting tampilan
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_menu_kategori ON menu_items(kategori);
CREATE INDEX IF NOT EXISTS idx_menu_tersedia ON menu_items(tersedia);

-- RLS: semua orang bisa baca, hanya admin (authenticated) yang bisa kelola
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Admin manage menu" ON menu_items FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- Data menu awal (contoh)
-- =========================================
INSERT INTO menu_items (kategori, nama, harga) VALUES
  ('Coffee', 'Espresso', 12000),
  ('Coffee', 'Double Espresso', 12000),
  ('Coffee', 'Americano', 12000),
  ('Coffee', 'Cappuccino', 12000),
  ('Coffee', 'Flat White', 12000),
  ('Coffee', 'Latte', 12000),
  ('Coffee', 'Mocha', 12000),
  ('Coffee', 'Macchiato', 12000),
  ('Coffee', 'Affogato', 12000),
  ('Coffee', 'Cold Brew', 12000),
  ('Coffee', 'Iced Latte', 12000),
  ('Coffee', 'Sea Salt Caramel Latte', 12000),
  ('Non Coffee', 'Hot Chocolate', 12000),
  ('Non Coffee', 'Matcha Latte', 12000),
  ('Non Coffee', 'Iced Lemon Tea', 12000),
  ('Non Coffee', 'Mixed Berry Smoothie', 12000),
  ('Dessert', 'Tiramisu', 12000),
  ('Dessert', 'Cheesecake', 12000),
  ('Dessert', 'Chocolate Lava Cake', 12000),
  ('Dessert', 'Red Velvet Slice', 12000);
