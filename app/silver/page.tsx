import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import MonthlyKitGrid from '@/components/ui/MonthlyKitGrid'
import { SILVER_PRODUCTS, SILVER_CORE_VALUES, HERO_VIDEOS } from '@/constants'

export const metadata: Metadata = {
  title: '실버 쿠킹키트 | ICANMEAL',
  description: '손으로 완성하고, 함께 나누며 가족에게 전하는 즐거운 활동 경험 — 노인복지관·요양원·병원을 위한 실버 쿠킹키트.',
}

export default function SilverPage() {
  return (
    <>
      {/* ════════════════════════════════════════
          Hero
          ════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--silver-tint) 0%, var(--cream) 70%)' }}
        />
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="sh-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
            <ScrollAnimation animation="left">
              <span className="eyebrow" style={{ color: 'var(--silver-rose-deep)' }}>Silver ICANMEAL</span>
              <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.35, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
                손으로 완성하고, 함께 나누며<br />가족에게 전하는 즐거운 활동 경험
              </h1>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 14, maxWidth: 460, lineHeight: 1.75 }}>
                예쁘고 품격 있는 결과물을 완성하며, 정서적 교류와 즐거움을 나누는 쿠킹클래스입니다.
              </p>
              <p style={{ fontSize: 13, color: 'var(--silver-rose-deep)', marginBottom: 28, maxWidth: 480, lineHeight: 1.7 }}>
                ※ 실버 ICANMEAL은 식사 제공이나 식사 대체를 전제로 하지 않는 수업용 쿠킹클래스 키트입니다.
              </p>
              <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>
                우리 센터 맞춤 프로그램 제안받기
              </Link>
            </ScrollAnimation>

            <ScrollAnimation animation="right">
              <div style={{ aspectRatio: '4 / 3', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(111,84,153,0.18), 0 4px 20px rgba(0,0,0,0.10)' }}>
                <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                  <source src={HERO_VIDEOS.silver} type="video/mp4" />
                </video>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CORE VALUES
          ════════════════════════════════════════ */}
      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Core Values</span>
              <h2>활동 시간을 참여와 교류의 시간으로 확장합니다</h2>
            </div>
          </ScrollAnimation>

          <div className="sh-values" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {SILVER_CORE_VALUES.map((v, i) => (
              <ScrollAnimation key={v} animation="up" delay={i * 60}>
                <div style={{ padding: '22px 20px', borderRadius: 14, border: '1px solid var(--line)', background: 'var(--white)', textAlign: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{v}</span>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ════════════════════════════════════════
          12개월, 12가지 추억
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">Categories</span>
              <h2>12개월, 12가지 추억으로 만나는<br />실버 쿠킹클래스</h2>
            </div>
          </ScrollAnimation>

          <MonthlyKitGrid products={SILVER_PRODUCTS} aspect="1 / 1" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          월간 캘린더 / 보호자 공유
          ════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream-deep)' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScrollAnimation animation="up">
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 16, padding: '26px 28px' }}>
              <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🗓️ 매달의 프로그램 고민을 줄이는 실버 월간 쿠킹캘린더</h5>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 10 }}>
                계절·행사 중심으로 구성된 월간 추천표를 통해 센터의 프로그램 운영을 미리 설계할 수 있습니다.
              </p>
              <Link href="/program" style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--silver-rose-deep)' }}>월간 프로그램 보기 →</Link>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="up" delay={80}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 16, padding: '26px 28px' }}>
              <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>💌 보호자 공유</h5>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                &ldquo;오늘 어르신은 직접 재료를 만지고, 예쁜 결과물을 완성해 함께 나누셨습니다.&rdquo; — 활동 사진과
                회상 대화 가이드, 수업용 영상을 함께 제공합니다.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA 배너
          ════════════════════════════════════════ */}
      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="scale">
            <div className="cta-banner">
              <h3>우리 센터에 맞는 실버 쿠킹클래스를 제안받아 보세요</h3>
              <p>맞춤 프로그램 제안, 기관 단체 주문, 파일럿 상담을 도와드립니다.</p>
              <Link href="/inquiry" className="btn-light">맞춤 프로그램 제안받기</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .sh-grid { grid-template-columns: 1fr !important; }
          .sh-values { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .sh-values { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
