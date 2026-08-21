import type { Metadata } from 'next'
import Link from 'next/link'
import {
  HOME_CHECK_FEATURES,
  BRAND_STEPS,
  INSTITUTION_FEATURES,
  CASE_ITEMS,
  KIDS_PRODUCTS,
  SILVER_PRODUCTS,
  FEATURED_MONTH,
  HERO_VIDEOS,
} from '@/constants'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import MonthlyKitCard from '@/components/ui/MonthlyKitCard'

export const metadata: Metadata = {
  title: 'ICANMEAL — 오감을 깨우고, 추억을 나누다',
  description:
    '키즈·실버 특화 쿠킹키트를 기관에 공급하는 푸드에듀케이션 브랜드 아이캔밀입니다.',
}

const featuredKids = KIDS_PRODUCTS.find((p) => p.month === FEATURED_MONTH)!
const featuredSilver = SILVER_PRODUCTS.find((p) => p.month === FEATURED_MONTH)!

/* ── 체크 아이콘 ── */
function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: 'var(--kids-tint)', color: 'var(--kids-coral-deep)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  )
}

/* ── 4단계 스텝 원 ── */
function StepNum({ num }: { num: string }) {
  return (
    <div
      style={{
        width: 60, height: 60, borderRadius: '50%',
        background: 'var(--white)',
        border: '1.5px solid var(--gold)',
        color: 'var(--gold)',
        fontWeight: 800, fontSize: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 18px',
        position: 'relative', zIndex: 2,
      }}
    >
      {num}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════
          HERO
          ════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, var(--kids-tint) 0%, #fff 46%, var(--silver-tint) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', right: '6%', bottom: -80, width: 340, height: 340,
            borderRadius: '50%', background: 'var(--silver-rose)', opacity: 0.18, filter: 'blur(10px)',
          }}
        />

        <div className="wrap" style={{ position: 'relative' }}>
          <div className="home-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <ScrollAnimation animation="left">
              <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', lineHeight: 1.28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20 }}>
                <span style={{ display: 'block' }}>오감을 깨우고,</span>
                <span style={{ display: 'block' }}>추억을 나누다</span>
              </h1>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 440, marginBottom: 28, lineHeight: 1.7 }}>
                손으로 직접 만드는 쿠킹 활동 — 아이는 오감을 키우고, 어르신은 추억을 되찾습니다.
              </p>
              <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '14px 28px' }}>
                맞춤 제안 받기
              </Link>
            </ScrollAnimation>

            <ScrollAnimation animation="right">
              <div
                style={{
                  aspectRatio: '4 / 3', borderRadius: 24, overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(46,37,31,0.14)',
                }}
              >
                <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                  <source src={HERO_VIDEOS.home} type="video/mp4" />
                </video>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4대 체크 특징
          ════════════════════════════════════════ */}
      <section style={{ padding: '32px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="home-check-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {HOME_CHECK_FEATURES.map((f, i) => (
              <ScrollAnimation key={f.title} animation="up" delay={i * 80}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <CheckIcon />
                  <div>
                    <h5 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2 }}>{f.title}</h5>
                    <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{f.desc}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CHOOSE YOUR LINE
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Choose Your Line</span>
              <h2>두 개의 라인, 하나의 브랜드</h2>
              <p>아이캔밀은 키즈와 실버, 대상에 맞는 라인을 첫 화면에서 바로 선택할 수 있습니다.</p>
            </div>
          </ScrollAnimation>

          <div className="line-grid-home" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <ScrollAnimation animation="left" delay={100}>
              <Link
                href="/kids"
                className="line-card-link"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  borderRadius: 20, padding: '40px 36px', minHeight: 220,
                  background: 'linear-gradient(120deg, var(--kids-coral-deep) 0%, var(--kids-coral) 100%)',
                  color: '#fff', transition: 'transform 0.28s',
                }}
              >
                <h3 style={{ fontSize: 26, fontWeight: 800 }}>키즈 쿠킹키트</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>선택하기</span>
                  <span
                    className="line-card-arrow"
                    style={{
                      width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </ScrollAnimation>

            <ScrollAnimation animation="right" delay={200}>
              <Link
                href="/silver"
                className="line-card-link"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  borderRadius: 20, padding: '40px 36px', minHeight: 220,
                  background: 'linear-gradient(120deg, var(--silver-sage) 0%, var(--silver-rose-deep) 100%)',
                  color: '#fff', transition: 'transform 0.28s',
                }}
              >
                <h3 style={{ fontSize: 26, fontWeight: 800 }}>실버 쿠킹키트</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>선택하기</span>
                  <span
                    className="line-card-arrow"
                    style={{
                      width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          아이캔밀이 제공하는 공통 경험
          ════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream-deep)' }}>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 48 }}>
              아이캔밀이 제공하는 공통 경험
            </h2>
          </ScrollAnimation>

          <div className="steps-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', position: 'relative' }}>
            <div
              aria-hidden="true"
              className="steps-dotline"
              style={{
                position: 'absolute', top: 30, left: '6%', right: '6%', height: 1,
                background: 'repeating-linear-gradient(to right, var(--gold) 0 6px, transparent 6px 12px)',
                zIndex: 0,
              }}
            />
            {BRAND_STEPS.map((step, i) => (
              <ScrollAnimation key={step.num} animation="up" delay={(i + 1) * 100}>
                <div style={{ padding: '0 18px', textAlign: 'center', position: 'relative' }}>
                  <StepNum num={step.num} />
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</h4>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{step.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          RECOMMENDED — 이번 달 추천 쿠킹키트
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Recommended</span>
              <h2>이번 달 추천 쿠킹키트</h2>
            </div>
          </ScrollAnimation>

          <div className="line-grid-home" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <ScrollAnimation animation="up" delay={100}>
              <MonthlyKitCard kit={featuredKids} size="large" aspect="16 / 9" />
            </ScrollAnimation>
            <ScrollAnimation animation="up" delay={200}>
              <MonthlyKitCard kit={featuredSilver} size="large" aspect="1 / 1" />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          INSTITUTION SUPPORT — 키트만 보내지 않습니다
          ════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream-deep)' }}>
        <div className="wrap">
          <div className="support-wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div>
              <ScrollAnimation animation="left">
                <span className="eyebrow">Institution Support</span>
                <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 28 }}>
                  키트만 보내지 않습니다
                </h2>
              </ScrollAnimation>

              <ul>
                {INSTITUTION_FEATURES.map((feat, i) => (
                  <ScrollAnimation key={feat.title} animation="left" delay={(i + 1) * 80}>
                    <li style={{ padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
                      <h5 style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 4 }}>{feat.title}</h5>
                      <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{feat.desc}</p>
                    </li>
                  </ScrollAnimation>
                ))}
              </ul>
            </div>

            <ScrollAnimation animation="right">
              <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 22, padding: '44px 38px' }}>
                <span className="eyebrow" style={{ color: 'var(--kids-butter)' }}>For Institutions</span>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, opacity: 0.88, marginTop: 8 }}>
                  상품 등록부터 배송, 보관 안내까지 — 기관 담당자가 처음부터 끝까지 혼자 고민하지 않도록 설계되었습니다.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACTIVITY CASES
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Activity Cases</span>
              <h2>오늘의 활동이,<br />한 장의 추억이 됩니다</h2>
            </div>
          </ScrollAnimation>

          <div className="case-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {CASE_ITEMS.map((item, i) => (
              <ScrollAnimation key={item.label} animation="up" delay={(i % 4) * 80}>
                <div
                  style={{
                    aspectRatio: '1', borderRadius: 16, position: 'relative', overflow: 'hidden',
                    display: 'flex', alignItems: 'flex-end', padding: 14,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    aria-hidden="true"
                    style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)' }}
                  />
                  <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 700, position: 'relative', zIndex: 2 }}>
                    {item.label}
                  </span>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA 배너
          ════════════════════════════════════════ */}
      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="scale">
            <div className="cta-banner">
              <h3>우리 기관에 맞는 쿠킹클래스 프로그램이 필요하신가요?</h3>
              <p>대상, 인원, 희망 일정을 알려주시면 맞춤 제안을 보내드립니다.</p>
              <Link href="/inquiry" className="btn-light">맞춤 제안 받아보기</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        .line-card-link:hover { transform: translateY(-4px); }
        .line-card-link:hover .line-card-arrow { background: rgba(255,255,255,0.42) !important; transform: translateX(4px); }

        @media (max-width: 760px) {
          .home-hero-grid { grid-template-columns: 1fr !important; }
          .home-check-row { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .line-grid-home { grid-template-columns: 1fr !important; }
          .steps-row { grid-template-columns: 1fr 1fr !important; gap: 32px 0 !important; }
          .steps-dotline { display: none !important; }
          .support-wrap { grid-template-columns: 1fr !important; }
          .case-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  )
}
