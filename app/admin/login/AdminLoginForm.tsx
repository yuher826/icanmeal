'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { ADMIN_DENIAL_MESSAGE, type AdminAuthDenial } from '@/lib/admin-auth-messages'

interface Props {
  denied?: string
  nextPath: string
}

export default function AdminLoginForm({ denied, nextPath }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    denied && denied in ADMIN_DENIAL_MESSAGE
      ? ADMIN_DENIAL_MESSAGE[denied as AdminAuthDenial]
      : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()

    /* ① 이메일/비밀번호 인증 */
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError || !data.user) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    /* ② 관리자 여부 확인
       admins RLS 는 `auth_id = auth.uid() OR is_admin()` 이라
       본인 행은 is_active 와 무관하게 읽힌다.
       덕분에 "관리자 아님" 과 "비활성 관리자" 를 구분해 안내할 수 있다. */
    const { data: adminRow, error: adminError } = await supabase
      .from('admins')
      .select('id, is_active, deleted_at')
      .eq('auth_id', data.user.id)
      .maybeSingle()

    /* ③ 관리자가 아니면 즉시 로그아웃 — 세션을 남겨두지 않는다 */
    if (adminError || !adminRow || adminRow.deleted_at) {
      await supabase.auth.signOut()
      setError(ADMIN_DENIAL_MESSAGE.not_admin)
      setLoading(false)
      return
    }

    if (!adminRow.is_active) {
      await supabase.auth.signOut()
      setError(ADMIN_DENIAL_MESSAGE.inactive)
      setLoading(false)
      return
    }

    /* ④ 통과 — 서버 컴포넌트가 새 세션 쿠키를 읽도록 refresh 후 이동 */
    const safeNext = nextPath.startsWith('/admin') ? nextPath : '/admin/institutions'
    router.replace(safeNext)
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        background: 'linear-gradient(160deg, var(--cream-deep), var(--cream))',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 16 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo_mark.png"
              alt=""
              aria-hidden="true"
              style={{ width: 30, height: 30, objectFit: 'contain' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo_wordmark.png"
              alt="ICANMEAL"
              style={{ height: 15, objectFit: 'contain' }}
            />
          </Link>
          <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em' }}>
            관리자 로그인
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 5 }}>
            아이캔밀 운영 관리자 전용 페이지입니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-card"
          style={{ padding: '26px 24px', boxShadow: 'var(--shadow-card)' }}
        >
          {error && (
            <div className="admin-alert admin-alert-error" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="admin-email"
                style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)' }}
              >
                이메일
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                className="admin-input"
                placeholder="admin@icanmeal.kr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="admin-password"
                style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)' }}
              >
                비밀번호
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', marginTop: 20, padding: '12px' }}
          >
            {loading ? '확인 중…' : '로그인'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12.5 }}>
          <Link href="/" style={{ color: 'var(--ink-soft)' }}>
            ← 사이트로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
