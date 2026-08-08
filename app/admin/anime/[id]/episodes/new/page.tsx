'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { createEpisodeAction } from '@/lib/admin/actions'

export default function NewEpisodePage() {
  const params = useParams()
  const animeId = params.id as string
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('anime_id', animeId)
    const res = await createEpisodeAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Yeni Bölüm Ekle</h1>
        <p className="text-sm text-neutral-400">Cloudflare Stream Video ID ile animeye yeni bir bölüm bağlayın.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Bölüm Numarası</label>
          <input name="episode_number" type="number" required defaultValue={1} className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Bölüm Başlığı</label>
          <input name="title" required placeholder="1. Bölüm - Başlangıç" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Cloudflare Video UID</label>
          <input name="video_uid" required placeholder="Cloudflare Stream'den aldığınız Video ID" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Açıklama (Opsiyonel)</label>
          <textarea name="description" rows={3} placeholder="Bölüm hakkında kısa özet..." className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-rose-600 px-6 py-2.5 font-semibold text-white hover:bg-rose-500 disabled:opacity-50 transition"
        >
          {loading ? 'Ekleniyor...' : 'Bölümü Yayınla'}
        </button>
      </form>
    </div>
  )
}