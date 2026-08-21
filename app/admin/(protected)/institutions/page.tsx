import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import {
  INSTITUTION_STATUSES,
  INSTITUTION_STATUS_LABEL,
  INSTITUTION_STATUS_CLASS,
  INSTITUTION_TYPE_LABEL,
  SORT_OPTIONS,
  DEFAULT_SORT,
  PAGE_SIZE,
  type InstitutionStatus,
  type SortKey,
} from '@/lib/institution-constants'
import InstitutionFilters from './InstitutionFilters'

export const dynamic = 'force-dynamic'

interface SearchParams {
  q?: string
  status?: string
  sort?: string
  page?: string
}

interface Row {
  id: string
  name: string
  institution_type: string
  business_number: string | null
  contact_name: string
  contact_phone: string
  status: InstitutionStatus
  created_at: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`
}

/** 검색어에 PostgREST or() 문법을 깨는 문자가 섞이지 않게 정리 */
function sanitizeQuery(raw: string): string {
  return raw.replace(/[,()*%]/g, ' ').trim().slice(0, 60)
}

export default async function InstitutionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin()
  const supabase = createSupabaseServerClient()

  /* ── 파라미터 정규화 ── */
  const rawQ = (searchParams.q ?? '').trim()
  const q = sanitizeQuery(rawQ)

  const status = INSTITUTION_STATUSES.includes(searchParams.status as InstitutionStatus)
    ? (searchParams.status as InstitutionStatus)
    : 'all'

  const sortKey: SortKey =
    searchParams.sort && searchParams.sort in SORT_OPTIONS
      ? (searchParams.sort as SortKey)
      : DEFAULT_SORT
  const sort = SORT_OPTIONS[sortKey]

  const page = Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  /* ── 목록 조회 ──
     서버 사이드 페이지네이션. count: 'exact' 로 전체 건수만 받고
     행은 range() 로 페이지 분량만 가져온다. 기관이 100개를 넘어도 안전하다. */
  let query = supabase
    .from('institutions')
    .select(
      'id, name, institution_type, business_number, contact_name, contact_phone, status, created_at',
      { count: 'exact' }
    )
    .is('deleted_at', null)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  if (q) {
    // 기관명 / 사업자등록번호 / 담당자명
    query = query.or(
      `name.ilike.%${q}%,business_number.ilike.%${q}%,contact_name.ilike.%${q}%`
    )
  }

  const {
    data,
    count,
    error,
  } = await query.order(sort.column, { ascending: sort.ascending }).range(from, to)

  /* ── 상태별 건수 (필터 칩 표시용) ── */
  const { data: statusRows } = await supabase
    .from('institutions')
    .select('status')
    .is('deleted_at', null)

  const statusCounts = (statusRows ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})
  const totalAll = statusRows?.length ?? 0

  const rows = (data ?? []) as Row[]
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasFilter = Boolean(q) || status !== 'all'

  /* 정렬 링크용 — 현재 필터를 유지한 채 sort 만 바꾼다 */
  function sortHref(key: SortKey): string {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (status !== 'all') p.set('status', status)
    p.set('sort', key)
    return `/admin/institutions?${p.toString()}`
  }

  function pageHref(n: number): string {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (status !== 'all') p.set('status', status)
    if (sortKey !== DEFAULT_SORT) p.set('sort', sortKey)
    if (n > 1) p.set('page', String(n))
    return `/admin/institutions${p.toString() ? `?${p.toString()}` : ''}`
  }

  /* 페이지 번호 목록 (현재 페이지 주변 최대 5개) */
  const pageNumbers: number[] = []
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  for (let i = start; i <= Math.min(totalPages, start + 4); i++) pageNumbers.push(i)

  return (
    <>
      <div className="admin-page-head">
        <h1>기관 관리</h1>
        <p>기관 회원의 가입 신청을 검토하고 승인·반려를 처리합니다.</p>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>목록을 불러오지 못했습니다: {error.message}</span>
        </div>
      )}

      <div className="admin-card">
        <InstitutionFilters
          q={rawQ}
          status={status}
          sort={sortKey}
          statusCounts={statusCounts}
          totalAll={totalAll}
        />

        {rows.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon" aria-hidden="true">
              {hasFilter ? '🔍' : '🏢'}
            </div>
            {hasFilter ? (
              <>
                <h3>검색 결과가 없습니다</h3>
                <p>
                  다른 검색어나 상태로 다시 시도해보세요.
                  <br />
                  <Link
                    href="/admin/institutions"
                    style={{ color: 'var(--kids-coral-deep)', fontWeight: 700 }}
                  >
                    필터 초기화
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h3>아직 가입한 기관이 없습니다</h3>
                <p>
                  기관이 회원가입을 하면 이 목록에 나타납니다.
                  <br />
                  가입 신청이 들어오면 여기에서 승인·반려를 처리할 수 있습니다.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <Link
                        href={sortHref(sortKey === 'name_asc' ? 'name_desc' : 'name_asc')}
                      >
                        기관명
                        {sortKey === 'name_asc' && ' ▲'}
                        {sortKey === 'name_desc' && ' ▼'}
                      </Link>
                    </th>
                    <th>유형</th>
                    <th>사업자번호</th>
                    <th>담당자</th>
                    <th>연락처</th>
                    <th>
                      <Link
                        href={sortHref(
                          sortKey === 'created_desc' ? 'created_asc' : 'created_desc'
                        )}
                      >
                        가입일
                        {sortKey === 'created_desc' && ' ▼'}
                        {sortKey === 'created_asc' && ' ▲'}
                      </Link>
                    </th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link
                          href={`/admin/institutions/${r.id}`}
                          className="admin-row-link admin-row-name"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td style={{ color: 'var(--ink-soft)' }}>
                        {INSTITUTION_TYPE_LABEL[r.institution_type] ?? r.institution_type}
                      </td>
                      <td className="num">{r.business_number || '—'}</td>
                      <td>{r.contact_name}</td>
                      <td className="num">{r.contact_phone}</td>
                      <td className="num">{formatDate(r.created_at)}</td>
                      <td>
                        <span
                          className={`status-badge ${INSTITUTION_STATUS_CLASS[r.status]}`}
                        >
                          <span className="status-dot" aria-hidden="true" />
                          {INSTITUTION_STATUS_LABEL[r.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <span className="admin-pagination-info">
                총 <strong>{total.toLocaleString('ko-KR')}</strong>건 중{' '}
                {(from + 1).toLocaleString('ko-KR')}–
                {Math.min(from + PAGE_SIZE, total).toLocaleString('ko-KR')}
              </span>

              {totalPages > 1 && (
                <nav className="admin-pagination-nav" aria-label="페이지">
                  <Link
                    href={pageHref(page - 1)}
                    className={`admin-page-link${page <= 1 ? ' disabled' : ''}`}
                    aria-disabled={page <= 1}
                  >
                    ←
                  </Link>
                  {pageNumbers.map((n) => (
                    <Link
                      key={n}
                      href={pageHref(n)}
                      className={`admin-page-link${n === page ? ' active' : ''}`}
                      aria-current={n === page ? 'page' : undefined}
                    >
                      {n}
                    </Link>
                  ))}
                  <Link
                    href={pageHref(page + 1)}
                    className={`admin-page-link${page >= totalPages ? ' disabled' : ''}`}
                    aria-disabled={page >= totalPages}
                  >
                    →
                  </Link>
                </nav>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
