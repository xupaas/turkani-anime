'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/auth/actions'
import { Tv, KeyRound, Mail } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-rose-500 mb-2">
            <Tv className="h-7 w-7" />
            <span>TURKANI<span className="text-white">.ME</span></span>
          </Link>
          <h2 className="text-xl font-bold text-white">Hesabınıza Giriş Yapın</h2>
          <p className="mt-1 text-sm text-neutral-400">Anime dünyasına kaldığınız yerden devam edin</p>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400 text-center">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                name="email"
                type="email"
                required
                placeholder="ornek@turkani.me"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Şifre
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50 transition shadow-lg shadow-rose-600/20"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="text-center text-sm text-neutral-400">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="font-semibold text-rose-500 hover:text-rose-400 transition">
            Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  )
}