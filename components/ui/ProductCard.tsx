'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import {
  LineBadge,
  StorageBadge,
  DifficultyBadge,
  TimeBadge,
  AgeBadge,
  AllergenBadges,
  FeaturedBadge,
} from './Badge'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const isKids = product.line === 'kids'

  const accentColor = isKids ? 'var(--kids-coral-deep)' : 'var(--silver-rose-deep)'
  const thumbBg = isKids
    ? 'linear-gradient(150deg, var(--kids-tint), #fff)'
    : 'linear-gradient(150deg, var(--silver-tint), #fff)'

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.(product)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={product.name}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        outline: 'none',
        transition: 'box-shadow 0.25s, transform 0.25s',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* ── 썸네일 영역 ── */}
      <div
        style={{
          height: 170,
          background: thumbBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {product.thumbnail_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.thumbnail_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <span
            style={{
              fontSize: 54,
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.08))',
              transition: 'transform 0.3s',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              display: 'block',
            }}
          >
            {isKids ? '🍳' : '🥗'}
          </span>
        )}

        {/* 라인 뱃지 */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <LineBadge line={product.line} />
        </div>

        {/* BEST 뱃지 */}
        {product.is_featured && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <FeaturedBadge />
          </div>
        )}
      </div>

      {/* ── 카드 바디 ── */}
      <div style={{ padding: '20px 20px 22px' }}>
        {/* 메타 칩 행 */}
        <div
          className="product-meta"
          style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}
        >
          <TimeBadge minutes={product.cook_time_min} />
          <DifficultyBadge level={product.difficulty} />
          <StorageBadge type={product.storage} />
          {(product.age_min != null || product.age_max != null) && (
            <AgeBadge min={product.age_min} max={product.age_max} />
          )}
        </div>

        {/* 제품명 */}
        <h4
          style={{
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.4,
            color: 'var(--ink)',
            marginBottom: 6,
          }}
        >
          {product.name}
        </h4>

        {/* 설명 (2줄 말줄임) */}
        <p
          style={{
            fontSize: 13.5,
            color: 'var(--ink-soft)',
            lineHeight: 1.55,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* 알러지 */}
        {product.allergens.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <AllergenBadges allergens={product.allergens} max={3} />
          </div>
        )}

        {/* 하단: 더보기 + 가격 */}
        <div
          className="product-foot"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            자세히 보기
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'transform 0.2s',
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>

          {product.price > 0 && (
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
              {product.price.toLocaleString('ko-KR')}원
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
