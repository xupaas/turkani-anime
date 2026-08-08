'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  animeId: string
  initialIsFavorite: boolean
  userId?: string
}

export function FavoriteButton({ animeId, initialIsFavorite, userId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const toggleFavorite = async () => {
    if (!userId) {
      alert('Favorilere eklemek için giriş yapmalısınız.')
      return
    }

    setLoading(true)

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('anime_id', animeId)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: userId, anime_id: animeId })
      setIsFavorite(true)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold border transition ${
        isFavorite
          ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700'
          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600'
      }`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-white' : ''}`} />
      {isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}
    </button>
  )
}