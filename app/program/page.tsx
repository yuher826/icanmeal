import type { Metadata } from 'next'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import ProgramCalendar from '@/components/ui/ProgramCalendar'

export const metadata: Metadata = {
  title: '월간 프로그램 | ICANMEAL',
  description: '기관의 한 달 운영을 함께 설계합니다 — 키즈·실버 12개월 연간 쿠킹키트 캘린더.',
}

export default function ProgramPage() {
  return (
    <>
      {/* ════════════════════════════════════════
          Hero
          ════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 48px' }}>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <span className="eyebrow">Monthly Program</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
              기관의 한 달 운영을 함께 설계합니다
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 520 }}>
              아이캔밀은 단순 상품몰이 아니라, 기관의 프로그램 운영을 설계해주는 브랜드입니다.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* ════════════════════════════════════════
          연간 캘린더
          ════════════════════════════════════════ */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ProgramCalendar />
        </div>
      </section>
    </>
  )
}
