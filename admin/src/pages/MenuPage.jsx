import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ kategori: '', nama: '', harga: '', tersedia: true })

  useEffect(() => { fetchMenu() }, [])

  const fetchMenu = async () => {
    const { data } = await supabase.from('menu_items').select('*').order('kategori').order('urutan')
    setItems(data || [])
    setLoading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const row = { kategori: form.kategori, nama: form.nama, harga: parseInt(form.harga), tersedia: form.tersedia }

    if (editItem) {
      await supabase.from('menu_items').update(row).eq('id', editItem.id)
    } else {
      await supabase.from('menu_items').insert(row)
    }

    setShowForm(false)
    setEditItem(null)
    setForm({ kategori: '', nama: '', harga: '', tersedia: true })
    fetchMenu()
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setForm({ kategori: item.kategori, nama: item.nama, harga: item.harga.toString(), tersedia: item.tersedia })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus menu ini?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    fetchMenu()
  }

  const toggleTersedia = async (item) => {
    await supabase.from('menu_items').update({ tersedia: !item.tersedia }).eq('id', item.id)
    fetchMenu()
  }

  const kategoris = [...new Set(items.map((i) => i.kategori))]

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button
          onClick={() => { setEditItem(null); setForm({ kategori: '', nama: '', harga: '', tersedia: true }); setShowForm(true) }}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-500 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tambah Menu
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editItem ? 'Edit Menu' : 'Tambah Menu'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase">Kategori</label>
                <input
                  type="text"
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  placeholder="Coffee, Non Coffee, Dessert..."
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  required
                  list="kategori-list"
                />
                <datalist id="kategori-list">
                  {kategoris.map((k) => <option key={k} value={k} />)}
                </datalist>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">Harga (Rp)</label>
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.tersedia}
                  onChange={(e) => setForm({ ...form, tersedia: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label className="text-sm text-gray-300">Tersedia</label>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg bg-gray-800 text-gray-400 hover:text-white">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-black font-bold hover:bg-orange-500">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu list by category */}
      <div className="space-y-6">
        {kategoris.map((kat) => (
          <div key={kat}>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">{kat}</h3>
            <div className="space-y-2">
              {items.filter((i) => i.kategori === kat).map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.tersedia ? 'border-gray-800 bg-gray-900' : 'border-gray-800/50 bg-gray-900/50 opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTersedia(item)} className={`w-3 h-3 rounded-full ${item.tersedia ? 'bg-green-400' : 'bg-gray-600'}`} title={item.tersedia ? 'Tersedia' : 'Tidak tersedia'} />
                    <div>
                      <p className="font-medium">{item.nama}</p>
                      <p className="text-sm text-primary">Rp {item.harga.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
