import { formatRupiah, formatTanggal } from './format'

/**
 * Generate HTML struk pesanan yang bisa di-print/download di HP
 * Design: minimal, clean, mobile-friendly receipt
 */
export function generateReceiptHTML(payload) {
  const { orderId, timestamp, pemesan, pemesanan } = payload
  const date = new Date(timestamp)
  const tanggalStr = date.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const waktuStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  })

  const tipeLabel = {
    dinein: 'Dine In',
    takeaway: 'Takeaway',
    tempat: 'Booking Tempat',
    villa: 'Booking Villa'
  }[pemesanan.tipe] || pemesanan.tipe

  let bookingDetail = ''
  if (pemesanan.bookingTempat) {
    const bt = pemesanan.bookingTempat
    bookingDetail = `
      <div class="section">
        <div class="section-title">Detail Booking Tempat</div>
        <div class="row"><span>Lokasi</span><span>${bt.namaTempat}</span></div>
        <div class="row"><span>Tanggal</span><span>${formatTanggal(bt.tanggal)}</span></div>
        <div class="row"><span>Jam Mulai</span><span>${bt.waktu}</span></div>
        <div class="row"><span>Durasi</span><span>${bt.durasiJam} Jam</span></div>
        <div class="row"><span>Jumlah Orang</span><span>${bt.jumlahOrang}</span></div>
        <div class="divider"></div>
        <div class="row bold"><span>Subtotal Tempat</span><span>${formatRupiah(bt.subtotal)}</span></div>
      </div>
    `
  }

  if (pemesanan.bookingVilla) {
    const bv = pemesanan.bookingVilla
    bookingDetail = `
      <div class="section">
        <div class="section-title">Detail Booking Villa</div>
        <div class="row"><span>Check-in</span><span>${formatTanggal(bv.checkIn)}</span></div>
        <div class="row"><span>Check-out</span><span>${formatTanggal(bv.checkOut)}</span></div>
        <div class="row"><span>Jumlah Malam</span><span>${bv.jumlahMalam} malam</span></div>
        <div class="row"><span>Jumlah Tamu</span><span>${bv.jumlahTamu} orang</span></div>
        <div class="divider"></div>
        <div class="row bold"><span>Subtotal Villa</span><span>${formatRupiah(bv.subtotal)}</span></div>
      </div>
    `
  }

  let menuDetail = ''
  if (pemesanan.menu && pemesanan.menu.items.length > 0) {
    const items = pemesanan.menu.items.map(i => `
      <div class="row">
        <span>${i.nama} <span class="qty">×${i.qty}</span></span>
        <span>${formatRupiah(i.subtotal)}</span>
      </div>
    `).join('')
    menuDetail = `
      <div class="section">
        <div class="section-title">Menu Pesanan</div>
        ${items}
        <div class="divider"></div>
        <div class="row bold"><span>Subtotal Menu</span><span>${formatRupiah(pemesanan.menu.subtotal)}</span></div>
      </div>
    `
  }

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Struk - ${orderId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      background: #f5f5f0;
      color: #1a1a1a;
      min-height: 100vh;
      padding: 16px;
    }
    .receipt {
      max-width: 400px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a0f0a, #2d1a12);
      padding: 24px 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
      color: #FF8F00;
    }
    .header p {
      font-size: 11px;
      opacity: 0.7;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .badge {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 12px;
      background: rgba(255,143,0,0.15);
      border: 1px solid rgba(255,143,0,0.3);
      border-radius: 20px;
      font-size: 11px;
      color: #FF8F00;
    }
    .body { padding: 20px; }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
      padding: 12px;
      background: #fafaf7;
      border-radius: 8px;
      font-size: 12px;
    }
    .meta-item { display: flex; flex-direction: column; gap: 2px; }
    .meta-label { color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-value { font-weight: 600; font-size: 12px; }
    .section { margin-bottom: 16px; }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #eee;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      font-size: 13px;
    }
    .row.bold { font-weight: 600; }
    .qty { color: #888; font-size: 11px; }
    .divider { height: 1px; background: #eee; margin: 8px 0; }
    .total-section {
      margin-top: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #1a0f0a, #2d1a12);
      border-radius: 8px;
      color: #fff;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 3px 0;
      opacity: 0.8;
    }
    .total-row.main {
      font-size: 20px;
      font-weight: 700;
      opacity: 1;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.15);
    }
    .total-row.main span:last-child { color: #FF8F00; }
    .footer {
      text-align: center;
      padding: 16px 20px 24px;
      font-size: 11px;
      color: #888;
      border-top: 1px dashed #ddd;
    }
    .footer p { margin-bottom: 4px; }
    .footer .wa { color: #FF8F00; text-decoration: none; font-weight: 500; }
    .note {
      margin: 12px 20px 0;
      padding: 10px 12px;
      background: #fff8f0;
      border: 1px solid #ffe0b2;
      border-radius: 8px;
      font-size: 11px;
      color: #6d4c00;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }
    .note-icon { flex-shrink: 0; }
    .actions {
      padding: 0 20px 20px;
      display: flex;
      gap: 8px;
    }
    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s;
    }
    .btn:active { transform: scale(0.97); }
    .btn-primary { background: #FF8F00; color: #1a1a1a; }
    .btn-secondary { background: #f0f0f0; color: #333; }
    @media print {
      body { padding: 0; background: #fff; }
      .receipt { box-shadow: none; border-radius: 0; max-width: 100%; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Sky Cafe</h1>
      <p>Luxury Roastery</p>
      <div class="badge">${tipeLabel}</div>
    </div>
    <div class="body">
      <div class="meta">
        <div class="meta-item">
          <span class="meta-label">Order ID</span>
          <span class="meta-value">${orderId}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tanggal</span>
          <span class="meta-value">${tanggalStr}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Waktu</span>
          <span class="meta-value">${waktuStr}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Status</span>
          <span class="meta-value" style="color:#FF8F00">Pending</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Data Pemesan</div>
        <div class="row"><span>Nama</span><span>${pemesan.nama}</span></div>
        <div class="row"><span>WhatsApp</span><span>${pemesan.telepon}</span></div>
        ${pemesan.email ? `<div class="row"><span>Email</span><span>${pemesan.email}</span></div>` : ''}
      </div>

      ${bookingDetail}
      ${menuDetail}

      ${pemesanan.catatan ? `
      <div class="section">
        <div class="section-title">Catatan</div>
        <p style="font-size:13px;color:#555">${pemesanan.catatan}</p>
      </div>
      ` : ''}

      <div class="total-section">
        <div class="total-row"><span>Subtotal</span><span>${formatRupiah(pemesanan.subtotal)}</span></div>
        <div class="total-row"><span>Biaya Layanan</span><span>${formatRupiah(pemesanan.biayaLayanan)}</span></div>
        <div class="total-row main"><span>Total</span><span>${formatRupiah(pemesanan.total)}</span></div>
      </div>

      <div class="note">
        <span class="note-icon">*</span>
        <span>Total harga mungkin dikenakan biaya admin tambahan dari penyedia layanan pembayaran.</span>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-secondary" onclick="window.print()">Print</button>
      <button class="btn btn-primary" onclick="window.close()">Selesai</button>
    </div>

    <div class="footer">
      <p>Pesanan akan dikonfirmasi via WhatsApp</p>
      <p><a class="wa" href="https://wa.me/6285947522947">wa.me/6285947522947</a></p>
      <p style="margin-top:8px">Terima kasih telah memesan di Sky Cafe</p>
    </div>
  </div>
</body>
</html>`

  return html
}

/**
 * Open receipt in new tab/window (works on mobile)
 */
export function openReceipt(payload) {
  const html = generateReceiptHTML(payload)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
