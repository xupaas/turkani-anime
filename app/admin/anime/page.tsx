import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Plus, Film, Tv } from 'lucide-react'

export default async function AdminAnimeListPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() }, setAll() {} },
    }
  )

  const { data: animeList } = await supabase
    .from('anime')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Anime Listesi</h1>
          <p className="text-sm text-neutral-400">Sistemdeki tüm animeleri yönetin ve yeni bölümler ekleyin.</p>
        </div>
        <Link
          href="/admin/anime/new"
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition"
        >
          <Plus className="h-4 w-4" />
          Yeni Anime Ekle
        </Link>
      </div>

      <div className="grid gap-4">
        {animeList && animeList.length > 0 ? (
          animeList.map((anime) => (
            <div
              key={anime.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 transition hover:border-neutral-700"
            >
              <div className="flex items-center gap-4">
                {anime.poster_url ? (
                  <img src={anime.poster_url} alt={anime.title} className="h-16 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-neutral-800 text-neutral-600">
                    <Film className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white">{anime.title}</h3>
                  <div className="flex gap-2 text-xs text-neutral-400 mt-1">
                    <span className="rounded bg-neutral-800 px-2 py-0.5">{anime.type}</span>
                    <span className="rounded bg-neutral-800 px-2 py-0.5">{anime.status}</span>
                    <span>{anime.release_year}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/admin/anime/${anime.id}/episodes/new`}
                className="flex items-center gap-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-rose-400 px-3 py-2 rounded-lg border border-neutral-700 transition"
              >
                <Tv className="h-3.5 w-3.5" />
                Bölüm Ekle
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-neutral-500 text-sm">
            Henüz eklenmiş bir anime bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}