// Menu items data
export const menuData = [
  { kategori: 'Coffee', nama: 'Espresso', harga: 12000 },
  { kategori: 'Coffee', nama: 'Double Espresso', harga: 12000 },
  { kategori: 'Coffee', nama: 'Americano', harga: 12000 },
  { kategori: 'Coffee', nama: 'Cappuccino', harga: 12000 },
  { kategori: 'Coffee', nama: 'Flat White', harga: 12000 },
  { kategori: 'Coffee', nama: 'Latte', harga: 12000 },
  { kategori: 'Coffee', nama: 'Mocha', harga: 12000 },
  { kategori: 'Coffee', nama: 'Macchiato', harga: 12000 },
  { kategori: 'Coffee', nama: 'Affogato', harga: 12000 },
  { kategori: 'Coffee', nama: 'Cold Brew', harga: 12000 },
  { kategori: 'Coffee', nama: 'Iced Latte', harga: 12000 },
  { kategori: 'Coffee', nama: 'Sea Salt Caramel Latte', harga: 12000 },
  { kategori: 'Non Coffee', nama: 'Hot Chocolate', harga: 12000 },
  { kategori: 'Non Coffee', nama: 'Matcha Latte', harga: 12000 },
  { kategori: 'Non Coffee', nama: 'Iced Lemon Tea', harga: 12000 },
  { kategori: 'Non Coffee', nama: 'Mixed Berry Smoothie', harga: 12000 },
  { kategori: 'Dessert', nama: 'Tiramisu', harga: 12000 },
  { kategori: 'Dessert', nama: 'Cheesecake', harga: 12000 },
  { kategori: 'Dessert', nama: 'Chocolate Lava Cake', harga: 12000 },
  { kategori: 'Dessert', nama: 'Red Velvet Slice', harga: 12000 }
]

// Tempat booking per jam
export const tempatBooking = [
  { id: 'outdoor', nama: 'Outdoor', hargaPerJam: 50000, deskripsi: 'Suasana terbuka & sejuk' },
  { id: 'indoor', nama: 'Indoor', hargaPerJam: 70000, deskripsi: 'Ruangan ber-AC nyaman' },
  { id: 'vip', nama: 'VIP', hargaPerJam: 150000, deskripsi: 'Privat & eksklusif' }
]

// Villa booking per malam
export const villaBooking = {
  id: 'villa',
  nama: 'Villa',
  hargaPerMalam: 1000000,
  fasilitas: [
    'AC',
    'WiFi',
    '3 Kamar Tidur',
    'Kolam Renang',
    'Sarapan Gratis',
    'Kopi Gratis 2 Kali'
  ],
  kapasitas: '6 Orang'
}

// Kategori menu untuk filter
export const kategoriMenu = ['Semua', 'Coffee', 'Non Coffee', 'Dessert']

// Biaya layanan tetap
export const BIAYA_LAYANAN = 4000

// Konfigurasi dari .env
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '6285947522947'
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
