import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component içinden çağrılırsa yoksayılır
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { episode_id, progress_seconds, duration_seconds } = await request.json()

    if (!episode_id || progress_seconds === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const completed = duration_seconds > 0 && (progress_seconds / duration_seconds) >= 0.9

    const { error } = await supabase
      .from('watch_history')
      .upsert({
        user_id: user.id,
        episode_id,
        progress_seconds: Math.floor(progress_seconds),
        duration_seconds: Math.floor(duration_seconds || 0),
        completed,
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,episode_id'
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}