import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollAnimation from '@/components/ui/ScrollAnimation'
import { CASE_ITEMS } from '@/constants'

export const metadata: Metadata = {
  title: '활동가이드 | ICANMEAL',
  description: '아이캔밀 쿠킹키트와 함께 제공되는 교안·활동지·PPT·사례 모음.',
}

const GUIDE_TYPES = [
  {
    icon: '📄', title: '수업 교안',
    desc: '연령·수준별로 제작된 A4 교안. 학습 목표, 재료 설명, 단계별 조리 지침, 마무리 활동까지 체계적으로 구성되어 있습니다.',
    tags: ['PDF', 'A4', '편집 가능'],
    color: 'var(--kids-tint)', accent: 'var(--kids-coral-deep)',
  },
  {
    icon: '✏️', title: '활동지',
    desc: '수업 전·후 아이들이 직접 작성하는 워크시트. 오늘 배운 재료 그리기, 영양 퀴즈, 오늘의 요리 감상 기록 등.',
    tags: ['PDF', '컬러·흑백', '출력 즉시 사용'],
    color: '#FFF3D6', accent: 'var(--gold)',
  },
  {
    icon: '📊', title: '수업 PPT',
    desc: '빔프로젝터·TV 연결 즉시 사용 가능한 수업용 슬라이드. 큰 글씨와 풍부한 사진으로 주의를 집중시킵니다.',
    tags: ['PPTX', '1080p', '키즈·실버 분리'],
    color: 'var(--silver-tint)', accent: 'var(--silver-rose-deep)',
  },
  {
    icon: '🎬', title: '수업 영상',
    desc: '전문 강사의 실제 수업 영상. 구매 기관에게만 스트리밍 링크를 제공하며 다운로드 없이 바로 재생됩니다.',
    tags: ['스트리밍', 'HD', '자막 포함'],
    color: 'var(--cream-deep)', accent: 'var(--ink)',
  },
]

const CASES = [
  { title: '서울 ○○ 어린이집', sub: '키즈 주먹밥 수업', result: '"아이들이 집에서도 해보고 싶다고 졸랐어요!"', line: '키즈', bg: 'linear-gradient(150deg,var(--kids-tint),#f0c8a8)' },
  { title: '부산 ○○ 노인복지관', sub: '실버 나물 비빔밥 수업', result: '"어르신들이 오랜만에 손맛을 느꼈다며 웃으셨어요."', line: '실버', bg: 'linear-gradient(150deg,var(--silver-tint),#c8b0e8)' },
  { title: '인천 ○○ 유치원', sub: '키즈 팬케이크 클래스', result: '"교안이 너무 잘 만들어져 있어 준비 시간이 반으로 줄었어요."', line: '키즈', bg: 'linear-gradient(150deg,#FFF3D6,#e8c87a)' },
  { title: '대구 ○○ 요양원', sub: '실버 경단 빚기 수업', result: '"어르신들이 예전 기억을 이야기하며 활기가 넘쳤습니다."', line: '실버', bg: 'linear-gradient(150deg,var(--silver-tint),var(--silver-sage))' },
]

const FAQ = [
  { q: '구매하지 않아도 교안을 미리 볼 수 있나요?', a: '샘플 교안은 기관 회원가입 후 요청하시면 제공해 드립니다. 전체 자료는 키트 구매 시 자동으로 열람 권한이 부여됩니다.' },
  { q: '영상 링크는 얼마나 유효한가요?', a: '구매한 키트 회차에 해당하는 영상은 영구 열람 가능합니다. 단, 수업용으로만 사용 가능하며 외부 공유는 제한됩니다.' },
  { q: 'PPT를 자체 내용으로 수정할 수 있나요?', a: '편집 허용 버전은 기관 문의를 통해 별도 협의 가능합니다. 기본 제공본은 텍스트 수정이 제한됩니다.' },
  { q: '활동지 추가 인쇄는 가능한가요?', a: '구매 기관은 자체 프린터로 활동지를 제한 없이 추가 인쇄할 수 있습니다.' },
]

export default function GuidePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))', padding: '72px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -40, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'var(--gold)', opacity: 0.09 }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <ScrollAnimation animation="up">
            <span className="eyebrow">Activity Guide</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 16 }}>
              활동가이드 · 사례
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 500, marginBottom: 28 }}>
              키트 구매 기관에 제공되는 교안·활동지·PPT·수업 영상과<br />
              전국 기관의 실제 수업 사례를 확인해 보세요.
            </p>
            <Link href="/auth/register" className="btn-cta" style={{ fontSize: 15, padding: '13px 26px' }}>기관 회원가입 →</Link>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── 자료 유형 4가지 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Materials Included</span>
              <h2 className="serif">키트에 포함된 4가지 자료</h2>
              <p>구매 즉시 수업에 바로 활용할 수 있도록 완성된 형태로 제공됩니다.</p>
            </div>
          </ScrollAnimation>
          <div className="guide-types" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {GUIDE_TYPES.map((g, i) => (
              <ScrollAnimation key={g.title} animation={i % 2 === 0 ? 'left' : 'right'} delay={i * 80}>
                <div style={{ padding: '32px 28px', borderRadius: 18, background: g.color, border: `1.5px solid ${g.accent}22`, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 40, flexShrink: 0 }}>{g.icon}</div>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>{g.title}</h4>
                    <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 14 }}>{g.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {g.tags.map(t => (
                        <span key={t} style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: `${g.accent}14`, color: g.accent }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── 활동 사례 ── */}
      <section>
        <div className="wrap">
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">Success Cases</span>
              <h2 className="serif">전국 기관 활동 사례</h2>
              <p>아이캔밀과 함께한 기관들의 생생한 수업 이야기.</p>
            </div>
          </ScrollAnimation>
          <div className="cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {CASES.map((c, i) => (
              <ScrollAnimation key={c.title} animation="up" delay={i * 100}>
                <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--line)' }}>
                  <div style={{ height: 120, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.72)', color: c.line === '키즈' ? 'var(--kids-coral-deep)' : 'var(--silver-rose-deep)' }}>{c.line} 수업</span>
                  </div>
                  <div style={{ padding: '20px 24px', background: 'var(--white)' }}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{c.title}</span>
                      <span style={{ fontSize: 13, color: 'var(--ink-soft)', marginLeft: 8 }}>{c.sub}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.6, borderLeft: `3px solid var(--gold)`, paddingLeft: 14 }}>
                      {c.result}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── FAQ ── */}
      <section>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <ScrollAnimation animation="up">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2 className="serif">자주 묻는 질문</h2>
            </div>
          </ScrollAnimation>
          {FAQ.map((f, i) => (
            <ScrollAnimation key={i} animation="up" delay={i * 80}>
              <div style={{ padding: '22px 0', borderBottom: '1px solid var(--line)' }}>
                <h5 style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 10, display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>Q.</span>
                  {f.q}
                </h5>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, paddingLeft: 26 }}>
                  {f.a}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <ScrollAnimation animation="scale">
            <div className="cta-banner">
              <h3>자료가 궁금하신가요? 샘플을 먼저 받아보세요.</h3>
              <p>기관 회원가입 후 샘플 교안 신청이 가능합니다.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/register" className="btn-light">기관 회원가입</Link>
                <Link href="/inquiry" style={{ display: 'inline-flex', alignItems: 'center', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.75)', padding: '12px 20px' }}>샘플 문의하기 →</Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .guide-types { grid-template-columns: 1fr !important; }
          .cases-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
