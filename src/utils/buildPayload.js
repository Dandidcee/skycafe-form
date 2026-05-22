import { BIAYA_LAYANAN, WHATSAPP_NUMBER } from '../data/menuData'
import { generateOrderId } from './format'

/**
 * Build structured JSON payload for Supabase
 */
export function buildOrderPayload({
  tipe,
  pemesan,
  selectedItems,
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

  const subtotal = menuSubtotal
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
      bookingTempat: null,
      bookingVilla: null,
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
