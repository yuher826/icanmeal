import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import MonthlyKitGrid from '@/components/ui/MonthlyKitGrid'
import { KIDS_PRODUCTS, KIDS_PROMISE, BRAND_ASSETS, HERO_VIDEOS } from '@/constants'

export const metadata: Metadata = {
  title: '키즈 쿠킹키트 | ICANMEAL',
  description: '만지고, 만들고, 맛보며 배우는 즐거운 요리 경험 — 어린이집·유치원·초등학교를 위한 키즈 쿠킹키트.',
}

export default function KidsPage() {
  return (
    <>
      {/* ════════════════════════════════════════
          Hero
          ════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--kids-tint) 0%, var(--cream) 70%)' }}
        />
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="kh-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
            <ScrollAnimation animation="left">
              <span className="eyebrow" style={{ color: 'var(--kids-coral-deep)' }}>Kids ICANMEAL</span>
              <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.35, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
                만지고, 만들고, 맛보며<br />배우는 즐거운 요리 경험
              </h1>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 28, maxWidth: 460, lineHeight: 1.75 }}>
                기관 일정과 목적에 맞춰 고르는 키즈 쿠킹키트.
                연령별 난이도, 알러지 정보, 교안·영상까지 한 번에 확인하세요.
              </p>
              <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>
                우리 기관에 맞는 키트 찾기
              </Link>
            </ScrollAnimation>

            <ScrollAnimation animation="right">
              <div style={{ aspectRatio: '4 / 3', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(201,87,42,0.18), 0 4px 20px rgba(0,0,0,0.10)' }}>
                <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                  <source src={HERO_VIDEOS.kids} type="video/mp4" />
                </video>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          KIDS ICANMEAL의 약속
          ════════════════════════════════════════ */}
      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Kids ICANMEAL의 약속</span>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                밥상머리 교육에서 시작된 키즈 라인
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BRAND_ASSETS.mascotChef} alt="" aria-hidden="true" style={{ width: 40, height: 40, objectFit: 'contain' }} />
              </h2>
              <p>
                단순한 요리 체험이 아니라, 함께 만들고 맛보며 대화하는 과정에서 가족의 소중함과 예절,
                사회성을 자연스럽게 경험하도록 돕습니다.
              </p>
            </div>
          </ScrollAnimation>

          <div className="kh-guide-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {KIDS_PROMISE.map((g, i) => (
              <ScrollAnimation key={g.title} animation="up" delay={i * 80}>
                <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, padding: 28, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--kids-tint)', fontSize: 24 }}>
                    {g.icon}
                  </div>
                  <div>
                    <h5 style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>{g.title}</h5>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{g.desc}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ════════════════════════════════════════
          12개월, 12가지 테마
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">Categories</span>
              <h2>12개월, 12가지 테마로 만나는<br />키즈 쿠킹키트</h2>
            </div>
          </ScrollAnimation>

          <MonthlyKitGrid products={KIDS_PRODUCTS} aspect="16 / 9" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          교안·영상 / 안전·보관 안내
          ════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream-deep)' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScrollAnimation animation="up">
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 16, padding: '26px 28px' }}>
              <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🎬 교안·영상 미리보기</h5>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                교안과 영상으로 준비부터 진행까지 쉽게 따라 하세요. 교육목표, 활동 순서, 교사 진행 멘트,
                확장 활동, 수업용 영상 썸네일까지 모든 상품에 기본 포함됩니다.
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="up" delay={80}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 16, padding: '26px 28px' }}>
              <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>📦 안전·보관 안내</h5>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                기관 운영에 필요한 위생·보관 기준을 함께 제공합니다 — 냉장·냉동·실온 보관, 유통기한,
                알러지 유발 식품, 가열·도구 사용 시 주의사항까지 상세 안내합니다.
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
              <h3>우리 기관에 맞는 키즈 쿠킹키트를 찾아보세요</h3>
              <p>샘플 상담부터 기관 전용 주문까지, 담당 매니저가 도와드립니다.</p>
              <Link href="/inquiry" className="btn-light">샘플 상담 신청하기</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .kh-grid { grid-template-columns: 1fr !important; }
          .kh-guide-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
