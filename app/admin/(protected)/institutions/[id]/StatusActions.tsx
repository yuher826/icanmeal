'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  approveInstitution,
  rejectInstitution,
  markReviewing,
  suspendInstitution,
  unsuspendInstitution,
  type ActionResult,
} from '../actions'
import type { InstitutionStatus } from '@/lib/institution-constants'

interface Props {
  institutionId: string
  status: InstitutionStatus
}

type Mode = null | 'reject' | 'suspend'

/**
 * 상태 변경 버튼.
 *
 * 실제 UPDATE 는 전부 서버 액션(actions.ts)에서 service_role 로 처리한다.
 * 클라이언트에서 institutions 를 직접 UPDATE 하면 REVOKE 때문에 막힌다
 * (_0006_rls.sql — 기관이 스스로 승인하는 걸 막는 장치).
 */
export default function StatusActions({ institutionId, status }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [mode, setMode] = useState<Mode>(null)
  const [reason, setReason] = useState('')
  const [result, setResult] = useState<ActionResult | null>(null)

  function run(fn: () => Promise<ActionResult>) {
    setResult(null)
    startTransition(async () => {
      const r = await fn()
      setResult(r)
      if (r.ok) {
        setMode(null)
        setReason('')
        router.refresh()
      }
    })
  }

  const busy = pending

  return (
    <div>
      {result && (
        <div
          className={`admin-alert ${result.ok ? 'admin-alert-ok' : 'admin-alert-error'}`}
          role="status"
        >
          <span aria-hidden="true">{result.ok ? '✅' : '⚠️'}</span>
          <span>{result.message}</span>
        </div>
      )}

      {/* 사유 입력 모드 */}
      {mode ? (
        <div>
          <label
            htmlFor="reason"
            style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}
          >
            {mode === 'reject' ? '반려 사유 (필수)' : '정지 사유 (선택)'}
          </label>
          <textarea
            id="reason"
            className="admin-input"
            style={{ width: '100%', minHeight: 84, resize: 'vertical' }}
            placeholder={
              mode === 'reject'
                ? '예: 사업자등록번호가 확인되지 않습니다. 정확한 번호로 다시 신청해주세요.'
                : '예: 대금 미납으로 인한 일시 정지'
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              type="button"
              className={`admin-btn ${mode === 'reject' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
              disabled={busy || (mode === 'reject' && !reason.trim())}
              onClick={() =>
                run(() =>
                  mode === 'reject'
                    ? rejectInstitution(institutionId, reason)
                    : suspendInstitution(institutionId, reason)
                )
              }
            >
              {busy ? '처리 중…' : mode === 'reject' ? '반려 확정' : '정지 확정'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              disabled={busy}
              onClick={() => {
                setMode(null)
                setReason('')
              }}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* 승인 대기·검토중·반려 → 승인 가능 */}
          {(status === 'pending' || status === 'reviewing' || status === 'rejected') && (
            <button
              type="button"
              className="admin-btn admin-btn-ok"
              disabled={busy}
              onClick={() => run(() => approveInstitution(institutionId))}
            >
              {busy ? '처리 중…' : '승인'}
            </button>
          )}

          {/* 승인 대기·검토중 → 반려 가능 */}
          {(status === 'pending' || status === 'reviewing') && (
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              disabled={busy}
              onClick={() => setMode('reject')}
            >
              반려
            </button>
          )}

          {/* 대기 → 검토중 표시 */}
          {status === 'pending' && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              disabled={busy}
              onClick={() => run(() => markReviewing(institutionId))}
            >
              검토 중으로 표시
            </button>
          )}

          {/* 승인됨 → 정지 */}
          {status === 'approved' && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              disabled={busy}
              onClick={() => setMode('suspend')}
            >
              정지
            </button>
          )}

          {/* 정지됨 → 해제 */}
          {status === 'suspended' && (
            <button
              type="button"
              className="admin-btn admin-btn-ok"
              disabled={busy}
              onClick={() => run(() => unsuspendInstitution(institutionId))}
            >
              {busy ? '처리 중…' : '정지 해제 (승인 상태로)'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
