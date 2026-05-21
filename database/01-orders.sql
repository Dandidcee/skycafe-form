-- =========================================
-- Sky Cafe - Tabel Orders (Pesanan)
-- =========================================
-- Tabel utama untuk menyimpan semua pesanan dari web customer.
-- N8N bisa listen ke tabel ini via Supabase Trigger / Realtime.

CREATE TABLE IF NOT EXISTS orders (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id        TEXT UNIQUE NOT NULL,           -- SKY-XXXXX-XXXX
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  status          TEXT DEFAULT 'pending',          -- pending, confirmed, paid, completed, cancelled

  -- Data Pemesan
  nama            TEXT NOT NULL,
  telepon         TEXT NOT NULL,
  email           TEXT,

  -- Tipe Pemesanan
  tipe            TEXT NOT NULL,                   -- dinein, takeaway

  -- Menu (disimpan sebagai JSONB array)
  -- Format: [{"nama":"Latte","kategori":"Coffee","harga":12000,"qty":2,"subtotal":24000}]
  menu_items      JSONB DEFAULT '[]'::jsonb,
  menu_subtotal   INT DEFAULT 0,
  menu_jumlah     INT DEFAULT 0,                  -- total jumlah item

  -- Catatan
  catatan         TEXT,

  -- Biaya
  subtotal        INT NOT NULL DEFAULT 0,
  biaya_layanan   INT NOT NULL DEFAULT 4000,
  total           INT NOT NULL DEFAULT 0,

  -- Konfirmasi
  konfirmasi_channel TEXT DEFAULT 'whatsapp',
  konfirmasi_nomor   TEXT,

  -- Metadata
  source          TEXT DEFAULT 'web-form',
  raw_payload     JSONB                            -- backup full JSON payload
);

-- Index untuk query yang sering dipakai
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tipe ON orders(tipe);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_telepon ON orders(telepon);

-- Enable Realtime (agar N8N bisa listen via Supabase Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- RLS (opsional, aktifkan jika perlu)
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anonymous insert" ON orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public read by order_id" ON orders FOR SELECT USING (true);
