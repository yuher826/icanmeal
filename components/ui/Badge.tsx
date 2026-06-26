/**
 * icanmeal Badge 컴포넌트 모음
 * 라인, 보관, 난이도, 시간, 연령, 알러지, 승인상태
 */

import { ALLERGEN_MAP, STORAGE_LABELS, DIFFICULTY_LABELS } from '@/constants'
import type { Allergen, ProductLine, StorageType, Difficulty, ApprovalStatus } from '@/types'

/* ── 공통 인라인 스타일 헬퍼 ── */
function badgeStyle(bg: string, color: string, extra?: object): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 100,
    background: bg,
    color,
    lineHeight: 1.4,
    ...extra,
  }
}

/* ════════════════════════════════════
   라인 뱃지 — 키즈 / 실버
   ════════════════════════════════════ */
export function LineBadge({ line }: { line: ProductLine }) {
  const isKids = line === 'kids'
  return (
    <span
      style={badgeStyle(
        isKids ? 'var(--kids-tint)'   : 'var(--silver-tint)',
        isKids ? 'var(--kids-coral-deep)' : 'var(--silver-rose-deep)',
        { letterSpacing: '0.04em' }
      )}
    >
      {isKids ? '키즈' : '실버'}
    </span>
  )
}

/* ════════════════════════════════════
   보관 방법 뱃지 — 냉장 / 냉동 / 실온
   ════════════════════════════════════ */
export function StorageBadge({ type }: { type: StorageType }) {
  const { label, emoji, color } = STORAGE_LABELS[type]
  return (
    <span style={badgeStyle(color, 'var(--ink-soft)')}>
      {emoji} {label}
    </span>
  )
}

/* ════════════════════════════════════
   난이도 뱃지
   ════════════════════════════════════ */
export function DifficultyBadge({ level }: { level: Difficulty }) {
  const { label } = DIFFICULTY_LABELS[level]
  return (
    <span style={badgeStyle('var(--cream-deep)', 'var(--ink-soft)')}>
      {label}
    </span>
  )
}

/* ════════════════════════════════════
   조리 시간 뱃지
   ════════════════════════════════════ */
export function TimeBadge({ minutes }: { minutes: number }) {
  return (
    <span style={badgeStyle('var(--cream-deep)', 'var(--ink-soft)')}>
      ⏱ {minutes}분
    </span>
  )
}

/* ════════════════════════════════════
   연령 뱃지
   ════════════════════════════════════ */
export function AgeBadge({ min, max }: { min?: number; max?: number }) {
  const label =
    min != null && max != null ? `${min}–${max}세`
    : min != null              ? `${min}세+`
    : max != null              ? `~${max}세`
    : null

  if (!label) return null

  return (
    <span style={badgeStyle('#FFF3D6', 'var(--gold)')}>
      👦 {label}
    </span>
  )
}

/* ════════════════════════════════════
   알러지 뱃지 목록
   ════════════════════════════════════ */
export function AllergenBadges({
  allergens,
  max = 4,
}: {
  allergens: Allergen[]
  max?: number
}) {
  if (!allergens.length) return null

  const visible = allergens.slice(0, max)
  const overflow = allergens.length - max

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {visible.map((a) => {
        const info = ALLERGEN_MAP[a]
        if (!info) return null
        return (
          <span
            key={a}
            title={info.label}
            style={{
              ...badgeStyle('#FFF0ED', 'var(--kids-coral-deep)'),
              border: '1px solid #FDDBD3',
              fontSize: 10.5,
            }}
          >
            {info.emoji} {info.label}
          </span>
        )
      })}
      {overflow > 0 && (
        <span style={badgeStyle('var(--cream-deep)', 'var(--ink-soft)', { fontSize: 10.5 })}>
          +{overflow}
        </span>
      )}
    </div>
  )
}

/* ════════════════════════════════════
   기관 승인 상태 뱃지
   ════════════════════════════════════ */
export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const MAP = {
    pending:   { label: '신청 완료',  bg: '#FFF3D6', color: 'var(--gold)' },
    reviewing: { label: '검토 중',    bg: 'var(--kids-tint)', color: 'var(--kids-coral-deep)' },
    approved:  { label: '승인 완료',  bg: '#E8F5E9', color: '#2D6A4F' },
    rejected:  { label: '승인 거절',  bg: '#FFF0ED', color: 'var(--kids-coral-deep)' },
  } as const

  const { label, bg, color } = MAP[status]
  return (
    <span
      style={{
        ...badgeStyle(bg, color),
        fontSize: 12,
        padding: '5px 13px',
      }}
    >
      {label}
    </span>
  )
}

/* ════════════════════════════════════
   BEST / 추천 뱃지
   ════════════════════════════════════ */
export function FeaturedBadge() {
  return (
    <span
      style={{
        ...badgeStyle('var(--gold)', '#fff'),
        fontSize: 10,
        letterSpacing: '0.06em',
        padding: '3px 8px',
      }}
    >
      BEST
    </span>
  )
}
