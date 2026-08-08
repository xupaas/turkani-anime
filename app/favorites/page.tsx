import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, Film } from 'lucide-react'

export default async function FavoritesPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*, anime(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
          Favori Animelerim
        </h1>
        <p className="text-sm text-neutral-400">Kaydettiğiniz tüm animeler burada listelenir.</p>
      </div>

      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((item) => {
            const anime = item.anime
            if (!anime) return null

            return (
              <Link
                key={item.id}
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
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-xl">
          Henüz favorilerinize bir anime eklemediniz.
        </div>
      )}
    </div>
  )
}