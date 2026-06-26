'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 28px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          일시적인 오류가 발생했어요
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 28 }}>
          잠시 후 다시 시도해 주세요. 문제가 지속되면 담당자에게 문의해 주세요.
        </p>
        <button
          onClick={reset}
          className="btn-cta"
          style={{ marginRight: 12 }}
        >
          다시 시도
        </button>
        <a href="/" className="btn-outline">
          홈으로
        </a>
      </div>
    </div>
  )
}
