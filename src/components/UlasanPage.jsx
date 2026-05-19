import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Review bawaan (hardcoded)
const defaultReviews = [
  { nama: 'Aldi', rating: 5, review: 'Kopi di sini juara banget! Tempatnya cozy, cocok buat kerja atau nongkrong santai. Pasti balik lagi.' },
  { nama: 'Cevin', rating: 4.5, review: 'Suasana outdoor-nya keren, sejuk dan estetik. Menu dessert-nya juga enak-enak. Recommended!' },
  { nama: 'Zahira', rating: 5, review: 'Pelayanannya ramah dan cepat. Latte-nya smooth banget, best latte yang pernah aku coba di kota ini.' },
  { nama: 'Dadang', rating: 4.5, review: 'Tempat yang bagus buat meeting atau quality time bareng keluarga. Villa-nya juga worth it, fasilitas lengkap.' }
]

function StarRating({ rating, interactive = false, onRate }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i
    const half = !filled && rating >= i - 0.5
    stars.push(
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => onRate(i) : undefined}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={{
            fontVariationSettings: `'FILL' ${filled || half ? 1 : 0}, 'wght' 300`,
            color: filled || half ? '#FF8F00' : 'rgba(255,255,255,0.2)'
          }}
        >
          {half ? 'star_half' : 'star'}
        </span>
      </button>
    )
  }
  return <div className="flex gap-0.5">{stars}</div>
}

function ReviewCard({ nama, rating, review, createdAt }) {
  // Generate avatar initials with random-ish color
  const initial = nama.charAt(0).toUpperCase()
  const colors = ['#FF8F00', '#e3beb8', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722']
  const colorIndex = nama.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div className="glass-panel rounded-xl border border-white/10 p-5 space-y-3 hover:border-secondary/30 transition-all">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-primary truncate">{nama}</p>
          {createdAt && (
            <p className="text-[10px] text-on-surface-variant">
              {new Date(createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <StarRating rating={rating} />
      </div>
      <p className="text-sm text-on-surface-variant leading-relaxed">{review}</p>
    </div>
  )
}

export default function UlasanPage() {
  const [userReviews, setUserReviews] = useState([])
  const [nama, setNama] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load reviews from Supabase
  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (data) setUserReviews(data)
    } catch (err) {
      // Silent fail, just show default reviews
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nama.trim() || !review.trim()) {
      setError('Nama dan ulasan wajib diisi.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('reviews')
        .insert({
          nama: nama.trim(),
          rating,
          review: review.trim()
        })

      if (dbError) throw dbError

      setSuccess(true)
      setNama('')
      setRating(5)
      setReview('')
      loadReviews()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Gagal mengirim ulasan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const allReviews = [
    ...userReviews.map((r) => ({ ...r, createdAt: r.created_at })),
    ...defaultReviews.map((r) => ({ ...r, createdAt: null }))
  ]

  // Calculate average
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '5.0'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel-heavy rounded-2xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8F00]/10 to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-playfair mb-2">Ulasan</h2>
            <p className="text-on-surface-variant">Apa kata mereka tentang Sky Cafe.</p>
          </div>
          <div className="flex items-center gap-3 glass-panel rounded-xl p-4 border border-white/10">
            <span className="text-3xl font-bold text-secondary">{avgRating}</span>
            <div>
              <StarRating rating={parseFloat(avgRating)} />
              <p className="text-[10px] text-on-surface-variant mt-1">{allReviews.length} ulasan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          {allReviews.map((r, idx) => (
            <ReviewCard key={idx} nama={r.nama} rating={r.rating} review={r.review} createdAt={r.createdAt} />
          ))}
        </div>

        {/* Write review form */}
        <div className="lg:col-span-1">
          <div className="glass-panel-heavy rounded-xl p-6 sticky top-28 border border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-secondary">rate_review</span>
              <h3 className="text-lg font-semibold font-playfair">Tulis Ulasan</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant block">Nama *</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface placeholder:text-white/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant block">Rating</label>
                <StarRating rating={rating} interactive onRate={setRating} />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant block">Ulasan *</label>
                <textarea
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda di Sky Cafe..."
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface resize-none placeholder:text-white/30"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              {success && (
                <div className="p-3 rounded-lg border border-green-500/40 bg-green-500/10 text-green-300 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Ulasan berhasil dikirim!
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#FF8F00] hover:bg-[#E67E00] text-[#0A0A0A] font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Mengirim...</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">send</span>Kirim Ulasan</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
