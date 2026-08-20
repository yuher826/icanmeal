'use client'

import { useState } from 'react'
import Link from 'next/link'
import { KIDS_PRODUCTS, SILVER_PRODUCTS } from '@/constants'
import type { ProductLine } from '@/types'
import ScrollAnimation from './ScrollAnimation'

export default function ProgramCalendar() {
  const [line, setLine] = useState<ProductLine>('kids')
  const products = line === 'kids' ? KIDS_PRODUCTS : SILVER_PRODUCTS
  const lineLabel = line === 'kids' ? '키즈' : '실버'

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {(['kids', 'silver'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLine(l)}
            style={{
              fontSize: 14, fontWeight: 700, padding: '11px 22px', borderRadius: 100,
              background: line === l ? 'var(--ink)' : 'var(--white)',
              color: line === l ? '#fff' : 'var(--ink-soft)',
              border: line === l ? '1px solid var(--ink)' : '1.5px solid var(--line)',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            }}
          >
            {l === 'kids' ? 'Kids' : 'Silver'} 월간 캘린더
          </button>
        ))}
      </div>

      <p style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 20 }}>
        2026년 아이캔밀 {lineLabel} 연간 쿠킹키트 캘린더 · 최소 주문 30세트, 배송 10영업일 전 주문 필요
      </p>

      <div className="prog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
        {products.map((p, i) => (
          <ScrollAnimation key={p.id} animation="up" delay={(i % 4) * 60}>
            <div style={{ borderRadius: 16, padding: '20px 20px', background: 'var(--white)', border: '1px solid var(--line)', minHeight: 150 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)' }}>{p.month}월</span>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '6px 0 4px' }}>{p.tagline}</p>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.35 }}>{p.name}</h4>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                {p.unit ? `${p.unit} · ` : ''}{p.price.toLocaleString('ko-KR')}원
              </span>
            </div>
          </ScrollAnimation>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link href="/inquiry" className="btn-cta" style={{ fontSize: 15, padding: '14px 28px' }}>
          이번 달 {lineLabel} 키트 주문하기
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) { .prog-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 640px) { .prog-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 400px) { .prog-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
