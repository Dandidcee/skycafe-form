import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function GalleryPage() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchGallery() }, [])

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('urutan').order('created_at', { ascending: false })
    setPhotos(data || [])
    setLoading(false)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `gallery/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('assets').upload(fileName, file)
    if (uploadError) {
      alert('Gagal upload: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)

    await supabase.from('gallery').insert({ url: publicUrl, caption: '' })
    setUploading(false)
    fetchGallery()
  }

  const handleDelete = async (photo) => {
    if (!confirm('Hapus foto ini?')) return

    // Extract path from URL
    const urlParts = photo.url.split('/assets/')
    if (urlParts.length > 1) {
      await supabase.storage.from('assets').remove([urlParts[1]])
    }

    await supabase.from('gallery').delete().eq('id', photo.id)
    fetchGallery()
  }

  const updateCaption = async (id, caption) => {
    await supabase.from('gallery').update({ caption }).eq('id', id)
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, caption } : p))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Galeri</h2>
        <label className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-500 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">upload</span>
          {uploading ? 'Uploading...' : 'Upload Foto'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="material-symbols-outlined text-5xl mb-3">photo_library</span>
          <p>Belum ada foto. Upload foto pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
              <img src={photo.url} alt={photo.caption || ''} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <input
                  type="text"
                  value={photo.caption || ''}
                  onChange={(e) => updateCaption(photo.id, e.target.value)}
                  placeholder="Caption..."
                  className="bg-transparent border-b border-white/30 text-white text-xs py-1 focus:outline-none focus:border-primary mb-2"
                />
                <button
                  onClick={() => handleDelete(photo)}
                  className="self-end p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
