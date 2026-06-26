import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 28px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div
          style={{
            fontSize: 80,
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            color: 'var(--line)',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </div>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🍳</div>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          페이지를 찾을 수 없어요
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 32 }}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-cta">홈으로 돌아가기</Link>
          <Link href="/kids" className="btn-outline">키즈 키트 보기</Link>
        </div>
      </div>
    </div>
  )
}
