import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Film } from 'lucide-react'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: animeList } = await supabase
    .from('anime')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-rose-950/40 via-neutral-900 to-neutral-900 p-8 md:p-12">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          Türkani'ye Hoş Geldiniz
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
          En Popüler Animeleri <span className="text-rose-500">HD Kalitede</span> Keşfet
        </h1>
        <p className="text-sm md:text-base text-neutral-400 mt-3 max-w-xl">
          Binlerce anime serisini ve filmini Türkçe altyazıyla kesintisiz izle, favorilerini listele ve izleme geçmişini takip et.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Film className="h-5 w-5 text-rose-500" />
          Son Eklenen Animeler
        </h2>

        {animeList && animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animeList.map((anime) => (
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
          <div className="text-center py-16 text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-xl">
            Henüz veritabanında anime bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}