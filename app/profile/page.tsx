import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { History, Play, User as UserIcon } from 'lucide-react'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: history } = await supabase
    .from('watch_history')
    .select('*, episodes(*, anime(title, slug, poster_url))')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Kullanıcı Kartı */}
      <div className="flex items-center gap-4 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60">
        <div className="h-16 w-16 rounded-full bg-rose-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg shadow-rose-600/20">
          {profile?.username?.[0] || user.email?.[0] || 'U'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{profile?.username || 'Kullanıcı'}</h1>
          <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
          <span className="inline-block mt-2 text-[10px] uppercase font-bold bg-neutral-800 text-rose-400 px-2.5 py-1 rounded-md border border-neutral-700">
            {profile?.role || 'USER'}
          </span>
        </div>
      </div>

      {/* İzleme Geçmişi */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="h-5 w-5 text-rose-500" />
          İzleme Geçmişi
        </h2>

        {history && history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((item) => {
              const ep = item.episodes
              if (!ep) return null

              return (
                <Link
                  key={item.id}
                  href={`/watch/${ep.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition group"
                >
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                    {ep.anime?.poster_url && (
                      <img src={ep.anime.poster_url} alt="" className="h-full w-full object-cover group-hover:scale-105 transition" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white group-hover:text-rose-400 transition truncate">
                      {ep.anime?.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                      {ep.episode_number}. Bölüm {ep.title && `- ${ep.title}`}
                    </p>
                    <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <Play className="h-3 w-3 fill-rose-500" />
                      Kaldığı Yer: {formatSeconds(item.progress_seconds)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-xl">
            Henüz izleme geçmişiniz bulunmuyor. Bir bölüm izlediğinizde otomatik buraya yansıyacaktır.
          </div>
        )}
      </section>
    </div>
  )
}