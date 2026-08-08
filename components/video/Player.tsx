'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  episodeId: string
  videoUid: string
  initialProgress?: number
  onEnded?: () => void
}

export function VideoPlayer({ episodeId, videoUid, initialProgress = 0, onEnded }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lastSavedTime = useRef<number>(initialProgress)

  const syncProgress = async (currentTime: number, duration: number) => {
    if (Math.abs(currentTime - lastSavedTime.current) < 5) return

    lastSavedTime.current = currentTime
    try {
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episode_id: episodeId,
          progress_seconds: currentTime,
          duration_seconds: duration
        })
      })
    } catch (e) {
      console.error('Progress sync error:', e)
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data)
          if (data.event === 'timeupdate') {
            syncProgress(data.currentTime, data.duration)
          } else if (data.event === 'ended') {
            if (onEnded) onEnded()
          }
        } catch (_) {}
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [episodeId])

  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || ''
  const iframeSrc = `https://customer-${accountId}.cloudflarestream.com/${videoUid}/iframe?startTime=${initialProgress}s&preload=true&autoplay=false`

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl border border-neutral-800">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="h-full w-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      />
    </div>
  )
}