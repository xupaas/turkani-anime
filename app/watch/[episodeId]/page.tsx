import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { VideoPlayer } from '@/components/video/Player'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default async function WatchPage({ params }: { params: { episodeId: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { data: episode } = await supabase
    .from('episodes')
    .select('*, anime(id, title, slug)')
    .eq('id', params.episodeId)
    .single()

  if (!episode) notFound()

  // Kullanıcının kaldığı saniyeyi getir
  let initialProgress = 0
  if (user) {
    const { data: history } = await supabase
      .from('watch_history')
      .select('progress_seconds')
      .eq('user_id', user.id)
      .eq('episode_id', episode.id)
      .single()

    if (history) initialProgress = history.progress_seconds
  }

  // Sonraki ve Önceki Bölümleri Getir
  const { data: prevEp } = await supabase
    .from('episodes')
    .select('id')
    .eq('anime_id', episode.anime_id)
    .eq('episode_number', episode.episode_number - 1)
    .single()

  const { data: nextEp } = await supabase
    .from('episodes')
    .select('id')
    .eq('anime_id', episode.anime_id)
    .eq('episode_number', episode.episode_number + 1)
    .single()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Head Navigation */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <Link href={`/anime/${episode.anime?.slug}`} className="font-semibold text-rose-500 hover:underline">
            {episode.anime?.title}
          </Link>
          <span className="text-neutral-500 mx-2">/</span>
          <span className="text-neutral-300">{episode.episode_number}. Bölüm</span>
        </div>
      </div>

      {/* Cloudflare Player */}
      <VideoPlayer
        episodeId={episode.id}
        videoUid={episode.video_uid}
        initialProgress={initialProgress}
      />

      {/* Navigasyon Butonları */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
        {prevEp ? (
          <Link
            href={`/watch/${prevEp.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-neutral-300 hover:text-white transition"
          >
            <ChevronLeft className="h-4 w-4" /> Önceki Bölüm
          </Link>
        ) : <div />}

        {nextEp ? (
          <Link
            href={`/watch/${nextEp.id}`}
            className="flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition"
          >
            Sonraki Bölüm <ChevronRight className="h-4 w-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}