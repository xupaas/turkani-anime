import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logout } from '@/lib/auth/actions'
import { Tv, Search, ShieldAlert, LogOut } from 'lucide-react'

export async function Navbar() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, display_name, role, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-wider text-rose-500">
          <Tv className="h-6 w-6" />
          <span>TURKANI<span className="text-white">.ME</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <Link href="/anime" className="hover:text-rose-500 transition-colors">Animeler</Link>
          <Link href="/forum" className="hover:text-rose-500 transition-colors">Forum</Link>
          <Link href="/calendar" className="hover:text-rose-500 transition-colors">Takvim</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 text-neutral-400 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {(profile?.role === 'ADMIN' || profile?.role === 'MODERATOR') && (
                <Link href="/admin" className="flex items-center gap-1 text-xs font-semibold bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-md border border-rose-500/20 hover:bg-rose-500/20 transition">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              
              <Link href={`/profile/${profile?.username}`} className="flex items-center gap-2 text-sm font-medium hover:text-rose-400 transition">
                <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-rose-500 font-bold border border-neutral-700">
                  {profile?.display_name?.[0]?.toUpperCase() || 'U'}
                </div>
              </Link>

              <form action={logout}>
                <button type="submit" className="p-2 text-neutral-400 hover:text-rose-500 transition" title="Çıkış Yap">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 transition">
                Giriş Yap
              </Link>
              <Link href="/register" className="text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg transition shadow-lg shadow-rose-600/20">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}