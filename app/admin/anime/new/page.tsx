'use client'

import { useState } from 'react'
import { createAnimeAction } from '@/lib/admin/actions'

export default function NewAnimePage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await createAnimeAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Yeni Anime Ekle</h1>
        <p className="text-sm text-neutral-400">Veritabanına yeni bir anime serisi veya film tanımlayın.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Anime Adı</label>
          <input name="title" required placeholder="Attack on Titan" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">URL Slug (Benzersiz)</label>
          <input name="slug" required placeholder="attack-on-titan" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Açıklama / Özet</label>
          <textarea name="description" rows={4} placeholder="Anime hakkında genel bilgi..." className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Poster Görsel URL</label>
            <input name="poster_url" placeholder="https://..." className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Banner Görsel URL</label>
            <input name="banner_url" placeholder="https://..." className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Çıkış Yılı</label>
            <input name="release_year" type="number" defaultValue={2026} className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Durum</label>
            <select name="status" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none">
              <option value="ONGOING">Devam Ediyor (ONGOING)</option>
              <option value="COMPLETED">Tamamlandı (COMPLETED)</option>
              <option value="UPCOMING">Gelecek (UPCOMING)</option>
              <option value="CANCELLED">İptal Edildi (CANCELLED)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Tür</label>
            <select name="type" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none">
              <option value="TV">TV Serisi</option>
              <option value="MOVIE">Film</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="SPECIAL">Özel Bölüm</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Stüdyo</label>
          <input name="studio" placeholder="MAPPA / Wit Studio" className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white focus:border-rose-500 focus:outline-none" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-rose-600 px-6 py-2.5 font-semibold text-white hover:bg-rose-500 disabled:opacity-50 transition"
        >
          {loading ? 'Kaydediliyor...' : 'Animeyi Kaydet'}
        </button>
      </form>
    </div>
  )
}