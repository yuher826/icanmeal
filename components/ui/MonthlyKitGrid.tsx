'use client'

import { useState, useMemo } from 'react'
import { SEASON_LABELS, seasonOfMonth, type MonthlyKit, type Season } from '@/constants'
import MonthlyKitCard from './MonthlyKitCard'
import ScrollAnimation from './ScrollAnimation'

const SEASON_TABS: (Season | 'all')[] = ['all', 'spring', 'summer', 'fall', 'winter']

interface Props {
  products: MonthlyKit[]
}

export default function MonthlyKitGrid({ products }: Props) {
  const [season, setSeason] = useState<Season | 'all'>('all')

  const filtered = useMemo(
    () => (season === 'all' ? products : products.filter((p) => seasonOfMonth(p.month) === season)),
    [products, season]
  )

  return (
    <>
      <div className="tabbar">
        {SEASON_TABS.map((s) => (
          <button
            key={s}
            className={s === season ? 'active' : ''}
            onClick={() => setSeason(s)}
          >
            {s === 'all' ? '전체 (12개월)' : SEASON_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((p, i) => (
          <ScrollAnimation key={p.id} animation="up" delay={(i % 3) * 100}>
            <MonthlyKitCard kit={p} />
          </ScrollAnimation>
        ))}
      </div>
    </>
  )
}
