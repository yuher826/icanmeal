'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import { SITE_CONFIG } from '@/constants'

const INSTITUTION_TYPES = ['어린이집', '유치원', '초등학교', '노인복지관', '요양원', '병원', '기타']

interface FormData {
  institutionName: string
  institutionType: string
  businessNumber: string
  contactName: string
  contactTitle: string
  phone: string
  email: string
  kitLine: string
  headcount: string
  startDate: string
  message: string
  agree: boolean
}

export default function InquiryPage() {
  const [form, setForm] = useState<FormData>({
    institutionName: '', institutionType: '', businessNumber: '',
    contactName: '', contactTitle: '', phone: '', email: '',
    kitLine: '', headcount: '', startDate: '', message: '', agree: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(key: keyof FormData, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.agree) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>문의가 접수되었습니다</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
            영업일 1일 이내에 담당자가 입력하신 연락처로 연락드립니다.
          </p>
          <Link href="/" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>홈으로 돌아가기</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))', padding: '64px 0 48px' }}>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <span className="eyebrow">Institution Inquiry</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 12 }}>
              기관 주문 · 문의
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 440 }}>
              기관 유형·인원·일정을 알려주시면 맞춤 제안을 영업일 1일 이내에 보내드립니다.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── 본문: 문의 정보 + 폼 ── */}
      <section>
        <div className="wrap">
          <div className="inq-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 56, alignItems: 'flex-start' }}>

            {/* 좌: 연락처 정보 */}
            <ScrollAnimation animation="left">
              <div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>연락처 안내</h3>
                {[
                  { label: '전화', value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone}` },
                  { label: '이메일', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  { label: '운영 시간', value: '평일 09:00 – 18:00', href: null },
                  { label: '주소', value: SITE_CONFIG.address, href: null },
                ].map(info => (
                  <div key={info.label} style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em' }}>{info.label}</div>
                    {info.href
                      ? <a href={info.href} style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{info.value}</a>
                      : <span style={{ fontSize: 15, color: 'var(--ink)' }}>{info.value}</span>}
                  </div>
                ))}

                <div style={{ marginTop: 28, padding: '20px 22px', borderRadius: 14, background: 'var(--kids-tint)', border: '1px solid rgba(227,107,59,0.15)' }}>
                  <h5 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>💡 기관 회원이신가요?</h5>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
                    회원 로그인 후 문의하시면 기관 정보가 자동으로 입력됩니다.
                  </p>
                  <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 700, color: 'var(--kids-coral-deep)' }}>로그인 하기 →</Link>
                </div>
              </div>
            </ScrollAnimation>

            {/* 우: 폼 */}
            <ScrollAnimation animation="right">
              <form onSubmit={handleSubmit} className="form-card" style={{ background: 'var(--white)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>문의 내용 작성</h3>

                {/* 기관 정보 */}
                <fieldset style={{ border: 'none', padding: 0, marginBottom: 24 }}>
                  <legend style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.06em', marginBottom: 14 }}>기관 정보</legend>
                  <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div className="field">
                      <label>기관명 *</label>
                      <input type="text" required placeholder="○○ 어린이집" value={form.institutionName} onChange={e => set('institutionName', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>기관 유형 *</label>
                      <select required value={form.institutionType} onChange={e => set('institutionType', e.target.value)}>
                        <option value="">선택</option>
                        {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>사업자등록번호</label>
                    <input type="text" placeholder="000-00-00000" value={form.businessNumber} onChange={e => set('businessNumber', e.target.value)} />
                  </div>
                </fieldset>

                {/* 담당자 정보 */}
                <fieldset style={{ border: 'none', padding: 0, marginBottom: 24 }}>
                  <legend style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.06em', marginBottom: 14 }}>담당자 정보</legend>
                  <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div className="field">
                      <label>담당자명 *</label>
                      <input type="text" required placeholder="홍길동" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>직책</label>
                      <input type="text" placeholder="원장·팀장 등" value={form.contactTitle} onChange={e => set('contactTitle', e.target.value)} />
                    </div>
                  </div>
                  <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="field">
                      <label>연락처 *</label>
                      <input type="tel" required placeholder="010-0000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>이메일 *</label>
                      <input type="email" required placeholder="example@org.kr" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                  </div>
                </fieldset>

                {/* 문의 내용 */}
                <fieldset style={{ border: 'none', padding: 0, marginBottom: 24 }}>
                  <legend style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.06em', marginBottom: 14 }}>문의 내용</legend>
                  <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div className="field">
                      <label>희망 키트</label>
                      <select value={form.kitLine} onChange={e => set('kitLine', e.target.value)}>
                        <option value="">선택</option>
                        <option value="kids">키즈</option>
                        <option value="silver">실버</option>
                        <option value="both">키즈 + 실버</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>예상 인원</label>
                      <input type="number" placeholder="20" min="1" value={form.headcount} onChange={e => set('headcount', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>희망 시작일</label>
                      <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label>문의 내용</label>
                    <textarea placeholder="수업 횟수, 특이사항, 알러지 고려 사항 등 자유롭게 적어주세요." style={{ minHeight: 100, resize: 'vertical' }} value={form.message} onChange={e => set('message', e.target.value)} />
                  </div>
                </fieldset>

                {/* 동의 + 제출 */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                  <input type="checkbox" required checked={form.agree} onChange={e => set('agree', e.target.checked)} style={{ marginTop: 3, flexShrink: 0, accentColor: 'var(--kids-coral)' }} />
                  <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                    <Link href="/privacy" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>개인정보처리방침</Link>에 동의하며 위 내용이 문의 목적으로 수집·이용되는 것에 동의합니다. *
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? '전송 중…' : '문의 전송하기'}
                </button>
              </form>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <style>{`
        .form-card { padding: 36px 32px; border-radius: 20px; border: 1px solid var(--line); }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 13px; font-weight: 700; color: var(--ink-soft); }
        .field input, .field select, .field textarea {
          padding: 11px 14px; border-radius: 10px; border: 1.5px solid var(--line);
          font-size: 14px; font-family: var(--sans); color: var(--ink);
          background: var(--cream); transition: border-color 0.2s;
          outline: none;
        }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--kids-coral); }
        @media (max-width: 840px) {
          .inq-layout { grid-template-columns: 1fr !important; }
          .field-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
