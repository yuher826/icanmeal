import Link from 'next/link'
import type { MonthlyKit } from '@/constants'

interface Props {
  kit: MonthlyKit
  /** large: 홈 "이번 달 추천" 섹션에서 쓰는 강조 카드 */
  size?: 'default' | 'large'
}

export default function MonthlyKitCard({ kit, size = 'default' }: Props) {
  const isKids = kit.line === 'kids'
  const accent = isKids ? 'var(--kids-coral-deep)' : 'var(--silver-rose-deep)'
  const tint = isKids ? 'var(--kids-tint)' : 'var(--silver-tint)'
  const lineLabel = isKids ? '키즈' : '실버'

  return (
    <Link
      href={`/${kit.line}`}
      className="kit-card"
      style={{
        display: 'block',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: tint,
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kit.image}
          alt={kit.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <div style={{ padding: size === 'large' ? '22px 24px 26px' : '18px 20px 22px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <span className={`chip ${kit.line}`}>{lineLabel}</span>
          <span className="chip">{kit.month}월</span>
          {kit.unit && <span className="chip">{kit.unit}</span>}
          <span className="chip">{kit.price.toLocaleString('ko-KR')}원</span>
          {kit.video && <span className="chip">🎬 영상포함</span>}
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: accent, marginBottom: 4 }}>{kit.tagline}</p>
        <h4 style={{ fontSize: size === 'large' ? 19 : 16, fontWeight: 700, marginBottom: 6, color: 'var(--ink)' }}>
          {kit.name}
        </h4>
        <p
          style={{
            fontSize: 13.5,
            color: 'var(--ink-soft)',
            lineHeight: 1.55,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {kit.desc}
        </p>

        <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>자세히 보기 →</span>
      </div>
    </Link>
  )
}
