import Link from 'next/link'
import { LayoutDashboard, Film, PlusCircle, Users, Settings } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] gap-6">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 backdrop-blur-md">
        <div className="mb-6 px-3 py-2 font-bold text-rose-500 uppercase tracking-wider text-xs">
          Yönetim Paneli
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
            <LayoutDashboard className="h-4 w-4" />
            Özet / İstatistik
          </Link>
          <Link href="/admin/anime" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
            <Film className="h-4 w-4" />
            Anime Listesi
          </Link>
          <Link href="/admin/anime/new" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
            <PlusCircle className="h-4 w-4" />
            Yeni Anime Ekle
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-md">
        {children}
      </main>
    </div>
  )
}