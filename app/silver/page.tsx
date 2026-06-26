import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'

export const metadata: Metadata = {
  title: '실버 쿠킹키트 | ICANMEAL',
  description: '노인복지관·요양원·병원을 위한 시니어 특화 요리 교육 키트.',
}

const PRODUCTS = [
  { id: 1, emoji: '🥗', name: '나물 비빔밥',       age: '60세+', time: 30, diff: '쉬움', desc: '손쉽게 버무리는 나물 비빔밥으로 제철 채소의 맛과 영양을 즐겨요.',           best: true  },
  { id: 2, emoji: '🍲', name: '순두부 찌개 키트',   age: '65세+', time: 35, diff: '쉬움', desc: '부드러운 순두부로 따뜻하게 몸을 데우는 손쉬운 요리 수업.',                  best: false },
  { id: 3, emoji: '🥙', name: '채소 쌈 다이닝',    age: '60세+', time: 20, diff: '쉬움', desc: '다양한 채소를 손질하고 정갈하게 담아 계절의 풍미를 나눠요.',                  best: true  },
  { id: 4, emoji: '🍡', name: '경단 빚기',          age: '65세+', time: 40, diff: '보통', desc: '오랜 기억 속 손맛을 살려 경단을 빚으며 추억과 대화를 나눕니다.',              best: false },
  { id: 5, emoji: '🍜', name: '잔치국수 클래스',    age: '70세+', time: 35, diff: '쉬움', desc: '고소한 육수에 국수를 말아 먹는 따뜻한 나눔 수업.',                          best: true  },
  { id: 6, emoji: '🥣', name: '견과 영양 죽',       age: '75세+', time: 30, diff: '쉬움', desc: '부드럽고 소화가 잘 되는 영양 죽으로 어르신 건강을 챙겨드려요.',             best: false },
]

const WHY = [
  { icon: '👐', title: '시니어 특화 설계',   desc: '손 힘이 약한 어르신도 쉽게 참여하는 조리 난이도로 설계.' },
  { icon: '💊', title: '영양 균형 검증',     desc: '영양사 검토를 거친 건강 친화적 레시피만 선별합니다.'   },
  { icon: '🎬', title: '쉬운 영상 교안',    desc: '큰 글씨·느린 속도의 시니어 전용 수업 영상 제공.'        },
  { icon: '🤝', title: '1:1 매니저 지원',   desc: '도입부터 운영까지 전담 매니저가 함께합니다.'             },
]

export default function SilverPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--silver-tint),var(--cream))', padding: '72px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -60, right: -40, width: 280, height: 280, borderRadius: '50%', background: 'var(--silver-rose)', opacity: 0.14 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -30, left: '35%', width: 180, height: 180, borderRadius: '50%', background: 'var(--silver-sage)', opacity: 0.18 }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <ScrollAnimation animation="up">
            <span className="eyebrow" style={{ color: 'var(--silver-rose-deep)' }}>Silver Line</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 16 }}>
              실버 쿠킹키트
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 480, marginBottom: 28 }}>
              노인복지관·요양원·병원을 위한 시니어 특화 요리 키트.<br />
              손쉬운 조리로 성취감과 따뜻한 즐거움을 드립니다.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {['60세+', '65세+', '70세+', '75세+'].map(t => (
                <span key={t} style={{ fontSize: 12.5, fontWeight: 700, padding: '7px 15px', borderRadius: 100, background: 'rgba(168,147,201,0.15)', color: 'var(--silver-rose-deep)', border: '1px solid rgba(168,147,201,0.28)' }}>{t}</span>
              ))}
            </div>
            <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px', background: 'var(--silver-rose-deep)', borderColor: 'var(--silver-rose-deep)' }}>기관 문의하기</Link>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── 제품 목록 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">All Products</span>
              <h2 className="serif">전체 실버 키트</h2>
            </div>
          </ScrollAnimation>
          <div className="tabbar">
            {['전체', '60세+', '70세+', '쉬움', '보통', '냉장', '실온'].map((t, i) => (
              <button key={t} className={i === 0 ? 'active' : ''}>{t}</button>
            ))}
          </div>
          <div className="product-grid">
            {PRODUCTS.map((p, i) => (
              <ScrollAnimation key={p.id} animation="up" delay={(i % 3) * 100}>
                <div className="s-card" style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 160, background: 'linear-gradient(150deg,var(--silver-tint),#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative' }}>
                    {p.emoji}
                    {p.best && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'var(--gold)', color: '#fff' }}>BEST</span>}
                    <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--silver-tint)', color: 'var(--silver-rose-deep)' }}>실버</span>
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink-soft)' }}>⏱ {p.time}분</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink-soft)' }}>{p.diff}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--silver-tint)', color: 'var(--silver-rose-deep)' }}>👴 {p.age}</span>
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.name}</h4>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver-rose-deep)' }}>자세히 보기 →</span>
                      <Link href="/inquiry" style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 100, background: 'var(--silver-tint)', color: 'var(--silver-rose-deep)' }}>문의</Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── 특징 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Why ICANMEAL Silver</span>
              <h2 className="serif">어르신을 위한 세심한 배려</h2>
            </div>
          </ScrollAnimation>
          <div className="s-why" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {WHY.map((f, i) => (
              <ScrollAnimation key={f.title} animation="up" delay={i * 100}>
                <div style={{ padding: '28px 24px', borderRadius: 16, border: '1px solid var(--line)', background: 'var(--white)', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                  <h5 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h5>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="scale">
            <div className="cta-banner" style={{ background: 'linear-gradient(135deg,var(--silver-rose-deep),#4a3570)' }}>
              <h3>실버 쿠킹키트 도입을 검토 중이신가요?</h3>
              <p>대상 인원과 기관 유형을 알려주시면 맞춤 프로그램을 제안해 드립니다.</p>
              <Link href="/inquiry" className="btn-light">기관 문의하기 →</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        .s-card { transition: box-shadow 0.25s, transform 0.25s; }
        .s-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
        @media (max-width: 760px) { .s-why { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .s-why { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
