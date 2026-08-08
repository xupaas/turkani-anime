'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Search, Film, Filter, Loader2 } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true)
      let builder = supabase.from('anime').select('*')

      if (query.trim()) {
        builder = builder.ilike('title', `%${query.trim()}%`)
      }
      if (selectedType !== 'ALL') {
        builder = builder.eq('type', selectedType)
      }
      if (selectedStatus !== 'ALL') {
        builder = builder.eq('status', selectedStatus)
      }

      const { data } = await builder.order('created_at', { ascending: false })
      setResults(data || [])
      setLoading(false)
    }

    const timer = setTimeout(() => {
      fetchAnime()
    }, 300)

    return () => clearTimeout(timer)
  }, [query, selectedType, selectedStatus])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search className="h-6 w-6 text-rose-500" />
          Anime Ara & Filtrele
        </h1>
        <p className="text-sm text-neutral-400">İsme, türe veya yayın durumuna göre tüm içeriklerde arama yapın.</p>
      </div>

      {/* Arama ve Filtre Barları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Anime adı yazın... (Örn: Attack on Titan)"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none transition"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none transition"
          >
            <option value="ALL">Tüm Türler</option>
            <option value="TV">TV Serisi</option>
            <option value="MOVIE">Film</option>
            <option value="OVA">OVA</option>
            <option value="ONA">ONA</option>
            <option value="SPECIAL">Özel Bölüm</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none transition"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="ONGOING">Devam Ediyor</option>
            <option value="COMPLETED">Tamamlandı</option>
            <option value="UPCOMING">Gelecek</option>
            <option value="CANCELLED">İptal Edildi</option>
          </select>
        </div>
      </div>

      {/* Sonuç Listesi */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            <span>Aranıyor...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.slug}`}
                className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                  {anime.poster_url ? (
                    <img
                      src={anime.poster_url}
                      alt={anime.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600">
                      <Film className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-xs font-bold text-white group-hover:text-rose-400 transition">
                    {anime.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                    <span>{anime.type}</span>
                    <span>•</span>
                    <span>{anime.release_year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-500 text-sm">
            Aramanızla eşleşen anime bulunamadı.
          </div>
        )}
      </div>
    </div>
  )
}