'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  INSTITUTION_STATUSES,
  INSTITUTION_STATUS_LABEL,
  SORT_OPTIONS,
  DEFAULT_SORT,
  type SortKey,
} from '@/lib/institution-constants'

interface Props {
  q: string
  status: string
  sort: SortKey
  statusCounts: Record<string, number>
  totalAll: number
}

/**
 * 검색 / 상태 필터 / 정렬 UI.
 *
 * 모든 상태는 URL 쿼리에 담는다. 서버 컴포넌트가 그걸 읽어 DB 쿼리를 만들기 때문에
 * 필터가 바뀌면 서버에서 다시 조회된다 (= 서버 사이드 페이지네이션 유지).
 * 링크 공유·뒤로가기도 자연스럽게 동작한다.
 */
export default function InstitutionFilters({
  q,
  status,
  sort,
  statusCounts,
  totalAll,
}: Props) {
  const router = useRouter()
  const [keyword, setKeyword] = useState(q)

  function buildHref(patch: Record<string, string | undefined>): string {
    const p = new URLSearchParams()
    const next = { q: keyword, status, sort, ...patch }

    if (next.q) p.set('q', next.q)
    if (next.status && next.status !== 'all') p.set('status', next.status)
    if (next.sort && next.sort !== DEFAULT_SORT) p.set('sort', next.sort)
    // 필터가 바뀌면 항상 1페이지부터
    return `/admin/institutions${p.toString() ? `?${p.toString()}` : ''}`
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(buildHref({ q: keyword }))
  }

  return (
    <div className="admin-filters">
      {/* 검색 */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
        <input
          type="search"
          name="q"
          className="admin-input"
          placeholder="기관명 · 사업자번호 · 담당자"
          aria-label="기관 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ minWidth: 230 }}
        />
        <button type="submit" className="admin-btn admin-btn-ghost" style={{ padding: '9px 15px' }}>
          검색
        </button>
      </form>

      {/* 상태 필터 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 4 }}>
        <Link
          href={buildHref({ status: 'all' })}
          className={`admin-chip-filter${status === 'all' ? ' active' : ''}`}
        >
          전체 {totalAll > 0 && <span>({totalAll})</span>}
        </Link>
        {INSTITUTION_STATUSES.map((s) => {
          const c = statusCounts[s] ?? 0
          return (
            <Link
              key={s}
              href={buildHref({ status: s })}
              className={`admin-chip-filter${status === s ? ' active' : ''}`}
            >
              {INSTITUTION_STATUS_LABEL[s]} {c > 0 && <span>({c})</span>}
            </Link>
          )
        })}
      </div>

      {/* 정렬 */}
      <select
        className="admin-select"
        aria-label="정렬"
        value={sort}
        onChange={(e) => router.push(buildHref({ sort: e.target.value }))}
        style={{ marginLeft: 'auto' }}
      >
        {(Object.keys(SORT_OPTIONS) as SortKey[]).map((k) => (
          <option key={k} value={k}>
            {SORT_OPTIONS[k].label}
          </option>
        ))}
      </select>
    </div>
  )
}
