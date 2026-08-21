import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import {
  INSTITUTION_STATUS_LABEL,
  INSTITUTION_STATUS_CLASS,
  INSTITUTION_TYPE_LABEL,
  PRICE_TIER_LABEL,
  type InstitutionStatus,
} from '@/lib/institution-constants'
import StatusActions from './StatusActions'

export const dynamic = 'force-dynamic'

function fmtDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}`
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  )
}

/** 값이 없으면 흐린 대시로 */
function V({ children }: { children: React.ReactNode }) {
  if (children === null || children === undefined || children === '') {
    return <span className="muted">—</span>
  }
  return <>{children}</>
}

export default async function InstitutionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()
  const supabase = createSupabaseServerClient()

  const { data: inst } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .maybeSingle()

  if (!inst) notFound()

  const status = inst.status as InstitutionStatus

  /* 승인자 이름 (approved_by → admins) */
  let approverName: string | null = null
  if (inst.approved_by) {
    const { data: approver } = await supabase
      .from('admins')
      .select('name')
      .eq('id', inst.approved_by)
      .maybeSingle()
    approverName = approver?.name ?? null
  }

  /* 같은 사업자번호로 가입한 다른 기관 — 분원 각각 가입을 허용했으므로(Q3)
     UNIQUE 가 없다. 중복 가입 여부를 관리자가 눈으로 확인할 수 있게 보여준다. */
  let duplicates: { id: string; name: string; status: string }[] = []
  if (inst.business_number) {
    const { data: dups } = await supabase
      .from('institutions')
      .select('id, name, status')
      .eq('business_number', inst.business_number)
      .neq('id', inst.id)
      .is('deleted_at', null)
      .limit(5)
    duplicates = dups ?? []
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/institutions" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
          ← 기관 목록
        </Link>
      </div>

      <div className="admin-page-head" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>{inst.name}</h1>
        <span className={`status-badge ${INSTITUTION_STATUS_CLASS[status]}`}>
          <span className="status-dot" aria-hidden="true" />
          {INSTITUTION_STATUS_LABEL[status]}
        </span>
      </div>

      {/* 반려/정지 사유는 눈에 띄게 */}
      {status === 'rejected' && inst.rejected_reason && (
        <div className="admin-alert admin-alert-error">
          <span aria-hidden="true">🚫</span>
          <span>
            <strong>반려 사유</strong>
            <br />
            {inst.rejected_reason}
          </span>
        </div>
      )}
      {status === 'suspended' && (
        <div className="admin-alert admin-alert-info">
          <span aria-hidden="true">⏸️</span>
          <span>
            <strong>정지됨</strong> ({fmtDateTime(inst.suspended_at)})
            {inst.suspended_reason && (
              <>
                <br />
                {inst.suspended_reason}
              </>
            )}
          </span>
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="admin-alert admin-alert-info">
          <span aria-hidden="true">ℹ️</span>
          <span>
            <strong>같은 사업자등록번호로 가입한 기관이 {duplicates.length}곳 더 있습니다.</strong>
            <br />
            분원 각각 가입은 허용되지만, 중복 신청이 아닌지 확인해주세요.
            <br />
            {duplicates.map((d, i) => (
              <span key={d.id}>
                {i > 0 && ' · '}
                <Link
                  href={`/admin/institutions/${d.id}`}
                  style={{ textDecoration: 'underline', fontWeight: 700 }}
                >
                  {d.name}
                </Link>
                <span style={{ opacity: 0.75 }}>
                  {' '}
                  ({INSTITUTION_STATUS_LABEL[d.status as InstitutionStatus] ?? d.status})
                </span>
              </span>
            ))}
          </span>
        </div>
      )}

      {/* ── 상태 변경 ── */}
      <div className="admin-card admin-card-pad" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>승인 처리</h2>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
          승인하면 이 기관이 주문을 시작할 수 있습니다. 반려 시 사유는 기관에 전달됩니다.
        </p>
        <StatusActions institutionId={inst.id} status={status} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {/* ── 기관 정보 ── */}
        <section className="admin-card admin-card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>기관 정보</h2>
          <dl className="admin-dl">
            <Row label="기관명">{inst.name}</Row>
            <Row label="기관 유형">
              {INSTITUTION_TYPE_LABEL[inst.institution_type] ?? inst.institution_type}
            </Row>
            <Row label="사업자등록번호">
              <V>{inst.business_number}</V>
            </Row>
            <Row label="대표자명">
              <V>{inst.representative_name}</V>
            </Row>
            <Row label="기관 주소">
              {inst.address ? (
                <>
                  {inst.zip_code && <span className="muted">[{inst.zip_code}] </span>}
                  {inst.address} {inst.address_detail}
                </>
              ) : (
                <V>{null}</V>
              )}
            </Row>
            <Row label="단가 등급">
              {PRICE_TIER_LABEL[inst.price_tier] ?? inst.price_tier}
            </Row>
          </dl>
        </section>

        {/* ── 담당자 ── */}
        <section className="admin-card admin-card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>담당자</h2>
          <dl className="admin-dl">
            <Row label="담당자명">{inst.contact_name}</Row>
            <Row label="연락처">
              <a href={`tel:${inst.contact_phone}`}>{inst.contact_phone}</a>
            </Row>
            <Row label="이메일">
              <a href={`mailto:${inst.contact_email}`}>{inst.contact_email}</a>
            </Row>
            <Row label="로그인 계정">
              {inst.auth_id ? (
                <span className="muted" style={{ fontSize: 12 }}>
                  연결됨
                </span>
              ) : (
                <span className="muted">미연결</span>
              )}
            </Row>
          </dl>
        </section>

        {/* ── 배송지 ── */}
        <section className="admin-card admin-card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>배송지</h2>
          {inst.ship_same_as_address ? (
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              기관 주소와 동일합니다.
            </p>
          ) : (
            <dl className="admin-dl">
              <Row label="수령인">
                <V>{inst.ship_recipient_name}</V>
              </Row>
              <Row label="연락처">
                <V>{inst.ship_phone}</V>
              </Row>
              <Row label="주소">
                {inst.ship_address ? (
                  <>
                    {inst.ship_zip_code && (
                      <span className="muted">[{inst.ship_zip_code}] </span>
                    )}
                    {inst.ship_address} {inst.ship_address_detail}
                  </>
                ) : (
                  <V>{null}</V>
                )}
              </Row>
            </dl>
          )}
        </section>

        {/* ── 세금계산서 ── */}
        <section className="admin-card admin-card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>세금계산서</h2>
          <dl className="admin-dl">
            <Row label="수신 이메일">
              <V>{inst.tax_email}</V>
            </Row>
            <Row label="담당자">
              <V>{inst.tax_manager_name}</V>
            </Row>
            <Row label="연락처">
              <V>{inst.tax_manager_phone}</V>
            </Row>
          </dl>
        </section>

        {/* ── 가입·승인 이력 ── */}
        <section className="admin-card admin-card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>가입 · 승인 이력</h2>
          <dl className="admin-dl">
            <Row label="가입 신청일">{fmtDateTime(inst.created_at)}</Row>
            <Row label="승인일">{fmtDateTime(inst.approved_at)}</Row>
            <Row label="승인자">
              <V>{approverName}</V>
            </Row>
            <Row label="약관 동의">{fmtDateTime(inst.agreed_terms_at)}</Row>
            <Row label="개인정보 동의">{fmtDateTime(inst.agreed_privacy_at)}</Row>
            <Row label="마케팅 수신">
              {inst.agreed_marketing_at ? fmtDateTime(inst.agreed_marketing_at) : (
                <span className="muted">미동의</span>
              )}
            </Row>
          </dl>
        </section>

        {/* ── 첨부서류 ── */}
        <section className="admin-card admin-card-pad">
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>첨부서류</h2>
          <div
            style={{
              padding: '20px 16px',
              borderRadius: 11,
              background: 'var(--cream-deep)',
              fontSize: 13,
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: 'var(--ink)' }}>아직 지원하지 않는 기능입니다.</strong>
            <br />
            현재 <code>institutions</code> 스키마에 첨부파일 컬럼이 없어
            사업자등록증 등을 받을 수 없습니다.
            <br />
            도입하려면 <code>institution_documents</code> 테이블과
            전용 Storage 버킷이 필요합니다.
          </div>
        </section>
      </div>

      {/* ── 관리자 메모 ── */}
      {inst.admin_memo && (
        <section className="admin-card admin-card-pad" style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 8 }}>
            내부 메모
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)', marginLeft: 8 }}>
              기관에게 보이지 않습니다
            </span>
          </h2>
          <p style={{ fontSize: 13.5, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {inst.admin_memo}
          </p>
        </section>
      )}
    </>
  )
}
