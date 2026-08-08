'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getSupabaseAdminClient() {
  const cookieStore = await cookies()
  return createServerClient(
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
          } catch {}
        },
      },
    }
  )
}

export async function createAnimeAction(formData: FormData) {
  const supabase = await getSupabaseAdminClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const poster_url = formData.get('poster_url') as string
  const banner_url = formData.get('banner_url') as string
  const release_year = parseInt(formData.get('release_year') as string) || new Date().getFullYear()
  const status = formData.get('status') as 'ONGOING' | 'COMPLETED' | 'UPCOMING' | 'CANCELLED'
  const type = formData.get('type') as 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL'
  const studio = formData.get('studio') as string

  const { error } = await supabase.from('anime').insert({
    title,
    slug,
    description,
    poster_url,
    banner_url,
    release_year,
    status,
    type,
    studio
  })

  if (error) return { error: error.message }
  redirect('/admin/anime')
}

export async function createEpisodeAction(formData: FormData) {
  const supabase = await getSupabaseAdminClient()

  const anime_id = formData.get('anime_id') as string
  const episode_number = parseInt(formData.get('episode_number') as string)
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const video_uid = formData.get('video_uid') as string

  const { error } = await supabase.from('episodes').insert({
    anime_id,
    episode_number,
    title,
    description,
    video_uid,
    status: 'READY'
  })

  if (error) return { error: error.message }
  redirect(`/admin/anime`)
}