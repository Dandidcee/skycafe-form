// Format currency to Indonesian Rupiah
export const formatRupiah = (value) => {
  if (typeof value !== 'number') return 'Rp 0'
  return `Rp ${value.toLocaleString('id-ID')}`
}

// Format date to readable Indonesian format
export const formatTanggal = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Generate unique order ID
export const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SKY-${ts}-${rand}`
}

// Calculate days between two dates
export const calculateDays = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end - start
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}
