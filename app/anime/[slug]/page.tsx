import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Play, Film, Calendar, Star } from 'lucide-react'

export default async function AnimeDetailPage({ params }: { params: { slug: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: anime } = await supabase
    .from('anime')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!anime) notFound()

  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', anime.id)
    .order('episode_number', { ascending: true })

  return (
    <div className="space-y-8">
      {/* Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
        {anime.banner_url && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={anime.banner_url} alt="" className="h-full w-full object-cover blur-sm" />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-6">
          <div className="h-64 w-44 shrink-0 overflow-hidden rounded-xl bg-neutral-800 border border-neutral-700 shadow-xl">
            {anime.poster_url ? (
              <img src={anime.poster_url} alt={anime.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-600">
                <Film className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="space-y-4 flex-1">
            <h1 className="text-3xl font-extrabold text-white">{anime.title}</h1>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
              {anime.description || 'Bu anime için henüz bir açıklama eklenmedi.'}
            </p>

            <div className="flex flex-wrap gap-3 text-xs font-semibold text-neutral-300 pt-2">
              <span className="rounded-lg bg-neutral-800 px-3 py-1.5 border border-neutral-700">{anime.type}</span>
              <span className="rounded-lg bg-neutral-800 px-3 py-1.5 border border-neutral-700">{anime.status}</span>
              <span className="rounded-lg bg-neutral-800 px-3 py-1.5 border border-neutral-700 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                {anime.release_year}
              </span>
              {anime.studio && (
                <span className="rounded-lg bg-neutral-800 px-3 py-1.5 border border-neutral-700">
                  {anime.studio}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bölümler Listesi */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Play className="h-5 w-5 text-rose-500 fill-rose-500" />
          Bölümler
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {episodes && episodes.length > 0 ? (
            episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${ep.id}`}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-neutral-700 hover:bg-neutral-800/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{ep.episode_number}. Bölüm</div>
                    <div className="text-xs text-neutral-400 line-clamp-1">{ep.title || 'Bölüm'}</div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-neutral-500 text-sm">Henüz eklenmiş bölüm yok.</p>
          )}
        </div>
      </section>
    </div>
  )
}