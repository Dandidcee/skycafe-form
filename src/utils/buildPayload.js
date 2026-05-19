import { tempatBooking, villaBooking, BIAYA_LAYANAN, WHATSAPP_NUMBER } from '../data/menuData'
import { generateOrderId, calculateDays } from './format'

/**
 * Build structured JSON payload for N8N webhook / Supabase / Google Sheets
 * Midtrans akan diproses oleh N8N berdasarkan payload ini.
 */
export function buildOrderPayload({
  tipe,
  pemesan,
  selectedItems,
  bookingTempat,
  bookingVilla,
  catatan
}) {
  const orderId = generateOrderId()
  const timestamp = new Date().toISOString()

  // Menu items
  const menuItems = selectedItems.map((item) => ({
    nama: item.nama,
    kategori: item.kategori,
    harga: item.harga,
    qty: item.qty,
    subtotal: item.harga * item.qty
  }))
  const menuSubtotal = menuItems.reduce((sum, i) => sum + i.subtotal, 0)

  // Booking tempat
  let bookingTempatSection = null
  let tempatSubtotal = 0
  if (tipe === 'tempat') {
    const tempatInfo = tempatBooking.find((t) => t.id === bookingTempat.tempat)
    const durasi = parseInt(bookingTempat.durasi) || 0
    tempatSubtotal = tempatInfo ? tempatInfo.hargaPerJam * durasi : 0
    bookingTempatSection = {
      tempatId: bookingTempat.tempat,
      namaTempat: tempatInfo ? tempatInfo.nama : null,
      tanggal: bookingTempat.tanggal,
      waktu: bookingTempat.waktu,
      durasiJam: durasi,
      jumlahOrang: bookingTempat.jumlahOrang,
      hargaPerJam: tempatInfo ? tempatInfo.hargaPerJam : 0,
      subtotal: tempatSubtotal
    }
  }

  // Booking villa
  let bookingVillaSection = null
  let villaSubtotal = 0
  if (tipe === 'villa') {
    const jumlahMalam = calculateDays(bookingVilla.checkIn, bookingVilla.checkOut)
    villaSubtotal = villaBooking.hargaPerMalam * jumlahMalam
    bookingVillaSection = {
      namaVilla: villaBooking.nama,
      checkIn: bookingVilla.checkIn,
      checkOut: bookingVilla.checkOut,
      jumlahMalam,
      jumlahTamu: bookingVilla.jumlahTamu,
      hargaPerMalam: villaBooking.hargaPerMalam,
      kapasitas: villaBooking.kapasitas,
      fasilitas: villaBooking.fasilitas,
      subtotal: villaSubtotal
    }
  }

  const subtotal = menuSubtotal + tempatSubtotal + villaSubtotal
  const biayaLayanan = BIAYA_LAYANAN
  const total = subtotal + biayaLayanan

  const payload = {
    orderId,
    timestamp,
    status: 'pending',
    source: 'web-form',
    pemesan: {
      nama: pemesan.nama.trim(),
      telepon: pemesan.telepon.trim(),
      email: pemesan.email ? pemesan.email.trim() : null
    },
    pemesanan: {
      tipe,
      bookingTempat: bookingTempatSection,
      bookingVilla: bookingVillaSection,
      menu: menuItems.length > 0
        ? { items: menuItems, subtotal: menuSubtotal, jumlahItem: menuItems.reduce((s, i) => s + i.qty, 0) }
        : null,
      catatan: catatan ? catatan.trim() : null,
      subtotal,
      biayaLayanan,
      total
    },
    konfirmasi: {
      channel: 'whatsapp',
      nomor: WHATSAPP_NUMBER
    }
  }

  return payload
}
