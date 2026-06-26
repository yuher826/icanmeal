'use client'

import { useState } from 'react'
import Link from 'next/link'

const INSTITUTION_TYPES = ['어린이집', '유치원', '초등학교', '노인복지관', '요양원', '병원', '기타']

type Step = 1 | 2 | 3

interface FormData {
  email: string; password: string; passwordConfirm: string
  institutionName: string; institutionType: string; businessNumber: string; address: string
  contactName: string; phone: string
  agree: boolean; agreeMarketing: boolean
}

const INIT: FormData = {
  email: '', password: '', passwordConfirm: '',
  institutionName: '', institutionType: '', businessNumber: '', address: '',
  contactName: '', phone: '',
  agree: false, agreeMarketing: false,
}

const STEPS = [
  { num: 1, label: '계정 정보' },
  { num: 2, label: '기관 정보' },
  { num: 3, label: '담당자·동의' },
]

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(INIT)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function set(key: keyof FormData, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (step < 3) { setStep((step + 1) as Step); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>가입 신청이 완료되었습니다!</h2>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 28 }}>
            담당자 검토 후 <strong>영업일 1일 이내</strong>에 승인 메일을 보내드립니다.<br />
            승인 완료 후 모든 서비스를 이용하실 수 있습니다.
          </p>
          <Link href="/" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>홈으로 →</Link>
        </div>
      </section>
    )
  }

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--kids-coral),var(--silver-rose))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: 'var(--sans)' }}>I</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>ICANMEAL</span>
          </Link>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700, marginTop: 18, marginBottom: 4 }}>기관 회원가입</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>사업자 기관 전용 가입입니다.</p>
        </div>

        {/* 스텝 인디케이터 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= s.num ? 'var(--kids-coral)' : 'var(--cream-deep)',
                  color: step >= s.num ? '#fff' : 'var(--ink-soft)',
                  border: step === s.num ? '2.5px solid var(--kids-coral-deep)' : '2px solid transparent',
                  transition: 'all 0.25s',
                }}>{s.num}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: step >= s.num ? 'var(--kids-coral-deep)' : 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 48, height: 1.5, background: step > s.num ? 'var(--kids-coral)' : 'var(--line)', margin: '0 4px', marginBottom: 18, transition: 'background 0.25s' }} />
              )}
            </div>
          ))}
        </div>

        {/* 폼 카드 */}
        <div style={{ background: 'var(--white)', borderRadius: 20, border: '1px solid var(--line)', padding: '32px 28px', boxShadow: 'var(--shadow-card)' }}>
          <form onSubmit={handleNext}>
            {/* 스텝 1: 계정 정보 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>계정 정보 입력</h3>
                <div className="r-field">
                  <label>이메일 *</label>
                  <input type="email" required placeholder="example@org.kr" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="r-field">
                  <label>비밀번호 *</label>
                  <input type="password" required placeholder="8자 이상" minLength={8} value={form.password} onChange={e => set('password', e.target.value)} />
                </div>
                <div className="r-field">
                  <label>비밀번호 확인 *</label>
                  <input type="password" required placeholder="비밀번호 재입력" value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)} />
                </div>
              </div>
            )}

            {/* 스텝 2: 기관 정보 */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>기관 정보 입력</h3>
                <div className="r-field">
                  <label>기관명 *</label>
                  <input type="text" required placeholder="○○ 어린이집" value={form.institutionName} onChange={e => set('institutionName', e.target.value)} />
                </div>
                <div className="r-field">
                  <label>기관 유형 *</label>
                  <select required value={form.institutionType} onChange={e => set('institutionType', e.target.value)}>
                    <option value="">선택해주세요</option>
                    {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="r-field">
                  <label>사업자등록번호 *</label>
                  <input type="text" required placeholder="000-00-00000" value={form.businessNumber} onChange={e => set('businessNumber', e.target.value)} />
                </div>
                <div className="r-field">
                  <label>기관 주소</label>
                  <input type="text" placeholder="서울시 ○○구 ○○로 1" value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
              </div>
            )}

            {/* 스텝 3: 담당자·동의 */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>담당자 정보 · 약관 동의</h3>
                <div className="r-field">
                  <label>담당자명 *</label>
                  <input type="text" required placeholder="홍길동" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
                </div>
                <div className="r-field">
                  <label>연락처 *</label>
                  <input type="tel" required placeholder="010-0000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" required checked={form.agree} onChange={e => set('agree', e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--kids-coral)' }} />
                    <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                      <Link href="/terms" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>이용약관</Link> 및 <Link href="/privacy" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>개인정보처리방침</Link>에 동의합니다. (필수)
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.agreeMarketing} onChange={e => set('agreeMarketing', e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--kids-coral)' }} />
                    <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>마케팅·프로모션 정보 수신에 동의합니다. (선택)</span>
                  </label>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep((step - 1) as Step)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '13px' }}>이전</button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-cta"
                style={{ flex: 2, justifyContent: 'center', padding: '13px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '처리 중…' : step < 3 ? '다음 →' : '가입 신청 완료'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>이미 계정이 있으신가요? </span>
            <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 700, color: 'var(--kids-coral-deep)' }}>로그인</Link>
          </div>
        </div>
      </div>

      <style>{`
        .r-field { display: flex; flex-direction: column; gap: 6px; }
        .r-field label { font-size: 13px; font-weight: 700; color: var(--ink-soft); }
        .r-field input, .r-field select {
          padding: 12px 14px; border-radius: 10px; border: 1.5px solid var(--line);
          font-size: 14px; font-family: var(--sans); color: var(--ink);
          background: var(--cream); outline: none; transition: border-color 0.2s;
        }
        .r-field input:focus, .r-field select:focus { border-color: var(--kids-coral); }
      `}</style>
    </section>
  )
}
