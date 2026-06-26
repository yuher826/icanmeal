import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND_STEPS, CASE_ITEMS, INSTITUTION_FEATURES } from '@/constants'
import ScrollAnimation from '@/components/ui/ScrollAnimation'

export const metadata: Metadata = {
  title: 'ICANMEAL — 만들고, 나누고, 기억에 남는 경험',
  description:
    '키즈·실버 특화 쿠킹키트를 기관에 공급하는 B2B 푸드에듀케이션 브랜드 아이캔밀입니다.',
}

/* ── 스텝 번호 원 ── */
function StepNum({ num }: { num: string }) {
  return (
    <div
      style={{
        width: 68, height: 68, borderRadius: '50%',
        background: 'var(--white)',
        border: '1.5px solid var(--gold)',
        color: 'var(--gold)',
        fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 20,
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
          HERO — 비디오 배경
          ════════════════════════════════════════ */}
      <section style={{ padding: 0, position: 'relative', overflow: 'hidden', minHeight: 560 }}>

        {/* 비디오 배경 */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/videos/kids-hero.mp4" type="video/mp4" />
        </video>

        {/* 어두운 그라디언트 오버레이 — 텍스트 가독성 확보 */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(43,36,32,0.55) 0%, rgba(43,36,32,0.40) 100%)',
            zIndex: 1,
          }}
        />

        {/* 콘텐츠 오버레이 */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '140px 28px 100px',
            textAlign: 'center',
            minHeight: 560,
          }}
        >
          <div style={{ maxWidth: 780 }}>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.80)' }}>아이캔밀 쿠킹키트</span>
            <h1
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(30px, 4.5vw, 50px)',
                lineHeight: 1.32, fontWeight: 700,
                letterSpacing: '-0.01em', marginBottom: 20,
                color: '#fff',
                textShadow: '0 2px 16px rgba(0,0,0,0.30)',
              }}
            >
              <span style={{ display: 'block' }}>만들고, 나누고,</span>
              <span style={{ display: 'block' }}>기억에 남는 경험</span>
            </h1>
            <p
              style={{
                fontSize: 17, color: 'rgba(255,255,255,0.88)',
                maxWidth: 460, margin: '0 auto 28px',
                textShadow: '0 1px 8px rgba(0,0,0,0.20)',
              }}
            >
              키즈·실버 특화 쿠킹키트와 전용 교안·영상으로 기관 수업을 특별하게 만드세요.
            </p>

            {/* 특징 뱃지 */}
            <div className="hero-badges" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
              {['교안·활동지 제공', '수업 영상 스트리밍', '기관별 최소 수량', 'B2B 결제 지원'].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12.5, fontWeight: 600,
                    padding: '8px 16px', borderRadius: 100,
                    border: '1px solid rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTA 버튼 */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/inquiry"
                className="btn-cta"
                style={{ fontSize: 15, padding: '14px 28px' }}
              >
                기관 문의하기
              </Link>
              <Link
                href="/auth/register"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 600, color: '#fff',
                  padding: '14px 24px', borderRadius: 100,
                  border: '1.5px solid rgba(255,255,255,0.50)',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                기관 회원가입
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          두 라인 선택 카드
          ════════════════════════════════════════ */}
      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Our Lines</span>
              <h2 className="serif">두 가지 특화 라인으로<br />모든 연령에 답합니다</h2>
            </div>
          </ScrollAnimation>

          <div
            className="line-grid-home"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          >
            {/* 키즈 */}
            <ScrollAnimation animation="left" delay={100}>
              <Link
                href="/kids"
                className="line-card-link"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  borderRadius: 22, padding: '44px 38px',
                  minHeight: 300, position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--kids-coral) 0%, var(--kids-coral-deep) 100%)',
                  color: '#fff', transition: 'transform 0.28s',
                }}
              >
                <div>
                  <span style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85 }}>
                    Kids Line
                  </span>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '14px 0 12px' }}>
                    키즈 쿠킹키트
                  </h3>
                  <p style={{ fontSize: 15, opacity: 0.92, maxWidth: 300 }}>
                    어린이집·유치원·초등학교를 위한 연령별 요리 교육 키트.
                    만지고 만들며 배우는 특별한 경험.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                  <span style={{ fontSize: 13, opacity: 0.75 }}>3 – 12세 &nbsp;|&nbsp; 30 – 50분</span>
                  <div className="line-card-arrow" style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, transition: 'background 0.2s, transform 0.2s',
                  }}>→</div>
                </div>
                <div aria-hidden="true" style={{
                  position: 'absolute', right: -24, bottom: -24,
                  width: 180, height: 180, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                }} />
              </Link>
            </ScrollAnimation>

            {/* 실버 */}
            <ScrollAnimation animation="right" delay={200}>
              <Link
                href="/silver"
                className="line-card-link"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  borderRadius: 22, padding: '44px 38px',
                  minHeight: 300, position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #D9CCEC 0%, var(--silver-rose) 100%)',
                  color: '#fff', transition: 'transform 0.28s',
                }}
              >
                <div>
                  <span style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85 }}>
                    Silver Line
                  </span>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '14px 0 12px' }}>
                    실버 쿠킹키트
                  </h3>
                  <p style={{ fontSize: 15, opacity: 0.92, maxWidth: 300 }}>
                    노인복지관·요양원·병원을 위한 시니어 특화 요리 키트.
                    손쉬운 조리로 성취감과 따뜻한 즐거움을.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                  <span style={{ fontSize: 13, opacity: 0.75 }}>60세 이상 &nbsp;|&nbsp; 30 – 45분</span>
                  <div className="line-card-arrow" style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, transition: 'background 0.2s, transform 0.2s',
                  }}>→</div>
                </div>
                <div aria-hidden="true" style={{
                  position: 'absolute', right: -24, bottom: -24,
                  width: 180, height: 180, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                }} />
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ════════════════════════════════════════
          브랜드 경험 4단계
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">How It Works</span>
              <h2 className="serif">네 단계로 시작하는<br />아이캔밀 쿠킹클래스</h2>
            </div>
          </ScrollAnimation>

          <div
            className="steps-row"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', position: 'relative' }}
          >
            {/* 점선 연결 */}
            <div
              aria-hidden="true"
              className="steps-dotline"
              style={{
                position: 'absolute', top: 34, left: '6%', right: '6%', height: 1,
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

      <hr className="divider" />

      {/* ════════════════════════════════════════
          추천 제품 섹션 (플레이스홀더)
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Featured Products</span>
              <h2 className="serif">이달의 추천 키트</h2>
              <p>기관 담당자들이 가장 많이 선택한 쿠킹키트를 먼저 만나보세요.</p>
            </div>
          </ScrollAnimation>

          <div className="tabbar">
            {['전체', '키즈', '실버'].map((t, i) => (
              <button key={t} className={i === 0 ? 'active' : ''}>{t}</button>
            ))}
          </div>

          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => {
              const isKids = i < 3
              return (
                <ScrollAnimation key={i} animation="up" delay={(i % 3) * 100}>
                  <div
                    style={{
                      background: 'var(--white)', border: '1px solid var(--line)',
                      borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
                      transition: 'box-shadow 0.25s, transform 0.25s',
                    }}
                    className="product-card-placeholder"
                  >
                    <div
                      style={{
                        height: 170,
                        background: isKids
                          ? 'linear-gradient(150deg, var(--kids-tint), #fff)'
                          : 'linear-gradient(150deg, var(--silver-tint), #fff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 52,
                      }}
                    >
                      {isKids ? '🍳' : '🥗'}
                    </div>
                    <div style={{ padding: '20px 20px 22px' }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span className={`chip ${isKids ? 'kids' : 'silver'}`}>{isKids ? '키즈' : '실버'}</span>
                        <span className="chip">⏱ 35분</span>
                        <span className="chip">쉬움</span>
                      </div>
                      <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                        {isKids ? '키즈 쿠킹키트' : '실버 쿠킹키트'} {String(i + 1).padStart(2, '0')}
                      </h4>
                      <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
                        {isKids
                          ? '어린이집·유치원 전용 요리 교육 키트'
                          : '노인복지관·요양원 전용 쿠킹 프로그램'}
                      </p>
                      <span
                        style={{
                          fontSize: 13, fontWeight: 700,
                          color: isKids ? 'var(--kids-coral-deep)' : 'var(--silver-rose-deep)',
                        }}
                      >
                        자세히 보기 →
                      </span>
                    </div>
                  </div>
                </ScrollAnimation>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/kids"   className="btn-outline">키즈 전체 보기</Link>
            <Link href="/silver" className="btn-outline">실버 전체 보기</Link>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ════════════════════════════════════════
          기관 지원 — 특징 리스트 + 다크 패널
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <div
            className="support-wrap"
            style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}
          >
            {/* 좌: 특징 리스트 */}
            <div>
              <ScrollAnimation animation="left">
                <span className="eyebrow">Institution Support</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 700,
                    letterSpacing: '-0.01em', marginBottom: 32,
                  }}
                >
                  기관 파트너를 위한<br />아이캔밀의 약속
                </h2>
              </ScrollAnimation>

              <ul className="support-list">
                {INSTITUTION_FEATURES.map((feat, i) => (
                  <ScrollAnimation key={feat.title} animation="left" delay={(i + 1) * 80}>
                    <li
                      style={{
                        display: 'flex', gap: 14, padding: '16px 0',
                        borderBottom: '1px solid var(--line)',
                      }}
                    >
                      <div
                        style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: 'var(--gold)', marginTop: 9, flexShrink: 0,
                        }}
                      />
                      <div>
                        <h5 style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 4 }}>{feat.title}</h5>
                        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{feat.desc}</p>
                      </div>
                    </li>
                  </ScrollAnimation>
                ))}
              </ul>
            </div>

            {/* 우: 다크 패널 (승인 프로세스) */}
            <ScrollAnimation animation="right">
              <div
                style={{
                  background: 'var(--ink)', color: 'var(--cream)',
                  borderRadius: 22, padding: '44px 38px',
                }}
              >
                <span className="eyebrow" style={{ color: 'var(--kids-butter)' }}>
                  기관 가입 프로세스
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.4,
                    marginBottom: 14,
                  }}
                >
                  승인까지 평균 1 영업일.<br />지금 바로 시작하세요.
                </h3>
                <p style={{ fontSize: 14.5, opacity: 0.80, marginBottom: 28 }}>
                  사업자번호로 간편 가입 후 담당자 승인을 받으면<br />모든 서비스를 이용하실 수 있습니다.
                </p>

                {/* 3단계 표시 */}
                {['신청 완료', '검토 중', '승인 완료'].map((s, i) => (
                  <div
                    key={s}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      marginBottom: i < 2 ? 14 : 26,
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        flexShrink: 0,
                        background: i === 2 ? 'var(--gold)' : 'rgba(251,245,234,0.14)',
                        border: `1px solid ${i === 2 ? 'var(--gold)' : 'rgba(251,245,234,0.22)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, opacity: i === 2 ? 1 : 0.70 }}>
                      {s}
                    </span>
                  </div>
                ))}

                <Link
                  href="/auth/register"
                  className="btn-light"
                  style={{ fontSize: 14 }}
                >
                  기관 회원가입 →
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ════════════════════════════════════════
          활동 사례 갤러리
          ════════════════════════════════════════ */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Activity Cases</span>
              <h2 className="serif">오늘의 활동이,<br />한 장의 추억이 됩니다</h2>
            </div>
          </ScrollAnimation>

          <div
            className="case-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}
          >
            {CASE_ITEMS.map((item, i) => (
              <ScrollAnimation key={item.label} animation="up" delay={i * 100}>
                <div
                  style={{
                    aspectRatio: '1', borderRadius: 16,
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', alignItems: 'flex-end', padding: 16,
                    background: item.bg,
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.42), transparent 60%)',
                    }}
                  />
                  <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, position: 'relative', zIndex: 2 }}>
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
              <Link href="/inquiry" className="btn-light">
                맞춤 제안 받아보기 →
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── 반응형 ── */}
      <style>{`
        /* 라인 카드 hover */
        .line-card-link:hover { transform: translateY(-4px); }
        .line-card-link:hover .line-card-arrow {
          background: rgba(255,255,255,0.40) !important;
          transform: translateX(4px);
        }
        /* 제품 카드 hover */
        .product-card-placeholder:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-3px);
        }

        /* 모바일 반응형 */
        @media (max-width: 760px) {
          .line-grid-home { grid-template-columns: 1fr !important; }
          .steps-row { grid-template-columns: 1fr 1fr !important; gap: 32px 0 !important; }
          .steps-dotline { display: none !important; }
          .support-wrap { grid-template-columns: 1fr !important; }
          .case-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .hero-badges { gap: 6px; }
          .steps-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
