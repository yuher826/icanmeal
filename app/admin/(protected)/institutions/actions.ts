'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import type { InstitutionStatus } from '@/lib/institution-constants'

export interface ActionResult {
  ok: boolean
  message: string
}

/** 클라이언트 IP (감사 로그용) */
function getClientIp(): string | null {
  const h = headers()
  const fwd = h.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return h.get('x-real-ip')
}

/**
 * 기관 상태 변경 (승인 / 반려 / 정지 / 정지해제).
 *
 * ⚠️ 왜 서버 액션 + service_role 인가
 *    _0006_rls.sql 에서 institutions 의 status, approved_at, approved_by,
 *    rejected_reason 등에 대해 authenticated 롤의 컬럼 UPDATE 권한을 REVOKE 했다.
 *    기관이 스스로를 승인하지 못하게 막는 장치인데, 관리자도 authenticated 라
 *    같이 막힌다. 그래서 이 변경은 service_role 로만 가능하고,
 *    service_role 은 RLS 를 전부 우회하므로 requireAdmin() 이 유일한 방어선이다.
 */
async function changeStatus(
  institutionId: string,
  nextStatus: InstitutionStatus,
  opts: { rejectedReason?: string; suspendedReason?: string } = {}
): Promise<ActionResult> {
  /* ① 권한 확인 — service_role 을 쓰기 전에 반드시 */
  const admin = await requireAdmin()

  if (!institutionId) {
    return { ok: false, message: '기관 ID가 없습니다.' }
  }

  let db
  try {
    db = createSupabaseAdminClient()
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'service_role 클라이언트 생성 실패',
    }
  }

  /* ② 변경 전 상태 조회 (감사 로그 before 기록용) */
  const { data: before, error: readError } = await db
    .from('institutions')
    .select('id, name, status, rejected_reason, suspended_reason, approved_at, approved_by')
    .eq('id', institutionId)
    .maybeSingle()

  if (readError || !before) {
    return { ok: false, message: '기관을 찾을 수 없습니다.' }
  }

  if (before.status === nextStatus) {
    return { ok: false, message: '이미 같은 상태입니다.' }
  }

  /* ③ 상태별 컬럼 구성 */
  const patch: Record<string, unknown> = { status: nextStatus }

  if (nextStatus === 'approved') {
    patch.approved_at = new Date().toISOString()
    patch.approved_by = admin.id
    patch.rejected_reason = null
    patch.suspended_at = null
    patch.suspended_reason = null
  } else if (nextStatus === 'rejected') {
    const reason = opts.rejectedReason?.trim()
    if (!reason) {
      return { ok: false, message: '반려 사유를 입력해주세요.' }
    }
    // DB 에도 CHECK 제약(institutions_rejected_reason_check)이 걸려 있다
    patch.rejected_reason = reason
    patch.approved_at = null
    patch.approved_by = null
  } else if (nextStatus === 'suspended') {
    patch.suspended_at = new Date().toISOString()
    patch.suspended_reason = opts.suspendedReason?.trim() || null
  }

  /* ④ 업데이트 */
  const { data: after, error: updateError } = await db
    .from('institutions')
    .update(patch)
    .eq('id', institutionId)
    .select('id, name, status, rejected_reason, suspended_reason, approved_at, approved_by')
    .maybeSingle()

  if (updateError || !after) {
    return { ok: false, message: `상태 변경 실패: ${updateError?.message ?? '알 수 없는 오류'}` }
  }

  /* ⑤ 감사 로그 — 실패해도 본 작업은 되돌리지 않는다.
        (로그 때문에 승인이 막히는 게 더 나쁘다. 대신 서버 로그에 남긴다) */
  const { error: auditError } = await db.from('audit_logs').insert({
    actor_auth_id: admin.auth_id,
    actor_type: 'admin',
    actor_name_snapshot: admin.name,
    action: `institution.${nextStatus}`,
    target_table: 'institutions',
    target_id: institutionId,
    before,
    after,
    ip_address: getClientIp(),
  })

  if (auditError) {
    console.error('[audit_logs] 기록 실패', {
      action: `institution.${nextStatus}`,
      institutionId,
      error: auditError.message,
    })
  }

  revalidatePath('/admin/institutions')
  revalidatePath(`/admin/institutions/${institutionId}`)

  const LABEL: Record<string, string> = {
    approved: '승인',
    rejected: '반려',
    reviewing: '검토 중으로 변경',
    suspended: '정지',
  }
  return { ok: true, message: `${after.name} — ${LABEL[nextStatus] ?? nextStatus} 처리했습니다.` }
}

export async function approveInstitution(institutionId: string): Promise<ActionResult> {
  return changeStatus(institutionId, 'approved')
}

export async function rejectInstitution(
  institutionId: string,
  reason: string
): Promise<ActionResult> {
  return changeStatus(institutionId, 'rejected', { rejectedReason: reason })
}

export async function markReviewing(institutionId: string): Promise<ActionResult> {
  return changeStatus(institutionId, 'reviewing')
}

export async function suspendInstitution(
  institutionId: string,
  reason: string
): Promise<ActionResult> {
  return changeStatus(institutionId, 'suspended', { suspendedReason: reason })
}

/** 정지 해제 — 승인 상태로 되돌린다 */
export async function unsuspendInstitution(institutionId: string): Promise<ActionResult> {
  return changeStatus(institutionId, 'approved')
}
