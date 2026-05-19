import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Insert order ke tabel orders di Supabase.
 * N8N akan listen perubahan di tabel ini.
 */
export async function insertOrder(payload) {
  const { pemesanan, pemesan } = payload

  const row = {
    order_id: payload.orderId,
    status: payload.status,
    source: payload.source,

    // Pemesan
    nama: pemesan.nama,
    telepon: pemesan.telepon,
    email: pemesan.email,

    // Tipe
    tipe: pemesanan.tipe,

    // Booking Tempat
    tempat_id: pemesanan.bookingTempat?.tempatId || null,
    tempat_nama: pemesanan.bookingTempat?.namaTempat || null,
    tempat_tanggal: pemesanan.bookingTempat?.tanggal || null,
    tempat_waktu: pemesanan.bookingTempat?.waktu || null,
    tempat_durasi: pemesanan.bookingTempat?.durasiJam || null,
    tempat_orang: pemesanan.bookingTempat?.jumlahOrang || null,
    tempat_harga: pemesanan.bookingTempat?.hargaPerJam || null,
    tempat_subtotal: pemesanan.bookingTempat?.subtotal || null,

    // Booking Villa
    villa_checkin: pemesanan.bookingVilla?.checkIn || null,
    villa_checkout: pemesanan.bookingVilla?.checkOut || null,
    villa_malam: pemesanan.bookingVilla?.jumlahMalam || null,
    villa_tamu: pemesanan.bookingVilla?.jumlahTamu || null,
    villa_subtotal: pemesanan.bookingVilla?.subtotal || null,

    // Menu
    menu_items: pemesanan.menu?.items || [],
    menu_subtotal: pemesanan.menu?.subtotal || 0,
    menu_jumlah: pemesanan.menu?.jumlahItem || 0,

    // Catatan
    catatan: pemesanan.catatan,

    // Biaya
    subtotal: pemesanan.subtotal,
    biaya_layanan: pemesanan.biayaLayanan,
    total: pemesanan.total,

    // Konfirmasi
    konfirmasi_channel: payload.konfirmasi.channel,
    konfirmasi_nomor: payload.konfirmasi.nomor,

    // Raw payload backup
    raw_payload: payload
  }

  const { data, error } = await supabase
    .from('orders')
    .insert(row)
    .select()
    .single()

  if (error) throw error
  return data
}
