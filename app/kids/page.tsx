import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'

export const metadata: Metadata = {
  title: '키즈 쿠킹키트 | ICANMEAL',
  description: '어린이집·유치원·초등학교를 위한 연령별 요리 교육 키트.',
}

const PRODUCTS = [
  { id: 1, emoji: '🍙', name: '주먹밥 만들기',    age: '3–5세',  time: 25, diff: '쉬움', desc: '작은 손으로도 쉽게 만드는 한 입 주먹밥. 식재료에 친숙해지는 첫 번째 요리 경험.', best: true  },
  { id: 2, emoji: '🥞', name: '팬케이크 클래스',  age: '4–7세',  time: 35, diff: '쉬움', desc: '반죽부터 굽기까지 달콤한 팬케이크로 수와 도형 개념을 배워요.',                   best: false },
  { id: 3, emoji: '🥗', name: '채소 샐러드 키트', age: '5–8세',  time: 20, diff: '쉬움', desc: '다양한 색깔 채소를 씻고 썰며 식감과 영양을 함께 탐색합니다.',                     best: true  },
  { id: 4, emoji: '🍕', name: '미니 피자 클래스', age: '6–10세', time: 45, diff: '보통', desc: '도우 늘리기부터 토핑 올리기까지 창의력을 발휘하는 피자 수업.',                    best: false },
  { id: 5, emoji: '🍱', name: '도시락 꾸미기',    age: '7–10세', time: 40, diff: '보통', desc: '균형 잡힌 식단을 직접 담으며 영양과 색감의 조화를 배웁니다.',                     best: true  },
  { id: 6, emoji: '🍪', name: '쿠키 베이킹',      age: '8–12세', time: 60, diff: '보통', desc: '계량부터 굽기까지 꼼꼼히 배우는 기초 베이킹 클래스.',                            best: false },
]

const WHY = [
  { icon: '📋', title: '연령별 교안 제공',   desc: '3–12세 발달 단계별 맞춤 교안·활동지 무료 제공.' },
  { icon: '🎬', title: '수업 영상 스트리밍', desc: '전문 강사 시연 영상으로 누구나 쉽게 수업 진행.' },
  { icon: '🛡️', title: '알러지 안심 키트',  desc: '18대 알러지 투명 표기 + 대체 재료 가이드 포함.' },
  { icon: '🚚', title: '신선 냉장 배송',     desc: '수업 전날 도착하는 냉장·냉동 직배송 서비스.'    },
]

export default function KidsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--kids-tint),var(--cream))', padding: '72px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -60, right: -40, width: 280, height: 280, borderRadius: '50%', background: 'var(--kids-coral)', opacity: 0.10 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -30, left: '35%', width: 180, height: 180, borderRadius: '50%', background: 'var(--kids-butter)', opacity: 0.13 }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <ScrollAnimation animation="up">
            <span className="eyebrow" style={{ color: 'var(--kids-coral-deep)' }}>Kids Line</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 16 }}>
              키즈 쿠킹키트
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 480, marginBottom: 28 }}>
              어린이집·유치원·초등학교를 위한 연령별 요리 교육 키트.<br />
              만지고, 만들고, 나누며 배우는 특별한 경험을 선물하세요.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {['3–5세', '4–7세', '6–10세', '8–12세'].map(t => (
                <span key={t} style={{ fontSize: 12.5, fontWeight: 700, padding: '7px 15px', borderRadius: 100, background: 'rgba(227,107,59,0.12)', color: 'var(--kids-coral-deep)', border: '1px solid rgba(227,107,59,0.22)' }}>{t}</span>
              ))}
            </div>
            <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>기관 문의하기</Link>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── 제품 목록 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">All Products</span>
              <h2 className="serif">전체 키즈 키트</h2>
            </div>
          </ScrollAnimation>
          <div className="tabbar">
            {['전체', '3–5세', '6–8세', '9–12세', '쉬움', '보통'].map((t, i) => (
              <button key={t} className={i === 0 ? 'active' : ''}>{t}</button>
            ))}
          </div>
          <div className="product-grid">
            {PRODUCTS.map((p, i) => (
              <ScrollAnimation key={p.id} animation="up" delay={(i % 3) * 100}>
                <div className="k-card" style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 160, background: 'linear-gradient(150deg,var(--kids-tint),#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative' }}>
                    {p.emoji}
                    {p.best && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'var(--gold)', color: '#fff' }}>BEST</span>}
                    <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--kids-tint)', color: 'var(--kids-coral-deep)' }}>키즈</span>
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink-soft)' }}>⏱ {p.time}분</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink-soft)' }}>{p.diff}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: '#FFF3D6', color: 'var(--gold)' }}>👦 {p.age}</span>
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.name}</h4>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kids-coral-deep)' }}>자세히 보기 →</span>
                      <Link href="/inquiry" style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 100, background: 'var(--kids-tint)', color: 'var(--kids-coral-deep)' }}>문의</Link>
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
              <span className="eyebrow">Why ICANMEAL Kids</span>
              <h2 className="serif">아이들을 위한 특별한 준비</h2>
            </div>
          </ScrollAnimation>
          <div className="k-why" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
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
            <div className="cta-banner">
              <h3>키즈 쿠킹키트 도입을 검토 중이신가요?</h3>
              <p>기관 유형과 인원을 알려주시면 맞춤 프로그램을 제안해 드립니다.</p>
              <Link href="/inquiry" className="btn-light">기관 문의하기 →</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        .k-card { transition: box-shadow 0.25s, transform 0.25s; }
        .k-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
        @media (max-width: 760px) { .k-why { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .k-why { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
