'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    setError('현재 서비스 준비 중입니다. 기관 문의를 이용해 주세요.')
  }

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--kids-coral),var(--silver-rose))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: 'var(--sans)' }}>I</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>ICANMEAL</span>
          </Link>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, marginTop: 20, marginBottom: 6 }}>기관 로그인</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
            기관 담당자 계정으로 로그인하세요.
          </p>
        </div>

        {/* 폼 카드 */}
        <div style={{ background: 'var(--white)', borderRadius: 20, border: '1px solid var(--line)', padding: '36px 32px', boxShadow: 'var(--shadow-card)' }}>
          <form onSubmit={handleSubmit}>
            <div className="a-field">
              <label>이메일</label>
              <input
                type="email" required autoComplete="email"
                placeholder="example@org.kr"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="a-field" style={{ marginTop: 14 }}>
              <label>비밀번호</label>
              <input
                type="password" required autoComplete="current-password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: 'var(--kids-coral-deep)', background: '#FFF0ED', border: '1px solid #FDDBD3', borderRadius: 8, padding: '10px 14px', marginTop: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 20 }}>
              <Link href="/auth/reset-password" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>비밀번호 찾기</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cta"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>아직 기관 계정이 없으신가요? </span>
            <Link href="/auth/register" style={{ fontSize: 14, fontWeight: 700, color: 'var(--kids-coral-deep)' }}>기관 회원가입</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/inquiry" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            가입 전 먼저 문의하기 →
          </Link>
        </div>
      </div>

      <style>{`
        .a-field { display: flex; flex-direction: column; gap: 6px; }
        .a-field label { font-size: 13px; font-weight: 700; color: var(--ink-soft); }
        .a-field input {
          padding: 12px 14px; border-radius: 10px; border: 1.5px solid var(--line);
          font-size: 15px; font-family: var(--sans); color: var(--ink);
          background: var(--cream); outline: none; transition: border-color 0.2s;
        }
        .a-field input:focus { border-color: var(--kids-coral); }
      `}</style>
    </section>
  )
}
