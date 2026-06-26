import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'

export const metadata: Metadata = {
  title: '키즈 쿠킹키트 | ICANMEAL',
  description: '어린이집·유치원·초등학교를 위한 연령별 요리 교육 키트.',
}

const GUIDE_CARDS = [
  {
    icon: '🍽️',
    title: '밥상머리 교육',
    desc: '함께 만들고 맛보며, 가족의 소중함과 예절을 배우는 시간입니다.',
  },
  {
    icon: '🎬',
    title: '전문적 영상 자료',
    desc: '어린이들에게도 전문적으로 제작된 영상으로 수업을 준비하고 진행할 수 있습니다.',
  },
  {
    icon: '🛡️',
    title: '알러지 정보 관리',
    desc: '알러지 정보를 확인하고 재료를 대체 가능한 레시피로 바꿔 진행하세요.',
  },
  {
    icon: '📋',
    title: '교사 친화적 교안',
    desc: '기관 교사들의 눈높이에 맞는 교안으로 수업을 효과적으로 진행하세요.',
  },
]

const PRODUCTS = [
  { id: 1, emoji: '🍙', name: '주먹밥 만들기',    age: '3–5세',  time: 25, diff: '쉬움', desc: '작은 손으로도 쉽게 만드는 한 입 주먹밥. 식재료에 친숙해지는 첫 번째 요리 경험.', best: true  },
  { id: 2, emoji: '🥞', name: '팬케이크 클래스',  age: '4–7세',  time: 35, diff: '쉬움', desc: '반죽부터 굽기까지 달콤한 팬케이크로 수와 도형 개념을 배워요.',                   best: false },
  { id: 3, emoji: '🥗', name: '채소 샐러드 키트', age: '5–8세',  time: 20, diff: '쉬움', desc: '다양한 색깔 채소를 씻고 썰며 식감과 영양을 함께 탐색합니다.',                     best: true  },
  { id: 4, emoji: '🍕', name: '미니 피자 클래스', age: '6–10세', time: 45, diff: '보통', desc: '도우 늘리기부터 토핑 올리기까지 창의력을 발휘하는 피자 수업.',                    best: false },
  { id: 5, emoji: '🍱', name: '도시락 꾸미기',    age: '7–10세', time: 40, diff: '보통', desc: '균형 잡힌 식단을 직접 담으며 영양과 색감의 조화를 배웁니다.',                     best: true  },
  { id: 6, emoji: '🍪', name: '쿠키 베이킹',      age: '8–12세', time: 60, diff: '보통', desc: '계량부터 굽기까지 꼼꼼히 배우는 기초 베이킹 클래스.',                            best: false },
]

export default function KidsPage() {
  return (
    <>
      {/* ════════════════════════════════════════
          Hero — 좌: 텍스트 / 우: 비디오
          ════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--kids-tint), var(--cream))',
          padding: '64px 0 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 데코 */}
        <div aria-hidden="true" style={{ position: 'absolute', top: -60, right: -40, width: 280, height: 280, borderRadius: '50%', background: 'var(--kids-coral)', opacity: 0.08, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -40, left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'var(--kids-butter)', opacity: 0.12, pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative' }}>
          <div
            className="kh-grid"
            style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}
          >
            {/* 좌: 텍스트 */}
            <ScrollAnimation animation="left">
              <span className="eyebrow" style={{ color: 'var(--kids-coral-deep)' }}>Kids ICANMEAL</span>
              <h1
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px, 3.5vw, 38px)',
                  lineHeight: 1.4,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                만들고, 나누며<br />배우는 아이들만의 경험
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: 'var(--ink-soft)',
                  marginBottom: 28,
                  maxWidth: 460,
                  lineHeight: 1.75,
                }}
              >
                기관 일정과 목적에 맞춰 고르는 키즈 쿠킹키트.
                연령별 난이도, 알러지 정보, 교안·영상까지 한 번에 확인하세요.
              </p>

              {/* 연령 태그 */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {['3–5세', '4–7세', '6–10세', '8–12세'].map(t => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12.5, fontWeight: 700,
                      padding: '6px 14px', borderRadius: 100,
                      background: 'rgba(227,107,59,0.12)',
                      color: 'var(--kids-coral-deep)',
                      border: '1px solid rgba(227,107,59,0.22)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>
                기관에 맞는 키트 바로 찾기
              </Link>
            </ScrollAnimation>

            {/* 우: 비디오 */}
            <ScrollAnimation animation="right">
              <div
                style={{
                  aspectRatio: '4 / 3',
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(227,107,59,0.18), 0 4px 20px rgba(0,0,0,0.10)',
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                >
                  <source src="https://uauprcrksiiiluxhvrac.supabase.co/storage/v1/object/public/media/videos/kids/kids-hero.mp4" type="video/mp4" />
                </video>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          밥상머리 교육에서 시작된 키즈 라인
          ════════════════════════════════════════ */}
      <section className="tight" style={{ position: 'relative' }}>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Kids ICANMEAL 교육 철학</span>
              <h2 className="serif">밥상머리 교육에서 시작된 키즈 라인</h2>
              <p>
                직접 만들고 나누는 과정 속에서 아이들이 배우고 성장합니다.
                함께 만들며 인원의 소중함과 예절, 사회성을 키워가는 경험을 선물하도록 기획했습니다.
              </p>
            </div>
          </ScrollAnimation>

          <div
            className="kh-guide-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}
          >
            {GUIDE_CARDS.map((g, i) => (
              <ScrollAnimation key={g.title} animation="up" delay={i * 80}>
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: 18,
                    padding: '28px',
                    display: 'flex',
                    gap: 18,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--kids-tint)', fontSize: 26,
                    }}
                  >
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
          제품 목록
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">Categories</span>
              <h2 className="serif">12개월, 12가지 테마로 만나는<br />키즈 쿠킹키트</h2>
            </div>
          </ScrollAnimation>

          <div className="tabbar">
            {['전체 (12개월)', '봄', '여름', '가을', '겨울'].map((t, i) => (
              <button key={t} className={i === 0 ? 'active' : ''}>{t}</button>
            ))}
          </div>

          <div className="product-grid">
            {PRODUCTS.map((p, i) => (
              <ScrollAnimation key={p.id} animation="up" delay={(i % 3) * 100}>
                <div
                  className="k-card"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: 18,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      background: 'linear-gradient(150deg,var(--kids-tint),#fff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 52, position: 'relative',
                    }}
                  >
                    {p.emoji}
                    {p.best && (
                      <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'var(--gold)', color: '#fff' }}>
                        BEST
                      </span>
                    )}
                    <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--kids-tint)', color: 'var(--kids-coral-deep)' }}>
                      키즈
                    </span>
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink-soft)' }}>⏱ {p.time}분</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink-soft)' }}>{p.diff}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: '#FFF3D6', color: 'var(--gold)' }}>👦 {p.age}</span>
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.name}</h4>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.desc}
                    </p>
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

      {/* ════════════════════════════════════════
          CTA 배너
          ════════════════════════════════════════ */}
      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="scale">
            <div
              className="cta-banner"
              style={{ background: 'linear-gradient(120deg, var(--kids-coral), var(--kids-butter))' }}
            >
              <h3>우리 기관에 맞는 키즈 쿠킹키트를 찾아보세요</h3>
              <p>기관 유형과 인원을 알려주시면 맞춤 프로그램을 제안해 드립니다.</p>
              <Link href="/inquiry" className="btn-light">기관 문의하기 →</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        .k-card { transition: box-shadow 0.25s, transform 0.25s; }
        .k-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
        @media (max-width: 760px) {
          .kh-grid { grid-template-columns: 1fr !important; }
          .kh-guide-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
