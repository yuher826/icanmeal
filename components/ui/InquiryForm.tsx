'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScrollAnimation from './ScrollAnimation'
import { SITE_CONFIG } from '@/constants'

const KIT_LINE_OPTIONS = [
  { value: 'kids', label: 'Kids ICANMEAL' },
  { value: 'silver', label: 'Silver ICANMEAL' },
  { value: 'both', label: '둘 다 검토 중' },
] as const

interface FormData {
  institutionName: string
  contactName: string
  phone: string
  email: string
  kitLine: string
  headcount: string
  schedule: string
  programType: string
  message: string
}

export default function InquiryForm() {
  const [form, setForm] = useState<FormData>({
    institutionName: '', contactName: '', phone: '', email: '',
    kitLine: 'kids', headcount: '', schedule: '', programType: '월간 정기 프로그램', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(key: keyof FormData, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>문의가 접수되었습니다</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 400, margin: '0 auto 28px' }}>
            담당 매니저가 1~2일 내 입력하신 연락처로 맞춤 제안을 보내드립니다.
          </p>
          <Link href="/" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>홈으로 돌아가기</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ════════════════════════════════════════
          본문: 안내 + 폼
          ════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 80px' }}>
        <div className="wrap">
          <div className="inq-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 56, alignItems: 'flex-start' }}>

            {/* 좌: 안내 */}
            <ScrollAnimation animation="left">
              <span className="eyebrow">Institution Inquiry</span>
              <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35, marginBottom: 16 }}>
                우리 기관에 맞는<br />맞춤 제안을 받아보세요
              </h1>
              <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: 28, maxWidth: 400 }}>
                참여 인원, 희망 일정, 대상을 알려주시면 담당 매니저가 1~2일 내 맞춤 제안을 보내드립니다.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <a href={`tel:${SITE_CONFIG.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700 }}>
                  📞 기관 전용 상담 {SITE_CONFIG.phone}
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700 }}>
                  ✉️ {SITE_CONFIG.email}
                </a>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--ink-soft)' }}>
                  🕐 {SITE_CONFIG.hours}
                </span>
              </div>
            </ScrollAnimation>

            {/* 우: 폼 */}
            <ScrollAnimation animation="right">
              <form onSubmit={handleSubmit} className="form-card" style={{ background: 'var(--white)' }}>
                <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="field">
                    <label>기관명</label>
                    <input type="text" required placeholder="예: 푸른어린이집" value={form.institutionName} onChange={(e) => set('institutionName', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>담당자명</label>
                    <input type="text" required placeholder="담당자 성함" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} />
                  </div>
                </div>

                <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div className="field">
                    <label>연락처</label>
                    <input type="tel" required placeholder="010-0000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>이메일</label>
                    <input type="email" required placeholder="example@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </div>
                </div>

                <div className="field" style={{ marginBottom: 20 }}>
                  <label>대상 라인</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {KIT_LINE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set('kitLine', opt.value)}
                        style={{
                          fontSize: 13.5, fontWeight: 700, padding: '10px 18px', borderRadius: 100,
                          background: form.kitLine === opt.value ? 'var(--ink)' : 'var(--white)',
                          color: form.kitLine === opt.value ? '#fff' : 'var(--ink-soft)',
                          border: form.kitLine === opt.value ? '1px solid var(--ink)' : '1.5px solid var(--line)',
                          transition: 'background 0.2s, color 0.2s',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="field">
                    <label>예상 참여 인원</label>
                    <input type="text" placeholder="예: 30명" value={form.headcount} onChange={(e) => set('headcount', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>희망 일정</label>
                    <input type="text" placeholder="예: 2026년 4월 중" value={form.schedule} onChange={(e) => set('schedule', e.target.value)} />
                  </div>
                </div>

                <div className="field" style={{ marginBottom: 20 }}>
                  <label>희망 프로그램 형태</label>
                  <select value={form.programType} onChange={(e) => set('programType', e.target.value)}>
                    <option>월간 정기 프로그램</option>
                    <option>단발성 특강</option>
                    <option>계절·명절 테마 프로그램</option>
                    <option>샘플 체험 후 결정</option>
                  </select>
                </div>

                <div className="field" style={{ marginBottom: 24 }}>
                  <label>상세 요청사항</label>
                  <textarea
                    placeholder="기관 상황, 원하시는 프로그램 방향을 자유롭게 남겨주세요."
                    style={{ minHeight: 110 }}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '15px', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? '전송 중…' : '맞춤 제안 요청하기'}
                </button>
              </form>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 840px) {
          .inq-layout { grid-template-columns: 1fr !important; }
          .field-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
