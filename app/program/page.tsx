import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'

export const metadata: Metadata = {
  title: '월간 프로그램 | ICANMEAL',
  description: '계절과 테마에 맞춰 매달 새로운 쿠킹키트와 교안을 받아보세요.',
}

const MONTHS = [
  { m: '1월',  theme: '설날 전통 음식',     emoji: '🎍', line: '키즈·실버', color: 'var(--kids-tint)',   accent: 'var(--kids-coral-deep)',   desc: '설날 음식을 만들며 명절 문화를 배워요.' },
  { m: '2월',  theme: '발렌타인 초코 만들기', emoji: '🍫', line: '키즈',     color: '#FFF0ED',             accent: 'var(--kids-coral-deep)',   desc: '초콜릿을 직접 만들어 선물하는 기쁨을.' },
  { m: '3월',  theme: '봄나물 건강 밥상',    emoji: '🌿', line: '실버',     color: '#E8F5E9',             accent: '#2D6A4F',                  desc: '봄 제철 나물로 건강 밥상을 차려봐요.' },
  { m: '4월',  theme: '꽃 모양 샌드위치',    emoji: '🥪', line: '키즈',     color: 'var(--kids-tint)',   accent: 'var(--kids-coral-deep)',   desc: '봄꽃을 닮은 예쁜 샌드위치로 봄을 맞이.' },
  { m: '5월',  theme: '어버이날 감사 밥상',   emoji: '🍚', line: '키즈·실버', color: '#FFF3D6',             accent: 'var(--gold)',              desc: '감사한 마음을 담아 한 상 차리기.' },
  { m: '6월',  theme: '여름 냉면',           emoji: '🍜', line: '실버',     color: 'var(--silver-tint)', accent: 'var(--silver-rose-deep)', desc: '시원한 여름 냉면으로 더위를 이겨내요.' },
  { m: '7월',  theme: '수박 화채 파티',      emoji: '🍉', line: '키즈',     color: 'var(--kids-tint)',   accent: 'var(--kids-coral-deep)',   desc: '여름 과일로 만드는 달콤한 화채 파티!' },
  { m: '8월',  theme: '삼복 보양 요리',      emoji: '🍗', line: '실버',     color: '#FFF3D6',             accent: 'var(--gold)',              desc: '보양 재료로 건강을 챙기는 여름 수업.' },
  { m: '9월',  theme: '추석 송편 빚기',      emoji: '🌕', line: '키즈·실버', color: '#E8F5E9',             accent: '#2D6A4F',                  desc: '추석 전통 송편 빚기로 명절 정서를.' },
  { m: '10월', theme: '할로윈 쿠키 데코',    emoji: '🎃', line: '키즈',     color: 'var(--kids-tint)',   accent: 'var(--kids-coral-deep)',   desc: '재미있는 할로윈 모양 쿠키 만들기.' },
  { m: '11월', theme: '김장 체험 클래스',    emoji: '🥬', line: '키즈·실버', color: 'var(--silver-tint)', accent: 'var(--silver-rose-deep)', desc: '김장 문화를 배우고 김치를 직접 담가요.' },
  { m: '12월', theme: '크리스마스 케이크',   emoji: '🎂', line: '키즈',     color: '#FFF3D6',             accent: 'var(--gold)',              desc: '연말 파티를 위한 케이크 데코레이션.' },
]

const HOW = [
  { num: '01', title: '구독 신청',      desc: '원하는 라인(키즈/실버)과 인원 수를 선택해 월간 구독을 신청합니다.' },
  { num: '02', title: '월간 키트 배송', desc: '매월 테마에 맞는 쿠킹키트와 교안·영상이 정기 배송됩니다.' },
  { num: '03', title: '수업 진행',      desc: '제공된 교안과 영상으로 담당자 누구나 손쉽게 수업을 진행하세요.' },
  { num: '04', title: '리포트 수령',    desc: '수업 후 활동 사진·결과물을 공유하면 월간 리포트를 보내드립니다.' },
]

export default function ProgramPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))', padding: '72px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -40, right: 0, width: 240, height: 240, borderRadius: '50%', background: 'var(--gold)', opacity: 0.10 }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <ScrollAnimation animation="up">
            <span className="eyebrow">Monthly Program</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 16 }}>
              월간 프로그램
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 480, marginBottom: 28 }}>
              계절과 테마에 맞춰 매달 새롭게 구성되는 쿠킹키트·교안·영상.<br />
              한 번 신청으로 1년 수업을 완성하세요.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>구독 문의하기</Link>
              <Link href="/kids" className="btn-outline">키트 먼저 보기</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── 12개월 그리드 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">2025 Calendar</span>
              <h2 className="serif">1년 12개월 테마 달력</h2>
              <p>계절·명절·기념일 테마로 구성된 연간 쿠킹 커리큘럼입니다.</p>
            </div>
          </ScrollAnimation>
          <div className="prog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {MONTHS.map((m, i) => (
              <ScrollAnimation key={m.m} animation="up" delay={(i % 4) * 80}>
                <div
                  style={{
                    borderRadius: 16, padding: '22px 20px',
                    background: m.color,
                    border: `1.5px solid ${m.accent}22`,
                    position: 'relative', overflow: 'hidden',
                    minHeight: 180,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: m.accent }}>{m.m}</span>
                    <span style={{ fontSize: 28 }}>{m.emoji}</span>
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--ink)', lineHeight: 1.3 }}>{m.theme}</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 12 }}>{m.desc}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: `${m.accent}18`, color: m.accent }}>{m.line}</span>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── 이용 방법 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">How To Subscribe</span>
              <h2 className="serif">월간 구독 이용 방법</h2>
            </div>
          </ScrollAnimation>
          <div className="prog-how" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, position: 'relative' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: 34, left: '6%', right: '6%', height: 1, background: 'repeating-linear-gradient(to right,var(--gold) 0 6px,transparent 6px 12px)', zIndex: 0 }} />
            {HOW.map((h, i) => (
              <ScrollAnimation key={h.num} animation="up" delay={i * 100}>
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--white)', border: '1.5px solid var(--gold)', color: 'var(--gold)', fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative', zIndex: 2 }}>
                    {h.num}
                  </div>
                  <h5 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{h.title}</h5>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{h.desc}</p>
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
              <h3>우리 기관에 맞는 연간 커리큘럼이 필요하신가요?</h3>
              <p>인원, 대상 연령, 월 횟수를 알려주시면 맞춤 제안을 드립니다.</p>
              <Link href="/inquiry" className="btn-light">월간 구독 문의 →</Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .prog-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 640px) { .prog-grid { grid-template-columns: 1fr 1fr !important; } .prog-how { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 400px) { .prog-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
