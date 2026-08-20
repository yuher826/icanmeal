import type { Metadata } from 'next'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import { GUIDE_MATERIALS, CASE_ITEMS } from '@/constants'

export const metadata: Metadata = {
  title: '활동가이드·사례 | ICANMEAL',
  description: '기관 운영자의 실행 부담을 낮춥니다 — 교안·진행카드·보관안내·사진가이드·수업용 영상과 기관 활동 사례.',
}

export default function GuidePage() {
  return (
    <>
      {/* ════════════════════════════════════════
          Hero
          ════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 48px' }}>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <span className="eyebrow">Activity Guide</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 32 }}>
              기관 운영자의 실행 부담을 낮춥니다
            </h1>
          </ScrollAnimation>

          <div className="guide-materials" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {GUIDE_MATERIALS.map((g, i) => (
              <ScrollAnimation key={g.title} animation="up" delay={i * 60}>
                <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, padding: 28, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-deep)', fontSize: 24 }}>
                    {g.icon}
                  </div>
                  <div>
                    <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{g.title}</h5>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{g.desc}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACTIVITY CASES
          ════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream-deep)' }}>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Activity Cases</span>
              <h2>기관에서 만나는 아이캔밀의 순간들</h2>
            </div>
          </ScrollAnimation>

          <div className="cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {CASE_ITEMS.map((item, i) => (
              <ScrollAnimation key={item.label} animation="up" delay={(i % 4) * 80}>
                <div style={{ aspectRatio: '1', borderRadius: 16, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 14 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)' }} />
                  <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 700, position: 'relative', zIndex: 2 }}>
                    {item.label}
                  </span>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .guide-materials { grid-template-columns: 1fr !important; }
          .cases-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  )
}
