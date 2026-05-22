import { useState } from 'react'
import { supabase } from '../lib/supabase'
import OrdersPage from './OrdersPage'
import MenuPage from './MenuPage'
import GalleryPage from './GalleryPage'
import SettingsPage from './SettingsPage'

const navItems = [
  { id: 'orders', label: 'Pesanan', icon: 'receipt_long' },
  { id: 'menu', label: 'Menu', icon: 'restaurant_menu' },
  { id: 'gallery', label: 'Galeri', icon: 'photo_library' },
  { id: 'settings', label: 'Pengaturan', icon: 'settings' },
]

export default function Dashboard() {
  const [activePage, setActivePage] = useState('orders')

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const renderPage = () => {
    switch (activePage) {
      case 'orders': return <OrdersPage />
      case 'menu': return <MenuPage />
      case 'gallery': return <GalleryPage />
      case 'settings': return <SettingsPage />
      default: return <OrdersPage />
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-primary">Sky Cafe</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                activePage === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {renderPage()}
      </main>
    </div>
  )
}
